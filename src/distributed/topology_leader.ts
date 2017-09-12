
import * as async from "async";
import * as lb from "../util/load_balance";
import * as intf from "../topology_interfaces";
import * as log from "../util/logger"

/** This class handles leader-status determination and
 * performs leadership tasks if marked as leader.
 */
export class TopologyLeader {

    private storage: intf.CoordinationStorage;
    private name: string;
    private is_running: boolean;
    private is_shut_down: boolean;
    private is_leader: boolean;
    private shutdown_callback: intf.SimpleCallback;
    private loop_timeout: number;

    /** Simple constructor */
    constructor(name: string, storage: intf.CoordinationStorage, loop_timeout: number) {
        this.storage = storage;
        this.name = name;
        this.is_running = false;
        this.shutdown_callback = null;
        this.is_leader = false;
        this.is_shut_down = false;
        this.loop_timeout = loop_timeout || 3 * 1000; // 3 seconds for refresh
    }

    /** Runs main loop that handles leadership detection */
    run() {
        let self = this;
        self.is_shut_down = false;
        self.is_running = true;
        async.whilst(
            () => {
                return self.is_running;
            },
            (xcallback) => {
                setTimeout(() => {
                    if (self.is_leader) {
                        self.performLeaderLoop(xcallback);
                    } else {
                        self.checkIfLeaderDetermined(xcallback);
                    }
                }, self.loop_timeout);
            },
            (err) => {
                log.logger().important("[Leader] Leader shutdown finished.");
                self.is_shut_down = true;
                self.is_running = false;
                if (self.shutdown_callback) {
                    self.shutdown_callback(err);
                }
            }
        );
    }

    /** Shut down the loop */
    shutdown(callback: intf.SimpleCallback) {
        let self = this;
        if (self.is_shut_down) {
            callback();
        } else {
            self.shutdown_callback = callback;
            self.is_running = false;
        }
    }

    /** Single step in checking if current node should be
     * promoted into leadership role.
     **/
    private checkIfLeaderDetermined(callback: intf.SimpleCallback) {
        let self = this;
        let should_announce = true;
        async.series(
            [
                (xcallback) => {
                    self.storage.getLeadershipStatus((err, res) => {
                        if (err) return callback(err);
                        if (res.leadership == intf.Consts.LeadershipStatus.ok) {
                            should_announce = false;
                        }
                        xcallback();
                    });
                },
                (xcallback) => {
                    if (!should_announce) return xcallback();
                    self.storage.announceLeaderCandidacy(self.name, xcallback);
                },
                (xcallback) => {
                    if (!should_announce) return xcallback();
                    self.storage.checkLeaderCandidacy(self.name, (err, is_leader) => {
                        if (err) return xcallback(err);
                        self.is_leader = is_leader;
                        if (self.is_leader) {
                            log.logger().important("[Leader] This worker became a leader...");
                            self.performLeaderLoop(xcallback);
                        } else {
                            xcallback();
                        }
                    });
                }
            ],
            callback()
        );
    }

    /** Single step in performing leadership role.
     * Checks work statuses and redistributes topologies for dead
     * to alive workers.
     */
    private performLeaderLoop(callback: intf.SimpleCallback) {
        let self = this;
        let perform_loop = true;
        let alive_workers: intf.WorkerStatus[] = null;
        let worker_weights: Map<string, number> = new Map<string, number>();
        async.series(
            [
                (xcallback) => {
                    self.storage.getWorkerStatus((err, workers) => {
                        if (err) return xcallback(err);
                        let this_worker_lstatus = workers
                            .filter(x => x.name === self.name)
                            .map(x => x.lstatus)[0];
                        if (this_worker_lstatus != intf.Consts.WorkerLStatus.leader) {
                            perform_loop = false;
                            return xcallback();
                        }
                        let dead_workers = workers
                            .filter(x => x.status === intf.Consts.WorkerStatus.dead)
                            .map(x => x.name);
                        alive_workers = workers
                            .filter(x => x.status === intf.Consts.WorkerStatus.alive);
                        if (alive_workers.length == 0) {
                            return xcallback();
                        }
                        async.each(
                            dead_workers,
                            (dead_worker, ycallback) => {
                                self.handleDeadWorker(dead_worker, ycallback);
                            },
                            xcallback
                        );
                    });
                },
                (xcallback) => {
                    if (!perform_loop || alive_workers.length == 0) {
                        return xcallback();
                    }
                    self.storage.getTopologyStatus((err, topologies) => {
                        if (err) return xcallback(err);
                        topologies = topologies.filter(x => x.enabled);
                        topologies.forEach(x => {
                            x.weight = x.weight || 1;
                            x.worker_affinity = x.worker_affinity || [];
                            if (x.status == "" || x.status == intf.Consts.TopologyStatus.unassigned) {
                                for (let worker of alive_workers) {
                                    let name = worker.name;
                                    if (name == x.worker) {
                                        let old_weight = 0;
                                        if (worker_weights.has(name)) {
                                            old_weight = worker_weights.get(name);
                                        }
                                        worker_weights.set(name, old_weight + x.weight);
                                        break;
                                    }
                                }
                            }
                        });

                        let unassigned_topologies = topologies
                            .filter(x => x.status === intf.Consts.TopologyStatus.unassigned);
                        if (unassigned_topologies.length > 0) {
                            log.logger().log("[Leader] Found unassigned topologies: " + JSON.stringify(unassigned_topologies));
                        }
                        let load_balancer = new lb.LoadBalancerEx(
                            alive_workers.map(x => {
                                return { name: x.name, weight: worker_weights.get(x.name) || 0 };
                            }),
                            5 // affinity means 5x stronger gravitational pull towards that worker
                        );
                        async.eachSeries(
                            unassigned_topologies,
                            (item, ycallback) => {
                                let ut = item as intf.TopologyStatus;
                                self.assignUnassignedTopology(ut, load_balancer, ycallback);
                            },
                            xcallback
                        );
                    });
                }
            ],
            callback
        );
    }

    /**
     * This method assigns topology to the worker that is provided by the load-balancer.
     * @param ut - unassigned toplogy object
     * @param load_balancer - load balancer object that tells you which worker to send the topology to
     * @param callback - callback to call when done
     */
    private assignUnassignedTopology(ut: intf.TopologyStatus, load_balancer: lb.LoadBalancerEx, callback: intf.SimpleCallback) {
        let self = this;
        let target = load_balancer.next(ut.worker_affinity, ut.weight);
        log.logger().log(`[Leader] Assigning topology ${ut.uuid} to worker ${target}`);
        self.storage.assignTopology(ut.uuid, target, (err) => {
            self.storage.sendMessageToWorker(target, intf.Consts.LeaderMessages.start_topology, { uuid: ut.uuid }, callback);
        });
    }

    /** Handles situation when there is a dead worker and its
     * topologies need to be re-assigned to other servers.
     */
    private handleDeadWorker(dead_worker: string, callback: intf.SimpleCallback) {
        log.logger().important("[Leader] Handling dead worker " + dead_worker);
        let self = this;
        self.storage.getTopologiesForWorker(dead_worker, (err, topologies) => {
            async.each(
                topologies,
                (topology, xcallback) => {
                    log.logger().important("[Leader] Unassigning topology " + topology.uuid);
                    self.storage.setTopologyStatus(topology.uuid, intf.Consts.TopologyStatus.unassigned, null, xcallback);
                },
                (err) => {
                    if (err) {
                        log.logger().important("[Leader] Error while handling dead worker " + err);
                        return callback(err);
                    }
                    log.logger().important("[Leader] Setting dead worker as unloaded: " + dead_worker);
                    self.storage.setWorkerStatus(dead_worker, intf.Consts.WorkerStatus.unloaded, callback);
                }
            );
        });
    }
}

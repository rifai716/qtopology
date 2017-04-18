import * as async from "async";
import * as tlp from "./topology_local_proxy";
import * as coord from "./topology_coordinator";
import * as comp from "../topology_compiler";
import * as intf from "../topology_interfaces";

class TopologyItem {
    uuid: string;
    config: any;
    proxy: tlp.TopologyLocalProxy;
}

/** This class handles topology worker - singleton instance on
 * that registers with coordination storage, receives instructions from
 * it and runs assigned topologies as subprocesses.
*/
export class TopologyWorker {

    private name: string;
    private coordinator: coord.TopologyCoordinator;
    private topologies: TopologyItem[];

    /** Initializes this object */
    constructor(name: string, storage: intf.CoordinationStorage) {
        this.name = name;
        this.coordinator = new coord.TopologyCoordinator(name, storage);
        this.topologies = [];

        let self = this;
        self.coordinator.on("start", (msg) => {
            self.start(msg.uuid, msg.config);
        });
        self.coordinator.on("shutdown", (msg) => {
            self.shutdown(() => { });
        });
    }

    /** Starts this worker */
    run() {
        this.coordinator.run();
    }

    /** Starts single topology */
    private start(uuid, config) {
        let compiler = new comp.TopologyCompiler(config);
        compiler.compile();
        config = compiler.getWholeConfig();

        let self = this;
        if (self.topologies.filter(x => x.uuid === uuid).length > 0) {
            self.coordinator.reportTopology(uuid, "error", "Topology with this UUID already exists: " + uuid);
            return;
        }
        let rec = new TopologyItem();
        rec.uuid = uuid;
        rec.config = config;
        self.topologies.push(rec);
        rec.proxy = new tlp.TopologyLocalProxy((err) => {
            if (!rec.proxy.wasShutDown()) {
                if (err) {
                    self.coordinator.reportTopology(uuid, "error", "" + err);
                } else {
                    self.coordinator.reportTopology(uuid, "stopped", "" + err);
                }
            }
            self.removeTopology(uuid);
        });
        rec.proxy.init(config, (err) => {
            if (err) {
                self.removeTopology(uuid);
                self.coordinator.reportTopology(uuid, "error", "" + err);
            } else {
                rec.proxy.run((err) => {
                    if (err) {
                        self.removeTopology(uuid);
                        self.coordinator.reportTopology(uuid, "error", "" + err);
                    } else {
                        self.coordinator.reportTopology(uuid, "running", "");
                    }
                });
            }
        });
    }

    /** Remove specified topology from internal list */
    private removeTopology(uuid: string) {
        this.topologies = this.topologies.filter(x => x.uuid != uuid);
    }

    /** Shuts down the worker and all its subprocesses. */
    shutdown(callback: intf.SimpleCallback) {
        let self = this;
        async.each(
            self.topologies,
            (itemx, xcallback) => {
                let item = itemx as TopologyItem;
                item.proxy.shutdown((err) => {
                    if (err) {
                        console.log("Error while shutting down topology", item.uuid, err);
                    } else {
                        self.coordinator.reportTopology(item.uuid, "stopped", "", xcallback);
                    }
                });
            },
            (err) => {
                if (err) {
                    console.log("Error while shutting down topologies:", err);
                }
                self.coordinator.shutdown(callback);
            }
        );
    }
}

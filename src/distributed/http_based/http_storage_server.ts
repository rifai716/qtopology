import * as hs from "../../util/http_server";
import * as intf from "../../topology_interfaces";
import * as leader from "../topology_leader";
import * as mem from "../memory/memory_storage";

////////////////////////////////////////////////////////////////////
// Initialize simple REST server

function initHttpServer(storage: intf.ICoordinationStorage): hs.MinimalHttpServer {
    const http_server = new hs.MinimalHttpServer();
    http_server.addHandler("/worker-statuses", (data, callback) => {
        storage.getWorkerStatus(callback);
    });
    http_server.addHandler("/topology-statuses", (data, callback) => {
        storage.getTopologyStatus(callback);
    });
    http_server.addHandler("/worker-topologies", (data, callback) => {
        const worker = data.worker;
        storage.getTopologiesForWorker(worker, callback);
    });
    http_server.addHandler("/get-messages", (data, callback) => {
        const worker = data.worker;
        storage.getMessages(worker, callback);
    });
    http_server.addHandler("/get-message", (data, callback) => {
        const worker = data.worker;
        storage.getMessage(worker, callback);
    });
    http_server.addHandler("/assign-topology", (data, callback) => {
        const worker = data.worker;
        const uuid = data.uuid;
        storage.assignTopology(uuid, worker, callback);
    });
    http_server.addHandler("/check-leader-candidacy", (data, callback) => {
        const worker = data.worker;
        storage.checkLeaderCandidacy(worker, callback);
    });
    http_server.addHandler("/announce-leader-candidacy", (data, callback) => {
        const worker = data.worker;
        storage.announceLeaderCandidacy(worker, callback);
    });
    http_server.addHandler("/register-worker", (data, callback) => {
        const worker = data.worker;
        storage.registerWorker(worker, callback);
    });
    http_server.addHandler("/set-topology-status", (data, callback) => {
        const uuid = data.uuid;
        const status = data.status;
        const error = data.error;
        const worker = data.worker;
        storage.setTopologyStatus(uuid, worker, status, error, callback);
    });
    http_server.addHandler("/set-topology-pid", (data, callback) => {
        const uuid = data.uuid;
        const pid = data.pid;
        storage.setTopologyPid(uuid, pid, callback);
    });
    http_server.addHandler("/set-worker-status", (data, callback) => {
        const name = data.name;
        const status = data.status;
        storage.setWorkerStatus(name, status, callback);
    });
    http_server.addHandler("/set-worker-lstatus", (data, callback) => {
        const name = data.name;
        const lstatus = data.lstatus;
        storage.setWorkerLStatus(name, lstatus, callback);
    });
    http_server.addHandler("/send-message", (data, callback) => {
        const worker = data.worker;
        const cmd = data.cmd;
        const content = data.content;
        const valid_msec: number = data.valid_msec || Date.now() + 60 * 1000;
        storage.sendMessageToWorker(worker, cmd, content, valid_msec, callback);
    });
    http_server.addHandler("/get-msg-queue-content", (data, callback) => {
        storage.getMsgQueueContent(callback);
    });

    http_server.addHandler("/register-topology", (data, callback) => {
        storage.registerTopology(data.uuid, data.config, callback);
    });
    http_server.addHandler("/disable-topology", (data, callback) => {
        storage.disableTopology(data.uuid, callback);
    });
    http_server.addHandler("/enable-topology", (data, callback) => {
        storage.enableTopology(data.uuid, callback);
    });
    http_server.addHandler("/delete-topology", (data, callback) => {
        storage.deleteTopology(data.uuid, callback);
    });
    http_server.addHandler("/clear-topology-error", (data, callback) => {
        leader.TopologyLeader.clearTopologyError(data.uuid, storage, callback);
    });
    http_server.addHandler("/stop-topology", (data, callback) => {
        storage.stopTopology(data.uuid, callback);
    });
    http_server.addHandler("/kill-topology", (data, callback) => {
        storage.killTopology(data.uuid, callback);
    });
    http_server.addHandler("/topology-info", (data, callback) => {
        storage.getTopologyInfo(data.uuid, callback);
    });
    http_server.addHandler("/delete-worker", (data, callback) => {
        storage.deleteWorker(data.name, callback);
    });
    http_server.addHandler("/shut-down-worker", (data, callback) => {
        storage.sendMessageToWorker(data.name, intf.CONSTS.LeaderMessages.shutdown, {}, 60 * 1000, callback);
    });
    http_server.addHandler("/enable-worker", (data, callback) => {
        storage.sendMessageToWorker(data.name, intf.CONSTS.LeaderMessages.set_enabled, {}, 60 * 1000, callback);
    });
    http_server.addHandler("/disable-worker", (data, callback) => {
        storage.sendMessageToWorker(data.name, intf.CONSTS.LeaderMessages.set_disabled, {}, 60 * 1000, callback);
    });

    http_server.addHandler("/topology-history", (data, callback) => {
        storage.getTopologyHistory(data.uuid, callback);
    });
    http_server.addHandler("/worker-history", (data, callback) => {
        storage.getWorkerHistory(data.name, callback);
    });
    return http_server;
}

/////////////////////////////////////////////////////////////////////////////

export function runHttpServer(options: any) {
    const storage = new mem.MemoryStorage();
    const http_server = initHttpServer(storage);
    http_server.run(options);
}

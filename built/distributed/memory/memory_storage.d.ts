import * as intf from "../../topology_interfaces";
export declare class MemoryStorage implements intf.CoordinationStorage {
    private workers;
    private topologies;
    private messages;
    private workers_history;
    private topologies_history;
    constructor();
    getProperties(callback: intf.SimpleResultCallback<intf.StorageProperty[]>): void;
    getWorkerStatus(callback: intf.SimpleResultCallback<intf.WorkerStatus[]>): void;
    getTopologyStatus(callback: intf.SimpleResultCallback<intf.TopologyStatus[]>): void;
    getTopologiesForWorker(worker: string, callback: intf.SimpleResultCallback<intf.TopologyStatus[]>): void;
    getMessages(name: string, callback: intf.SimpleResultCallback<intf.StorageResultMessage[]>): void;
    getTopologyInfo(uuid: string, callback: intf.SimpleResultCallback<intf.TopologyInfoResponse>): void;
    registerWorker(name: string, callback: intf.SimpleCallback): void;
    announceLeaderCandidacy(name: string, callback: intf.SimpleCallback): void;
    checkLeaderCandidacy(name: string, callback: intf.SimpleResultCallback<boolean>): void;
    assignTopology(uuid: string, worker: string, callback: intf.SimpleCallback): void;
    sendMessageToWorker(worker: string, cmd: string, content: any, valid_msec: number, callback: intf.SimpleCallback): void;
    setTopologyStatus(uuid: string, status: string, error: string, callback: intf.SimpleCallback): void;
    setWorkerStatus(worker: string, status: string, callback: intf.SimpleCallback): void;
    setWorkerLStatus(worker: string, lstatus: string, callback: intf.SimpleCallback): void;
    registerTopology(uuid: string, config: intf.TopologyDefinition, callback: intf.SimpleCallback): void;
    disableTopology(uuid: string, callback: intf.SimpleCallback): void;
    enableTopology(uuid: string, callback: intf.SimpleCallback): void;
    deleteTopology(uuid: string, callback: intf.SimpleCallback): void;
    stopTopology(uuid: string, callback: intf.SimpleCallback): void;
    killTopology(uuid: string, callback: intf.SimpleCallback): void;
    clearTopologyError(uuid: string, callback: intf.SimpleCallback): void;
    deleteWorker(name: string, callback: intf.SimpleCallback): void;
    shutDownWorker(name: string, callback: intf.SimpleCallback): void;
    getTopologyHistory(uuid: string, callback: intf.SimpleResultCallback<intf.TopologyStatusHistory[]>): void;
    getWorkerHistory(name: string, callback: intf.SimpleResultCallback<intf.WorkerStatusHistory[]>): void;
    private pingWorker(name);
    private unassignWaitingTopologies();
    private disableDefunctWorkers();
    private disableDefunctLeaders();
    private notifyTopologyHistory(top);
    private notifyWorkerHistory(w);
}

import * as intf from "../../topology_interfaces";
export declare class HttpStorage implements intf.CoordinationStorage {
    private port;
    private client;
    private url_prefix;
    constructor(port?: number);
    getProperties(callback: intf.SimpleResultCallback<intf.StorageProperty[]>): void;
    getMessages(name: string, callback: intf.SimpleResultCallback<intf.StorageResultMessage[]>): void;
    getMessage(name: string, callback: intf.SimpleResultCallback<intf.StorageResultMessage>): void;
    getWorkerStatus(callback: intf.SimpleResultCallback<intf.WorkerStatus[]>): void;
    getTopologyStatus(callback: intf.SimpleResultCallback<intf.TopologyStatus[]>): void;
    getTopologiesForWorker(name: string, callback: intf.SimpleResultCallback<intf.TopologyStatus[]>): void;
    getTopologyInfo(uuid: string, callback: intf.SimpleResultCallback<any>): void;
    registerWorker(name: string, callback: intf.SimpleCallback): void;
    pingWorker(name: string, callback?: intf.SimpleCallback): void;
    announceLeaderCandidacy(name: string, callback: intf.SimpleCallback): void;
    checkLeaderCandidacy(name: string, callback: intf.SimpleResultCallback<boolean>): void;
    assignTopology(uuid: string, name: string, callback: intf.SimpleCallback): void;
    sendMessageToWorker(worker: string, cmd: string, content: any, valid_msec: number, callback: intf.SimpleCallback): void;
    setTopologyStatus(uuid: string, status: string, error: string, callback: intf.SimpleCallback): void;
    getMsgQueueContent(callback: intf.SimpleResultCallback<intf.MsgQueueItem[]>): void;
    setWorkerStatus(name: string, status: string, callback: intf.SimpleCallback): void;
    setWorkerLStatus(name: string, lstatus: string, callback: intf.SimpleCallback): void;
    setTopologyPid(uuid: string, pid: number, callback: intf.SimpleCallback): void;
    registerTopology(uuid: string, config: any, callback: intf.SimpleCallback): void;
    disableTopology(uuid: string, callback: intf.SimpleCallback): void;
    enableTopology(uuid: string, callback: intf.SimpleCallback): void;
    deleteTopology(uuid: string, callback: intf.SimpleCallback): void;
    clearTopologyError(uuid: string, callback: intf.SimpleCallback): void;
    stopTopology(uuid: string, callback: intf.SimpleCallback): void;
    killTopology(uuid: string, callback: intf.SimpleCallback): void;
    deleteWorker(name: string, callback: intf.SimpleCallback): void;
    shutDownWorker(name: string, callback: intf.SimpleCallback): void;
    getTopologyHistory(uuid: string, callback: intf.SimpleResultCallback<intf.TopologyStatusHistory[]>): void;
    getWorkerHistory(name: string, callback: intf.SimpleResultCallback<intf.WorkerStatusHistory[]>): void;
    private call(addr, req_data, callback);
}

"use strict";

module.exports = {
    // used for nodes that run in subprocess
    child: require("./src/topology_node"),
    // used for running single local topology in same process
    local: require("./src/topology_local"),
    // when running fully capable topology workers
    distributed: {
        // for single worker
        worker: require("./src/distributed/topology_worker"),
        // for single coordinator
        coordinator: require("./src/distributed/topology_coordinator"),
        // std providers
        std_coordinators: {
            file: require("./src/distributed/file_based/file_coordinator"),
            http: {
                storage: require("./src/distributed/http_based/http_coordination_storage"),
                coordinator: require("./src/distributed/http_based/http_coordinator")
            }
        }
    },
    // some exposed utilities
    util: {
        // easier parsing of command line
        cmdline: require("./src/util/cmdline")
    }
};

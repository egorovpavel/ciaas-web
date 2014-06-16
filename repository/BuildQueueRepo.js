'use strict';

var Queue = require('bull');

var BuildQueueRepo = function (port, host) {
    var buildQueue = Queue("build", port, host);

    var addJob = function (job) {
        return buildQueue.add(job);
    };

    return {
        add: addJob
    }
};

module.exports = BuildQueueRepo;
'use strict';
var db = require('../models');

var ProjectsRepo = function () {

    var addProjectToAccount = function (accountId, project) {
        var Account = db.Account.build({id: accountId});
        return Account.createProject(project);
    };

    return {
        add: addProjectToAccount
    }
};

module.exports = ProjectsRepo;
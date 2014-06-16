'use strict';
var db = require('../models');
var Promise = require('bluebird');

var ProjectsRepo = function () {
    var addProjectToAccount = function (account, projectProperties) {
        var promise = Promise.pending();
        var project = db.Project.build(projectProperties);
        var errors = project.validate();
        if (errors) {
            promise.reject(errors);
            return promise.promise;
        }

        return account.createProject(projectProperties).then(function () {
            return project.setContainer(projectProperties.container);
        });
    };

    var updateProject = function (id, projectProperties) {
        return getById(id).then(function (project) {
            var promise = Promise.pending();
            project.name = projectProperties.name;
            project.repo_url = projectProperties.repo_url;
            project.command = projectProperties.command;
            var errors = project.validate();
            if (errors) {
                promise.reject(errors);
                return promise.promise;
            }
            project.setContainer(projectProperties.container);
            return project.save();
        });
    };

    var getAll = function (account) {
        return db.Project.findAll({include: [db.Container], where: {AccountId: account.id}});
    };

    var getById = function (id) {
        return db.Project.find({include: [db.Container], where: {id: id}});
    };

    var deleteProject = function (id) {
        return getById(id).then(function (project) {
            return project.destroy();
        })
    };

    return {
        update: updateProject,
        create: addProjectToAccount,
        all: getAll,
        get: getById,
        'delete': deleteProject
    }
}();

module.exports = ProjectsRepo;
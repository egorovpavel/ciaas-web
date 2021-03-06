'use strict';
var db = require('../models');
var Promise = require('bluebird');
var _ = require('lodash');

var ProjectsRepo = function () {
    var addProjectToAccount = function (account, projectProperties) {
        var promise = Promise.pending();
        var newproject = db.Project.build(projectProperties);
        var errors = newproject.validate();
        if (errors) {
            promise.reject(errors);
            return promise.promise;
        }
        if(!projectProperties.container){
            errors = {
                ContainerId : ["Primary container must be selected"]
            };
            promise.reject(errors);
            return promise.promise;
        }

        return newproject.save().then(function (project) {
            newproject = project;
            return project.setContainer(projectProperties.container);
        }).then(function () {
            return newproject.setAccount(account);
        });
    };

    var updateProject = function (id, projectProperties) {
        return getById(id).then(function (project) {
            var promise = Promise.pending();
            project.command = projectProperties.command;
            project.artifact_path = projectProperties.artifact_path;
            project.default_branch = projectProperties.default_branch;
            var errors = project.validate();
            if (errors) {
                promise.reject(errors);
                return promise.promise;
            }
            return project.save().then(function (project) {
                return project.setContainer(projectProperties.container);
            }).then(function(project){
                var secondaryConatiners = _.map(projectProperties.secondary_container,function(item){
                    item.id = parseInt(item.id);
                    return db.Container.build(item);
                });
                console.log("SECONADY:",secondaryConatiners);

                return project.setSecondaryContainer(secondaryConatiners);
            });
        });
    };

    var getAll = function (account) {
        return db.Project.findAll({include: [db.Container,{ model : db.Build, attributes:["build_id","status_result"]}], where: {AccountId: account.id}});
    };

    var getById = function (id) {
        return db.Project.find({include: [{ model: db.Account, as:"Account"},{ model: db.Container},{ model: db.Container, as: 'SecondaryContainer' }], where: {id: id}});
    };

    var deleteProject = function (id) {
        return getById(id).then(function (project) {
            return project.destroy();
        })
    };

    var countAll = function () {
        return db.Project.count();
    };

    return {
        update: updateProject,
        create: addProjectToAccount,
        all: getAll,
        get: getById,
        count : countAll,
        'delete': deleteProject
    }
}();

module.exports = ProjectsRepo;
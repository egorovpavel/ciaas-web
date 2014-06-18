'use strict';
var db = require('../models');
var Promise = require('bluebird');

var BuildsRepo = function () {

    var openBuild = function (buildProperties) {
        var promise = Promise.pending();
        buildProperties.status_exec = "QUEUED";
        var build = db.Build.build(buildProperties);
        var errors = build.validate();
        if (errors) {
            promise.reject(errors);
            return promise.promise;
        }
        return build.save();
    };

    var closeBuild = function (id, buildProperties) {
        return getById(id).then(function (build) {
            var promise = Promise.pending();
            build.log_build = buildProperties.name;
            build.log_result = buildProperties.type;
            build.status_exec = buildProperties.description;
            build.status_result = buildProperties.description;
            build.finished = buildProperties.description;
            build.started = buildProperties.description;
            var errors = build.validate();
            if (errors) {
                promise.reject(errors);
                return promise.promise;
            }
            return build.save();
        });
    };

    var getAll = function () {
        return db.Container.findAll();
    };

    var getById = function (id) {
        return db.Container.find(id);
    };

    var getPrimary = function () {
        return db.Container.findAll({where: {type: 'primary'}});
    };

    var destroy = function (id) {
        return getById(id).then(function (container) {
            return container.destroy();
        })
    };

    return {
        open: openBuild,
        close: closeBuild,
        all: getAll,
        get: getById,
        getPrimary: getPrimary,
        'delete': destroy
    }
}();

module.exports = BuildsRepo;
'use strict';
var db = require('../models');
var Promise = require('bluebird');
var request = require('request');

var BuildsRepo = function () {
    var bucket = process.env.S3_BUCKET || "dev-results";
    var getLogs = function(id,buildstatus){
        console.log("FETCHIG LOGS:",'https://s3-eu-west-1.amazonaws.com/dev-results/build_'+id);
        var promise = Promise.pending();
        if(buildstatus == "QUEUED" || buildstatus == "RUNNING"){
            promise.resolve("");
        }else{
            request('http://s3-eu-west-1.amazonaws.com/' + bucket + '/build_'+id, function (err, response, body) {
                console.log("RESPONSE",response.statusCode);
                if (!err && response.statusCode == 200) {
                    promise.resolve(body);
                }else if(!err && response.statusCode != 200){
                    console.log("RESPONSE err",response.statusCode);
                    promise.reject({message: response.statusCode});
                }else{
                    promise.reject(err);
                }
            });
        }
        return promise.promise;
    };

    var openBuild = function (project,commit) {
        return db.Build.count({ where: ["ProjectId = ?", project.id] }).then(function (n) {
            var nextId = n + 1;
            var buildProperties = {
                status_exec: "QUEUED",
                build_id: nextId,
                branch : project.default_branch,
                commit_id : commit.commit_id,
                commit_message : commit.commit_message,
                commit_author : commit.commit_author
            };
            console.log("COMMIT:", commit);
            console.log("BUILD:", buildProperties);
            return db.Build.create(buildProperties);
        }).then(function (build) {
            return build.setProject(project);
        });
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

    var getAll = function (project) {
        return project.getBuilds({
            order: 'build_id DESC'
        });
    };

    var countAll = function () {
        return db.Build.count();
    };

    var getById = function (project, id) {
        return db.Build.find({where: {
            ProjectId: project.id,
            build_id: id
        }});
    };

    return {
        open: openBuild,
        close: closeBuild,
        all: getAll,
        get: getById,
        count : countAll,
        getLogs:getLogs
    }
}();

module.exports = BuildsRepo;

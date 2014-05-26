"use strict";

var thoonk = require('thoonk').createClient();
var Job = require('thoonk-jobs');
var redis = require('redis');
module.exports = function (app) {

    app.get('/dashboard', function (req, res, next) {
        res.render('dashboard/index');
    });

    app.get('/dashboard/build/:id', function (req, res, next) {
        res.render('dashboard/build', {
            buildId: req.params.id,
            output: "output"
        });
    });
    app.io.route('build.feed', function (req) {
        var id = req.data.id;
        var redisClient = redis.createClient();
        redisClient.on('message', function (channel, message) {
            req.io.emit("channel_" + id, {
                message: message
            })
        });
        redisClient.subscribe("channel_" + id);

    })
    app.post('/dashboard', function (req, res, next) {
        var item = {
            id: Math.round(Math.random() * 100, 3),
            config: {
                language: "JS",
                timeout: 500000
            },
            payload: {
                commands: req.param('commands').split("\r\n")
            },
            result: {
                status: null,
                output: []
            }
        };
        console.log(item);
        thoonk.registerObject('Job', Job, function () {
            var jobPublisher = thoonk.objects.Job('buildQueue');
            jobPublisher.subscribe(function () {
                jobPublisher.publish(item, {
                    id: item.id,
                    onFinish: function () {
                        console.log('Job completed!');
                    }
                }, function () {
                    res.redirect('/dashboard/build/' + item.id);
                });
            });
        });
    });
};

"use strict";

var thoonk = require('thoonk').createClient();
var Job = require('thoonk-jobs');
var redis = require('redis');
var ConvertAsci = require('ansi-to-html');
module.exports = function (app) {

    var convert = new ConvertAsci();

    app.get('/dashboard', function (req, res, next) {
        res.render('common/app');
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
                message: convert.toHtml(message)
            })
        });
        redisClient.subscribe("channel_" + id);
    });
    app.post('/dashboard', function (req, res, next) {
        var item = req.param('item');
        item.id = Math.round(Math.random() * 100, 3);
        item.result = {
            status: null,
            output: []
        };
        console.log(item);
        thoonk.registerObject('Job', Job, function () {
            var jobPublisher = thoonk.objects.Job('buildQueue');
            jobPublisher.subscribe(function () {
                jobPublisher.publish(item, {
                    id: item.id,
                    onFinish: function (err, result) {
                        console.log('Job completed!');
                        console.log(result);
                    }
                }, function () {
                    res.json({id: item.id});
                });
            });
        });
    });
};

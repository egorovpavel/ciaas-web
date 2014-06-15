"use strict";

var redis = require('redis');
var Queue = require('bull');
var _ = require('lodash');

var ConvertAsci = require('ansi-to-html');
module.exports = function (app) {
    var buildQueue = Queue("build", app.get('redisPort'), app.get('redisHost'));
    var convert = new ConvertAsci();
    var getKey = function (id) {
        return "report:build:" + id;
    };
    var redisFeedSubscriber = redis.createClient();
    var redisClient = redis.createClient();

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

        var firstMessage = true;
        redisFeedSubscriber.on('message', function (channel, message) {
            if (channel == "channel_result_" + id) {
                req.io.emit("channel_result_" + id, JSON.parse(message));
                redisFeedSubscriber.unsubscribe("channel_result_" + id);
                redisFeedSubscriber.unsubscribe("channel_" + id);
            } else {
                var msg = JSON.parse(message);
                if (msg.data) {
                    var data = {
                        id: msg.id,
                        line: msg.line,
                        data: convert.toHtml(msg.data)
                    };
                    if (firstMessage) {
                        if (msg.line > 0) {
                            redisClient.lrange(getKey(id), 0, data.line - 1, function (err, entries) {
                                var en = _.map(entries, function (item, idx) {
                                    return {
                                        id: id,
                                        line: idx,
                                        data: convert.toHtml(item)
                                    }
                                });
                                en.push(data);
                                _.forEach(en, function (elm) {
                                    req.io.emit("channel_" + id, elm);
                                });
                            });
                        } else {
                            req.io.emit("channel_" + id, data);
                        }
                        firstMessage = false;
                    } else {
                        req.io.emit("channel_" + id, data);
                    }
                }
            }
        });
        redisFeedSubscriber.subscribe("channel_" + id);
        redisFeedSubscriber.subscribe("channel_result_" + id);

    });
    app.post('/dashboard', function (req, res, next) {
        var item = req.param('item');
        item.id = Math.round(Math.random() * 100, 3);

        buildQueue.add(item);

        res.json({id: item.id});
    });
};

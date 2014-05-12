"use strict";

var thoonk = require('thoonk').createClient();
var Job = require('thoonk-jobs');

module.exports = function (app) {

    app.get('/dashboard', function (req, res, next) {
        res.render('dashboard/index');
    });

    app.post('/dashboard', function (req, res, next) {
        console.log(req.param('commands'));
        var item = {
            id: Math.round(Math.random() * 100, 3),
            config: {
                language: "JS",
                timeout: 500000
            },
            payload: {
                commands: req.param('commands').split("\r\n")

            }
        };
        console.log(item);
        thoonk.registerObject('Job', Job, function () {
            var jobPublisher = thoonk.objects.Job('buildQueue');
            jobPublisher.subscribe(function () {

                jobPublisher.publish(item, {
                    //id: 'customId',
                    //priority: true, // push the job to the front of the queue
                    onFinish: function () {
                        console.log('Job completed!');
                    }
                }, function () {
                    res.redirect('/dashboard');
                });
            });
        });
    });
};
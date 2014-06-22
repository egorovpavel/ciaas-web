'use strict';
var ConvertAsci = require('ansi-to-html');
var _ = require('lodash');
function BuildController(app) {
    var convert = new ConvertAsci();
    var Projects = app.get("repos").ProjectsRepo;
    var Accounts = app.get("repos").AccountsRepo;
    var Builds = app.get("repos").BuildsRepo;
    var BuildQueue = app.get("repos").BuildQueueRepo();

    app.get('/account/:username/project/:id/build', function (req, res) {
        var acc;
        Accounts.getByUsername(req.param('username')).then(function (account) {
            acc = account;
            return  Projects.all(account);
        }).then(function (projects) {
            console.log(projects);
            res.render('project/list.html', {
                account: acc,
                projects: projects
            });
        }).catch(function (err) {
            if (err) {
                console.log(err);
                res.status(404);
            }
        }).finally(function () {
            console.log("ACCOUNT LIST");
        });
    });

    app.post('/account/:username/project/:id/build', function (req, res) {
        var _buildid;
        var _project;
        var _id;
        Projects.get(req.param('id')).then(function (project) {
            _project = project;
            return Builds.open(project);
        }).then(function (build) {
            _id = build.id;
            _buildid = build.build_id;
            return _project.getContainer();
        }).then(function (container) {
            var job = {
                _id: _id,
                id: _buildid,
                config: {
                    language: "JS",
                    timeout: 500000
                },
                container: {
                    primary: container.name
                },
                reposity: {
                    uri: _project.repo_url,
                    name: _project.name
                },
                skipSetup: false,
                payload: {
                    commands: _project.command.split("\\n")
                }
            };
            return BuildQueue.add(job);
        }).then(function (build) {
            res.redirect('/account/' + req.param('username') + '/project/' + req.param('id') + "/build/" + _buildid);
        }).catch(function (err) {
            if (err) {
                res.status(500);
            }
        }).finally(function () {
            console.log("build DONE");
        });
    });

    app.get('/account/:username/project/:id/build/:num', function (req, res) {
        var viewbag = {};
        Accounts.getByUsername(req.param('username')).then(function (account) {
            viewbag.account = account;
            return  Projects.get(req.param('id'));
        }).then(function (project) {
            viewbag.project = project;
            console.log(viewbag);
            return Builds.get(project, req.param('num'));
        }).then(function (build) {
            viewbag.build = build;
            viewbag.log = _.reduce(build.log_build, function (aggr, l) {
                return aggr + convert.toHtml(l.data)
            }, "");
            if (build.status_exec == 'COMPLETE') {
                res.render('build/detail_static.html', viewbag);
            } else {
                res.render('build/detail.html', viewbag);
            }
        }).catch(function (err) {
            if (err) {
                console.log(err);
                res.status(404);
            }
        }).finally(function () {
            console.log("ACCOUNT LIST");
        });
    });

}

module.exports = BuildController;
'use strict';

function BuildController(app) {

    var Projects = app.get("repos").ProjectsRepo;
    var Accounts = app.get("repos").AccountsRepo;
    var Containers = app.get("repos").ContainersRepo;

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
        Accounts.getByUsername(req.param('username')).then(function (account) {
            req.body.project.accountId = account.id;
            return Projects.create(account, req.body.project);
        }).then(function () {
            res.redirect('/account/' + req.param('username') + '/project');
        }).catch(function (err) {
            if (err) {
                if (err.code && err.code == 'ER_DUP_ENTRY') {
                    err = {
                        repo_url: ["Project with this repository already exists"]
                    };
                }
                console.log(err);
                Containers.getPrimary().then(function (containers) {
                    res.render('project/form.html', {
                        errors: err,
                        containers: containers,
                        project: req.body.project
                    });
                })
            }
        }).finally(function () {
            console.log("ACCOUNT DONE");
        });
    });

    app.get('/account/:username/project/:id/build/:num', function (req, res) {
        var _containers;
        var _account;
        Accounts.getByUsername(req.param('username')).then(function (account) {
            _account = account;
            return Containers.getPrimary();
        }).then(function (containers) {
            _containers = containers;
            return Projects.get(req.param('id'));
        }).then(function (project) {
            console.log(project);
            res.render('project/form.html', {
                containers: _containers,
                project: project,
                account: _account
            });
        }).catch(function (err) {
            console.log(err);
            if (err) {
                res.status(404);
            }
        })
            .finally(function () {
                console.log("ACCOUNT DONE");
            });
    });

}

module.exports = BuildController;
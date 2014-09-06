'use strict';
var Authorization = require('./../common/Authorization');
function UserProjectsController(app) {

    var Projects = app.get("repos").ProjectsRepo;
    var Accounts = app.get("repos").AccountsRepo;
    var GitHubRemote = app.get("repos").GitHubRemoteRepo;
    var Containers = app.get("repos").ContainersRepo;

    app.get('/projects',Authorization.isAuthenticated, function (req, res) {
        Projects.all(req.user).then(function (projects) {
            res.render('project/list.html', {
                req : req,
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

    app.post('/projects/create',Authorization.isAuthenticated, function (req, res) {
        Accounts.getByUsername(req.param('username')).then(function (account) {
            return Projects.create(account, req.body.project);
        }).then(function () {
            res.redirect('/dashboard/account/' + req.param('username') + '/project');
        }).catch(function (err) {
            if (err) {
                if (err.code && err.code == 'ER_DUP_ENTRY') {
                    err = {
                        repo_url: ["Project with this repository already exists"]
                    };
                }
                Containers.getPrimary().then(function (containers) {
                    res.render('dashboard/project/form.html', {
                        req : req,
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

    app.get('/projects/create',Authorization.isAuthenticated, function (req, res) {
        GitHubRemote.getAllRepos(req.user.token).then(function(repos){
            res.render('project/new.html', {
                req : req,
                repos : repos
            });
        }).catch(function (err) {
            if (err) {
                console.log(err);
                res.status(500);
            }
        }).finally(function () {
            console.log("ACCOUNT DONE");
        });
    });

    app.get('/projects/create/:repo',Authorization.isAuthenticated, function (req, res) {
        var repositories;
        GitHubRemote.getRepo(req.user.token, req.user.username,req.params.repo).then(function(repos){
            repositories = repos;
            return Containers.getPrimary();  
        }).then(function (containers) {
            res.render('project/new_config.html', {
                req : req,
                containers: containers,
                repos : repositories
            });
        }).catch(function (err) {
            if (err) {
                console.log(err);
                res.status(500);
            }
        }).finally(function () {
            console.log("ACCOUNT DONE");
        });
    });



    app.post('/projects/create/:repo',Authorization.isAuthenticated, function (req, res) {
        var project;
        GitHubRemote.getRepo(req.user.token, req.user.username,req.params.repo).then(function(repo){
            project = req.body.project;
            project.name = repo.name;
            project.repo_url = repo.clone_url;
            console.log(project);
            return Projects.create(req.user, project);
        }).then(function (containers) {
            res.redirect('/projects');
        }).catch(function (err) {
            if (err) {
                console.log(err);
                res.status(500);
            }
        }).finally(function () {
            console.log("ACCOUNT DONE");
        });
    });

    app.get('/projects/:id/delete',Authorization.isAuthenticated, function (req, res) {
        var acc;
        Accounts.getByUsername(req.param('username'))
            .then(function (account) {
                acc = account;
                return Projects.get(req.param('id'))
            })
            .then(function (project) {
                res.render('dashboard/project/delete.html', {
                    req : req,
                    account: acc,
                    project: project
                });
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                    res.status(404);
                }
            })
            .finally(function () {
                console.log("ACCOUNT delete show");
            });
    });

    app.post('/projects/:id/delete',Authorization.isAuthenticated, function (req, res) {
        Projects.delete(req.param('id'))
            .then(function () {
                res.redirect('/dashboard/account/' + req.param('username') + '/project');
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                    res.status(501);
                }
            })
            .finally(function () {
                console.log("ACCOUNT deleteed");
            });
    });

    app.get('/projects/:id/edit',Authorization.isAuthenticated, function (req, res) {
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
            res.render('dashboard/project/form.html', {
                req : req,
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

    app.post('/projects/:id/edit',Authorization.isAuthenticated, function (req, res) {
        var _account;
        Accounts.getByUsername(req.param('username')).then(function (account) {
            _account = account;
            return Projects.update(req.param('id'), req.body.project);
        }).then(function () {
            res.redirect('/dashboard/account/' + req.param('username') + '/project');
        }).catch(function (err) {
            if (err) {
                if (err.code && err.code == 'ER_DUP_ENTRY') {
                    err = {
                        repo_url: ["Project for this repository already exists"]
                    };
                }
                console.log(err);
                req.body.project.id = "dummy";

                Containers.getPrimary().then(function (containers) {
                    res.render('dashboard/project/form.html', {
                        req : req,
                        errors: err,
                        account: _account,
                        containers: containers,
                        project: req.body.project
                    });
                });
            }
        }).finally(function () {
            console.log("ACCOUNT DONE");
        });
    });

    app.get('/projects/:id',Authorization.isAuthenticated, function (req, res) {
        var _account;
        Accounts.getByUsername(req.param('username')).then(function (account) {
            _account = account;
            return Projects.get(req.param('id'));
        }).then(function (project) {
            res.render('dashboard/project/detail.html', {
                req : req,
                account: _account,
                project: project
            });
        }).catch(function (err) {
            console.log(err);
            if (err) {
                res.status(500);
            }
        }).finally(function () {
            console.log("ACCOUNT DONE");
        });
    });

}

module.exports = UserProjectsController;
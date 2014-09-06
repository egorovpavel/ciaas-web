'use strict';
var Authorization = require('./../common/Authorization');
function ContainerController(app) {
    var Containers = app.get("repos").ContainersRepo;

    app.get('/dashboard/container',Authorization.isAuthenticated,Authorization.isAdmin, function (req, res) {
        Containers.all().then(function (containers) {
            res.render('dashboard/container/list.html', {
                req : req,
                containers: containers
            });
        }).catch(function (err) {
            if (err) {
                console.log(err);
                res.status(501);
            }
        }).finally(function () {
            console.log("ACCOUNT LIST");
        });
    });

    app.get('/dashboard/container/create',Authorization.isAuthenticated,Authorization.isAdmin, function (req, res) {
        res.render('dashboard/container/form.html',{req : req});
    });

    app.get('/dashboard/container/:id',Authorization.isAuthenticated,Authorization.isAdmin, function (req, res) {
        Containers.get(req.param('id')).then(function (container) {
            res.render('dashboard/container/detail.html', {
                req : req,
                container: container
            });
        })
            .catch(function (err) {
                console.log(err);
                if (err) {
                    res.status(501);
                }
            })
            .finally(function () {
                console.log("ACCOUNT DONE");
            });
    });

    app.get('/dashboard/container/:id/edit',Authorization.isAuthenticated,Authorization.isAdmin, function (req, res) {
        Containers.get(req.param('id')).then(function (container) {
            res.render('dashboard/container/form.html', {
                req : req,
                container: container
            });
        })
            .catch(function (err) {
                console.log(err);
                if (err) {
                    res.status(404);
                }
            })
            .finally(function () {
                console.log("ACCOUNT DONE");
            });
    });

    app.post('/dashboard/container/:id/edit',Authorization.isAuthenticated,Authorization.isAdmin, function (req, res) {
        Containers.update(req.param('id'), req.body.container)
            .then(function (container) {
                res.redirect('/dashboard/container/' + container.id);
            })
            .catch(function (err) {
                if (err) {

                    if (err.code && err.code == 'ER_DUP_ENTRY') {
                        err = {
                            name: ["container with this name already exists"]
                        };
                    }
                    console.log(err);
                    req.body.container.id = "dummy";
                    res.render('dashboard/container/form.html', {
                        req : req,
                        errors: err,
                        container: req.body.container
                    });
                }
            })
            .finally(function () {
                console.log("ACCOUNT DONE");
            });
    });

    app.post('/dashboard/container/create',Authorization.isAuthenticated,Authorization.isAdmin, function (req, res) {
        console.log(req.body.container);
        Containers.create(req.body.container)
            .then(function (container) {
                res.redirect('/dashboard/container/' + container.id);
            })
            .catch(function (err) {
                if (err) {
                    if (err.code && err.code == 'ER_DUP_ENTRY') {
                        err = {
                            name: ["container with this name already exists"]
                        };
                    }
                    console.log("ERROR", err);
                    res.render('dashboard/container/form.html', {
                        req : req,
                        errors: err,
                        container: req.body.container
                    });
                }
            })
            .finally(function () {
                console.log("ACCOUNT DONE");
            });
    });

    app.get('/dashboard/container/:id/delete',Authorization.isAuthenticated,Authorization.isAdmin, function (req, res) {
        Containers.get(req.param('id'))
            .then(function (container) {
                res.render('dashboard/container/delete.html', {
                    req : req,
                    container: container
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

    app.post('/dashboard/container/:id/delete',Authorization.isAuthenticated,Authorization.isAdmin, function (req, res) {
        Containers.delete(req.param('id'))
            .then(function (container) {
                res.redirect('/dashboard/container');
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

};

module.exports = ContainerController;
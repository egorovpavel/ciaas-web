'use strict';

function AccountController(app) {
    var Accounts = app.get("repos").AccountsRepo;

    app.get('/account', function (req, res) {
        Accounts.all().then(function (accounts) {
            res.render('account/list.html', {
                accounts: accounts
            });
        }).catch(function (err) {
            if (err) {
                console.log(err);
                res.responseError(501);
            }
        }).finally(function () {
            console.log("ACCOUNT LIST");
        });
    });

    app.get('/account/create', function (req, res) {
        res.render('account/form.html');
    });

    app.get('/account/detail/:id', function (req, res) {
        Accounts.get(req.param('id')).then(function (account) {
            res.render('account/detail.html', {
                account: account
            });
        })
            .catch(function (err) {
                console.log(err);
                if (err) {
                    res.responseError(501);
                }
            })
            .finally(function () {
                console.log("ACCOUNT DONE");
            });
    });

    app.get('/account/edit/:id', function (req, res) {
        Accounts.get(req.param('id')).then(function (account) {
            res.render('account/form.html', {
                account: account
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

    app.post('/account/edit/:id', function (req, res) {
        Accounts.update(req.param('id'), req.body.account)
            .then(function (account) {
                res.redirect('/account/detail/' + account.id);
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                    if (err.code && err.code == 'ER_DUP_ENTRY') {
                        err = {
                            email: ["Email already exists"]
                        };
                    }
                    req.body.account.id = req.param('id');
                    res.render('account/form.html', {
                        errors: err,
                        account: req.body.account
                    });
                }
            })
            .finally(function () {
                console.log("ACCOUNT DONE");
            });
    });

    app.post('/account/create', function (req, res) {
        Accounts.create(req.body.account)
            .then(function (account) {
                res.redirect('/account/detail/' + account.id);
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                    if (err.code && err.code == 'ER_DUP_ENTRY') {
                        err = {
                            email: ["Email already exists"]
                        };
                    }
                    res.render('account/form.html', {
                        errors: err,
                        account: req.body.account
                    });
                }
            })
            .finally(function () {
                console.log("ACCOUNT DONE");
            });
    });

    app.get('/account/delete/:id', function (req, res) {
        Accounts.get(req.param('id'))
            .then(function (account) {
                res.render('account/delete.html', {
                    account: account
                });
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                    res.responseError(501);
                }
            })
            .finally(function () {
                console.log("ACCOUNT delete show");
            });
    });

    app.post('/account/delete/:id', function (req, res) {
        Accounts.delete(req.param('id'))
            .then(function (account) {
                res.redirect('/account');
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                    res.responseError(501);
                }
            })
            .finally(function () {
                console.log("ACCOUNT deleteed");
            });
    });

};

module.exports = AccountController;
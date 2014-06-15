var _repository = require("../repository/ConfigRepo.js");

function AccountController (app) {

    var _repo = new _repository();

    app.get('/account', function (req, res) {
        res.render('account/account.html');
    });

    app.post('/account', function (req, res) {
        var _body = req.body;

        _repo.createAccount({
            username: _body.username,
            full_name: _body.full_name,
            email: _body.email,
            password: "password1"
        })
            .then(function (config) {
                console.log(config);
                res.render('account/account.html');
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                }
            })
            .finally(function () {
                console.log("ACCOUNT DONE");
            });
    });
};

module.exports = AccountController;
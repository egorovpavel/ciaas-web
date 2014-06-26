module.exports = function (app) {

    app.get('/auth/github/callback', function (req, res) {
        res.redirect('/account/:username/project/create');
    });

    app.get('/', function (req, res) {
        res.render('home/home.html');
    });
};
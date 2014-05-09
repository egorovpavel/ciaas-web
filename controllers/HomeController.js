
module.exports = function (app) {
    var homeViewDir = './home/';

    app.get('/home', function (req, res) {
        res.render(homeViewDir + 'home');
    });
};
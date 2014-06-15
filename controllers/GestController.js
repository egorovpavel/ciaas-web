
module.exports = function(app){
    var homeViewDir = './home/';

    app.get('/', function (req, res) {
        res.render(homeViewDir + 'home');
    });
}
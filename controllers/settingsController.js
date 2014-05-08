/**
 * Created by Iurie on 08-05-2014.
 */

module.exports = function (app) {

    app.get('/settings', function (req, res) {
        res.render('index');
    });

};
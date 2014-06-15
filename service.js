"use strict";
var express = require('express.io');
var http = require('http');
var swig = require('swig');
var fs = require('fs');
var Sequelize = require('sequelize');
var model = require(__dirname + '/models_db/models_sqlite.js');
var controllers_path = __dirname + '/controllers';
var config = require('./config.json')[process.env.NODE_ENV || 'development'];

var sqlize = new Sequelize(config.mysql.db, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
    dialect: 'mysql',
    port: config.mysql.port,
    host: config.mysql.host
});
model(sqlize);

var app = express();
app.http().io();
app.set('env', "development");
app.configure('development', function () {
    app.engine('html', swig.renderFile);
    app.set('port', config.app.port);
    app.set('redisPort', config.redis.port);
    app.set('redisHost', config.redis.host);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    app.disable('view cache');
    app.use(require('connect').bodyParser());


    app.use('/app/partials', express.static(__dirname + '/views/angular'));
    app.use('/app', express.static(__dirname + '/assets/dist'));
    app.use('/app', express.static(__dirname + '/assets/src'));
    app.use('/app', express.static(__dirname + '/assets/src/bower_components'));
});

fs.readdirSync(controllers_path).forEach(function(file){
    require(controllers_path + '/' + file)(app);
});

app.listen(
    app.get('port'),
    function () {
        console.log("Express server listening on port " + app.get('port'));
    }
);


return app;

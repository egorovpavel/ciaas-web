"use strict";
var express = require('express.io');
var http = require('http');
var swig = require('swig');
var fs = require('fs');

var app = express();
app.http().io();
app.set('env', "development");
app.configure('development', function () {
    app.engine('html', swig.renderFile);
    app.set('port', 3000);
    app.set('redisPort', 6379);
    app.set('redisHost', '127.0.0.1');
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    app.disable('view cache');
    app.use(require('connect').bodyParser());


    app.use('/app/partials', express.static(__dirname + '/views/angular'));
    app.use('/app', express.static(__dirname + '/assets/dist'));
    app.use('/app', express.static(__dirname + '/assets/src'));
    app.use('/app', express.static(__dirname + '/assets/src/bower_components'));
});

var controllers_path = __dirname + '/controllers';

fs.readdirSync(controllers_path).forEach(function (file) {
    require(controllers_path + '/' + file)(app);
});

app.listen(
    app.get('port'),
    function () {
        console.log("Express server listening on port " + app.get('port'));
    }
);
return app;

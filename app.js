"use strict";
var express = require('express');
var http = require('http');
var swig = require('swig');

var app = express();
app.engine('html', swig.renderFile);
app.set('port', 8080);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);

app.get('/', function (request, response) {
    response.render('index', {});
});

app.get('/dashboard', function (request, response) {
    response.render('dashboard');
});

http.createServer(app).listen(
    app.get('port'),
    function () {
        console.log("Express server listening on port " + app.get('port'));
    }
);

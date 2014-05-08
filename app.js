"use strict";
var express = require('express');
var http = require('http');
var consolidate = require('consolidate');
var swig = require('swig');

var app = express();
app.engine('html', swig.renderFile);
app.set('port', 3000);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);

app.get('/', function (request, response) {
    response.render('index');
});

http.createServer(app).listen(
    app.get('port'),
    function () {
        console.log("Express server listening on port " + app.get('port'));
    }
);
/**
 * Created by Iurie on 08-05-2014.
 */

"use strict";

var Sequelize = require("sequelize");

var connection = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: '/vagrant/platform/web/database/main.db'
});

module.exports = connection;
'use strict';
var db = require('../models');
var Promise = require('bluebird');

var AccountsRepo = function () {

    var createAccount = function (accountProperties) {
        var promise = Promise.pending();
        var account = db.Account.build(accountProperties);
        var errors = account.validate();
        if (errors) {
            promise.reject(errors);
            return promise.promise;
        }
        return account.save();
    };

    var updateAccount = function (id, accountProperties) {
        return getById(id).then(function (account) {
            var promise = Promise.pending();
            account.username = accountProperties.username;
            account.full_name = accountProperties.full_name;
            if (accountProperties.password) {
                account.password = accountProperties.password;
            }
            var errors = account.validate();
            if (errors) {
                promise.reject(errors);
                return promise.promise;
            }
            return account.save();
        });
    };

    var getAll = function () {
        return db.Account.findAll();
    };

    var getById = function (id) {
        return db.Account.find(id);
    };

    var softDelete = function (id) {
        return getById(id).then(function (account) {
            return account.destroy();
        })
    };

    return {
        update: updateAccount,
        create: createAccount,
        all: getAll,
        get: getById,
        'delete': softDelete
    }
}();

module.exports = AccountsRepo;
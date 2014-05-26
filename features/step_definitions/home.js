'use strict';

module.exports = function () {
    this.World = require("../support/world.js");
    this.Given(/^I am on home page$/, function (callback) {
        // express the regexp above with the code you wish you had
        callback.pending();
    });

    this.Then(/^I should see "([^"]*)"$/, function (arg1, callback) {
        // express the regexp above with the code you wish you had
        callback.pending();
    });
}
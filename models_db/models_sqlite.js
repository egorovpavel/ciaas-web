var Sequelize = require("sequelize");
module.exports = function (sq) {

    var Container = sq.define('container', {
        name: Sequelize.STRING,
        type: Sequelize.STRING,
        description: Sequelize.STRING
    });

    var Config = sq.define('config', {
        command: Sequelize.STRING,
        artifact_path: Sequelize.STRING
    });

    Config.hasMany(Container);
    Container.hasMany(Config);

    return {
        Config : Config,
        Container : Container
    };
};
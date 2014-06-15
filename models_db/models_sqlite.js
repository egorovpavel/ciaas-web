var Sequelize = require("sequelize");
module.exports = function (sq) {

    var Account = sq.define('Account', {
        username: Sequelize.STRING,
        full_name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING
    });

    var Container = sq.define('Container', {
        name: Sequelize.STRING,
        type: Sequelize.STRING,
        description: Sequelize.STRING
    });

    var Project = sq.define('Project', {
        name: Sequelize.STRING,
        repo_url: Sequelize.STRING,
        command: Sequelize.STRING,
        artifact_path: Sequelize.STRING
    });

    var Build = sq.define('Build', {
        log_build: Sequelize.STRING,
        log_result: Sequelize.STRING,
        status_exec: Sequelize.STRING, // NONE; RUNNING; COMPLETE
        status_result: Sequelize.STRING, //SUCCESS; FAILED;
        time_finish: Sequelize.DATE
    });

    Account.hasMany(Project);
    //Project.belongsTo(Account);

    Project.hasMany(Build);
    Build.belongsTo(Project);

    Project.hasMany(Container);
    Container.hasMany(Project);

    return {
        Account: Account,
        Project : Project,
        Container : Container,
        Build: Build
    };
};
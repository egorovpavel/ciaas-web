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
        account: {
            type: Sequelize.STRING,
            references: "Account",
            referencesKey: "username"
        },
        name: Sequelize.STRING,
        repo_url: Sequelize.STRING,
        command: Sequelize.STRING,
        artifact_path: Sequelize.STRING
    });

    var Project_Container  = sq.define('Project_Container', {
        project_id: {
            type: Sequelize.INTEGER,
            references: "Project",
            referencesKey: "id"
        },
        container_id: {
            type: Sequelize.STRING,
            references: "Container",
            referencesKey: "name"
        }
    });

    var Build = sq.define('Build', {
        project_id: {
            type: Sequelize.INTEGER,
            references: "Project",
            referencesKey: "id"
        },
        log_build: Sequelize.STRING,
        log_result: Sequelize.STRING,
        status_exec: Sequelize.STRING, // NONE; RUNNING; COMPLETE
        status_result: Sequelize.STRING, //SUCCESS; FAILED;
        time_finish: Sequelize.DATE
    });

    return {
        Account: Account,
        Project : Project,
        Container : Container,
        Project_Container: Project_Container,
        Build: Build
    };
};
module.exports = function (sequelize, DataTypes) {
    var Build = sequelize.define('Build', {
        build_id: {
            type: DataTypes.INTEGER
        },
        log_build: {
            type: DataTypes.TEXT
        },
        log_result: {
            type: DataTypes.STRING
        },
        status_exec: {
            type: DataTypes.ENUM('QUEUED', 'RUNNING', 'COMPLETE')
        },
        status_result: {
            type: DataTypes.ENUM('SUCCESS', 'FAILED', 'TIMEOUT')
        },
        finished: {
            type: DataTypes.DATE
        },
        started: {
            type: DataTypes.DATE
        }
    }, {
        classMethods: {
            associate: function (models) {
                Build.belongsTo(models.Project);
            }
        }
    });

    return Build;
};
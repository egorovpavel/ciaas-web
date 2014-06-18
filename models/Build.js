module.exports = function (sequelize, DataTypes) {
    var Build = sequelize.define('Build', {
        log_build: {
            type: DataTypes.STRING
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
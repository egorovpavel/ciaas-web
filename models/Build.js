module.exports = function (sequelize, DataTypes) {
    var Build = sequelize.define('Build', {
        log_build: DataTypes.STRING,
        log_result: DataTypes.STRING,
        status_exec: DataTypes.STRING, // NONE; RUNNING; COMPLETE
        status_result: DataTypes.STRING, //SUCCESS; FAILED;
        time_finish: DataTypes.DATE
    }, {
        classMethods: {
            associate: function (models) {
                Build.belongsTo(models.Project);
            }
        }
    });

    return Build;
};
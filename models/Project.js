module.exports = function (sequelize, DataTypes) {
    var Project = sequelize.define('Project', {
        name: DataTypes.STRING,
        repo_url: DataTypes.STRING,
        command: DataTypes.STRING,
        artifact_path: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Project.hasMany(models.Build);
                Project.hasMany(models.Container);
            }
        }
    });

    return Project;
};
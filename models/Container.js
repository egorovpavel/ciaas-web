module.exports = function (sequelize, DataTypes) {
    var Container = sequelize.define('Container', {
        name: DataTypes.STRING,
        type: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Container.hasMany(models.Project);
            }
        }
    });

    return Container;
};
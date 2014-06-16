module.exports = function (sequelize, DataTypes) {
    var Account = sequelize.define('Account', {
        username: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Username cant be empty"
                },
                is: {
                    args: ["^[a-z]+$", 'i'],
                    msg: "Username must be alpha"
                }
            }
        },
        full_name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Full name cant be empty"
                },
                is: {
                    args: ["^[a-z ]+$", 'i'],
                    msg: "Full name must be alpha"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: "Email must be valid email address"
                },
                notEmpty: {
                    msg: "Email cant be empty"
                }
            },
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Password cant be empty"
                }
            }
        }
    }, {
        paranoid: true,
        timestamps: true,
        classMethods: {
            associate: function (models) {
                Account.hasMany(models.Project);
            }
        }
    });

    return Account;
};
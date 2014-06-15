module.exports = {
  up: function(migration, DataTypes, done) {
      var db = migration.migrator.sequelize;
      require('../models_db/models_sqlite.js')(db);
      db.sync().success(function(err){
          if(err){
              console.log(err);
          }

      });
  },
  down: function(migration, DataTypes, done) {
      migration.dropTable("ContainersProjects");
      migration.dropTable("Builds");
      migration.dropTable("Projects");
      migration.dropTable("Accounts");
      migration.dropTable("Containers");
      done();
  }
};

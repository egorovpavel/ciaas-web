module.exports = {
  up: function(migration, DataTypes, done) {
      var db = migration.migrator.sequelize;
      require('../models_db/models_sqlite.js')(db);
      db.sync().success(function(err){
          if(err){
              console.log(err);
          }
          migration.describeTable('containers').success(function(attributes) {
              console.log(attributes);
              done();
          });
      });
  },
  down: function(migration, DataTypes, done) {
      migration.dropTable("containers");
      migration.dropTable("configs");
      done();
  }
};

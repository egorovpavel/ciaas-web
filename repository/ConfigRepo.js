var db = require("../models_db/connection.js");
var models = require("../models_db/models_sqlite.js")(db);


function ConfigRepo(){

    ConfigRepo.prototype.createConfig = function(object_config){
        return models.Config.create(object_config);
    };
    ConfigRepo.prototype.getCommand = function(){  };

    ConfigRepo.prototype.getArtifactPath = function(){  };

};

module.exports = ConfigRepo;
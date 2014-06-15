var db = require("../models_db/connection.js");
var models = require("../models_db/models_sqlite.js")(db);


function ConfigRepo(){

    ConfigRepo.prototype.createProject = function(object_project){
        return models.Project.create(object_project);
    };
    ConfigRepo.prototype.getCommand = function(){  };

    ConfigRepo.prototype.getArtifactPath = function(){  };

    ConfigRepo.prototype.createAccount = function(object_account){
        return models.Account.create(object_account);
    };

    ConfigRepo.prototype.getAccountByName = function(name){
        var acc =  models.Account.find({where: {name : name}});
        console.log(acc);
        return acc
    };
    ConfigRepo.prototype.getProjectContainers = function(project_id){
        return 1
    };
    ConfigRepo.prototype.createtProjectContainers = function(object_proj_containers){
        return models.Project_Container.create(object_proj_containers);
    };
    ConfigRepo.prototype.getContainerByName = function(container_name){
        var cont =  models.Project_Container.find({where: {name : container_name}});
        console.log(cont);
        return cont
    };
};

module.exports = ConfigRepo;
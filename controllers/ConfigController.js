var _repository = require("../repository/ConfigRepo.js");

function ConfigController (app){

    var _repo = new _repository();

    app.get('/config', function (req, res) {
        _repo.createConfig({
            command : "Ola2",
            artifact_path : "/path/to"
        })
        .then(function(config){
            console.log(config);
            res.render('config/config.html');
        })
        .catch(function(err){
            if(err){
                console.log(err);
            }
        })
        .finally(function(){
            console.log("ALLWAYS");
        });
});


    /*
        app.get('/config', function (req, res) {
            var result = {
                configs : null,
                users : null
            };
            _repo.createConfig({
                command : "Ola",
                artifact_path : "/path/to"
            })
            .then(function(config){
                result.configs = config;
                return _usersRepo.all();
            })
            .then(function(users){
                result.users = users;
                return _someOtherRepo.getAll();
            })
            .then(function(some){
                result.users = users;
            })
            .fail(function(err){
                Logger.log("sdsfsd");
                app.render("500");
            })
            .done(function(){

                app.render("sddsad", result);
            })
            .always(function(){
                Logger.log("sdsfsd");
            });
        });

        */
}

module.exports = ConfigController;
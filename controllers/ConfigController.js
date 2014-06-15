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

    app.post('/config',
        function (req, res) {
        var _body = req.body;
        _repo.createConfig({
            command : _body.commands,
            artifact_path : "/path/to"
        })
            .then(function(config){

            })
            .catch(function(err){
                if(err){
                    console.log(err);
                }
            })
            .finally(function(){
                //console.log("ALLWAYS");
            });
    });
}

module.exports = ConfigController;
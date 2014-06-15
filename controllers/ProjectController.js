var _repository = require("../repository/ConfigRepo.js");

function ProjectController (app){

    var _repo = new _repository();

    app.get('/project', function (req, res) {
        res.render('config/project.html');
    });

    app.post('/project', function (req, res) {
        var _body = req.body;
        if(_body.lang_nodejs == 'on')
        var master_container = _repo.getContainerByName(_body.lang_nodejs);
        var slave_container = _repo.getContainerByName(_body.dep_redis);
        var curr_account = _repo.getAccountByName("system");

        var new_project = _repo.createProject({
            account: curr_account.id,
            name: _body.proj_name,
            repo_url: _body.repository_url,
            command: _body.commands,
            artifact_path: _body.artifact
        })
        .then(function(config){
             console.log(config);
        })
        .catch(function(err){
            if(err){
                console.log(err);
            }
        })
        .finally(function(){
            console.log("PROJECT CONFIG DONE");
        });
        _repo.createtProjectContainers({
            project_id: new_project.id,
            container_id: master_container.name
        });
        _repo.createtProjectContainers({
            project_id: new_project.id,
            container_id: slave_container.name
        });

    });
}

module.exports = ProjectController;
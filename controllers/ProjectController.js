function ProjectController (app){

    var _repo = app.get('repository');

    app.get('/project', function (req, res) {
        res.render('config/project.html');
    });

    app.post('/project', function (req, res) {
        var _body = req.body;
        var curr_account = _repo.getAccountByName("system");

        console.log(curr_account);

        _repo.createProj(curr_account,{
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
    });
}

module.exports = ProjectController;
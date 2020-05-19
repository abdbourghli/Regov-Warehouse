var users = [
    { name: 'test1', email: 'test1@tex.com' },
    { name: 'test2', email: 'test2@tex.com' },
    { name: 'test3', email: 'test3@tex.com' }
  ];
  
  exports.list = function(req, res){
    res.send({ title: 'Users', users: users });
  };

  exports.login = function(req, res){
    let userIndex = users.findIndex(x => x.name ===req.body.name);
    if (userIndex>-1) {
      next();
    } else {
      var err = new Error('cannot find user ' + req.body.name);
      res.status = 404;
      res.send(err)
    }
  };
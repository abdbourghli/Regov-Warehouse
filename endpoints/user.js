var users = [
    { name: 'test1', email: 'test1@tex.com' },
    { name: 'test2', email: 'test2@tex.com' },
    { name: 'test3', email: 'test3@tex.com' }
  ];
  
  exports.list = function(req, res){
    res.send({ title: 'Users', users: users });
  };
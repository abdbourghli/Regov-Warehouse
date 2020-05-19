var express = require('express')
var router = express.Router()

//Test data
var users = [
    { name: 'test1', email: 'test1@tex.com' },
    { name: 'test2', email: 'test2@tex.com' },
    { name: 'test3', email: 'test3@tex.com' }
  ];
  


//Home
router.get('/', function (req, res) {
  res.send('Home page')
})

/// User endpoints ///

//get list of users
router.get('/users', function (req, res) {
    res.send({ title: 'Users', users: users });
})

//create user
router.post('/register', function (req, res) {
    let userIndex = users.findIndex(x => x.name ===req.body.name);
    if (userIndex!=-1) {
        if (req.body.email){
            users.push({name: req.body.name, email: req.body.email})
            res.send('added new user')
        }
        else{
            var err = new Error('Missing user name');
            res.status = 404;
            res.send(err)
        }
         res.send('added new user')
    } else {
        var err = new Error('User already exists' + req.body.name);
        res.status = 404;
        res.send(err)
    }
})

//Login
router.post('/login', function (req, res) {
    let userIndex = users.findIndex(x => x.name ===req.body.name);
    if (userIndex>-1) {
        res.send(users[userIndex])
    } else {
        var err = new Error('cannot find user ' + req.body.name);
        res.status = 404;
        res.send(err)
    }
})

module.exports = router
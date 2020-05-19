let express = require('express')
let db = require('../scripts/db')
let router = express.Router()

//Test data
let users = [
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
router.get('/users', (req, res) =>{
    res.send({ title: 'Users', users: users });
})

//create user
router.post('/register', async (req, res) =>{
    let userIndex = users.findIndex(x => x.name ===req.body.name);
    const userInDB = await db.getUserByName(req.body.name)
    
    if (!userInDB) {
        if (req.body.email&&req.body.password){
            db.addUserToDB({userName: req.body.name, email: req.body.email, password: req.body.password})
            res.send('added new user to database')
        }
        else{
            var err = new Error('Missing user name');
            res.status = 400;
            res.send(err)
        }
    } else {
        var err = new Error('User already exists' + req.body.name);
        res.status = 400;
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

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


/// products endpoints ///

//add product
router.post('/api/addproduct', async (req, res) =>{
    //check that product doesn't already exists
    const productInDB = await db.getProductByName(req.body.name)
    if (!productInDB) {
        //add the product to db
        db.addProductToDB({name:req.body.name})
        res.send('added new product to database')
    } else {
        var err = new Error('Product already exists' + req.body.name);
        res.status = 400;
        res.send(err)
    }
})

//fetch a product
router.get('/api/product/:name', async (req,res)=>{
    if (req.params.name){
        const reqProduct = await db.getProductByName(req.params.name)
        if (reqProduct){
            res.send(reqProduct)
        }
        else{
            res.status = 404
            res.send(`${req.params.name} doesn't exists.`)
        }
    }
})

//fetch all products
router.get('/api/products', async (req,res)=>{
    const reqProduct = await db.getAllProducts()
    if (reqProduct){
        res.send(reqProduct)
    }
    else{
        res.send("No products in DataBase")
    }
})

/// products endpoints ///

//add warehouse
router.post('/api/addwarehouse', async (req, res) =>{
    //check that warehouse doesn't already exists
    const warehouseInDB = await db.getWarehouseByName(req.body.name)
    if (!warehouseInDB) {
        //add the product to db
        db.addWarehouseToDB({name:req.body.name})
        res.send('added new warehouse to database')
    } else {
        var err = new Error('warehouse already exists' + req.body.name);
        res.status = 400;
        res.send(err)
    }
})

//fetch a warehouse
router.get('/api/warehouse/:name', async (req,res)=>{
    if (req.params.name){
        const reqWarehouse = await db.getWarehouseByName(req.params.name)
        if (reqWarehouse){
            res.send(reqWarehouse)
        }
        else{
            res.status = 404
            res.send(`${req.params.name} doesn't exists.`)
        }
    }
})

//fetch all warehouses
router.get('/api/warehouses', async (req,res)=>{
    const reqWarehouses = await db.getAllWarehouses()
    if (reqWarehouses){
        res.send(reqWarehouses)
    }
    else{
        res.send("No warehouses in DataBase")
    }
})

module.exports = router

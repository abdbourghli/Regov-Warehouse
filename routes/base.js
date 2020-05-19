const express = require('express')
const db = require('../scripts/db')
const router = express.Router()
const passport = require('passport')
const session = require('express-session')

initializePassport = require('../scripts/pass-configs')

initializePassport(passport, db.getUserByName, db.getUserByID)

//Test data
let users = [
    { name: 'test1', email: 'test1@tex.com' },
    { name: 'test2', email: 'test2@tex.com' },
    { name: 'test3', email: 'test3@tex.com' }
  ];
  

//session configs
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

//passport middleware
router.use(passport.initialize())
router.use(passport.session())

//Home
router.get('/', function (req, res) {
  res.send('Home page')
})

/// User endpoints ///

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
router.post('/login',passport.authenticate('local', { failWithError: true }),function(req, res, next) {
    // handle success
    res.redirect('/');
    },
    function(err, req, res, next) {
    // handle error
    console.log(err)
    return res.json({sucess: 'false'});
});


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

//remove product by product name
router.delete('/api/product/:name', async (req,res)=>{
    const product = await db.getProductByName(req.params.name)
    if (product){
        db.removeProduct(product)
        res.send('product removed')

    }
    else{
        res.send("Product doesn't exests in DataBase")
    }
})

/// warehouse endpoints ///

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

//remove product by warehouse name
router.delete('/api/warehouse/:name', async (req,res)=>{
    const warehouse = await db.getWarehouseByName(req.params.name)
    if (warehouse){
        db.removeWarehouse(warehouse)
        res.send('warehouse removed')

    }
    else{
        res.send("warehouse doesn't exests in DataBase")
    }
})

/// stock endpoints ///

//get stock in warehouse
router.get('/api/warehousestock/:warehouse', async (req,res)=>{
    if (req.params.warehouse){
        const stock = await db.getWarehouseStock(req.params.warehouse)
        res.send(stock)
    }
    else {
        var err = new Error('missing info');
        res.status = 400;
        res.send(err)
    }
})
//get stock by warehouse name and product name

//add to stock
router.put('/api/stock', async (req, res) =>{
    if (req.body.product && req.body.warehouse && req.body.amount){
        db.insertInStock(req.body.product, req.body.warehouse, req.body.amount)
        res.send('added to stock')
    }
    else {
        var err = new Error('missing info');
        res.status = 400;
        res.send(err)
    }
})

//remove from stock
router.put('/api/unstock', async (req, res) =>{
    if (req.body.product && req.body.warehouse && req.body.amount){

        db.removefromStock(req.body.product, req.body.warehouse, req.body.amount)
        res.send('added to stock')
    }
    else {
        var err = new Error('missing info');
        res.status = 400;
        res.send(err)
    }
})
module.exports = router

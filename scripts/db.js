const mysql = require('mysql'),
    passHash = require('./pass-hash')
require('dotenv').config()

//login info to DN
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

/// users events///

//adding hash value to the passVault table and link it with the user id
const commitUserPass = (userID, userHash)=>{
    const inserUserQuery = `INSERT INTO passVault (userID, passHash) VALUES 
    (${userID}, "${userHash}")`;
    con.query(inserUserQuery, function (err, result) {
    if (err) throw err;
  });
}

// insert new user to DB
exports.addUserToDB = async user=>{
    const inserUserQuery = `INSERT INTO users (userName, email) VALUES 
    ("${user.userName}", "${user.email}")`;
    con.query(inserUserQuery, async function (err, result) {
    if (err) throw err;
    else{
        console.log(user)
        console.log("1 record inserted")
        // console.log(result)
        try{
            //create hash value from the given password
            const userHash = await passHash.createHash(user.password)
            //get the new user id
            const newuser = await module.exports.getUserByName(user.userName)
            //adding the hash value to the passwords table and link it with the user id
            commitUserPass(newuser.ID, userHash)
        }
        catch(e){
            console.log("Error accured during hash commit, Removing user record",e)
            //delete the new row from the user table
            var deleteUserQuery = `DELETE FROM users WHERE email = '${user.email}'`;
            con.query(deleteUserQuery, function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
            });
        }
    }
  });
}

//search for user by username
exports.getUserByName = userName=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT * FROM users WHERE userName = "${userName}"`, async function (err, result, fields) {
            if (err) reject (err);
            if(result[0]){
                let userData = result[0]
                //get the user password hash
                let passwordHash = await (module.exports.getUserHash(userData.ID)) ||''
                //adding hash to userData
                userData.passwordHash = passwordHash.passHash
                
                resolve (userData)
            }
            else {
                resolve (null)
            }
          });
    })
}

//search for user by id
exports.getUserByID = id=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT * FROM users WHERE ID = "${id}"`,  async function (err, result, fields) {
            if (err) reject (err);
            if(result[0]){
                let userData = result[0]
                //get the user password hash
                let passwordHash = await module.exports.getUserHash(userData.ID) ||''
                //adding hash to userData
                userData.passwordHash = passwordHash.passHash
                
                resolve (userData)
            }
            else {
                resolve (null)
            }
          });
    })
}

//get all users
exports.getAllUsers = ()=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT * FROM users`,  async function (err, result, fields) {
            if (err) reject (err);
            if(result[0]){
                resolve (result)
            }
            else {
                resolve (null)
            }
          });
    })
}

//get user password hash
exports.getUserHash = id=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT passHash FROM passVault WHERE userID = "${id}"`, function (err, result, fields) {
            if (err) reject (err);
            if(result[0]){
                resolve (result[0])
            }
            else {
                resolve (null)
            }
          });
    })
}

/// products events///

//fetch a product by the product name
exports.getProductByName = productName=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT * FROM products WHERE Name = "${productName}"`, async function (err, result, fields) {
            if (err) reject (err);
            if(result[0]){
                resolve (result[0])
            }
            else {
                resolve (null)
            }
          });
    })
}

//inset product to the Database
exports.addProductToDB = async product=>{
    console.log(product)
    const inserUserQuery = `INSERT INTO products (Name) VALUES ("${product.name}")`;
    con.query(inserUserQuery, async function (err, result) {
    if (err) throw err;
    else{
        console.log(product)
        console.log("1 record inserted")
        // console.log(result)
    }
  });
}
exports.getAllProducts = ()=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT * FROM products`, async function (err, result, fields) {
            if (err) reject (err);
            resolve (result)
          });
    })
}

/// warehouse events///

//fetch a warehouse by the warehouse name
exports.getWarehouseByName = warehouseName=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT * FROM warehouse WHERE Name = "${warehouseName}"`, async function (err, result, fields) {
            if (err) reject (err);
            if(result[0]){
                resolve (result[0])
            }
            else {
                resolve (null)
            }
          });
    })
}

//insert warehouse to DB
exports.addWarehouseToDB = async warehouse=>{
    const inserUserQuery = `INSERT INTO warehouse (Name) VALUES ("${warehouse.name}")`;
    con.query(inserUserQuery, async function (err, result) {
    if (err) throw err;
    else{
        console.log(warehouse)
        console.log("1 record inserted")
        // console.log(result)
    }
  });
}
exports.getAllWarehouses= ()=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT * FROM warehouse`, async function (err, result, fields) {
            if (err) reject (err);
            resolve (result)
          });
    })
}

/// stock events///

//fetch item stock in a specific warehouse by id
exports.getStockByProductAndWarehosueI = (productId,warehouseId)=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT * FROM stock WHERE product = "${productId}" AND warehouse = "${warehouseId}"`, async function (err, result, fields) {
            if (err) reject (err);
            if(result[0]){
                resolve (result[0])
            }
            else {
                resolve (null)
            }
        });
    })
}

//fetch item stock in a specific warehouse by name
exports.getStockByProductAndWarehosueN = (productName,warehouseName)=>{
    return new Promise( async (resolve,reject)=>{
        const productItem = await exports.getProductByName(productName)
        const warehouseItem = await exports.getWarehouseByName(warehouseName)
        if (productItem && warehouseItem){
            console.log(productItem,warehouseItem)
            resolve(await exports.getStockByProductAndWarehosueI(productItem.ID, warehouseItem.ID))
        }
        else{
            resolve(null)
        }
    })
}

//insert in stock
exports.insertInStock = async (productName, warehouseName, amount)=>{
    const itemStock = await exports.getStockByProductAndWarehosueN(productName, warehouseName)
    if (!itemStock){
        const productItem = await exports.getProductByName(productName)
        const warehouseItem = await exports.getWarehouseByName(warehouseName)

        const Query = `INSERT INTO stock (product, warehouse, amount) VALUES ("${productItem.ID}", "${warehouseItem.ID}", "${amount}")`;
        con.query(Query, async function (err, result) {
            if (err) throw err;
            else{
                console.log("1 record inserted")
                // console.log(result)
            }
        });
    }
    else {
        exports.addToStock(itemStock, amount)
    }
}

//add to stock in a specific warehouse
exports.addToStock = (stock, amount)=>{
    const Query = `UPDATE stock SET amount = ${amount+stock.amount} where ID = ${stock.ID}`;
    con.query(Query, async function (err, result) {
        if (err) throw err;
        else{
            console.log("1 record Updated")
            // console.log(result)
        }
    });
}
//Conect to DB
exports.connect = ()=>{con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB!")
});}
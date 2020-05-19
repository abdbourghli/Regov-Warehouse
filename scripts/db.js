const mysql = require('mysql')
require('dotenv').config()

//login info to DN
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  
//Conect to DB
exports.connect = ()=>{con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB!")
});}
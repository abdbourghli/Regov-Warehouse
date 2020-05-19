const mysql = require('mysql')
require('dotenv').config()

//login info to DN
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

//adding hash value to the passVault table and link it with the user id
const commitUserPass = (userID, userHash)=>{
    const inserUserQuery = `INSERT INTO passVault (userID, passHash) VALUES 
    (${userID}, "${userHash}")`;
    con.query(inserUserQuery, function (err, result) {
    if (err) throw err;
  });
}


//Conect to DB
exports.connect = ()=>{con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB!")
});}
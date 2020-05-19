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
    const inserUserQuery = `INSERT INTO user (userName, email) VALUES 
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
            var deleteUserQuery = `DELETE FROM user WHERE email = '${user.email}'`;
            con.query(deleteUserQuery, function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
            });
        }
    }
  });
}

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
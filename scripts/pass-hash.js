const bcrypt = require('bcrypt')

const saltRounds = 8

exports.createHash = password=>{
    return new Promise((resolve, reject)=>{
        //auto-gen a salt and hash from password
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if(err){
                 reject (err)
            }
             resolve(hash)
         })
    }) 
}

exports.compareHash = (password, hash)=>{
    return new Promise((resolve, reject)=>{
        //hash pasword and compare it with the stored hash value
        bcrypt.compare(password, hash, function(err, result) {
            if(err){
                //no match
                reject (err)
            }
            //matched
            resolve (result) 
        });
    });
}
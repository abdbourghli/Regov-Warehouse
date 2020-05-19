//passport configiration
const LocalStrategy = require('passport-local').Strategy,
    passHash = require('./pass-hash')

//initialize local strategy
function initialize(passport,getUserByName, getUserByID){
    passport.use(new LocalStrategy({usernameField: 'userName', passwordField: 'password'}, async (userName, password, done)=>{
        //get the user from DB
        const user = await getUserByName(userName)
        if (user == null){
            //user not found
            return (done(null, false, {message: `No user with the username "${userName}"`}))
        }
        try{
            //calculating the password hash and compare it with the stored hash
            if (await passHash.compareHash(password, user.passwordHash)){
                //hash match
                return done(null, user)
            }else{
                //hash unmatch
                return done(null, false, {message: 'Incorrect Password!'})
            }
        }
        catch(err){
            return done(err)
        }
    }))

    //serialize user and create session with user id
    passport.serializeUser((user, done) => done(null, user.ID))
    //deserialize user from user id
    passport.deserializeUser((id, done) => {
        return done(null, getUserByID(id))
    })
}

module.exports = initialize
const passport = require('passport');

const localStrat = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


 function initialize(passport, getUserByEmail, getuserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if(user == null) {
            return done(null, false, { message: 'No user with that email' });
        }

        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Wrong password' })
            }
        } catch (e){
            return done(e)
        }

    }
    passport.use(new localStrat({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { 
        return done(null, getuserById(id))
     })
}

module.exports = initialize;
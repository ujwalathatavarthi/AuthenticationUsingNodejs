const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/User');

passport.use(new googleStrategy({
    clientID : "746446558845-46mcqp6jk43ghkhodaa95om0rbrbkqb7.apps.googleusercontent.com",
    clientSecret : "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",
    callbackURL: "https://authentication-using-nodejs-z97u.onrender.com/auth/google/callback",
},
function(accessToken, refreshToken, profile, done){
    User.findOne({email: profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log('error in google strategy passport',err);
            return;
        }
        console.log(profile);
        if(user){
            return done(null,user);
        }
        else{
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex'),
            },function(err,user){
                if(err){
                    console.log('error in creating user',err);
                    return;
                }
                return done(null,user);
            });
        }
    });
}

));

module.exports = passport;
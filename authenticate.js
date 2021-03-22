var passport = require('passport');
var LocalStartegy = require('passport-local').Strategy; 
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStartegy(User.authenticate())); // if you dont use passprt-local-mongoose you need to write your own authentificate function
// Taking care of session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 604800}); // time to re authenticate
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // carry token in header
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload)
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false); // done is callback func that passport passes
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));


exports.verifyUser = passport.authenticate('jwt', {session: false}); // jwt strategy just configered // token based auth so no sessions created


/*
So, for verifying a user, I will use the JWT strategy. 
How does the JWT strategy work? 
=> In the incoming request, the token will be included in the authentication header as we saw here. 
We said authentication header as bearer token. 
If that is included, then that'll be extracted and that will be used to authenticate the user based upon the token.
*/ 

// config/passport.js
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const appConfig = require('./appConfig');

// JWT strategy options
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: appConfig.jwtSecret,
};

// JWT strategy implementation
passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        // Find the user based on the JWT payload's user ID
        User.findById(jwt_payload.id, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    })
);

module.exports = passport;

const LocalStrategy = require('passport-local');
const User = require('./../models/User');

module.exports = function(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username' });
                }
                if (!user.isValidPassword(password)) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                if (!user.confirmed) {
                    return done(null, false, { message: 'Please check email to active your account' });
                }
                if (user.del_flag) {
                    return done(null, false, { message: 'Your account has been blocked' });
                }
                return done(null, user);
            });
        }
    ));
}

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require("../models/User");

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req,username, password, done) => {
  User.findOne({
      email: username
    })
    .then(user => {
      if (!user) {
        return done(null, false, req.flash("errors", {
          msg: 'Invalid  Email'
        }));
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, req.flash("errors", {
            msg: 'Invalid  Password'
          }));

        }
        return done(null, user);
      })
    })
    .catch(err => {
      return done(err)
    })
}))

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
var debug = require('debug')('auth');

var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var utils = require('../td_common/libs/utils');

var User = require('../models/user');


module.exports = function (expressApp) {
  debug("auth init");

  // for passport
  expressApp.use(cookieParser());

  expressApp.use(passport.initialize());
  expressApp.use(passport.session());

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      debug("email: " + email);
      debug("password: " + password);

      User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          debug("user is not exists");
          return done(null, false, { message:
                                       'Unknown user, email: ' + email });
        }
        user.comparePassword(password, function(err, isMatch) {
          if (err) return done(err);
          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid password' });
          }
        });
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    var createAccessToken = function () {
      var token = utils.randomToken();
      User.findOne( { accessToken: token }, function (err, existingUser) {
        if (err) { return done( err ); }
        if (existingUser) {
          createAccessToken(); // Run the function again - the token has
                               //  to be unique!
        } else {
          user.set('accessToken', token);
          user.save( function (err) {
            if (err) return done(err);
            return done(null, user.get('accessToken'));
          });
        }
      });
    };

    if ( user._id ) {
      createAccessToken();
    }
  });

  passport.deserializeUser(function(token, done) {
    User.findOne( {accessToken: token } , function (err, user) {
      done(err, user);
    });
  });
};


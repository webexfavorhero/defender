var debug = require('debug')('signup');

var express = require('express');
var router = express.Router();
var nconf = require('nconf');
var async = require('async');
var fs = require('fs');
var hogan = require('hogan.js');
var momentTimezone = require('moment-timezone');

var log = require('../td_common/libs/log');

var mail = require('../libs/mail');
var User = require('../models/user');
var Activation = require('../models/activation');
var packages = require('../controllers/packages');


var signupTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/signup_email.tmpl', 'utf8'));

var signupSubjectTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/signup_subj.tmpl', 'utf8'));


// Status check middleware. Check if confirmation email has send before
// note that the data will be expired in 2h, so the user can only be send
// another email after 2 hours.
// To make sure the tokens expire, we’ll be taking advantage of the
// TTL capability of mongodb:
//    http://docs.mongodb.org/manual/tutorial/expire-data/
// If there's no record in the database, then create a new recoad for the
// emailStatus.
function checkStatus(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, data) {
    if(err) {
      log.error('Find user on signup/activate error: ' + err.message);
    }
    if(data) {
      res.render('message',
                 { title: 'Warning',
                   warning: 'Email ' + req.body.email +
                            ' already registered.'});
    } else {
      Activation.findOne({ email: req.body.email }, function(err, activ) {
        if (err) {
          return next(err);
        } else if ( activ === null) {
          return( next() );
        } else if ( activ.verified === true ) {
          res.render('message',
                     { title: 'Warning',
                       warning: 'Your account has already been activated. ' +
                                'Just head to the login page.' });
        } else {
          res.render('message',
                     { title: 'Warning',
                       warning: 'An email has been send before, please ' +
                                'check your mail to activate your account. ' +
                                'Note that you can only get another mail ' +
                                'after 2 hours.'});
        }
      });
    }
  });
}

router.post('/activate', checkStatus, function(req, res) {
  var _mail = req.body.email;
  debug("_mail: " + _mail);
  var activationStatus = new Activation({ email: _mail,
                                          hashedEmail: _mail,
                                          verified: false });
  activationStatus.save(function(err, activ) {
    if(err) {
      return log.error(err);
    } else {
      var activateLink = nconf.get('app:site') +
                        '/signup?token=' + activ.hashedEmail;
      var templData = { email: activ.email,
                        activateLink: activateLink };
      var signupHtml = signupTemplate.render(templData);
      var signupSubject = signupSubjectTemplate.render(templData);

      var mailOptions = {
        from: nconf.get("notifier:emailFrom"),
        to: activ.email,
        subject: signupSubject,
        html: signupHtml };

      mail.send(mailOptions, function (error, info) {
        debug('info: ' + JSON.stringify(info));
        if(error) {
          res.render('message', { title: 'Error', error: error });
        } else {
          res.render('message',
                     { title: 'Info',
                       info: 'We have just set you an email, ' +
                             'please check your mail to ' +
                             'activate your account!' });
        }
      });
    }
  });
});

// signup get router
router.get('/', function(req, res, next) {
  var token = req.query.token;
  if (token === undefined) {
    res.render('signup_step1', { title: "Sign Up" });
  } else {
    Activation.findOne({ hashedEmail: token }, function(err, activ) {
      if(err) { return next(err); }
      if(!activ) {
        res.render('message',
                   { title: 'Error',
                     error: 'Activation token not found.' });
      } else {
        var email = activ.email;
        if (activ.verified === true) {
          res.render('message',
                     { title: 'Warning',
                       warning: 'Your account has already been activated. ' +
                                'Just head to the login page.' });
        } else {
              var timezones = momentTimezone.tz.names();
              packages.getPackages(null, function(pkgs, message){
                res.render('signup_step2', { title: "Sign Up",
                                             email: email,
                                             timezones: timezones,
                                             packages: pkgs,
                                             flashMessage: message });
              });
        }
      }
    });
  }
});

router.post('/', function(req, res) {
  debug('signup body: ' + JSON.stringify(req.body));
  async.waterfall([
    function (callback) {
      User.findOne({ email: req.body.email }, callback);
    },
    function(data, callback) {
      if(data) {
        return callback(new Error('Oops, this email ' + req.body.email +
                                  ' already registered.'));
      }
      User.create({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        phone: req.body.phone,
        timezone: req.body.timezone,
        createdAt: Date.now(),
        plan: 'free',
        paid: false,
        contacts: [{
          name: req.body.username,
          email: req.body.email,
          phone: req.body.phone }]
        }, callback);
    },
    function(user, callback) {
      Activation.findOneAndUpdate( { email: req.body.email },
                                   { $set: { verified: true } },
                                   { upsert: false },
                                   function(err, activ) {
        callback(err, activ, user);
      });
    },
    function(activ, user, callback) {
      log.info('User ' + user.email + ' registered.');
      Activation.findOneAndRemove({email: user.email}).exec();
      req.logIn(user, callback);
    }
  ], function (err) {
    if (err) {
      log.error('Signup error: ' + err.message);
      res.render('message', { title: 'Error',
                              error: err.message });
    } else {
      res.redirect('/package/' + req.body.package);
    }
  });
});

module.exports = router;


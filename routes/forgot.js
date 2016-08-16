var debug = require('debug')('forgot');
debug('start');

var express = require('express');
var router = express.Router();
var async = require('async');
var nconf = require('nconf');
var fs = require('fs');
var hogan = require('hogan.js');

var log = require('../td_common/libs/log');
var utils = require('../td_common/libs/utils');

var mail = require('../libs/mail');
var User = require('../models/user');


var forgotTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/forgot_email.tmpl', 'utf8'));

var forgotSubjectTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/forgot_subj.tmpl', 'utf8'));


router.get('/', function (req, res) {
  res.render('forgot', { title: "Forgot password",
                        flashMessage: req.flash('error') });
});

router.post('/', function(req, res) {
  async.waterfall([
    function(callback) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', {i: 'No account with email address ' +
                                 req.body.email + ' exists.'});
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = utils.randomToken();
        user.resetPasswordExpires = Date.now() + 60*60*1000; // 1 hour
        user.save(function(err) {
          callback(err, user);
        });
      });
    },
    function(user, callback) {

      var resetLink = nconf.get('app:site') +
                        '/reset/' + user.resetPasswordToken;
      var templData = { username: user.username,
                        resetLink: resetLink };
      var forgotHtml = forgotTemplate.render(templData);
      var forgotSubject = forgotSubjectTemplate.render(templData);

      var mailOptions = {
        from: nconf.get("notifier:emailFrom"),
        to: user.email,
        subject: forgotSubject,
        html: forgotHtml };

      mail.send(mailOptions, function (err, info) {
        debug('mail.send: ' + JSON.stringify(info));
        callback(err, user);
      });
    }
  ], function(err, user) {
    if (err) {
      log.error('Forgot password error: ' + err.message);
      res.render('message',
                 { title: 'Error',
                   error: err.message });
    } else {
      res.render('message',
                 { title: 'Info',
                   info: 'An e-mail has been sent to ' + user.email +
                         ' with further instructions.'});
    }
  });
});

module.exports = router;


var debug = require('debug')('reset');
debug('start');

var express = require('express');
var router = express.Router();
var async = require('async');
var nconf = require('nconf');
var fs = require('fs');
var hogan = require('hogan.js');

var log = require('../td_common/libs/log');

var mail = require('../libs/mail');
var User = require('../models/user');


var resetTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/reset_email.tmpl', 'utf8'));

var resetSubjectTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/reset_subj.tmpl', 'utf8'));


router.get('/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token,
                 resetPasswordExpires: { $gt: Date.now() } },
               function(err, user) {
    if (!user) {
      req.flash('error', {e: 'Password reset token is invalid or has ' +
                             'expired.'});
      return res.redirect('/forgot');
    }
    res.render('reset', { title: "Reset password",
                          flashMessage: req.flash('error'),
                          token: req.params.token });
  });
});

router.post('/:token', function(req, res) {
  async.waterfall([
    function(callback) {
      User.findOne({ resetPasswordToken: req.params.token,
                     resetPasswordExpires: { $gt: Date.now() } },
                   function(err, user) {
        if (!user) {
          req.flash('error', {e: 'Password reset token is invalid or has ' +
                                 'expired.'});
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function(err) {
          if (err) { return callback(err); }
          req.logIn(user, function(err) {
            callback(err, user);
          });
        });
      });
    },
    function(user, callback) {
      var templData = { username: user.username,
                        email: user.email };
      var resetHtml = resetTemplate.render(templData);
      var resetSubject = resetSubjectTemplate.render(templData);

      var mailOptions = {
        from: nconf.get("notifier:emailFrom"),
        to: user.email,
        subject: resetSubject,
        html: resetHtml };

      mail.send(mailOptions, function (err, info) {
        debug('mail.send: ' + JSON.stringify(info));
        if(err) {
          req.flash('error', {e: err.message});
        } else {
          req.flash('error', {i: 'Success! Your password has been changed.'});
        }
        callback(err);
      });
    }
  ], function(err) {
    if (err) {
      log.error('Password reset error: ' + err.message);
    }
    res.redirect('/dashboard');
  });
});

module.exports = router;


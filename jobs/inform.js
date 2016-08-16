var debug = require('debug')('jobs:inform');

var nconf = require('nconf');
var async = require('async');
var hogan = require('hogan.js');
var fs = require('fs');

var log = require('../td_common/libs/log');

var agenda = require('../libs/agenda');
var mail = require('../libs/mail');
var sms = require('../libs/sms');
var User = require('../models/user');


var noSmsSubjectTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/nosms_subj.tmpl', 'utf8'));
var noSmsEmailTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/nosms_email.tmpl', 'utf8'));

var paymentDeclinedSubjectTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/payment_declined_subj.tmpl',
                  'utf8'));
var paymentDeclinedEmailTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/payment_declined_email.tmpl',
                  'utf8'));


exports.define = function defineJobs () {

  agenda.define('inform', function informJob(job, done) {
    var data = job.attrs.data;
    var userId = data.userId;
    var about = data.about;
    var subject = '';
    var emailHtml = '';
    var smsText = '';

    async.waterfall([
      function findUser (callback) {
        User.findById(userId, callback);
      },
      function createMessage (user, callback) {
        var templData;
        if (about === 'payment declinded') {
          templData = { username: user.username };
          subject = paymentDeclinedSubjectTemplate.render(templData);
          emailHtml = paymentDeclinedEmailTemplate.render(templData);
        } else if (about === 'no sms') {
          var link = nconf.get('app:site') + '/products';
          templData = { username: user.username,
                        link: link };
          subject = noSmsSubjectTemplate.render(templData);
          emailHtml = noSmsEmailTemplate.render(templData);
          // don't send sms, because user has no sms
        } else {
          return callback('Unknown about: ' + about);
        }
        callback(null, user);
      },
      function sendEmail (user, callback) {
        if (nconf.get('notifier:emailNotifications') &&
            user.email &&
            emailHtml) {
          var mailOptions = {
            from: nconf.get('notifier:emailFrom'),
            to: user.email,
            subject: subject,
            html: emailHtml };

          mail.send(mailOptions, function (err, info) {
            debug('info: ' + JSON.stringify(info));
          });
        }
        callback(null, user);
      },
      function sendSms (user, callback) {
        if (nconf.get('notifier:smsNotifications') &&
            user.phone &&
            smsText) {

          var smsOptions = {
            to: user.phone,
            from: nconf.get('notifier:smsFrom'),
            body: smsText };

          sms.sendPaid(smsOptions, user._id, function (err, message) {
            debug('message: ' + JSON.stringify(message));
          });
        }
        callback(null);
      },
    ], function finish (err) {
      if (err) {
        log.error('inform job error: ' + err);
      }
      done();
    });
  });
};

exports.reset = function resetJobs () {

};


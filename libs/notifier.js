var debug = require('debug')('notifier');
debug('start');

var nconf = require('nconf');
var async = require('async');
var fs = require('fs');
var hogan = require('hogan.js');
var moment = require('moment');
var mongoose = require('mongoose');

var log = require('../td_common/libs/log');
var utils = require('../td_common/libs/utils');

var mail = require('./mail');
var sms = require('./sms');
var Notification = require('../models/notification');
var websockets = require('./websockets');


var messageTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/notification_msg.tmpl', 'utf8'));

var emailTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/notification_email.tmpl', 'utf8'));

var subjectTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/notification_subj.tmpl', 'utf8'));

var smsTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/notification_sms.tmpl', 'utf8'));


exports.createNotifications = function (urlStatus, monitorId, newStatus,
                                        oldStatus, finishCallback) {
  var userId = urlStatus.userId;
  if (!(userId instanceof mongoose.Types.ObjectId)) {
    // if userId has been populated
    userId = userId._id;
  }
  async.eachSeries(urlStatus.contactIds, function(contactId, eachCallback) {
    Notification.create({ urlStatusId: urlStatus._id,
                          userId: userId,
                          contactId: contactId,
                          active: true,
                          createdAt: Date.now(),
                          statusType: monitorId,
                          oldStatus: oldStatus,
                          newStatus: newStatus,
                          resolveToken: utils.randomToken()
                        }, function (err) {
      eachCallback(err);
    });
  }, function (err) {
    finishCallback(err);
  });
};

exports.deactivateNotificationsByMonitorId =
                               function (urlStatusId, monitorId, callback) {
  Notification.update({ urlStatusId: urlStatusId,
                        active: true,
                        statusType: monitorId },
                      { $set: { active: false,
                                deactivatedAt: Date.now() } },
                      { multi: true },
                      function (err) {
    callback(err);
  });
};

exports.deactivateNotificationsByMonitorType =
                         function (urlStatusId, monitorType, finishCallback) {
  var monitors = nconf.get('monitors');
  var approvedMonitors = [];
  for (var monitorId in monitors) {
    if (monitorType === '*' || monitors[monitorId].type === monitorType) {
      approvedMonitors.push(monitorId);
    }
  }
  async.eachSeries(approvedMonitors, function(monitorId, eachCallback) {
    exports.deactivateNotificationsByMonitorId(urlStatusId, monitorId,
                                                 function (err){
      eachCallback(err);
    });
  }, function (err) {
    finishCallback(err);
  });
};

exports.notify = function(frequency, finishCallback) {
  debug('Notifications for every ' + frequency + '...');
  var tasks = 0;
  var emailCount = 0;
  var smsCount = 0;

  async.waterfall([
    function findNotices (callback) {
      Notification
        .find({ active: true })
        .populate({
          path: 'userId',
          match: { paid: true },
        })
        .populate({
          path: 'urlStatusId',
          match: { active: true },
        })
        .exec(callback);
    },
    function forEachNotice (notices, callback) {
      if (!notices) {
        return callback(true);
      }
      notices = notices
                  .filter(function filterPopulated (notice) {
                    return notice.userId && notice.urlStatusId;
                  })
                  .filter(function filterFrequency (notice) {
                    var contact = notice.userId.contacts.id(notice.contactId);
                    if (!contact) { return false; }
                    return (contact.notificationFrequency === frequency);
                  });

      debug('notices count: ' + notices.length);
      tasks = notices.length;
      if (tasks === 0) {
        return callback(true); // break from waterfall
      }

      for (var i in notices) {
        var notice = notices[i];
        callback(null, notice);
      }
    },
    function getTemplateData (notice, callback) {
      var user = notice.userId;
      var urlStat = notice.urlStatusId;
      var contact = user.contacts.id(notice.contactId);
      debug('contact: ' + JSON.stringify(contact));
      var templData = {
        contactName: contact.name,
        url: urlStat.url,
        urlName: urlStat.name,
        dateChanged: moment(notice.createdAt).format('lll'),
        urlStatus: notice.newStatus, //TODO: '{Browser Flag, Server Down, No Traffic}'
        statusType: notice.statusType };
      if (frequency !== "0") {
        templData.resolveLink = nconf.get('app:site') + '/resolve/' +
                                                          notice.resolveToken;
      }
      callback(null, notice, templData, user, contact);
    },
    function sendMessage (notice, templData, user, contact, callback) {
      var message = { w: messageTemplate.render(templData) };
      if (templData.hasOwnProperty('resolveLink')) {
        message.a = templData.resolveLink;
        message.l = 'If you don\'t want to receive any further ' +
                    'notifications, please click here';
      }
      debug('send message');
      websockets.emitToUser(user._id, 'message', message);
      callback(null, notice, templData, user, contact);
    },
    function sendEmail (notice, templData, user, contact, callback) {
      if (nconf.get('notifier:emailNotifications') && contact.email) {
        var emailHtml = emailTemplate.render(templData);
        var subject = subjectTemplate.render(templData);
        var mailOptions = {
          from: nconf.get('notifier:emailFrom'),
          to: contact.email,
          subject: subject,
          html: emailHtml };
        debug('send email');
        mail.send(mailOptions, function (err, info) {
          debug('info: ' + JSON.stringify(info));
          if (!err) {
            emailCount++;
            notice.emailSentAt.push(Date.now());
          }
          callback(null, notice, templData, user, contact);
        });
      } else {
        callback(null, notice, templData, user, contact);
      }
    },
    function sendSms (notice, templData, user, contact, callback) {
      if (nconf.get('notifier:smsNotifications') && contact.phone) {
        var smsText = smsTemplate.render(templData);
        var smsOptions = {
          to: contact.phone,
          from: nconf.get('notifier:smsFrom'),
          body: smsText };
        debug('send sms');
        sms.sendPaid(smsOptions, user._id, function (err, message) {
          debug('message: ' + JSON.stringify(message));
          if (!err) {
            smsCount++;
            notice.smsSentAt.push(Date.now());
          }
          callback(null, notice);
        });
      } else {
        callback(null, notice);
      }
    },
    function updateNotice (notice, callback) {
      var deactivateNow = false;
      if (frequency === '0') {
        debug('frequency is 0');
        deactivateNow = true;
      } else {
        if (notice.newStatus === 'ok') {
          debug('status is ok');
          deactivateNow = true;
        }
      }

      if (deactivateNow) {
        debug('deactivateNow');
        notice.active = false;
        notice.deactivatedAt = Date.now();
      }

      notice.save(function(err) {
        callback(err);
      });
    },
  ], function done (err) {
    debug('err: ' + err);
    if (err && err !== true) {
      log.error(err);
    }

    if (tasks > 0) { tasks--; }
    if (tasks === 0) {
      log.info('Notifier (freq=' + frequency + ') sent ' +
               emailCount + ' emails and ' + smsCount + ' sms');
      if (finishCallback) {
        finishCallback();
      }
    }
  });
};


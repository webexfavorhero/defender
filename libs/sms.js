var debug = require('debug')('sms');

var nconf = require('nconf');
var async = require('async');
var twilio = require('twilio');

var log = require('../td_common/libs/log');

var agenda = require('../libs/agenda');
var User = require('../models/user');


var client = new twilio.RestClient(nconf.get('twilio:accountSid'),
                                   nconf.get('twilio:authToken'));

// smsOptions example:
// {
//   to:'+16512223344',
//   from:'TWILIO_NUMBER',
//   body:'Hello World'
// }
//
function send (smsOptions, callback) {
  client.messages.create(smsOptions, function(err, message) {
    if (err) {
      log.error(err.message);
    }
    if (callback) {
      callback(err, message);
    }
  });
}
//exports.send = send;

function sendPaid (smsOptions, userId, finishCallback) {
  debug('sms.sendPaid');
  async.waterfall([
    function findUser (callback) {
      User.findById(userId, callback);
    },
    function subtractSms (user, callback) {
      if (user.sms > 0) {
        user.sms--;
      } else {
        agenda.now('inform', { userId: user._id,
                               about: 'no sms' });
        var error = new Error('User ' + user.email + ' have no sms for send');
        return callback(error);
      }
      callback(null, user);
    },
    function sendSms (user, callback) {
      send(smsOptions, function(err, message) {
        debug('message: ' + message);
        callback(err, message, user);
      });
    },
    function saveUser (message, user, callback) {
      user.save(function (err) {
        callback(err, message);
      });
    },
  ], function finish (err, message) {
    if (err && err !== true) {
      log.error('error: ' + err.message);
    }

    if (finishCallback) {
      finishCallback(err, message);
    }
  });
}
exports.sendPaid = sendPaid;


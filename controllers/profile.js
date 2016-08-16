var debug = require('debug')('profile');

var async = require('async');
var _ = require('lodash');
var nconf = require('nconf');

var log = require('../td_common/libs/log');

var User = require('../models/user');


function getProfile (userId, callback) {
  var message = {};
  User.findById(userId, function (err, user) {
    if (err) {
      log.error('Find user in get profile error: ' + err.message);
      message.e = 'Can\'t find user';
      return callback({}, message);
    }
    var profile = {
      em: user.email,
      un: user.username,
      ph: user.phone,
      ca: user.createdAt,
      tz: user.timezone,
      pl: nconf.get('plans:' + user.plan).name,
      tr: user.trial ? 1 : 0,
      pd: user.paid ? 1 : 0,
      es: user.extraSlots,
      sm: user.sms,
      fn: user.billing.firstName,
      mn: user.billing.middleName,
      ln: user.billing.lastName,
      cm: user.billing.company,
      ad: user.billing.address,
      a2: user.billing.address2,
      ci: user.billing.city,
      st: user.billing.state,
      pc: user.billing.postalCode,
      cc: user.billing.countryCode,
    };
    debug('profile: ' + JSON.stringify(profile));
    callback (profile, message);
  });
}

function editProfile (userId, profile, finishCallback) {
  debug('profile: ' + JSON.stringify(profile));
  var message = {};

  async.waterfall([

    function findUser (callback) {
      User.findById(userId, callback);
    },

    function updateProfile(user, callback) {
      // TODO: change email,
      // send to user email with confirmation link
      // set: user.email = user.contacts[0].email = <new email>
      if (profile.hasOwnProperty('un')) {
        user.username = profile.un;
        user.contacts[0].name = profile.un;
      }
      if (profile.hasOwnProperty('ph')) {
        user.phone = profile.ph;
        user.contacts[0].phone = profile.ph;
      }
      if (profile.hasOwnProperty('tz')) {
        user.timezone = profile.tz;
      }
      if (profile.hasOwnProperty('fn')) {
        user.billing.firstName = profile.fn;
      }
      if (profile.hasOwnProperty('mn')) {
        user.billing.middleName = profile.mn;
      }
      if (profile.hasOwnProperty('ln')) {
        user.billing.lastName = profile.ln;
      }
      if (profile.hasOwnProperty('cm')) {
        user.billing.company = profile.cm;
      }
      if (profile.hasOwnProperty('ad')) {
        user.billing.address = profile.ad;
      }
      if (profile.hasOwnProperty('a2')) {
        user.billing.address2 = profile.a2;
      }
      if (profile.hasOwnProperty('ci')) {
        user.billing.city = profile.ci;
      }
      if (profile.hasOwnProperty('st')) {
        user.billing.state = profile.st;
      }
      if (profile.hasOwnProperty('pc')) {
        user.billing.postalCode = profile.pc;
      }
      if (profile.hasOwnProperty('cc')) {
        user.billing.countryCode = profile.cc;
      }
      callback(null, user);
    },

    function changePassword(user, callback) {
      if (profile.hasOwnProperty('cp') && profile.hasOwnProperty('ps')) {
        var currentPassword = profile.cp;
        var newPassword = profile.ps;
        debug('change password. currentPassword: ' + currentPassword +
                             ', newPassword: ' + newPassword);
        user.comparePassword(currentPassword, function(err, isMatch) {
          if (err) {
            return callback(err);
          }
          if(isMatch) {
            user.password = newPassword;
            message.i = 'Password has been successfully changed';
          } else {
            message.e = 'Invalid password';
          }
          callback(null, user);
        });
      } else {
        callback(null, user);
      }
    },

    function saveUser (user, callback) {
      user.save(function(err) {
        if (err) {
          message.e = 'Can not save profile';
        }
        callback(err);
      });
    },

  ], function finish (err) {
    if (err) {
      log.error('Edit profile error: ' + err.message);
    }
    finishCallback(message);
  });
}

exports.websocketHandlers = [

  function getProfileHandler (socket, userId) {
    socket.on('get profile', function () {
      debug('get profile');
      getProfile(userId, function (profile, message) {
        socket.emit('profile', profile);
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

  function editProfileHandler (socket, userId) {
    socket.on('edit profile', function (profile) {
      debug('edit profile: ', JSON.stringify(profile));
      editProfile(userId, profile, function (message) {
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },
];


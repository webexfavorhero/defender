var debug = require('debug')('dashboard');

var assert = require('assert');
var _ = require('lodash');
var mongoose = require('mongoose');
var assert = require('assert');
var async = require('async');
var fs = require('fs');
var hogan = require('hogan.js');
var nconf = require('nconf');

var log = require('../td_common/libs/log');
var utils = require('../td_common/libs/utils');

var uri = require('../libs/uri');
var User = require('../models/user');
var UrlStatus = require('../models/urlstatus');
var manualCheck = require('../libs/manual_check');
var notifier = require('../libs/notifier');


function getDashboard (userId, callback) {
  var activeSlots = 0;
  var slots = [];
  var message = {};

  User.findById(userId, function (err, user) {
    if (err) {
      log.error('Find user in get dashboard error: ' + err.message);
      message.e = 'Can\'t find user';
      return callback ({}, message);
    }
    UrlStatus
      .find({ userId: userId, deleted: false })
      .sort('-dateAdded')
      .exec(function (err, uss) {

      if (err) {
        log.error('Get slots error: ' + err.message);
        message.e = 'Can\'t get slots';
      }

      for (var i in uss) {
        var us = uss[i];

        var latestNotification = us.getLatestNotification(false);
        var flagCounters = us.getMonitorTypeCounters("flag", false);
        debug('flagCounters: ' + JSON.stringify(flagCounters));

        var slot = {
          _id: us._id,
          _nm: us.name,
          _url: us.url,
          _ad: us.dateAdded,
          msw: us.active ? 1 : 0,
          fsw: us.switches.flag ? 1 : 0,
          fms: flagCounters.current,
          ftb: flagCounters.total,
          ssw: us.switches.server ? 1 : 0,
          sms: us.monitors.servermon.status,
          tsw: us.switches.traffic ? 1 : 0,
          tms: us.monitors.trafficmon.status === 'ok' ? 1 : 0,
          tc: us.monitors.trafficmon.hits.allTime,
          _lv: us.monitors.trafficmon.lastVisitAt,
          _to: us.monitors.trafficmon.visitorInterval,
          _co: us.contactIds,
          nti: latestNotification.type,
          ntd: latestNotification.at,
        };
        debug('slot: ' + JSON.stringify(slot));
        slots.push(slot);
        if (us.active) { activeSlots++; }
      }

      var totalSlots = user.planOptions.slots + user.extraSlots;

      debug("activeSlots: " + activeSlots);
      debug("totalSlots: " + totalSlots);
      assert(activeSlots <= totalSlots,
             "Expression activeSlots:" + activeSlots +
             " <= totalSlots:" + totalSlots + " is not true");

      var co = [];
      var frequencies = nconf.get('notifier:frequencies');
      user.contacts.forEach(function(contact, idx) {
        var frequency = _.find(frequencies,
                               { 'value': contact.notificationFrequency });
        co.push({
          _id: contact._id,
          nm: contact.name,
          ph: contact.phone,
          em: contact.email,
          nf: frequency.id,
          ed: idx === 0 ? 0 : 1,
        });
      });

      if (callback) {
        callback({
          tb: {
            as: activeSlots,
            ts: totalSlots,
            cp: nconf.get('plans:' + user.plan).name,
            tr: user.trial ? 1 : 0,
            sms: user.sms,
          },
          s: slots,
          co: co,
        }, message);
      }
    });
  });
}

function addSlot (userId, slot, finishCallback) {
  debug("slot: " + JSON.stringify(slot));
  var slotUrl = uri.stripQuery(slot._url);

  async.waterfall([

    function findUser (callback) {
      User.findById(userId, callback);
    },

    function checks (user, callback) {
      if (!slot.hasOwnProperty('_nm') || slot._nm.length < 1) {
        return callback('Name is not specified');
      }
      if (!slot.hasOwnProperty('_url') || slot._url.length < 1) {
        return callback('URL is not specified');
      }
      callback(null, user);
    },

    function findDeletedUS (user, callback) {
      // If user delete slot and create with the same url,
      // then give him same key.
      UrlStatus.findOne({userId: userId, url: slotUrl}, function (err, us) {
        debug('findDeletedUS: ' + JSON.stringify(us));
        callback(err, user, us);
      });
    },

    function updateUrlStatus (user, us, callback) {
      var mon;
      if (!us) {
        debug('create new');
        // create new
        us = UrlStatus({ userId: userId,
                         key: utils.randomToken() });
      } else {
        // for send information to frontend about creating previously
        // deleted slot through mongoose pre-save hook
        us.markModified('name');
        us.markModified('url');
        us.markModified('dateAdded');
        us.markModified('active');
        us.markModified('contactIds');
        us.markModified('switches.flag');
        us.markModified('switches.server');
        us.markModified('switches.traffic');
        us.markModified('deleted');
        for (mon in us.monitors.toObject()) {
          us.markModified('monitors.' + mon + '.status');
        }
      }
      us.name = slot._nm;
      us.url = slotUrl;
      us.dateAdded = Date.now();
      us.active = true;
      us.contactIds = [user.contacts[0]._id];
      us.switches.flag = true;
      us.switches.server = true;
      us.switches.traffic = false;
      us.deleted = false;
      for (mon in us.monitors.toObject()) {
        us.monitors[mon].status = 'ok';
      }
      us.save(function(err) {
        callback(err, us);
      });
    },

    function doManualCheck (us, callback) {
      manualCheck.checkOne(userId, us._id, function(err) {
        callback(err, us);
      });
    },

  ], function finish (err, us) {
    var message = {};
    if (err) {
      var error = 'Add slot error: ' + err.message;
      log.error(error);
      message.e = error;
    }
    if (finishCallback) {
      finishCallback(message, us);
    }
  });
}

function editSlot (userId, slot, finishCallback) {
  var message = {};

  async.waterfall([

    function findUser (callback) {
      User.findById(userId, callback);
    },

    function(user, callback) {
      UrlStatus.count({userId: userId, active: true},
                      function (err, activeSlots) {
        callback(err, user, activeSlots);
      });
    },

    function (user, activeSlots, callback) {
      debug('active slots: ' + activeSlots);

      var totalSlots = user.slots;
      assert(activeSlots <= totalSlots,
             "Expression activeSlots:" + activeSlots +
             " <= totalSlots:" + totalSlots + " is not true");

      if (activeSlots >= totalSlots &&
          slot.hasOwnPropery('msw') && slot.msw === 1) {
        slot.msw = 0;
        message.w = 'Active slots have reached the limit';
      }

      callback(null);
    },

    function(callback) {
      UrlStatus.findOne({ userId: userId,
                          _id: slot._id,
                          deleted: false }, callback);
    },

    function whenUrlIsChanged (us, callback) {
      debug("us: " + JSON.stringify(us));
      if (!us) {
        return callback(new Error('Can\'t find slot'));
      }
      if (slot.hasOwnProperty('_url')) {
        var newUrl = uri.stripQuery(slot._url);
        if (us.url !== newUrl) {
          // mark as deleted and create new slot with different key
          removeSlot(userId, slot, function(mes) {
            if (!_.isEmpty(mes)) {
              message = mes;
              return callback(new Error('removeSlot message'));
            }
            if (!slot.hasOwnProperty('_nm')) {
              slot._nm = us.name;
            }
            addSlot(userId, slot, function(mes, usAdded) {
              if (!_.isEmpty(mes)) {
                message = mes;
                return callback(new Error('addSlot message'));
              }
              usAdded.active = us.active;
              usAdded.dateAdded = us.dateAdded;
              usAdded.contactIds = us.contactIds;
              usAdded.switches.flag = us.switches.flag;
              usAdded.switches.server = us.switches.server;
              usAdded.switches.traffic = us.switches.traffic;
              usAdded.monitors.trafficmon.visitorInterval =
                                      us.monitors.trafficmon.visitorInterval;
              callback(null, usAdded);
            });
          });
          return;
        }
      }
      callback(null, us);
    },

    function(us, callback) {
      if (slot.hasOwnProperty('_nm')) {
        us.name = slot._nm;
      }
      if (slot.hasOwnProperty('msw')) {
        us.active = Boolean(slot.msw);
        notifier.deactivateNotificationsByMonitorType(us._id, '*',
                                                     function () {});
      }
      if (slot.hasOwnProperty('fsw')) {
        us.switches.flag = Boolean(slot.fsw);
        if (!us.switches.flag) {
          notifier.deactivateNotificationsByMonitorType(us._id, 'flag',
                                                       function () {});
        }
      }
      if (slot.hasOwnProperty('ssw')) {
        us.switches.server = Boolean(slot.ssw);
        if (!us.switches.server) {
          notifier.deactivateNotificationsByMonitorType(us._id, 'server',
                                                       function () {});
        }
      }
      if (slot.hasOwnProperty('tsw')) {
        us.switches.traffic = Boolean(slot.tsw);
        if (!us.switches.traffic) {
          notifier.deactivateNotificationsByMonitorType(us._id, 'traffic',
                                                       function () {});
        }
      }
      if (slot.hasOwnProperty('_to')) {
        us.monitors.trafficmon.visitorInterval = slot._to;
      }
      if (slot.hasOwnProperty('_co')) {
        us.contactIds = slot._co.map(mongoose.Types.ObjectId);
      }
      us.save(function(err) {
        callback(err);
      });
    }

  ], function (err) {
    if (err) {
      var error = 'Edit slot error: ' + err.message;
      log.error(error);
      message.e = error;
    }
    if (finishCallback) {
      finishCallback(message);
    }
  });
}

function removeSlot (userId, slot, callback) {
  var message = {};
  UrlStatus.findById(slot._id, function (err, us) {
    if (err) {
      log.error('Remove slot (id = ' + slot._id + ') error: ' + err.message);
      message.e = 'Remove slot error: ' + err.mesage;
      return callback(message);
    }
    if (!us) {
      log.error('Can\'t find slot (id = ' + slot._id + ') for remove');
      message.e = 'Can\'t find slot for remove';
      return callback(message);
    }
    us.deleted = true;
    us.deletedAt = Date.now();
    us.active = false;
    us.save(function (err) {
      if (err) {
        log.error('Remove slot (id = ' + slot._id + ') error: ' + err.message);
        message.e = 'Remove slot error: ' + err.mesage;
      }
      callback(message);
    });
  });
}


function checkSlot (userId, slot, finishCallback) {
  var slotId = slot._id;
  manualCheck.checkOne(userId, slotId, function() {
    if (finishCallback) {
      finishCallback();
    }
  });
}

var trafficScriptTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/traffic_script.tmpl', 'utf8'));

function generateScript (userId, data, callback) {
  var ids = data.ids;
  var message = {};
  UrlStatus.find({ userId: userId, '_id': { $in: ids } },
                 function(err, uss) {
    if (err) {
      log.error("Generate script error: " + err);
      message.e = 'generation script error';
    }
    var urlKeys = '[';
    for (var i in uss) {
      var us = uss[i];
      if (i > 0) {
        urlKeys += ',';
      }
      urlKeys += '{u:"' + us.url + '",k:"' + us.key + '"}';
    }
    urlKeys += ']';
    var trafficScript = trafficScriptTemplate.render(
                                    { urlKeys: urlKeys });
    trafficScript = trafficScript.replace(/&quot;/g , '"');
    debug('traffic script: ' + trafficScript);
    callback(message, {s: trafficScript});
  });
}

function activateAction (userId, ids, callback) {
  var message = {};

  function afterSave (err) {
    if (err) { log.error('Activate slot error: ' + err.message); }
  }

  User.findById(userId, function (err, user) {
    if (err) {
      message.e = 'Can\'t find user';
      return callback(message);
    }
    UrlStatus.count({ userId: userId, active: true },
                    function (err, count) {
      var slots = user.slots;
      var activeSlots = count;
      debug('active slots: ' + activeSlots);
      UrlStatus.find({ userId: userId, '_id': { $in: ids } },
                     function(err, uss) {
        if (err) {
          log.err("Activate actions error: " + err);
          message.e = 'Activation error';
        } else {
          for (var i in uss) {
            var us = uss[i];
            if (us.active !== true) {
              debug('activeSlots: ' + activeSlots + ' / ' + slots);
              if (activeSlots >= slots) {
                message.w = 'Active slots have reached the limit';
                break;
              } else {
                us.active = true;
                activeSlots++;
                us.save(afterSave);
              }
            }
          }
        }
        callback(message);
      });
    });
  });
}

function deactivateAction (userId, ids, callback) {
  var message = {};

  function afterSave (err) {
    if (err) { log.error('Deactivate slot error: ' + err.message); }
  }

  UrlStatus.find({ userId: userId, '_id': { $in: ids } },
                 function(err, uss) {
    if (err) {
      log.err("Deactivate action error: " + err);
      message.e = 'Deactivation error';
    } else {
      for (var i in uss) {
        var us = uss[i];
        if (us.active !== false) {
          us.active = false;
          us.save(afterSave);
        }
      }
    }
    callback(message);
  });
}

function actions (userId, data, callback) {
  var action = data.action;
  var ids = data.ids;
  if (action === 'activate') {
    activateAction(userId, ids, callback);
  } else if (action === 'deactivate') {
    deactivateAction(userId, ids, callback);
  } else {
    log.error ('Unknown bulk action: ' + action);
  }
}

function getFlags(userId, data, callback) {
  var ids = data.ids;
  var message = {};
  var flags = [];
  UrlStatus.find({ userId: userId, '_id': { $in: ids } },
                 function(err, uss) {
    if (err) {
      log.error("Get flags error: " + err);
      message.e = 'get flags error';
    }
    for (var i in uss) {
      var us = uss[i];
      var flagMonitors = us.getMonitorsByType('flag');
      var flag = { _id: us._id, ms: [] };
      for (var mon in flagMonitors) {
        flag.ms.push({
          nm: flagMonitors[mon]._conf_options.name,
          st: flagMonitors[mon].status,
          dt: flagMonitors[mon].dateChanged,
        });
      }
      flags.push(flag);
    }
    callback(flags, message);
  });
}

exports.websocketHandlers = [

  function getDashboardHandler (socket, userId) {
    socket.on('get dashboard', function () {
      debug('get dashboard');
      getDashboard(userId, function (dashboard, message) {
        socket.emit('dashboard', dashboard);
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

  function addSlotHandler (socket, userId) {
    socket.on('add slot', function (slot) {
      addSlot(userId, slot, function (message){
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

  function editSlotHandler (socket, userId) {
    socket.on('edit slot', function (slot) {
      debug('edit slot: ', JSON.stringify(slot));
      editSlot(userId, slot, function (message) {
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

  function removeSlotHandler (socket, userId) {
    socket.on('remove slot', function (slot) {
      removeSlot(userId, slot, function (message){
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

  function checkSlotHandler (socket, userId) {
    socket.on('check slot', function (slot) {
      debug('check slot: ', JSON.stringify(slot));
      checkSlot(userId, slot);
    });
  },

  function generateScriptHandler (socket, userId) {
    socket.on('generate script', function (data) {
      generateScript(userId, data, function (message, scriptData) {
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
        socket.emit('traffic script', scriptData);
      });
    });
  },

  function actionsHandler (socket, userId) {
    socket.on('actions', function (data) {
      actions(userId, data, function (message) {
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

  function getFlagsHandler (socket, userId) {
    socket.on('get flags', function (data) {
      debug('get flags: ' + JSON.stringify(data));
      getFlags(userId, data, function (flags, message) {
        socket.emit('flags', flags);
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

];


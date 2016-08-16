var debug = require('debug')('monitor');

var async = require('async');
var nconf = require('nconf');
var assert = require('assert');

var log = require('../td_common/libs/log');

var uri = require('./uri');
var notifier = require('./notifier');
var UrlStatus = require('../models/urlstatus');
var Blocklist = require('../models/blocklist');


module.exports = function (monitorId, idInBlocklist) {
  debug('monitorId: ' + monitorId);
  assert(monitorId, 'Monitor id is undefined.');
  var monitorOptions = nconf.get('monitors:' + monitorId);
  assert(monitorOptions, 'Monitor options are undefined.');

  var monitor = {
    id: monitorId,
    idInBlocklist: (idInBlocklist ? idInBlocklist : monitorId),
    options: monitorOptions,
  };

  monitor.setIdInBlocklist = function (idInBlocklist) {
    monitor.idInBlocklist = idInBlocklist;
  };

  monitor.startUpdatingBlocklist = function (finishCallback) {
    var query = JSON.parse('{ "monitors.' + monitor.idInBlocklist +
                                                      '.flagged": true }');
    var set = JSON.parse('{ "monitors.' + monitor.idInBlocklist +
                                                     '.updating": true }');
    Blocklist.update(query, { $set: set }, { multi: true }, function (err) {
      finishCallback(err);
    });
  };

  monitor.updateInBlocklist = function (url, details, finishCallback) {
    var set = JSON.parse('{ "monitors.' + monitor.idInBlocklist +
                                                        '.flagged": true, ' +
                           '"monitors.' + monitor.idInBlocklist +
                                                        '.updating": false, ' +
                           '"monitors.' + monitor.idInBlocklist +
                                                        '.details": ' +
                                             JSON.stringify(details) + ' }');

    var urlWithoutQuery = uri.stripQuery(url);
    // TODO: canonicalize url
    Blocklist.update({ url: urlWithoutQuery }, { $set: set },
                     { multi: false, upsert: true },
                     function (err) {
      finishCallback(err);
    });
  };

  monitor.completeUpdatingBlocklist = function (finishCallback) {
    var query = JSON.parse('{ "monitors.' + monitor.idInBlocklist +
                                                      '.updating": true }');
    var set = JSON.parse('{ "monitors.' + monitor.idInBlocklist +
                                                      '.flagged": false, ' +
                           '"monitors.' + monitor.idInBlocklist +
                                                      '.updating": false, ' +
                           '"monitors.' + monitor.idInBlocklist +
                                                      '.details": {} }');
    Blocklist.update(query, { $set: set }, { multi: true }, function (err) {
      finishCallback(err);
    });
  };

  monitor.findInBlocklist = function (url, finishCallback) {
    Blocklist.findOne({ url: url }, function (err, block) {
      var flagged = false, details = {};
      if (block && block.monitors[monitor.idInBlocklist]) {
        flagged = block.monitors[monitor.idInBlocklist].flagged;
        details = block.monitors[monitor.idInBlocklist].details;
      }
      finishCallback(err, flagged, details, block);
    });
  };

  // plan can be null (all plans)
  monitor.findUrlStatusesForPlan = function (plan, callback) {
    var query = JSON.parse('{ "active":true, "switches.' +
                           monitor.options.type + '": true }');
    debug('query: ' + JSON.stringify(query));
    var userMatch = { paid: true };
    if (plan) {
      userMatch.plan = plan;
    }

    UrlStatus
      .find(query)
      .populate({
        path: 'userId',
        match: userMatch,
      })
      .exec(function (err, uss) {
        if (!uss) {
          return callback(err, null);
        }
        uss = uss.filter(function filterPopulated (us) {
          // pass just if user plan has enabled this type of monitor
          return (us.userId &&
                  us.userId.planOptions[monitor.options.type] === true);
        });
        callback(err, uss);
      });
  };

  monitor.updateUrlStatusIfDifferent = function (us, status, details,
                                                 finishCallback) {
    var usMonitor = us.getMonitor(monitorId);
    if (usMonitor.status === status) {
      return finishCallback(null);
    }

    async.waterfall([
      function deactivateOldNotifications (callback) {
        notifier.deactivateNotificationsByMonitorId (us._id, monitor.id,
                                                       function (err) {
          callback(err);
        });
      },
      function createNewNotifications (callback) {
        var oldStatus = usMonitor.status;
        usMonitor.status = status;
        usMonitor.dateChanged = Date.now();
        notifier.createNotifications(us, monitor.id, status, oldStatus,
                                     function (err) {
          callback(err);
        });
      },
    ], function done (err) {
      if (err) {
        log.error('Update monitor status error: ' + err.message);
      }
      finishCallback(null);
    });
  };

  monitor.incUrlStatusesHits = function (uss) {
    for (var i in uss) {
      uss[i].incMonitorHits(monitor.id);
    }
  };

  monitor.saveUrlStatuses = function (uss, finishCallback) {
    async.each(uss, function (us, eachCallback) {
      us.save(function (err) {
        eachCallback(err);
      });
    }, function (err){
      finishCallback(err);
    });
  };

  return monitor;
};


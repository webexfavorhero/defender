var debug = require('debug')('trafficmon');

var async = require('async');
var moment = require('moment');

var log = require('../../td_common/libs/log');


var monitor = require('../monitor')('trafficmon');

function checkForPlan (plan, finishCallback) {
  debug('Start checking trafficmon for ' + plan + '...');
  async.waterfall([
    function findUss (callback) {
      monitor.findUrlStatusesForPlan(plan, function(err, uss) {
        if (!uss) {
          return callback(true);
        }
        callback(err, uss);
      });
    },
    function checkLastHitsTime (uss, callback) {
      if (!uss) {
        return callback(true);
      }

      async.each(uss, function (us, eachCallback) {
        var traffic = "no traffic";
        var lastAt = us.monitors[monitor.id].hits.lastAt;
        var visitorInterval = us.monitors[monitor.id].visitorInterval;
        if (visitorInterval === 0) {
          traffic = 'ok';
        } else if (lastAt) {
          var lastHitAt = moment(lastAt);
          var timeAgo = moment().subtract(visitorInterval, 'minutes');
          debug('visitorInterval: ' + visitorInterval);
          debug('lastHitAt: ' + lastHitAt.format());
          debug('timeAgo: ' + timeAgo.format());
          if (lastHitAt > timeAgo) {
            traffic = 'ok';
          }
        }
        debug("traffic (" + us.url + "): " + traffic);
        eachCallback(null);
      }, function finishEach (err) {
        callback(err, uss);
      });
    },
    function saveUss (uss, callback) {
      monitor.saveUrlStatuses(uss, callback);
    },
  ], function done (err) {
    if (err && err !== true) {
      log.error(err);
    }
    debug('Check trafficmon for ' + plan + ' was over');
    if (finishCallback) {
      finishCallback();
    }
  });
}
exports.checkForPlan = checkForPlan;


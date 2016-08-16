var debug = require('debug')('servermon');

var request = require('request');
var async = require('async');

var log = require('../../td_common/libs/log');


var monitor = require('../monitor')('servermon');

function getUrlUptime (url, callback) {
  var options = {
      url: url,
      method: 'HEAD'
  };
  request(options, function (error, res) {
    var uptime = '';
    debug('error: ' + error);
    debug('res: ' + JSON.stringify(res));
    if (error) {
      if (/Invalid URI/.test(error)) {
        uptime = 'invalid url';
      } else if (/ENOTFOUND/.test(error)) {
        uptime = 'not found';
      } else if (/ETIMEDOUT/.test(error)) {
        uptime = 'timed out';
      } else if (/ECONNRESET/.test(error)) {
        uptime = 'conn reset';
      } else if (/ECONNREFUSED/.test(error)) {
        uptime = 'conn refused';
      } else if (/socket hang up/.test(error)) {
        uptime = 'no response';
      } else {
        uptime = error;
      }
    } else {
      if (res.statusCode === 200) {
        var contentLength = res.headers['content-length'];
        debug('contentLength: ' + contentLength);
        if (contentLength === 0) {
          uptime = 'no content';
        } else {
          uptime = 'ok';
        }
      } else {
        uptime = 'error ' + res.statusCode;
      }
    }
    debug('uptime (' + url + '): ' + uptime);
    callback(null, uptime);
  });
}

function checkOne (us, finishCallback) {
  getUrlUptime(us.url, function (err, status) {
    monitor.updateUrlStatusIfDifferent (us, status, {}, function (err) {
      finishCallback(err);
    });
  });
}
exports.checkOne = checkOne;

function checkForPlan (plan, finishCallback) {
  debug('Start checking servermon for ' + plan + '...');
  async.waterfall([
    function findUss (callback) {
      monitor.findUrlStatusesForPlan(plan, function(err, uss) {
        if (!uss) {
          return callback(true);
        }
        callback(err, uss);
      });
    },
    function uptimeRequests (uss, callback) {
      async.each(uss, function (us, eachCallback) {
        checkOne(us, function(err) {
          eachCallback(err);
        });
      }, function finishEach (err) {
        callback(err, uss);
      });
    },
    function incHitsAndSaveUss (uss, callback) {
      monitor.incUrlStatusesHits(uss);
      monitor.saveUrlStatuses(uss, callback);
    }
  ], function done (err) {
    if (err && err !== true) {
      log.error(err);
    }
    debug('Check servermon for ' + plan + ' was over');
    if (finishCallback) {
      finishCallback();
    }
  });
}
exports.checkForPlan = checkForPlan;


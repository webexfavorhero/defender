var debug = require('debug')('openphish');

var async = require('async');
var request = require('request');
var eventStream = require('event-stream');

var log = require('../../td_common/libs/log');
var redis = require("../redis");


var monitor = require('../monitor')('openphish');

function checkOne (us, finishCallback) {
  monitor.findInBlocklist(us.url, function (err, flagged, details) {
    var status = flagged ? 'phishing' : 'ok';
    debug('check url ' + us.url + ': ' + status);
    monitor.updateUrlStatusIfDifferent (us, status, details,
                                        function (err) {
      finishCallback(err);
    });
  });
}
exports.checkOne = checkOne;

function checkForUpdates (finishCallback) {
  var hasUpdates = false;
  debug('monitor.options.databaseUrl: ' + monitor.options.databaseUrl);
  var options = {
    url: monitor.options.databaseUrl,
    method: 'HEAD'
  };
  request(options, function (err, res) {
    if (err) {
      return finishCallback(new Error('request for updates error: ' + err),
                            hasUpdates);
    }
    debug('headers: ' + JSON.stringify(res.headers));
    var lastModified = new Date(res.headers['last-modified']);
    debug('lastModified: ' + lastModified);

    redis.get('openphishLastModifiedAtDownload',
              function (err, lastModifiedAtDownload) {
      if (err) {
        return finishCallback(new Error('redis get error: ' + err),
                              hasUpdates);
      }
      debug('lastModifiedAtDownload: ' + lastModifiedAtDownload);
      if (!lastModifiedAtDownload || lastModified > lastModifiedAtDownload) {
        hasUpdates = true;
      }
      return finishCallback(null, hasUpdates, lastModified);
    });
  });
}

function check (finishCallback) {
  debug('Start openphish monitor checking...');
  async.waterfall([
    function updatedOrNot (callback) {
      if (monitor.options.skipCheckForUpdates) {
        log.warn('ATENTION!!! openphish monitor skips check for updates.');
        callback(null, 0);
      } else {
        checkForUpdates (function (err, hasUpdates, lastModified) {
          if (!hasUpdates) {
            debug('Openphish hasn\'t updates');
            return callback(true);
          }
          debug('Openphish has updates. Downloading and checking...');
          callback(null, lastModified);
        });
      }
    },
    function startUpdatingBlocklist (lastModified, callback) {
      if (monitor.options.skipUpdates) {
        callback(null, lastModified);
      } else {
        monitor.startUpdatingBlocklist (function (err) {
          callback(err, lastModified);
        });
      }
    },
    function downloadDatabaseAndUpdate (lastModified, callback) {
      if (monitor.options.skipUpdates) {
        log.warn('ATENTION!!! Openphish monitor skips updates.');
        callback(null);
      } else {
        debug('monitor.options.databaseUrl: ' + monitor.options.databaseUrl);
        request({ url: monitor.options.databaseUrl })
          .pipe(eventStream.split())
          .pipe(eventStream.map(function (lineUrl, mapCallback) {
            monitor.updateInBlocklist (lineUrl, {}, function(err) {
              mapCallback(err, null);
            });
          }))
          .on("error", function (err){
            return callback(err);
          })
          .on("end", function (){
            debug('parse end');
            redis.set('openphishLastModifiedAtDownload', lastModified);
            log.info('Database update from openphish has been downloaded, ' +
                     'lastModified: ' + lastModified);
              return callback(null);
          });
      }
    },
    function completeUpdatingBlocklist (callback) {
      if (monitor.options.skipUpdates) {
        callback(null);
      } else {
        monitor.completeUpdatingBlocklist (function (err) {
          callback(err);
        });
      }
    },
    function findUss (callback) {
      monitor.findUrlStatusesForPlan(null, function(err, uss) {
        if (!uss) {
          return callback(true);
        }
        async.each(uss, function (us, eachCallback) {
          checkOne (us, eachCallback);
        }, function (err) {
          callback(err, uss);
        });
      });
    },
    function incHitsAndSaveUss (uss, callback) {
      monitor.incUrlStatusesHits(uss);
      monitor.saveUrlStatuses(uss, callback);
    }
  ], function finish (err) {
    if (err === true) {
      // do nothing
    } else if (err) {
      log.error('Openphish monitor error: ' + err);
    }
    debug('Openphish monitor check was over');
    if (finishCallback) {
       finishCallback(null);
    }
  });
}
exports.check = check;


var debug = require('debug')('cleanmx');
var debug_parser = require('debug')('cleanmx:parser');

var async = require('async');
var request = require('request');
var XmlStream = require('xml-stream');

var log = require('../../td_common/libs/log');
var redis = require("../redis");


var monitor = require('../monitor')('cleanmx', 'cleanmxPhishing');

function checkOne (us, finishCallback) {
  monitor.findInBlocklist(us.url, function (err, flagged, details, block) {
    if (err) {
      return finishCallback(err);
    }
    // we don't use flagged and details variables, because we processing
    // 3 types of blocklist monitors: cleanmxPhishing, cleanmxMissused and
    // cleanmxMalware, but flagged and details variables just for one monitor.
    var status = 'ok';
    var detailsArr = [];
    if (block) {
      if (block.monitors.cleanmxPhishing.flagged) {
        status = 'phishing';
        detailsArr.push(block.monitors.cleanmxPhishing.details);
      }
      if (block.monitors.cleanmxMissused.flagged) {
        status = (status === 'ok' ? 'missused' : status + ', missused');
        detailsArr.push(block.monitors.cleanmxMissused.details);
      }
      if (block.monitors.cleanmxMalware.flagged) {
        status = (status === 'ok' ? 'malware' : status + ', malware');
        detailsArr.push(block.monitors.cleanmxMalware.details);
      }
    }
    debug('check url ' + us.url + ': ' + status);
    monitor.updateUrlStatusIfDifferent (us, status, detailsArr,
                                        function (err) {
      finishCallback(err);
    });
  });
}
exports.checkOne = checkOne;

function checkForUpdates (finishCallback) {
  var hasUpdates = false;
  redis.get('cleanmxLastDownloadAt',
            function (err, lastDownloadAt) {
    if (err) {
      return finishCallback(new Error('redis get error: ' + err),
                            hasUpdates);
    }
    debug('lastDownloadAt: ' + lastDownloadAt);
    if (!lastDownloadAt ||
        Date.now() > lastDownloadAt + 60*60*1000) { // 1 hour
      hasUpdates = true;
    }
    return finishCallback(null, hasUpdates);
  });
}

function check (finishCallback) {
  debug('Start cleanmx monitor checking...');
  async.waterfall([
    function updatedOrNot (callback) {
      if (monitor.options.skipCheckForUpdates) {
        log.warn('ATENTION!!! cleanmx monitor skips check for updates.');
        callback(null);
      } else {
        checkForUpdates (function (err, hasUpdates) {
          if (!hasUpdates) {
            debug('cleanmx doesn\'t has updates');
            return callback(true);
          }
          debug('cleanmx has updates. Downloading and checking...');
          callback(null);
        });
      }
    },

    function startUpdatingPhishingBlocklist (callback) {
      if (monitor.options.skipUpdates) {
        callback(null);
      } else {
        monitor.setIdInBlocklist('cleanmxPhishing');
        monitor.startUpdatingBlocklist (function (err) {
          callback(err);
        });
      }
    },
    function downloadPhishingDatabaseAndUpdate (callback) {
      if (monitor.options.skipUpdates) {
        log.warn('ATENTION!!! Cleanmx monitor skips updates.');
        callback(null);
      } else {
        debug('monitor.options.phishingDatabaseUrl: ' +
              monitor.options.phishingDatabaseUrl);
        var source = request({
          url: monitor.options.phishingDatabaseUrl,
          headers: {
            'User-Agent': 'request'
          }
        });

        var xml = new XmlStream(source);
        xml.on('endElement: entry', function(entry) {
          debug_parser('update phishing entry: ' + JSON.stringify(entry));
          monitor.updateInBlocklist (entry.url, entry, function(err) {
            if (err) {
              log.error('Cleanmx update in phishing blocklist error: ' + err);
            }
          });
        });
        xml.on('error', function (err) {
          debug('phishing err: ' + err);
          return callback(err);
        });
        xml.on('end', function () {
          debug('phishing parse end');
          return callback(null);
        });
      }
    },
    function completePhishingUpdatingBlocklist (callback) {
      if (monitor.options.skipUpdates) {
        callback(null);
      } else {
        monitor.completeUpdatingBlocklist (function (err) {
          callback(err);
        });
      }
    },

    function startUpdatingMissusedBlocklist (callback) {
      if (monitor.options.skipUpdates) {
        callback(null);
      } else {
        monitor.setIdInBlocklist('cleanmxMissused');
        monitor.startUpdatingBlocklist (function (err) {
          callback(err);
        });
      }
    },
    function downloadMissusedDatabaseAndUpdate (callback) {
      if (monitor.options.skipUpdates) {
        callback(null);
      } else {
        debug('monitor.options.missusedDatabaseUrl: ' +
              monitor.options.missusedDatabaseUrl);
        var source = request({
          url: monitor.options.missusedDatabaseUrl,
          headers: {
            'User-Agent': 'request'
          }
        });

        var xml = new XmlStream(source);
        xml.on('endElement: entry', function(entry) {
          debug_parser('update missused entry: ' + JSON.stringify(entry));
          monitor.updateInBlocklist (entry.url, entry, function(err) {
            if (err) {
              log.error('Cleanmx update in missused blocklist error: ' + err);
            }
          });
        });
        xml.on('error', function (err) {
          debug('missused err: ' + err);
          return callback(err);
        });
        xml.on('end', function () {
          debug('missused parse end');
          return callback(null);
        });
      }
    },
    function completeMissusedUpdatingBlocklist (callback) {
      if (monitor.options.skipUpdates) {
        callback(null);
      } else {
        monitor.completeUpdatingBlocklist (function (err) {
          callback(err);
        });
      }
    },

    function startUpdatingMalwareBlocklist (callback) {
      if (monitor.options.skipUpdates) {
        callback(null);
      } else {
        monitor.setIdInBlocklist('cleanmxMalware');
        monitor.startUpdatingBlocklist (function (err) {
          callback(err);
        });
      }
    },
    function downloadMalwareDatabaseAndUpdate (callback) {
      if (monitor.options.skipUpdates) {
        callback(null);
      } else {
        debug('monitor.options.malwareDatabaseUrl: ' +
              monitor.options.malwareDatabaseUrl);
        var source = request({
          url: monitor.options.malwareDatabaseUrl,
          headers: {
            'User-Agent': 'request'
          }
        });

        var xml = new XmlStream(source);
        xml.on('endElement: entry', function(entry) {
          debug_parser('update malware entry: ' + JSON.stringify(entry));
          monitor.updateInBlocklist (entry.url, entry, function(err) {
            if (err) {
              log.error('Cleanmx update in malware blocklist error: ' + err);
            }
          });
        });
        xml.on('error', function (err) {
          debug('malware err: ' + err);
          return callback(err);
        });
        xml.on('end', function () {
          debug('malware parse end');
          return callback(null);
        });
      }
    },
    function completeMalwareUpdatingBlocklist (callback) {
      if (monitor.options.skipUpdates) {
        callback(null);
      } else {
        monitor.completeUpdatingBlocklist (function (err) {
          callback(err);
        });
      }
    },

    function setLastDonwloadDate(callback) {
      var lastDownloadAt = new Date();
      redis.set('cleanmxLastDownloadAt', lastDownloadAt.valueOf());
      log.info('Databases (phishing, missused, malware) update from cleanmx ' +
               'has been downloaded, lastDownloadAt: ' +
               lastDownloadAt.toISOString());
      callback(null);
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
      log.error('CleanMX monitor error: ' + err);
    }
    debug('CleanMX monitor check was over');
    if (finishCallback) {
      finishCallback(null);
    }
  });
}
exports.check = check;


var debug = require('debug')('safebrowsing_go');

var request = require('request');
var assert = require('assert');
var async = require('async');
var _ = require('lodash');

var log = require('../../td_common/libs/log');


var monitor = require('../monitor')('safebrowsing_go');

var MAX_URLS_FOR_CHECKING = 500;

function doSafeBrowsingCheck(urls, uss, callback) {

  assert (urls.length <= MAX_URLS_FOR_CHECKING ,
          "Limit is maximum " + MAX_URLS_FOR_CHECKING + " links per one POST");

  var body = 'urls=' + JSON.stringify(urls) + '&block=false';
  debug("body: " + body);

  request.post({ uri: monitor.options.apiUrl,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body },
    function (err, res, body){
      if (err) {
        return callback(err);
      } else if (res.statusCode !== 200) {
        return callback(new Error ('Check request error, status code: ' +
                                   res.statusCode));
      }
      debug("res.headers: " + JSON.stringify(res.headers));
      debug("res.statusCode: " + JSON.stringify(res.statusCode));
      debug('body: ' + body);
      var results = JSON.parse(body);
      debug('obj: ' + JSON.stringify(results));
      return callback(null, results);
  });
}

function checkUss(uss, finishCallback) {
  var ussChunks = _.chunk(uss, MAX_URLS_FOR_CHECKING);
  async.eachSeries(ussChunks, function (ussChunk, eachSeriesCallback) {
    var urlsChunk = _.map(ussChunk, function(us) { return us.url; });
    doSafeBrowsingCheck(urlsChunk, ussChunk, function (err, resultsChunk) {

      if (err) {
        return eachSeriesCallback(err);
      }
      debug("resultsChunk: " + JSON.stringify(resultsChunk));

      async.forEachOf(ussChunk, function (us, i, eachCallback) {

        var url = us.url;
        var result = resultsChunk[url];
        var status = 'ok';
        if (result.hasOwnProperty('list')) {
          if (result.list === 'googpub-phish-shavar') {
            status = 'phishing';
          } else if (result.list === 'goog-malware-shavar') {
            status = 'malware';
          } else {
            status = result.list;
          }
        } else if (result.hasOwnProperty('isListed') && result.isListed) {
          status = 'listed';
        } else if (result.hasOwnProperty('fullHashRequested') &&
                   result.fullHashRequested) {
          status = 'maybe';
        }
        debug('url: ' + url + ', status: ' + status +
              ', details: ' + JSON.stringify(result));

        monitor.updateUrlStatusIfDifferent(us, status, result, function (err) {
          eachCallback(err);
        });
      }, function finishForEachOf (err) {
        eachSeriesCallback(err);
      });

    });
  }, function finishEachSeries (err) {
    finishCallback(err, uss);
  });
}

function checkOne (us, finishCallback) {
  var uss = [us];
  checkUss(uss, function (err) {
    finishCallback(err);
  });
}
exports.checkOne = checkOne;

function checkForPlan (plan, finishCallback) {
  debug('Start checking safebrowsing_lookup for ' + plan + '...');

  async.waterfall([
    function findAndCheckUss (callback) {
      monitor.findUrlStatusesForPlan(plan, function(err, uss) {
        if (!uss) {
          return callback(true);
        }
        checkUss(uss, function (err) {
          callback(err, uss);
        });
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
    debug('Check safebrowsing_lookup for ' + plan + ' was over');
    if (finishCallback) {
      finishCallback();
    }
  });
}
exports.checkForPlan = checkForPlan;


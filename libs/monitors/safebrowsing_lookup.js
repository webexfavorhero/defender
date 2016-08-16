var debug = require('debug')('safebrowsing_lookup');

var https = require('https');
var nconf = require('nconf');
var assert = require('assert');
var async = require('async');
var _ = require('lodash');

var log = require('../../td_common/libs/log');
var utils = require('../../td_common/libs/utils');


var monitor = require('../monitor')('safebrowsing_lookup');

var MAX_URLS_FOR_CHECKING = 500;

function doSafeBrowsingLookup(urls, uss, callback) {

  assert (urls.length <= MAX_URLS_FOR_CHECKING ,
          "Limit is maximum " + MAX_URLS_FOR_CHECKING + " links per one POST");

  // For more information see:
  //     https://developers.google.com/safe-browsing/lookup_guide

  var googleApp = utils.getRandomItem(nconf.get('googleApps'));

  var postOptions = {
    host: 'sb-ssl.google.com',
    path: '/safebrowsing/api/lookup' +
          '?client=' + googleApp.name +
          '&key=' + googleApp.key +
          '&appver=' + googleApp.ver +
          '&pver=' + googleApp.pver,
    method: 'POST'
  };
  debug("postOptions: " + JSON.stringify(postOptions));

  var postData = urls.length +'\n' + urls.join('\n');
  debug("postData: " + postData);

  var postReq = https.request(postOptions, function(res) {
    debug("res.headers: " + JSON.stringify(res.headers));
    debug("res.statusCode: " + JSON.stringify(res.statusCode));

    if (res.statusCode == 204) {

      // NONE of the queried URLs matched the phishing or malware lists, and
      // no response body is returned.
      if (callback) {
        return callback(null, 'ok');
      }

    } else if (res.statusCode == 200) {

      // AT LEAST ONE of the queried URLs are matched in either the phishing
      // or malware lists. The actual results are returned through the
      // response body.
      res.on('data', function(data) {
        var body = data.toString();
        var flags = body.split("\n");
        debug('flags: ' + flags);
        if (callback) {
          return callback(null, flags);
        }
      });

    } else {
      var err = "";
      if (res.statusCode == 400) {
        err = "Google Response error. " +
              "Bad Request—The HTTP request was not correctly formed.";
      } else if (res.statusCode == 401) {
        err = "Google Response error. " +
              "Not Authorized—The API key is not authorized.";
      } else if (res.statusCode == 503) {
        err = ["Google Response error. ",
               "Service Unavailable—The server cannot handle the ",
               "request. Besides the normal server failures, this ",
               "could also indicate that the client has been ",
               "“throttled” for sending too many requests."].join('');
      } else {
        err = "Google Response error with unknown statusCode: " +
              res.statusCode;
      }
      if (callback) {
        return callback(err);
      }
    }
  });

  postReq.on('error', function(err) {
    if (callback) {
      return callback(err);
    }
  });

  postReq.write(postData);
  postReq.end();

}

function checkUss(uss, finishCallback) {
  var ussChunks = _.chunk(uss, MAX_URLS_FOR_CHECKING);
  async.eachSeries(ussChunks, function (ussChunk, eachSeriesCallback) {
    var urlsChunk = _.map(ussChunk, function(us) { return us.url; });
    doSafeBrowsingLookup(urlsChunk, ussChunk, function (err, flagsChunk) {

      async.forEachOf(ussChunk, function (us, i, eachCallback) {
        var status = (typeof(flagsChunk) === "string") ? flagsChunk :
                                                         flagsChunk[i];
        monitor.updateUrlStatusIfDifferent(us, status, {}, function (err) {
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
      debug('saveUrlStatuses');
      monitor.saveUrlStatuses(uss, callback);
    },
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


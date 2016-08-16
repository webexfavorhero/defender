var debug = require('debug')('wot');

var request = require('request');
var assert = require('assert');
var async = require('async');
var _ = require('lodash');

var log = require('../../td_common/libs/log');
var uri = require('../uri');

var monitor = require('../monitor')('wot');

var MAX_URLS_FOR_CHECKING = 100;

function doWotCheck(domains, callback) {

  assert (domains.length <= MAX_URLS_FOR_CHECKING ,
          "Limit is maximum " + MAX_URLS_FOR_CHECKING +
          " domains per one request");

  var hosts = domains.join('/') + '/';
  debug('hosts: ' + hosts);
  var requestUri = monitor.options.databaseUrl + hosts;
  debug('requestUri: ' + requestUri);

  request.get({ uri: requestUri },
    function (err, res, body){
      if (err) {
        return callback(err);
      } else if (res.statusCode !== 200) {
        return callback(new Error ('Wot request error, status code: ' +
                                   res.statusCode));
      }
      debug("res.headers: " + JSON.stringify(res.headers));
      debug("res.statusCode: " + JSON.stringify(res.statusCode));
      debug('body: ' + body);
      var results = JSON.parse(body);
      debug('results: ' + JSON.stringify(results));
      return callback(null, results);
  });
}

function wordOfReputation(num) {
  if (num >= 80) {
    return "excellent";
  } else if (num >= 60) {
    return "good";
  } else if (num >= 40) {
    return "unsatisfactory";
  } else if (num >= 20) {
    return "poor";
  }
  return "very poor";
}

var wotCategories = {
  101: { description: 'malware or viruses', group: 'negative' },
  102: { description: 'poor customer experience', group: 'negative' },
  103: { description: 'phishing', group: 'negative' },
  104: { description: 'scam', group: 'negative' },
  105: { description: 'potentially illegal', group: 'negative' },
  201: { description: 'misleading claims or unethical',
    group: 'questionable' },
  202: { description: 'privacy risks', group: 'questionable' },
  203: { description: 'suspicious', group: 'questionable' },
  204: { description: 'hate, discrimination', group: 'questionable' },
  205: { description: 'spam', group: 'questionable' },
  206: { description: 'potentially unwanted programs', group: 'questionable' },
  207: { description: 'ads / pop-ups', group: 'questionable' },
  301: { description: 'online tracking', group: 'neutral' },
  302: { description: 'alternative or controversial medicine',
    group: 'neutral' },
  303: { description: 'opinions, religion, politics', group: 'neutral' },
  304: { description: 'other', group: 'neutral' },
  401 : { description: 'adult content', group: 'negative' },
  402 : { description: 'incidental nudity', group: 'questionable' },
  403 : { description: 'gruesome or shocking', group: 'questionable' },
  404 : { description: 'site for kids', group: 'positive' },
  501	: { description: 'good site', group: 'positive' },
};

function wotCategory(num) {
  if (wotCategories.hasOwnProperty(num)) {
    return wotCategories[num];
  }
  return null;
}

function checkUss(uss, finishCallback) {
  var ussChunks = _.chunk(uss, MAX_URLS_FOR_CHECKING);
  async.eachSeries(ussChunks, function (ussChunk, eachSeriesCallback) {
    var domainsChunk = _.map(ussChunk, function(us) {
                                        return uri.extractDomain(us.url); });
    doWotCheck(domainsChunk, function (err, resultsChunk) {

      if (err) {
        return eachSeriesCallback(err);
      }
      debug("resultsChunk: " + JSON.stringify(resultsChunk));

      async.forEachOf(ussChunk, function (us, i, eachCallback) {

        var domain = uri.extractDomain(us.url);
        var result = resultsChunk[domain];
        var status = '';
        debug('result: ' + JSON.stringify(result));
        debug('result.target: ' + result.target);

        if (result.hasOwnProperty('0')) {
          status += (status ? '; ' : '') +
                    'Trustworthiness [' +
                    'reputation:' + wordOfReputation(result['0'][0]) +
                                '(' + result['0'][0] + ') ' +
                    'confidence:' + result['0'][1] +
                    ']';
        }
        if (result.hasOwnProperty('4')) {
          status += (status ? '; ' : '') +
                    'Child safety [' +
                    'reputation:' + wordOfReputation(result['4'][0]) +
                                '(' + result['4'][0] + '), ' +
                    'confidence:' + result['4'][1] +
                    ']';
        }
        if (result.hasOwnProperty('categories')) {
          for (var j in result.categories) {
            var categ = wotCategory(result.categories[j]);
            if (categ) {
              status += (status ? '; ' : '') +
                        categ.description +
                        '(' + categ.group + ')';
            }
          }
        }
        if (result.hasOwnProperty('blacklists')) {
          if (result.blacklists.hasOwnProperty('malware')) {
            status += (status ? '; ' : '') + 'malware';
          }
          if (result.blacklists.hasOwnProperty('phishing')) {
            status += (status ? '; ' : '') + 'phishing';
          }
          if (result.blacklists.hasOwnProperty('scam')) {
            status += (status ? '; ' : '') + 'scam';
          }
          if (result.blacklists.hasOwnProperty('spam')) {
            status += (status ? '; ' : '') + 'spam';
          }
        }

        if (status === '') {
          status = 'ok';
        }

        debug('url: ' + us.url + ', status: ' + status +
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
  debug('Start checking wot for ' + plan + '...');

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
    debug('Check wot for ' + plan + ' was over');
    if (finishCallback) {
      finishCallback();
    }
  });
}
exports.checkForPlan = checkForPlan;


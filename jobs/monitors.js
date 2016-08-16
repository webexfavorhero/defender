var debug = require('debug')('monitors');

var nconf = require('nconf');
var async = require('async');

var log = require('../td_common/libs/log');

var agenda = require('../libs/agenda');

var safebrowsing_lookup = require('../libs/monitors/safebrowsing_lookup');
var servermon = require('../libs/monitors/servermon');
var trafficmon = require('../libs/monitors/trafficmon');
var safebrowsing_go = require('../libs/monitors/safebrowsing_go');
var phishtank = require('../libs/monitors/phishtank');
var openphish = require('../libs/monitors/openphish');
var cleanmx = require('../libs/monitors/cleanmx');
var malwaredomainlist = require('../libs/monitors/malwaredomainlist');
var wot = require('../libs/monitors/wot');

exports.define = function defineJobs () {

  function monitorsForPlanJob (job, done) {
    var plan = job.attrs.data.plan;
    debug('Start monitors checking for ' + plan + '...');
    var planOptions = nconf.get('plans:' + plan);

    async.waterfall([
      function (callback) {
        if (planOptions.flag &&
            nconf.get('monitors:safebrowsing_lookup:enabled')) {
          debug('safebrowsing_lookup check');
          safebrowsing_lookup.checkForPlan(plan, function() {
            callback(null);
          });
        } else {
          callback(null);
        }
      },
      function (callback) {
        if (planOptions.server &&
            nconf.get('monitors:servermon:enabled')) {
          debug('servermon check');
          servermon.checkForPlan(plan, function() {
            callback(null);
          });
        } else {
          callback(null);
        }
      },
      function (callback) {
        if (planOptions.traffic &&
            nconf.get('monitors:trafficmon:enabled')) {
          debug('trafficmon check');
          trafficmon.checkForPlan(plan, function() {
            callback(null);
          });
        } else {
          callback(null);
        }
      },
      function (callback) {
        if (planOptions.flag &&
            nconf.get('monitors:safebrowsing_go:enabled')) {
          debug('safebrowsing_go check');
          safebrowsing_go.checkForPlan(plan, function() {
            callback(null);
          });
        } else {
          callback(null);
        }
      },
      function (callback) {
        if (planOptions.flag &&
            nconf.get('monitors:wot:enabled')) {
          debug('wot check');
          wot.checkForPlan(plan, function() {
            callback(null);
          });
        } else {
          callback(null);
        }
      },

    ], function (err) {
      if (err) {
        log.error(err);
      }
      debug('Monitors checking for ' + plan + ' was over');
    });
    done();
  }

  var plans = nconf.get('plans');
  for (var plan in plans) {
    var planOpts = plans[plan];
    var frequency = planOpts.checkFrequency;
    if (frequency !== "0") {
      agenda.define('monitors for ' + plan, monitorsForPlanJob);
    }
  }

  agenda.define('phishtank monitor', function (job, done) {
    phishtank.check(function () { });
    done();
  });
  agenda.define('openphish monitor', function (job, done) {
    openphish.check(function () { });
    done();
  });
  agenda.define('cleanmx monitor', function (job, done) {
    cleanmx.check(function () { });
    done();
  });
  agenda.define('malwaredomainlist monitor', function (job, done) {
    malwaredomainlist.check(function () { });
    done();
  });

};

exports.reset = function resetJobs () {
  if (nconf.get('checker:check') === true) {

    if (nconf.get('monitors:safebrowsing_lookup:enabled') ||
        nconf.get('monitors:servermon:enabled') ||
        nconf.get('monitors:trafficmon:enabled') ||
        nconf.get('monitors:safebrowsing_go:enabled') ||
        nconf.get('monitors:wot:enabled')) {
      var plans = nconf.get('plans');
      for (var plan in plans) {
        var planOpts = plans[plan];
        var frequency = planOpts.checkFrequency;
        if (frequency !== "0") {
          log.info('Schedule monitors safebrowsing_lookup, servermon, ' +
                   'trafficmon, safebrowsing_go, wot for plan ' + plan);
          agenda.every(frequency, 'monitors for ' + plan, { plan: plan });
        }
      }
    }

    if (nconf.get('monitors:phishtank:enabled')) {
      log.info('Schedule phishtank monitor');
      agenda.every(nconf.get('monitors:phishtank:agendaEvery'),
                   'phishtank monitor');
    }
    if (nconf.get('monitors:openphish:enabled')) {
      log.info('Schedule openphish monitor');
      agenda.every(nconf.get('monitors:openphish:agendaEvery'),
                   'openphish monitor');
    }
    if (nconf.get('monitors:cleanmx:enabled')) {
      log.info('Schedule cleanmx monitor');
      agenda.every(nconf.get('monitors:cleanmx:agendaEvery'),
                   'cleanmx monitor');
    }
    if (nconf.get('monitors:malwaredomainlist:enabled')) {
      log.info('Schedule malwaredomainlist monitor');
      agenda.every(nconf.get('monitors:malwaredomainlist:agendaEvery'),
                   'malwaredomainlist monitor');
    }
  }
};


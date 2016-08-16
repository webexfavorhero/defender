var debug = require('debug')('jobs:hits');

var moment = require('moment');
var momentTimezone = require('moment-timezone');
var async = require('async');

var log = require('../td_common/libs/log');
var agenda = require('../libs/agenda');
var UrlStatus = require('../models/urlstatus');


function resetHitsForZone(zone, weekChanged, monthChanged, finishCallback) {
  log.info('Start reset hits for timezone: ' + zone + '...');
  var tasks = 0;

  async.waterfall([
    function findUrls (callback) {
      UrlStatus
        .find({})
        .populate({
          path: 'userId',
          match: { timezone: zone },
        })
        .exec(callback);
    },
    function uptimeRequest (uss, callback) {
      if (!uss) {
        return callback(true);
      }
      uss = uss.filter(function filterPopulated (us) { return us.userId; });
      debug("found (resetHits) count: " + uss.length);
      tasks = uss.length;
      if (tasks === 0) {
        return callback(true); // break from waterfall
      }

      var i;
      for (i in uss) {
        var us = uss[i];
        debug("resetHits (" + us.url + ")");
        us.resetDayHits();
        if (weekChanged) {
          us.resetWeekHits();
        }
        if (monthChanged) {
          us.resetMonthHits();
        }
        us.save(function(err) {
          callback(err);
        });
      }
    },
  ], function done (err) {
    if (err && err !== true) {
      log.error(err);
    }
    if (tasks > 0) { tasks--; }
    if (tasks === 0) {
      log.info('reset hits for timezone: ' + zone + ' was over');
      if (finishCallback) {
        finishCallback();
      }
    }
  });
}

function resetHits(finishCallback) {
  var zones = momentTimezone.tz.names();

  debug('local moment: ' + moment().format());
  debug('  utc moment: ' + moment().utc().format());

  for (var i in zones) {
    var zone = zones[i];

    var zoneMoment = momentTimezone().tz(zone);
    var zoneHour = zoneMoment.hour();

    if (zoneHour === 0) {
      var zoneDayOfWeek = zoneMoment.day();
      var zoneDayOfMonth = zoneMoment.date();
      var weekChanged = (zoneDayOfWeek === 0 ? true : false);
      var monthChanged = (zoneDayOfMonth === 1 ? true : false);
      debug('zone: ' + zone);
      debug('zone hours: ' + zoneHour);
      debug('zone day of week: ' + zoneDayOfWeek);
      debug('zone day of month: ' + zoneDayOfMonth);
      debug('zone time: ' + zoneMoment.format());

      resetHitsForZone(zone, weekChanged, monthChanged, finishCallback);
    }
  }
}

exports.define = function defineJobs () {
  agenda.define('reset hits', function resetHitsJob (job, done) {
    resetHits();
    done();
  });
};

exports.reset = function resetJobs () {
  log.info('Schedule reset hits');
  // every hour (at 0:00-23:00)
  agenda.every('0 0-23 * * *', 'reset hits');
};


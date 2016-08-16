var debug = require('debug')('scheduler');
debug('start');

var log = require('../td_common/libs/log');

var agenda = require('./agenda');

var monitorsJobs = require('../jobs/monitors');
var notifierJobs = require('../jobs/notifier');
var plansJobs = require('../jobs/plans');
var hitsJobs = require('../jobs/hits');
var informJobs = require('../jobs/inform');


monitorsJobs.define();
notifierJobs.define();
plansJobs.define();
hitsJobs.define();
informJobs.define();

/////////////////////////////////
//TODO: only for first job-worker
//

// IMPORTANT: Do not run this before you finish defining all of your jobs.
agenda.purge(function(err, numRemoved) {
  if (numRemoved > 0) {
    log.warn('Purge jobs without defined behaviors: ' +
             'numRemoved = ' + numRemoved);
  }
});

monitorsJobs.reset();
notifierJobs.reset();
plansJobs.reset();
hitsJobs.reset();
informJobs.reset();

//
/////////////////////////////////

exports.start = function startScheduler (callback) {
  agenda.start();
  log.info('Scheduler started');
  if (callback) {
    callback();
  }
};

exports.stop = function stopScheduler (callback) {
  agenda.stop(function afterAgendaStopped () {
    log.info('Scheduler stopped');
    if (callback) {
      callback();
    }
  });
};


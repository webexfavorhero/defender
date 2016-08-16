var debug = require('debug')('agenda');

var Agenda = require('agenda');
var nconf = require('nconf');
var moment = require('moment');
var async = require('async');

var log = require('../td_common/libs/log');


var agenda = new Agenda({ db: { address: nconf.get('app:mongodb'),
                                collection: 'jobs' },
                          defaultConcurrency: 5,
                          maxConcurrency: 20,
                          defaultLockLifetime: 10000, // 10 sec
                          //processEvery: '30 seconds'
                        });

agenda.on('fail', function(err, job) {
  log.error('Job \'' + job.attrs.name +
            '\' failed with error: ' + err.message);
});

agenda.on('start', function(job) {
  log.info('Job \'' + job.attrs.name + '\' starting');
});

agenda.on('success', function(job) {
  log.info('Job \'' + job.attrs.name + '\' success');
});


module.exports = exports = agenda;


var debug = require('debug')('jobs:test');

var moment = require('moment');

var log = require('../td_common/libs/log');

var agenda = require('../libs/agenda');

exports.define = function defineJobs () {
  agenda.define('test job', function testJob (job, done) {
    var data = job.attrs.data;
    log.info(moment().format() + ' test job,  data: ' + JSON.stringify(data));
    done();
  });
};

exports.reset = function resetJobs () {
  agenda.every('2 seconds', 'test job', { hello: 'world' });

  // var tomorrow = moment().add(1, 'days').startOf('day');
  // var afterTomorrow = moment().add(2, 'days').startOf('day');

  // agenda.schedule(tomorrow.toDate(), 'test job', { hello: 'tomorrow' });

  // agenda.schedule(afterTomorrow.toDate(), 'test job', { hello: 'afterTomorrow' });

  // agenda.cancel({name: 'test job', 'data.hello': 'tomorrow'},
  //               function(err, numRemoved) {
  // });

  // agenda.cancel({name: 'test job', 'data.hello': 'afterTomorrow'},
  //               function(err, numRemoved) {
  // });
};


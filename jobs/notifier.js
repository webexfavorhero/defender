var debug = require('debug')('jobs:notifier');

var nconf = require('nconf');

var log = require('../td_common/libs/log');

var agenda = require('../libs/agenda');
var notifier = require('../libs/notifier');

exports.define = function defineJobs () {
  var frequencies = nconf.get('notifier:frequencies');
  for (var i in frequencies) {
    var frequency = frequencies[i].value;
    agenda.define('notifier for ' + frequency,
                  function notifierJob (job, done) {
      var frequency = job.attrs.data.frequency;
      notifier.notify(frequency);
      done();
    });
  }
};

exports.reset = function resetJobs () {
  if (nconf.get('notifier:emailNotifications') === true ||
      nconf.get('notifier:smsNotifications') === true) {
    var frequencies = nconf.get('notifier:frequencies');
    for (var i in frequencies) {
      var frequency = frequencies[i].value;
      var agendaEvery = frequencies[i].agendaEvery;
      log.info('Schedule notifier for frequency ' + frequency);
      agenda.every(agendaEvery, 'notifier for ' + frequency,
                   { frequency: frequency });
    }
  }
};


var debug = require('debug')('job_worker');

var log = require('./td_common/libs/log');
require('./td_common/libs/config');

log.info('job_worker started');

// connect to DB
var db = require('./td_common/libs/db');
db.connectToDb();

// scheduler: do periodical checks, notifications, etc.
var scheduler = require('./libs/scheduler');
scheduler.start();

// Signals
function sigExit () {
  log.info('signal -> exit');
  scheduler.stop( function afterSchedulerStop () {
    log.info('exit');
    process.exit(0);
  });
}
process.on('SIGTERM', sigExit);
process.on('SIGINT' , sigExit);


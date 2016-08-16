var debug = require('debug')('test:phishtank');

require('../td_common/libs/config');
// connect to DB
var db = require('../td_common/libs/db');
db.connectToDb();

var User = require('../models/user');
var UrlStatus = require('../models/urlstatus');

var phishtank = require('../libs/monitors/phishtank');

phishtank.check(function () {
  debug('check done');
});

// UrlStatus.findOne({url: 'http://appeal-limit.com/'}, function (err, us) {
//   debug('us: ' + JSON.stringify(us));
//   phishtank.checkOne (us, function () {
//     debug('ok');
//     us.save(function (err) {
//       debug('finish');
//       if (err) { debug('error: ' + err); }
//     });
//   });
// });

// UrlStatus.findOne({name: 'global-print'}, function (err, us) {
//   debug('us: ' + JSON.stringify(us));
//   phishtank.checkOne (us, function () {
//     debug('ok');
//     us.save(function (err) {
//       debug('finish');
//       if (err) { debug('error: ' + err); }
//     });
//   });
// });


var debug = require('debug')('test:cleanmx');

require('../td_common/libs/config');
// connect to DB
// var db = require('../td_common/libs/db');
// db.connectToDb();

// var User = require('../models/user');
// var UrlStatus = require('../models/urlstatus');

var request = require('request');
var XmlStream = require('xml-stream');

function check (callback) {
  var stream = request({
    url: 'http://support.clean-mx.de/clean-mx/xmlphishing.php?response=alive',
    headers: {
      'User-Agent': 'request'
    }
  });

  // stream
  //   .pipe(eventStream.split())
  //   .pipe(eventStream.map(function (line, mapCallback) {
  //     debug('line: ' + line);
  //       mapCallback(null, null);
  //       // mapCallback(err, line);
  //   }))
  //   .on("error", function (err){
  //     debug('err: ' + err);
  //     return callback(err);
  //   })
  //   .on("end", function (){
  //     debug('parse end');
  //       return callback(null);
  //   });


  var xml = new XmlStream(stream);

  // xml.preserve('entry', true);
  // xml.collect('subitem');
  xml.on('endElement: entry', function(entry) {
    debug('entry: ' + JSON.stringify(entry));
  });

  xml.on('end', function () {
    debug('parse end');
    return callback(null);
  });

  xml.on('error', function (err) {
    debug('err: ' + err);
    return callback(err);
  });

}
check(function() {
  debug('check finish');
});

// phishtank.check(function () {
//   debug('check done');
// });

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


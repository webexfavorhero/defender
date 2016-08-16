var debug = require('debug')('manual_check');

var async = require('async');

var log = require('../td_common/libs/log');

var UrlStatus = require('../models/urlstatus');
var websockets = require('./websockets');

var safebrowsing_lookup = require('./monitors/safebrowsing_lookup');
var servermon = require('./monitors/servermon');
var safebrowsing_go = require('./monitors/safebrowsing_go');
var phishtank = require('./monitors/phishtank');
var openphish = require('./monitors/openphish');
var cleanmx = require('./monitors/cleanmx');
var malwaredomainlist = require('./monitors/malwaredomainlist');
var wot = require('./monitors/wot');


function checkOne (userId, slotId, finishCallback) {
  debug('Manual check for slot ' + slotId + '...');
  var checkFlag;
  var checkServer;

  async.waterfall([
    function findUrls (callback) {
      UrlStatus.findById(slotId)
        .populate('userId')
        .exec(callback);
    },
    function checkSlotProperties (us, callback) {
      if (!us) {
        websockets.emitToUser(userId, 'message', { e: 'Manual check error: ' +
                              'Can\'t find slot'});
        return callback(true);
      }
      if (!us.userId.paid) {
        websockets.emitToUser(userId, 'message', { e: 'Manual check error: ' +
                              'The service has not paid.'});
        return callback(true);
      }
      if (us.active !== true) {
        websockets.emitToUser(userId, 'message', { e: 'Manual check error: ' +
                              'slot "' + us.name + '" is not active'});
        return callback(true);
      }
      var planOptions = us.userId.planOptions;
      checkFlag = us.switches.flag && planOptions.flag;
      checkServer = us.switches.server && planOptions.server;
      if (!checkFlag && !checkServer) {
        websockets.emitToUser(userId, 'message', { e: 'Manual check error: ' +
          'flag and server monitors are disabled for slot "' + us.name + '"'});
        return callback(true);
      }
      callback(null, us);
    },
    function safebrowsing_lookupCheck (us, callback) {
      if (checkFlag) {
        safebrowsing_lookup.checkOne (us, function() {
          callback(null, us);
        });
      } else {
        callback(null, us);
      }
    },
    function servermonCheck (us, callback) {
      if (checkServer) {
        servermon.checkOne (us, function() {
          callback(null, us);
        });
      } else {
        callback(null, us);
      }
    },
    function safebrowsing_goCheck (us, callback) {
      if (checkFlag) {
        safebrowsing_go.checkOne (us, function() {
          callback(null, us);
        });
      } else {
        callback(null, us);
      }
    },
    function phishtankCheck (us, callback) {
      if (checkFlag) {
        phishtank.checkOne (us, function() {
          callback(null, us);
        });
      } else {
        callback(null, us);
      }
    },
    function openphishCheck (us, callback) {
      if (checkFlag) {
        openphish.checkOne (us, function() {
          callback(null, us);
        });
      } else {
        callback(null, us);
      }
    },
    function cleanmxCheck (us, callback) {
      if (checkFlag) {
        cleanmx.checkOne (us, function() {
          callback(null, us);
        });
      } else {
        callback(null, us);
      }
    },
    function malwaredomainlistCheck (us, callback) {
      if (checkFlag) {
        malwaredomainlist.checkOne (us, function() {
          callback(null, us);
        });
      } else {
        callback(null, us);
      }
    },
    function wotCheck (us, callback) {
      if (checkFlag) {
        wot.checkOne (us, function() {
          callback(null, us);
        });
      } else {
        callback(null, us);
      }
    },
    function saveUs (us, callback) {
      us.save(function(err) {
        callback(err, us);
      });
    }
  ], function done (err, us) {
    if (err === true) {
      // do nothing
    } else if (err) {
      log.error(err);
    } else {
      websockets.emitToUser(userId, 'message',
        { i: 'Slot "' + us.name + '" has ' +
         (checkFlag ? 'safebrowsing_lookup status: "' +
                              us.monitors.safebrowsing_lookup.status + '", ' +
                      'safebrowsing_go status: "' +
                              us.monitors.safebrowsing_go.status + '", ' +
                      'phishtank status: "' +
                              us.monitors.phishtank.status + '", ' +
                      'openphish status: "' +
                              us.monitors.openphish.status + '", ' +
                      'cleanmx status: "' +
                              us.monitors.cleanmx.status + '", ' +
                      'malwaredomainlist status: "' +
                              us.monitors.malwaredomainlist.status + '", ' +
                      'wot status: "' +
                              us.monitors.wot.status + '"'
                    : '') +
         (checkFlag && checkServer ? ' and ' : '') +
         (checkServer ? 'server status: "' + us.monitors.servermon.status + '"'
                      : '')
        });
    }
    debug('Manual check for slot ' + slotId + ' was over');
    if (finishCallback) {
      finishCallback();
    }
  });
}
exports.checkOne = checkOne;


//TODO: redirects: UrlStatus has 'redirectUrls' field
// function redirectDetector(detectUrl, onRedirectCallback, finishCallback) {
//   debug("detectUrl: ".red + detectUrl);
//   //TODO: https support (for example, http://fb.com uses redirect to https)
//   http.get(detectUrl, function (res) {
//     // Detect a redirect
//     if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
//       var redirectUrl = "";
//       if (url.parse(res.headers.location).hostname) {
//         redirectUrl = res.headers.location;
//       } else {
//         var detect = url.parse(detectUrl);
//         redirectUrl = detect.protocol + "//" + detect.host + res.headers.location;
//       }
//       if (onRedirectCallback) {
//         onRedirectCallback(detectUrl, redirectUrl);
//       }
//       redirectDetector(redirectUrl, onRedirectCallback);
//     } else {
//       // Otherwise no redirect.
//       if (finishCallback) {
//         finishCallback(detectUrl);
//       }
//     }
//   }).on('error', function(e) {
//     log.warn("redirectDetector error: " + e.message +
//              " (" + detectUrl + ")");
//     if (finishCallback) {
//       finishCallback(detectUrl);
//     }
//   });
// }
// exports.redirectDetector = redirectDetector;



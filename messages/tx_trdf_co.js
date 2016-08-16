var debug = require('debug')('tx_trdf_co');

var async = require('async');

var log = require('../td_common/libs/log');

var Traffic = require('../models/traffic');
var UrlStatus = require('../models/urlstatus');
var websockets = require('../libs/websockets');


function trafficHandler (socket, data) {
  debug("traffic message: ", JSON.stringify(data));

  var key = data.k;
  var visitKey = data.r;

  async.waterfall([
    function (callback) {
      UrlStatus
        .findOne({key: key})
        .exec(callback);
    },
    function (us, callback) {
      var err;
      if (!us) {
        err = new Error('UrlStatus with key ' + key + ' not found');
      } else if (us.deleted) {
        err = new Error('Received traffic message for deleted slot.' +
                        'Key: ' + key + ', url: ' + us.url);
        websockets.emitToUser(us.userId, 'message', { e: 'Received traffic ' +
                              'message for deleted slot "' + us.name + '"'});
      } else if (!us.active) {
        err = new Error('Received traffic message for inactive slot.' +
                        'Key: ' + key + ', url: ' + us.url);
        websockets.emitToUser(us.userId, 'message', { e: 'Received traffic ' +
                              'message for inactive slot "' + us.name + '"'});
      } else if(!us.switches.traffic) {
        err = new Error('Traffic monitor for key ' + key +
                        ' is disabled. url: ' + us.url);
        websockets.emitToUser(us.userId, 'message', { e: 'Received traffic ' +
                              'message for slot "' + us.name + '" ' +
                              'with disabled traffic monitor'});
      }
      if (err) {
        return callback(err);
      }

      if (data.hasOwnProperty('t')) {
        var visitAt = new Date(data.t);
        debug('visitAt: ' + visitAt +
              ', before lastVisitAt: ' + us.monitors.trafficmon.lastVisitAt);
        if (!us.monitors.trafficmon.lastVisitAt ||
            visitAt > us.monitors.trafficmon.lastVisitAt) {
          us.monitors.trafficmon.lastVisitAt = visitAt;
          debug('new lastVisitAt: ' + us.monitors.trafficmon.lastVisitAt);
        }
        us.incMonitorHits('trafficmon');
        us.save(function (err) {
          callback(err, us);
        });
      } else {
        callback(null, us);
      }
    },
    function (us, callback) {
      Traffic.findOne({ urlStatusId: us._id, visitKey: visitKey },
                      function (err, traf) {
        if (err) {
          return callback(err);
        }
        if (!traf) {
          traf = new Traffic({ urlStatusId: us._id,
                               userId: us.userId,
                               visitKey: visitKey });
        }
        if (data.hasOwnProperty('t')) {
          // url is opened
          traf.visitAt = data.t;
          traf.acceptAt = data.aa;
          traf.visitorIp = data.vi;
          traf.apiVersion = data.a;
          traf.userAgent = data.ua;
          traf.refererUrl = data.q;
        } else if (data.hasOwnProperty('l')) {
          // url is loaded
          traf.loadedAfterMs = data.l;
        } else if (data.hasOwnProperty('e')) {
          // url is closed
          traf.closedAfterMs = data.e;
        } else {
          var error = new Error('Traffic message does not contain ' +
                                '\'t\', \'l\' or \'e\' field: ' +
                                JSON.stringify(data));
          return callback(error);
        }
        traf.save(function (err) {
          callback(err);
        });
      });
    },
  ], function finish (err) {
    if (err) {
      log.error('Traffic accept error: ' + err.message);
    }
  });
}


var messageHandlers = {
  'traffic': trafficHandler,
};
exports.messageHandlers = messageHandlers;


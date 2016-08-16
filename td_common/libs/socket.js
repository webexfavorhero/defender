var debug = require('debug')('socket');

var nconf = require('nconf');
var axon = require('axon');
var dns = require('dns');

var log = require('./log');

//
// socket pull
//

var pullSocket = axon.socket('pull');

function bindPull () {
  var port = nconf.get('socket:port');
  pullSocket.bind(port);
  log.info('Bind pull socket server on port ' + port);
}
exports.bindPull = bindPull;

var messageHandlers = {
  // This is a dict:
  //   'message 1': handler1 (socket, data) { ... },
  //   'message 2': handler2 (socket, data) { ... },
  //   ...
  // Example:
  //   'example': function exampleHandler (socket, data) {
  //     log.info('message example received, data: ' + JSON.stringify(data));
  //   },
};

function addMessageHandlers (mh) {
  for (var msg in mh) {
    try {
      if (messageHandlers.hasOwnProperty(msg)) {
        throw new Error('messageHandlers already has handler for message: ' +
                        msg);
      } else {
        messageHandlers[msg] = mh[msg];
      }
    } catch (err) {
      log.error(err);
    }
  }
}
exports.addMessageHandlers = addMessageHandlers;

function applyMessageHandlers () {
  pullSocket.on('message', function (message, data) {
    debug('(pull) message: ' + message + ', data: ' + JSON.stringify(data));
    var handler = messageHandlers[message];
    handler(pullSocket, data);
  });
}
exports.applyMessageHandlers = applyMessageHandlers;


//
// socket push
//

var pushSockets = {
  // Dict:
  //   'host1:port': pushSocket,
  //   'host2:port': pushSocket,
  //   ...
};

function connectPush (host, callback) {
  if (pushSockets.hasOwnProperty(host)) {
    if (callback) {
      return callback(new Error('Push socket to host "' + host +
                       '" already connected.'));
    }
  }
  var hostname = host.split(':')[0];
  var port = host.split(':')[1];
  dns.resolve4(hostname, function(err, ips) {
    if (err) {
      if (callback) {
        return callback(new Error('DNS resolve hostname "' + hostname +
                                  '" error'));
      }
    }
    var ip = ips[0];
    var connectTo = 'tcp://' + ip + ':' + port;
    var pushSocket = axon.socket('push');
    log.info('Connect push socket to ' + connectTo + ' ...');
    pushSocket.connect(connectTo);
    pushSocket.on('connect', function () {
      log.info('Push socket is connected to ' + connectTo);
      pushSockets[host] = pushSocket;
      if (callback) {
        callback(err, pushSocket);
      }
    });
    pushSocket.on('error', function (err) {
      log.error('Error with push socket to ' + connectTo + ': ' + err.message);
    });
  });
}
exports.connectPush = connectPush;

function pushTo(host, message, data) {
  if (pushSockets.hasOwnProperty(host)) {
    var pushSocket = pushSockets[host];
    pushSocket.send('traffic', data);
  } else {
    connectPush (host, function (err, pushSocket) {
      if (err) {
        log.error('Connect to host "' + host + '" error:' +
                  err.message);
      } else {
        pushSocket.send('traffic', data);
      }
    });
  }
}
exports.pushTo = pushTo;



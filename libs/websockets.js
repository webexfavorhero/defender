var debug = require('debug')('websockets');

var socketIo = require('socket.io');
var passportSocketIo = require("passport.socketio");
var socketIoRedis = require('socket.io-redis');
var socketIoEmitter = require('socket.io-emitter');
var assert = require('assert');
var nconf = require('nconf');
var mongoose = require('mongoose');

var log = require('../td_common/libs/log');


var io;
var ioEmitter = socketIoEmitter(nconf.get('app:redis'));

function createOnServer(server) {
  io = socketIo(server);
  io.adapter(socketIoRedis(nconf.get('app:redis')));
}
exports.createOnServer = createOnServer;

function setAuthentication (sessionStore) {
  assert(io, 'io undefined');
  io.use(passportSocketIo.authorize({
    key: nconf.get('app:sessionKey'),
    secret: nconf.get('app:sessionSecret'),
    store: sessionStore,
    fail: function (data, message, error, accept){
      log.error("socket.io auth failed");
      if(error) throw new Error(message);
      return accept(new Error(message));
    },
    success: function(data, accept) {
      debug("socket.io auth success");
      accept();
    }
  }));
}
exports.setAuthentication = setAuthentication;

function emitToUser (userId, message, data) {
  if (!(userId instanceof mongoose.Types.ObjectId)) {
    // if userId has been populated
    userId = userId._id;
  }
  if (io) {
    debug('IO ==> emitToUser = '+userId+', message: ' + message +
          ', data: ' + JSON.stringify(data));
    io.to('userId=' + userId).emit(message, data);
  } else {
    debug('IO_EMITTER ==> emitToUser = '+userId+', message: ' + message +
          ', data: ' + JSON.stringify(data));
    ioEmitter.to('userId=' + userId).emit(message, data);
  }
}
exports.emitToUser = emitToUser;

var handlers = [
  // function handler1 (socket, user) { ... },
  // function handler2 (socket, user) { ... },
  // ...
  // Example:
  //   function exampleHandler (socket, user) {
  //     socket.on('get example', function () {
  //       socket.emit('example', {exapmle: 'ex'});
  //     });
  //   }
];

function addHandlers (h) {
  handlers = handlers.concat(h);
}
exports.addHandlers = addHandlers;

function applyHandlers () {
  assert(io, 'io undefined');
  debug('io start');

  io.on('connection', function (socket) {
    log.info('websocket connection, user: ' + socket.request.user.email + ')');
    var user = socket.request.user;
    var userId = user._id;
    debug('user: ' + JSON.stringify(user));
    socket.join('userId=' + userId);

    socket.on('disconnect', function () {
      socket.leave('userId=' + userId);
    });

    for (var i in handlers) {
      var handler = handlers[i];
      // we pass to handler userId (but not user) because user can be outdated
      // passport-socketio doesn't sychronize user on each ws message
      handler(socket, userId);
    }
  });
}
exports.applyHandlers = applyHandlers;


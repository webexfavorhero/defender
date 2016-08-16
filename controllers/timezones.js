var debug = require('debug')('timezones');

var momentTimezone = require('moment-timezone');
var _ = require('lodash');


function getTimezones (userId, callback) {
  var message = {};
  var timezones = momentTimezone.tz.names();
  debug('timezones: ' + JSON.stringify(timezones));
  callback (timezones, message);
}

exports.websocketHandlers = [

  function getTimezonesHandler (socket, userId) {
    socket.on('get timezones', function () {
      debug('get timezones');
      getTimezones(userId, function (timezones, message) {
        socket.emit('timezones', timezones);
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

];


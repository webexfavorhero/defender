var debug = require('debug')('services');

var nconf = require('nconf');
var _ = require('lodash');

var log = require('../td_common/libs/log');

var User = require('../models/user');


function getServices (userId, callback) {
  var message = {};
  User.findById(userId, function (err, user) {
    if (err) {
      log.error('Find user in get services error: ' + err.message);
      message.e = 'Can\'t find user';
      return callback({}, message);
    }
    var srvs = [];
    var services = nconf.get('services');
    for (var serviceKey in services) {
      var service = services[serviceKey];
      if (service.justForPlans &&
          service.justForPlans.indexOf(user.plan) === -1) {
        // forbidden for this plan
        continue;
      }
      var srv = {
        id: service.id,
        tp: service.type,
        nm: service.name,
        pc: service.price,
        cn: service.count,
        pd: service.period,
        cs: service.css,
        ln: '/services?serviceId=' + service.id,
      };
      srvs.push(srv);
    }
    debug('srvs: ' + JSON.stringify(srvs));
    callback (srvs, message);
  });
}

exports.websocketHandlers = [

  function getServicesHandler (socket, userId) {
    socket.on('get services', function () {
      debug('get services');
      getServices(userId, function (services, message) {
        socket.emit('services', services);
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

];


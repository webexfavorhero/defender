var debug = require('debug')('packages');

var nconf = require('nconf');
var _ = require('lodash');

var log = require('../td_common/libs/log');

var User = require('../models/user');


function getPackages (userId, callback) {
  var message = {};
  var packages = [];
  var currentPlan;
  var currentPlanPrice;
  if (userId) {
    User.findById(userId, function (err, user) {
      if (err) {
        log.error('Find user in get packages error: ' + err.message);
        message.e = 'Can\'t find user';
        return callback({}, message);
      }
      currentPlan = user.planOptions;
      currentPlanPrice = parseFloat(currentPlan.price);
      fillPackages();
    });
  } else {
    fillPackages();
  }

  function fillPackages() {
    var plans = nconf.get('plans');
    for (var planKey in plans) {
      var plan = plans[planKey];
      if (plan.hidden) {
        continue;
      }
      var planPrice = parseFloat(plan.price);
      if (!currentPlanPrice || planPrice >= currentPlanPrice) {
        var pkg = {
          id: plan.id,
          nm: plan.name,
          pc: plan.price,
          sl: plan.slots,
          fl: plan.flag ? 1 : 0,
          sr: plan.server ? 1 : 0,
          tr: plan.traffic ? 1 : 0,
          cf: plan.checkFrequency,
          sp: plan.slotPrice,
          sm: plan.smsOnStart,
          pr: plan.period,
          ln: '/package/' + plan.id,
        };
        if (currentPlan && plan.id === currentPlan.id) {
          pkg.ln = '';
        }
        packages.push(pkg);
      }
    }
    debug('packages: ' + JSON.stringify(packages));
    callback (packages, message);
  }
}
exports.getPackages = getPackages;

exports.websocketHandlers = [

  function getPackagesHandler (socket, userId) {
    socket.on('get packages', function () {
      debug('get packages');
      getPackages(userId, function (packages, message) {
        socket.emit('packages', packages);
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

];


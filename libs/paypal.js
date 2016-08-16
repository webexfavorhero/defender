var debug =  require('debug')('paypal');

var paypal = require('paypal-rest-sdk');
var nconf = require('nconf');

var log = require('../td_common/libs/log');


var mode = nconf.get('paypal:mode');
log.info('Paypal mode: ' + mode);


var config = nconf.get('paypal:' + mode);

debug('Config: ' + JSON.stringify(config));
try {
  paypal.configure(config);
} catch (err) {
  log.error('Paypal configure error: ' + err);
}

module.exports = exports = paypal;


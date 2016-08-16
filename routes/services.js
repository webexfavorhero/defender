var debug = require('debug')('services');

var express = require('express');
var router = express.Router();
var nconf = require('nconf');
var async = require('async');

var log = require('../td_common/libs/log');

var checkAuth = require('../libs/check_auth');
var billing = require('../libs/billing');


router.get('/', checkAuth, function(req, res) {
	debug('body: ' + JSON.stringify(req.body));
  var user = req.user;
  var serviceId = req.query.serviceId;
  var serviceOptions = nconf.get('services:' + serviceId);

  async.waterfall([

    function doChecks (callback) {
      if (serviceOptions.justForPlans &&
          serviceOptions.justForPlans.indexOf(user.plan) === -1) {
        return callback(new Error('Service ' + serviceId + ' is forbidden ' +
                                  'for plan ' + user.plan));
      }
      callback(null);
    },

    function createService (callback) {
      billing.createBillingPlanIfNotExists(serviceId, callback);
    },

    function createAgreement (serviceId, isCreated, callback) {
      if (isCreated) {
        log.info('Service "' + serviceId + '" is created.');
      }
      debug('create billing agreement');
      billing.createBillingAgreement(serviceId,
         function(err, serviceId, billingAgreement, redirectTo,
                  agreementToken) {
        debug('billingAgreement: ' + JSON.stringify(billingAgreement));
        debug('agreementToken: ' + JSON.stringify(agreementToken));
        callback(err, redirectTo, billingAgreement, serviceId, agreementToken);
      });
    },

    function updateUser (redirectTo, billingAgreement, serviceId,
                         agreementToken, callback) {
      user.paypal.serviceAgreementToken = agreementToken;
      user.paypal.addService = serviceId;
      debug('user.paypal: ' + JSON.stringify(user.paypal));
      user.save(function (err) {
        callback(err, redirectTo);
      });
    },

  ], function finish (err, redirectTo) {
    if (err) {
      log.error(err.message);
      req.flash('error', {e: err.message});
      res.redirect('/dashboard');
    } else {
      debug('redirectTo: ' + redirectTo);
      res.redirect(redirectTo);
    }
  });
});

module.exports = router;


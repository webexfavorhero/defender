var debug = require('debug')('package');

var express = require('express');
var router = express.Router();
var nconf = require('nconf');
var async = require('async');
var _ = require('lodash');

var log = require('../td_common/libs/log');

var checkAuth = require('../libs/check_auth');
var billing = require('../libs/billing');


router.get('/:plan', checkAuth, function (req, res) {
	debug('body: ' + JSON.stringify(req.body));
  var user = req.user;
  var oldPlanId = req.user.plan;
  var newPlanId = req.params.plan;
  var oldPlan = nconf.get("plans:" + oldPlanId);
  var newPlan = nconf.get("plans:" + newPlanId);
  var message = {};

  async.waterfall([

    function doChecks (callback) {
      if (_.isEmpty(newPlan)) {
        message.e = 'Unknown plan: ' + newPlanId;
      } else if (newPlanId === oldPlanId) {
        message.e = 'You can not choose the same plan';
      } else if (newPlan.price < oldPlan.price) {
        message.e = 'You can not downgrade plan';
      }

      if (!_.isEmpty(message)) {
        callback(new Error(message.e));
      } else {
        callback(null);
      }
    },

    function ifPlanIsFree (callback) {
      if (newPlan.price === 0) {
        user.plan = newPlanId;
        user.trial = newPlan.trailPeriod ? true : false;
        user.sms += newPlan.smsOnStart;
        user.paid = true;
        log.info('User ' + user.email + ' choosed free plan ' + newPlanId);
        callback(true);
      } else {
        callback(null);
      }
    },

    function createPlan (callback) {
      billing.createBillingPlanIfNotExists(newPlanId, callback);
    },

    function createAgreement (planId, isCreated, callback) {
      if (isCreated) {
        log.info('Plan "' + planId + '" is created.');
      }
      debug('create billing agreement');
      billing.createBillingAgreement(planId,
         function(err, planId, billingAgreement, redirectTo, agreementToken) {
        debug('billingAgreement: ' + JSON.stringify(billingAgreement));
        debug('agreementToken: ' + JSON.stringify(agreementToken));
        callback(err, redirectTo, billingAgreement, planId, agreementToken);
      });
    },

    function updateUser (redirectTo, billingAgreement, planId, agreementToken,
                         callback) {
      user.paypal.agreementToken = agreementToken;
      user.paypal.newPlan = planId;
      debug('user.paypal: ' + JSON.stringify(user.paypal));
      user.save(function (err) {
        callback(err, redirectTo);
      });
    },

  ], function finish (err, redirectTo) {
    if (err === true) {
      res.redirect('/dashboard');
    } else if (err) {
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


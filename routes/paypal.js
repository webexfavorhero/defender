var debug = require('debug')('paypal');
debug('start');

var express = require('express');
var router = express.Router();
var async = require('async');
var nconf = require('nconf');

var log = require('../td_common/libs/log');

var billing = require('../libs/billing');
var User = require('../models/user');


router.get('/payment/return', function(req, res) {
  debug('paypal payment RETURN');

  debug('req.query: ' + JSON.stringify(req.query));
  var paymentId = req.query.paymentId;
  var payerId = req.query.PayerID;
  var paymentToken = req.query.token;
  debug('  paymentId=' + paymentId);
  debug('  PayerID=' + payerId);
  debug('  paymentToken: ' + paymentToken);

  async.waterfall([

    function findUser (callback) {
      User.findOne({ 'paypal.paymentToken': paymentToken },
                    function (err, user) {
        if (err) {
          return callback(err);
        }
        if (!user) {
          return callback(new Error('User with paypal.paymentToken===' +
                                    paymentToken + ' not found.'));
        }
        callback(null, user);
      });
    },

    function executePayment (user, callback) {
      billing.executePayment(paymentId, payerId,
                              function (err, saleCompleted, amount, payment) {
        debug("Get Payment Response: " + JSON.stringify(payment));
        callback(err, user, saleCompleted, amount, payment);
      });
    },

    function updateUser (user, saleCompleted, amount, payment, callback) {
      debug('user: ' + JSON.stringify(user));
      if (saleCompleted) {
        var product = user.paypal.saleProduct;
        var productOptions = nconf.get('products:' + product);
        switch (productOptions.type) {
          case "sms":
            var soldSms = productOptions.sms;
            if (!soldSms) {
              return callback(new Error('Field "sms" is not defined in ' +
                              'product "' + productOptions.id + '"'));
            }
            user.sms += soldSms;
            log.info('User ' + user.email + ' bought sms package "' +
                     productOptions.id + '" (' +  soldSms + ' sms)');
            break;
          default:
            return callback(new Error('Unknown product "' +
                                      productOptions.id + '"'));
        }
      }
      user.paypal.paymentToken = undefined;
      user.paypal.saleProduct = undefined;
      debug('user.paypal: ' + JSON.stringify(user.paypal));
      user.save(function(err) {
        callback(err);
      });
    },

  ], function finish (err) {
    if (err) {
      log.error('Execute payment error: ' + err.message);
      req.flash('error', {e: 'Execute payment error.'});
    }
    res.redirect('/dashboard');
  });
});


router.get('/payment/cancel', function(req, res) {
  debug('paypal payment CANCEL');

  debug('req.query: ' + JSON.stringify(req.query));
  var paymentId = req.query.paymentId;
  var payerId = req.query.PayerID;
  var paymentToken = req.query.token;
  debug('  paymentId=' + paymentId);
  debug('  PayerID=' + payerId);
  debug('  paymentToken: ' + paymentToken);

  User.findOne({ 'paypal.paymentToken': paymentToken },
                function (err, user) {
    if (err) {
      log.error('Cancel payment error: ' + err.message);
    }
    if (!user) {
      log.error('User with paypal.paymentToken===' + paymentToken +
                ' not found.');
    } else {
      user.paypal.paymentToken = undefined;
      user.paypal.saleProduct = undefined;
      debug('user.paypal: ' + JSON.stringify(user.paypal));
      log.info('User ' + user.email + ' canceled the upgrade plan');
      user.save(function (err) {
        if (err) {
          log.err('Cancel plan error: ' + err.message);
        }
      });
    }
  });

  req.flash('error', {e: 'Payment has been canceled'});
  res.redirect('/dashboard');
});


router.get('/plan/return', function (req, res) {
  debug('paypal plan RETURN');
  debug('  req.query = ' + JSON.stringify(req.query));
  debug('  req.body = ' + JSON.stringify(req.body));
  var agreementToken = req.query.token;
  debug('  agreementToken: ' + agreementToken);

  async.waterfall([

    function findUser (callback) {
      User.findOne({ 'paypal.agreementToken': agreementToken },
                    function (err, user) {
        if (err) {
          return callback(err);
        }
        if (!user) {
          return callback(new Error('User with paypal.agreementToken===' +
                                    agreementToken + ' not found.'));
        }
        callback(null, user);
      });
    },

    function executedAgreement (user, callback) {
      billing.executeBillingAgreement(agreementToken,
                        function(err, executedAgreement, billingAgreement) {
        callback(err, user, executedAgreement, billingAgreement);
      });
    },

    function updateUser (user, executedAgreement, billingAgreement, callback) {
      var newPlanOptions = nconf.get('plans:' + user.paypal.newPlan);
      user.plan = user.paypal.newPlan;
      user.trial = newPlanOptions.trialPeriod ? true : false;
      user.sms += newPlanOptions.smsOnStart;
      user.paid = true;
      var cancelAgreementId = user.paypal.agreementId;
      user.paypal.agreementId = executedAgreement.id;
      user.paypal.agreementToken = undefined;
      user.paypal.newPlan = undefined;
      debug('user.paypal: ' + JSON.stringify(user.paypal));
      log.info('User ' + user.email + ' upgraded plan to "' + user.plan +
               '", trial: ' + user.trial +
               ', paypal.agreementId: ' + user.paypal.agreementId);
      user.save(function (err) {
        callback(err, cancelAgreementId);
      });
    },

    function cancelOldAgreement (cancelAgreementId, callback) {
      debug('cancelAgreementId: ' + cancelAgreementId);
      if (cancelAgreementId) {
        billing.cancelBillingAgreement(cancelAgreementId,
                                       function (err, response) {
          debug('response: ' + JSON.stringify(response));
          callback(err);
        });
      } else {
        callback(null);
      }
    },

  ], function (err) {
    if (err) {
      log.error('Upgrade plan error: ' + err.message);
      req.flash('error', {e: 'Upgrade plan error: ' + err.message});
    }
    res.redirect('/dashboard');
  });
});


router.get('/plan/cancel', function (req, res) {
  debug('paypal plan CANCEL');
  debug('  req.query = ' + JSON.stringify(req.query));
  debug('  req.body = ' + JSON.stringify(req.body));

  var agreementToken = req.query.token;
  debug('  agreementToken: ' + agreementToken);
  var errorStr;

  User.findOne({ 'paypal.agreementToken': agreementToken },
                function (err, user) {
    if (err) {
      errorStr = 'Cancel plan error: ' + err.message;
      log.error(errorStr);
      req.flash('error', {e: errorStr});
    }
    if (!user) {
       errorStr = 'User with paypal.agreementToken===' + agreementToken +
                  ' not found.';
      log.error(errorStr);
      req.flash('error', {e: errorStr});
    } else {
      user.paypal.agreementToken = undefined;
      user.paypal.newPlan = undefined;
      debug('user.paypal: ' + JSON.stringify(user.paypal));
      log.info('User ' + user.email + ' canceled the upgrade plan');
      user.save(function (err) {
        if (err) {
          var errorStr = 'Cancel plan error: ' + err.message;
          log.err(errorStr);
          req.flash('error', {e: 'Cancel plan error: ' + errorStr});
        }
      });
    }
  });
  res.redirect('/dashboard');
});


router.get('/service/return', function (req, res) {
  debug('paypal service RETURN');
  debug('  req.query = ' + JSON.stringify(req.query));
  debug('  req.body = ' + JSON.stringify(req.body));
  var agreementToken = req.query.token;
  debug('  agreementToken: ' + agreementToken);

  async.waterfall([

    function findUser (callback) {
      User.findOne({ 'paypal.serviceAgreementToken': agreementToken },
                    function (err, user) {
        if (err) {
          return callback(err);
        }
        if (!user) {
          return callback(new Error('User with paypal.serviceAgreementToken' +
                                    '===' + agreementToken + ' not found.'));
        }
        callback(null, user);
      });
    },

    function executedAgreement (user, callback) {
      billing.executeBillingAgreement(agreementToken,
                        function(err, executedAgreement, billingAgreement) {
        callback(err, user, executedAgreement, billingAgreement);
      });
    },

    function updateUser (user, executedAgreement, billingAgreement, callback) {
      var serviceOptions = nconf.get('services:' + user.paypal.addService);
      switch (serviceOptions.type) {
        case 'extraSlots':
          user.extraSlots += serviceOptions.count;
          break;
      }

      user.paypal.services.push({ serviceId: user.paypal.addService,
                                  agreementId: executedAgreement.id });
      log.info('User ' + user.email + ' added service "' +
               user.paypal.addService +
               '", agreementId: ' + executedAgreement.id);

      user.paypal.serviceAgreementToken = undefined;
      user.paypal.addService = undefined;
      debug('user.paypal: ' + JSON.stringify(user.paypal));

      user.save(function (err) {
        callback(err);
      });
    },

  ], function (err) {
    if (err) {
      log.error('Upgrade plan error: ' + err.message);
    }
    res.redirect('/dashboard');
  });
});


router.get('/service/cancel', function (req, res) {
  debug('paypal service CANCEL');
  debug('  req.query = ' + JSON.stringify(req.query));
  debug('  req.body = ' + JSON.stringify(req.body));

  var agreementToken = req.query.token;
  debug('  agreementToken: ' + agreementToken);

  User.findOne({ 'paypal.serviceAgreementToken': agreementToken },
                function (err, user) {
    if (err) {
      log.error('Cancel subscription to service error (find user): ' +
                err.message);
    }
    if (!user) {
      log.error('User with paypal.serviceAgreementToken===' + agreementToken +
                ' not found.');
    } else {
      user.paypal.serviceAgreementToken = undefined;
      user.paypal.addService = undefined;
      debug('user.paypal: ' + JSON.stringify(user.paypal));
      log.info('User ' + user.email + ' canceled the subscription to service');
      user.save(function (err) {
        if (err) {
          log.err('Cancel subscription to service error (save): ' +
                  err.message);
        }
      });
    }
  });
  res.redirect('/dashboard');
});


// WARNING: webhooks do not processed now
router.post('/webhooks', function (req, res) {
  res.send('ok');

  var webhookEvent = req.body;
  var webhookHeaders = req.headers;
  log.info('Paypal webhook received:' +
           ' event_type: ' + webhookEvent.event_type +
           ' summary: ' + webhookEvent.summary +
           ' create_time: ' + webhookEvent.create_time);
  debug('  webhookEvent: ' + JSON.stringify(webhookEvent));
  debug('  webhookHeaders: ' + JSON.stringify(webhookHeaders));

  async.waterfall([

    function verify (callback) {
      billing.verifyWebhookEvent(webhookEvent, webhookHeaders,
                                 function (err, isOk) {
        if (err) {
          log.error(err.message);
        }
        if (!isOk) {
          err = new Error('Webhook is not verified: ' +
                          JSON.stringify(webhookEvent));
        } else {
          debug('Webhook id: ' + webhookEvent.id + ' is verified.');
        }
        callback(err);
      });
    },

    function selectEventType (callback) {
      var err = null;
      switch(webhookEvent.event_type) {
        case 'PAYMENT.AUTHORIZATION.CREATED':
        case 'PAYMENT.AUTHORIZATION.VOIDED':
        case 'PAYMENT.CAPTURE.COMPLETED':
        case 'PAYMENT.CAPTURE.PENDING':
        case 'PAYMENT.CAPTURE.REFUNDED':
        case 'PAYMENT.CAPTURE.REVERSED':
        case 'RISK.DISPUTE.CREATED':
        case 'PAYMENT.SALE.COMPLETED':
        case 'PAYMENT.SALE.PENDING':
        case 'PAYMENT.SALE.REFUNDED':
        case 'PAYMENT.SALE.REVERSED':
          log.warn('Webhook event type ' + webhookEvent.event_type +
                   ' do not processed.');
          break;
        default:
          err = new Error('Unknown webhook event type: ' +
                          webhookEvent.event_type);
      }
      callback(err);
    },

  ], function (err) {
    if (err) {
      log.error(err.message);
    }
  });
});

module.exports = router;


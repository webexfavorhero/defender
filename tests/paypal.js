var debug = require('debug')('paypal');

var async = require('async');

require('../td_common/libs/config');
var log = require('../td_common/libs/log');

var billing = require('../libs/billing');

async.waterfall([

  // function (callback) {
  //   billing.createBillingPlan('starter', function (err, planId) {
  //     if (!err) {
  //       log.info('Billing Plan "' + planId + '" created and activated.');
  //     }
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   billing.createBillingPlanIfNotExists('starter',
  //                                        function (err, planId, isCreated) {
  //     if (isCreated) {
  //       log.info('Billing Plan "' + planId + '" created and activated.');
  //     }
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   billing.removeBillingPlan('starter', function (err, planId) {
  //     if (!err) {
  //       log.info('Billing plan "' + planId + '" is removed.');
  //     }
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   billing.getBillingPlan('starter', function (err, planId, billingPlan) {
  //     if (!err) {
  //       debug('Got billing plan "' + planId + '": ' + JSON.stringify(billingPlan));
  //     }
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   billing.isBillingPlanExists('starter', function (err, isExists) {
  //     if (isExists) {
  //       debug('plan is exists');
  //     } else {
  //       debug('plan is not exists');
  //     }
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   debug('billing plans:');
  //   billing.getBillingPlansList(function (err, billingPlansList) {
  //     var billingPlans = billingPlansList.plans;
  //     for (var i in billingPlans) {
  //       debug('plan: ' + JSON.stringify(billingPlans[i]));
  //     }
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   billing.createBillingAgreement ('starter', 'TODO:userId',
  //                           function (err, planId, userId, billingAgreement,
  //                                     redirectTo) {
  //     if (!err) {
  //       debug('Got billing agreement for plan "' + planId +
  //             '" for userId "' + userId + '": ' +
  //             JSON.stringify(billingAgreement));
  //       debug('redirectTo: ' + redirectTo);
  //     }
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   var billingAgreementId = 'I-Y276NC5UTM76';
  //   billing.getBillingAgreement (billingAgreementId,
  //                                function (err, billingAgreement) {
  //     if (!err) {
  //       debug('Got billing agreement ' + JSON.stringify(billingAgreement));
  //     }
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   var billingAgreementIds = [
  //     "I-NHYGV201PCAT",
  //     "I-231GHF46P9WN",
  //     "I-MX1B9HRN0MJT",
  //     "I-86M3SESCLYEB",
  //     "I-G1S5TB0SHKTR",
  //     "I-XA1NGWBJS4Y5",
  //     "I-Y276NC5UTM76",
  //     "I-8165X2BNAC9M",
  //     "I-XLHBKKX1JCN8",
  //     "I-1UWLEKAYS4PL",
  //     "I-59XSHCYNRK29",
  //   ];
  //   async.each(billingAgreementIds,
  //              function (billingAgreementId, eachCallback) {
  //     debug('billingAgreementId: ' + billingAgreementId);
  //     billing.getBillingAgreement (billingAgreementId,
  //                                  function (err, billingAgreement) {
  //       if (!err) {
  //         debug('Got billing agreement ' + JSON.stringify(billingAgreement));
  //       }
  //       eachCallback(err);
  //     }, function (err) {
  //       if (err) {
  //         debug('err: ' + err.message);
  //       }
  //     });
  //   });
  // },

  // function (callback) {
  //   var billingAgreementId = 'I-XLHBKKX1JCN8';
  //   var startDate = '2015-01-01';
  //   var endDate = '2015-12-31';
  //   billing.searchTransactions(billingAgreementId, startDate, endDate,
  //                              function(err, results) {
  //     debug('billingAgreementId: ' + billingAgreementId +
  //           ' results: ' + JSON.stringify(results));
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   billing.removeWebhook('*', function (err, isRemoved) {
  //     if (isRemoved) {
  //       log.info('Webhook (*) was removed');
  //     } else {
  //       log.info('Webhook (*) was not removed');
  //     }
  //     callback (err);
  //   });
  // },

  // function (callback) {
  //   billing.createWebhookIfNotExists ('*', function (err, webhook, isCreated) {
  //     if (isCreated) {
  //       log.info('Webhook (*) is created: ' + JSON.stringify(webhook));
  //     } else {
  //       log.info('Webhook (*) already exists: ' + JSON.stringify(webhook));
  //     }
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   billing.getWebhooksList(function (err, webhooks) {
  //     callback(err);
  //   });
  // },

  // function (callback) {
  //   billing.searchWebhookEvents(function (err, webhookEvents) {
  //     if (!err) {
  //       debug('Got webhookEvents: ' + JSON.stringify(webhookEvents));
  //     }
  //     callback(err);
  //   });
  // },

], function (err) {
  if (err) {
    log.error('Error: ' + err.message);
  }
});

// searchTransactions();





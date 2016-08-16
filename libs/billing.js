var debug = require('debug')('billing');

var nconf = require('nconf');
var async = require('async');
var moment = require('moment');
var url = require('url');

var log = require('../td_common/libs/log');

var paypal = require('./paypal');


var SITE = nconf.get('app:site');
var PAYMENT_RETURN_URL = SITE + '/paypal/payment/return';
var PAYMENT_CANCEL_URL = SITE + '/paypal/payment/cancel';
var PLAN_RETURN_URL = SITE + '/paypal/plan/return';
var PLAN_CANCEL_URL = SITE + '/paypal/plan/cancel';
var SERVICE_RETURN_URL = SITE + '/paypal/service/return';
var SERVICE_CANCEL_URL = SITE + '/paypal/service/cancel';
var WEBHOOKS_URL = SITE + '/paypal/webhooks';


exports.webhook = null;

// If you want to subscribe on webhooks, unkomment this:
//
// createWebhookIfNotExists ('*', function (err, webhook, isCreated) {
//   if (isCreated) {
//     log.info('Webhook (*) is created: ' + JSON.stringify(webhook));
//   } else {
//     log.info('Webhook (*) already exists: ' + JSON.stringify(webhook));
//   }
//   exports.webhook = webhook;
// });


function createPayment (productId, productName, productPrice, finishCallback) {

  async.waterfall([
    function doSale (callback) {
      var createPaymentJson = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": PAYMENT_RETURN_URL,
          "cancel_url": PAYMENT_CANCEL_URL,
        },
        "transactions": [{
          "item_list": {
            "items": [{
              "name": productName,
              "sku": productId,
              "price": productPrice,
              "currency": "USD",
              "quantity": 1
            }]
          },
          "amount": {
            "currency": "USD",
            "total": productPrice
          },
          "description": productName,
        }]
      };
      debug('createPaymentJson: ' + JSON.stringify(createPaymentJson));
      paypal.payment.create(createPaymentJson, callback);
    },
    function afterSale (payment, callback) {
      var redirectTo;
      var paymentToken;
      for (var index = 0; index < payment.links.length; index++) {
        if (payment.links[index].rel === 'approval_url') {
          debug('payment.links[' + index + '].href: ' +
                payment.links[index].href);
          redirectTo = payment.links[index].href;
          paymentToken = url.parse(redirectTo, true).query.token;
        }
      }
      debug('payment: ' + JSON.stringify(payment));
      callback(null, redirectTo, paymentToken);
    },
  ], function finish (err, redirectTo, paymentToken) {
    var error = null;
    if (err) {
      error = new Error('Create payment error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    }
    debug('redirectTo: ' + redirectTo);
    debug('paymentToken: ' + paymentToken);
    if (finishCallback) {
      finishCallback(error, redirectTo, paymentToken);
    }
  });
}
exports.createPayment = createPayment;


function executePayment (paymentId, payerId, callback) {
  var executePaymentJson = {
      "payer_id": payerId,
  };
  paypal.payment.execute(paymentId, executePaymentJson,
                         function (err, payment) {
    var amount = 0;
    var saleCompleted = false;
    var error = null;
    if (err) {
      error = new Error('Execute payment error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    } else {
      debug("Get Payment Response: " + JSON.stringify(payment));
      amount = parseFloat(payment.transactions[0].amount.total);
      var saleState = payment.transactions[0].
                              related_resources[0].sale.state;
      if (payment.state === 'approved' && saleState === 'completed') {
        debug('amount: ' + amount);
        saleCompleted = true;
      } else {
        error = new Error('Execute payment error: sale is not completed.' +
                          ' paymentId: ' + paymentId);
      }
    }
    callback(error, saleCompleted, amount, payment);
  });
}
exports.executePayment = executePayment;


function createBillingPlan (planOrServiceId, finishCallback) {

  function setPlanAttributes (planOptions, callback) {
    var planPeriodArr = planOptions.period.split(' ');
    var planFrequencyInterval = planPeriodArr[0];
    var planFrequency = planPeriodArr[1].replace(/s$/, '').toUpperCase();

    var billingPlanAttributes = {
      'description': '"' + planOptions.name + '" plan',
      'merchant_preferences': {
        'auto_bill_amount': 'yes',
        'initial_fail_amount_action': 'continue',
        'max_fail_attempts': '0',  // infinite number of failed attempts
        'return_url': PLAN_RETURN_URL,
        'cancel_url': PLAN_CANCEL_URL,
      },
      'name': planOptions.id,
      'payment_definitions': [{
        'amount': {
          'currency': 'USD',
          'value': planOptions.price
        },
        'cycles': '0',
        'frequency': planFrequency,
        'frequency_interval': planFrequencyInterval,
        'name': planOptions.id,
        'type': 'REGULAR'
      }],
      'type': 'INFINITE'
    };

    if (planOptions.trialPeriod) {
      var trialPeriodArr = planOptions.trialPeriod.split(' ');
      var trialFrequencyInterval = trialPeriodArr[0];
      var trialFrequency = trialPeriodArr[1].replace(/s$/, '').toUpperCase();
      var trialPD = {
        'amount': {
          'currency': 'USD',
          'value': planOptions.trialPrice
        },
        'cycles': '1',
        'frequency': trialFrequency,
        'frequency_interval': trialFrequencyInterval,
        'name': 'trial-' + planOptions.id,
        'type': 'TRIAL'
      };
      billingPlanAttributes.payment_definitions.push(trialPD);
    }
    callback(null, billingPlanAttributes);
  }

  function setServiceAttributes (serviceOptions, callback) {
    var servicePeriodArr = serviceOptions.period.split(' ');
    var serviceFrequencyInterval = servicePeriodArr[0];
    var serviceFrequency = servicePeriodArr[1].replace(/s$/, '').toUpperCase();

    var billingPlanAttributes = {
      'description': '"' + serviceOptions.name + '" service',
      'merchant_preferences': {
        'auto_bill_amount': 'yes',
        'initial_fail_amount_action': 'continue',
        'max_fail_attempts': '0',  // infinite number of failed attempts
        'return_url': SERVICE_RETURN_URL,
        'cancel_url': SERVICE_CANCEL_URL,
      },
      'name': serviceOptions.id,
      'payment_definitions': [{
        'amount': {
          'currency': 'USD',
          'value': serviceOptions.price
        },
        'cycles': '0',
        'frequency': serviceFrequency,
        'frequency_interval': serviceFrequencyInterval,
        'name': serviceOptions.id,
        'type': 'REGULAR'
      }],
      'type': 'INFINITE'
    };
    callback(null, billingPlanAttributes);
  }

  async.waterfall([

    function createBillingPlan(callback) {
      var planOptions = nconf.get('plans:' + planOrServiceId);
      var serviceOptions = nconf.get('services:' + planOrServiceId);
      if (planOptions) {
        setPlanAttributes(planOptions, callback);
      } else if (serviceOptions) {
        setServiceAttributes(serviceOptions, callback);
      } else {
        return callback(new Error('Plan or service "' + planOrServiceId +
                                  '" is not defined in config'));
      }
    },

    function createBillingPlan(billingPlanAttributes, callback) {
      paypal.billingPlan.create(billingPlanAttributes, callback);
    },

    function activateBillingPlan(billingPlan, callback) {
      log.info('Create Billing Plan Response' + JSON.stringify(billingPlan));
      var billingPlanUpdateAttributes = [{
        'op': 'replace',
        'path': '/',
        'value': {
          'state': 'ACTIVE'
        }
      }];
      paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes,
                                callback);
    },

  ], function finish(err) {
    var error = null;
    if (err) {
      error = new Error('Create/activate plan or service "' + planOrServiceId +
                        '" error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    }
    if (finishCallback) {
      finishCallback(error, planOrServiceId);
    }
  });
}
exports.createBillingPlan = createBillingPlan;


function getBillingPlansList (callback) {

  var listBillingPlan = {
    'status': 'ACTIVE',
    'page_size': 20,  // TODO: limit, list plans for all pages
    'page': 0,
    'total_required': 'yes'
  };

  paypal.billingPlan.list(listBillingPlan, function (err, billingPlansList) {
    var error = null;
    if (err) {
      error = new Error('List billing plans error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    } else {
      debug('Plans list: ' + JSON.stringify(billingPlansList));
    }
    if (callback) {
      callback(error, billingPlansList);
    }
  });
}
exports.getBillingPlansList = getBillingPlansList;


function findBillingPlanId (planOrServiceId, callback) {
  getBillingPlansList(function (err, billingPlansList) {
    if (err) {
      return callback(err);
    }
    var billingPlans = billingPlansList.plans;
    for (var i in billingPlans) {
      if (billingPlans[i].name === planOrServiceId) {
        var billingPlanId = billingPlans[i].id;
        return callback(null, billingPlanId);
      }
    }
    return callback(new Error('Billing plan "' + planOrServiceId +
                              '" not found.'), null);
  });
}
exports.findBillingPlanId = findBillingPlanId;


function isBillingPlanExists (planOrServiceId, callback) {
  findBillingPlanId(planOrServiceId, function (err, billingPlanId) {
    callback(null, billingPlanId ? true : false);
  });
}
exports.isBillingPlanExists = isBillingPlanExists;


function createBillingPlanIfNotExists (planOrServiceId, callback) {
  var isCreated = false;
  isBillingPlanExists(planOrServiceId, function (err, isExists) {
    if (isExists) {
      callback(err, planOrServiceId, isCreated);
    } else {
      createBillingPlan(planOrServiceId, function(err, planOrServiceId) {
        if (!err) {
          isCreated = true;
        }
        callback(err, planOrServiceId, isCreated);
      });
    }
  });
}
exports.createBillingPlanIfNotExists = createBillingPlanIfNotExists;


function removeBillingPlan (planOrServiceId, finishCallback) {
  async.waterfall([

    function selectPlan (callback) {
      findBillingPlanId(planOrServiceId, callback);
    },

    function removePlan (billingPlanId, callback) {
      debug('billing plan id: ' + billingPlanId);
      var billingPlanUpdateAttributes = [{
          'op': 'replace',
          'path': '/',
          'value': {
            'state': 'DELETED'
          }
      }];
      paypal.billingPlan.update(billingPlanId, billingPlanUpdateAttributes,
                                callback);
    },

  ], function finish (err) {
    var error = null;
    if (err) {
      error = new Error('Remove billing plan "' + planOrServiceId +
                        '" error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    }
    if (finishCallback) {
      finishCallback(error, planOrServiceId);
    }
  });
}
exports.removeBillingPlan = removeBillingPlan;


function getBillingPlan(planOrServiceId, finishCallback) {
  async.waterfall([

    function selectPlan (callback) {
      findBillingPlanId(planOrServiceId, callback);
    },

    function getPlan (billingPlanId, callback) {
      debug('billing plan id: ' + billingPlanId);
      paypal.billingPlan.get(billingPlanId, callback);
    },

  ], function finish (err, billingPlan) {
    var error = null;
    if (err) {
      error = new Error('Get billing plan "' + planOrServiceId + '" error: ' +
                        err.message + ', err: ' + JSON.stringify(err));
    }
    if (finishCallback) {
      finishCallback(error, planOrServiceId, billingPlan);
    }
  });
}
exports.getBillingPlan = getBillingPlan;


function createBillingAgreement (planOrServiceId, finishCallback) {
  async.waterfall([

    function selectPlan (callback) {
      findBillingPlanId(planOrServiceId, callback);
    },

    function createAgreement (billingPlanId, callback) {
      debug('billingPlanId: ' + billingPlanId);
      var startDate = moment().add(3, 'hours');
      var isoStartDate = startDate.toISOString().replace(/\..*Z/, 'Z');
      debug('isoStartDate: ' + isoStartDate);

      var description;
      var planName = nconf.get('plans:' + planOrServiceId + ':name');
      var serviceName = nconf.get('services:' + planOrServiceId + ':name');
      if (planName) {
        description = 'Plan "' + planName + '"';
      } else if (serviceName) {
        description = 'Service "' + serviceName + '"';
      } else {
        description = 'Unknown plan/service';
      }

      var billingAgreementAttributes = {
        'name': '"' + planOrServiceId + '" billing agreement',
        'description': description,
        'start_date': isoStartDate,
        'plan': {
          'id': billingPlanId,
        },
        'payer': {
          'payment_method': 'paypal'
        }
      };
      debug('billingAgreementAttributes: ' +
            JSON.stringify(billingAgreementAttributes));

      paypal.billingAgreement.create(billingAgreementAttributes, callback);
    },

    function afterAgreementCreated (billingAgreement, callback) {
      log.info('Create Billing Agreement Response: ' +
               JSON.stringify(billingAgreement));
      for (var i in billingAgreement.links) {
        if (billingAgreement.links[i].rel === 'approval_url') {
          var redirectTo = billingAgreement.links[i].href;
          var agreementToken = url.parse(redirectTo, true).query.token;
          callback(null, billingAgreement, redirectTo, agreementToken);
        }
      }
    },

  ], function finish (err, billingAgreement, redirectTo, agreementToken) {
    var error = null;
    if (err) {
      error = new Error('Create "' + planOrServiceId + '" billing agreement ' +
                        ' error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    }
    if (finishCallback) {
      finishCallback(error, planOrServiceId, billingAgreement, redirectTo,
                    agreementToken);
    }
  });
}
exports.createBillingAgreement = createBillingAgreement;


function executeBillingAgreement (agreementToken, finishCallback) {
  async.waterfall([

    function execute (callback) {
      paypal.billingAgreement.execute(agreementToken, {},
                                      function (err, executedAgreement) {
        if (err) {
          return callback(err, null);
        }
        debug('executedAgreement: ' + JSON.stringify(executedAgreement));
        callback(null, executedAgreement);
      });
    },

    function get (executedAgreement, callback) {
      var billingAgreementId = executedAgreement.id;
      paypal.billingAgreement.get(billingAgreementId,
                                  function (err, billingAgreement) {
        debug('billingAgreement: ' + JSON.stringify(billingAgreement));
        callback(err, executedAgreement, billingAgreement);
      });
    },

  ], function finish (err, executedAgreement, billingAgreement) {
    var error = null;
    if (err) {
      error = new Error('Execute/get billing agreement error: ' +
                        'agreementToken=' + agreementToken +
                        ', error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    }
    finishCallback(error, executedAgreement, billingAgreement);
  });
}
exports.executeBillingAgreement = executeBillingAgreement;


function cancelBillingAgreement(billingAgreementId, callback) {
  var cancel_note = {
      "note": "Canceling the agreement"
  };
  paypal.billingAgreement.cancel(billingAgreementId, cancel_note,
                                 function (err, response) {
    var error = null;
    if (err) {
      error = new Error('Cancel billing agreement error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    } else {
      debug('Cancel billing agreement response: ' + JSON.stringify(response));
    }
    callback(error, response);
  });
}
exports.cancelBillingAgreement = cancelBillingAgreement;


function getBillingAgreement(billingAgreementId, callback) {
  paypal.billingAgreement.get(billingAgreementId,
                              function (err, billingAgreement) {
    var error = null;
    if (err) {
      error = new Error('Get billing agreement error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    } else {
      debug('Billing agreement: ' + JSON.stringify(billingAgreement));
    }
    callback(error, billingAgreement);
  });
}
exports.getBillingAgreement = getBillingAgreement;


var searchTransactionsDateFormat = 'YYYY-MM-DD';
exports.searchTransactionsDateFormat = searchTransactionsDateFormat;


function searchTransactions (billingAgreementId, startDate, endDate,
                             callback) {
  paypal.billingAgreement.searchTransactions(billingAgreementId,
                                             startDate, endDate,
                                             function (err, results) {
    var error = null;
    if (err) {
      error = new Error('Search transactions error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    } else {
      debug('Billing Agreement Transactions Search Response: ' +
            JSON.stringify(results));
    }
    callback(error, results);
  });
}
exports.searchTransactions = searchTransactions;


function getWebhooksList (callback) {
  paypal.notification.webhook.list(function (err, webhooks) {
    var error = null;
    if (err) {
      error = new Error('Get webhooks list error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    } else {
      debug('Webhooks list: ' + JSON.stringify(webhooks));
    }
    callback(error, webhooks);
  });
}
exports.getWebhooksList = getWebhooksList;


function createWebhook (webhookName, callback) {
  var createWebhookJson = {
    "url": WEBHOOKS_URL,
    "event_types": [
      {
        "name": webhookName
      },
    ]
  };
  paypal.notification.webhook.create(createWebhookJson,
                                     function (err, webhook) {
    var error = null;
    if (err) {
      error = new Error('Create webhook error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    } else {
      debug('Webhook: ' + JSON.stringify(webhook));
    }
    callback(error, webhook);
  });
}
exports.createWebhook = createWebhook;

function createWebhookIfNotExists (webhookName, callback) {
  getWebhooksList(function (err, webhooksList) {
    var create = true;
    var webhook;
    if (err) {
      // create = true;
    } else if (!webhooksList) {
      // create = true;
    } else if (!webhooksList.webhooks) {
      // create = true;
    } else {
      loops:
      for (var i in webhooksList.webhooks) {
        webhook = webhooksList.webhooks[i];
        if (webhook.url === WEBHOOKS_URL) {
          for (var j in webhook.event_types) {
            var event_type = webhook.event_types[j];
            if (event_type.name === webhookName) {
              create = false;
              break loops;
            }
          }
        }
      }
    }
    var isCreated = false;
    if (create) {
      createWebhook(webhookName, function (err, createdWebhook) {
        if (!err) {
          isCreated = true;
        }
        callback(err, createdWebhook, isCreated);
      });
    } else {
      callback(err, webhook, isCreated);
    }
  });
}
exports.createWebhookIfNotExists = createWebhookIfNotExists;


function removeWebhook (webhookName, callback) {
  getWebhooksList(function (err, webhooksList) {
    var webhookId;
    if (webhooksList && webhooksList.webhooks) {
      loops:
      for (var i in webhooksList.webhooks) {
        var webhook = webhooksList.webhooks[i];
        if (webhook.url === WEBHOOKS_URL) {
          for (var j in webhook.event_types) {
            var event_type = webhook.event_types[j];
            if (event_type.name === webhookName) {
              webhookId = webhook.id;
              break loops;
            }
          }
        }
      }
    }
    var isRemoved = false;
    if (webhookId) {
      paypal.notification.webhook.del(webhookId, function (err, response) {
        var error = null;
        if (err) {
          error = new Error('Remove webhook error: ' + err.message +
                            ', err: ' + JSON.stringify(err));
        } else {
          debug('Remove webhook response: ' + JSON.stringify(response));
          isRemoved = true;
        }
        callback(error, isRemoved);
      });
    } else {
      callback(err, isRemoved);
    }
  });
}
exports.removeWebhook = removeWebhook;


function verifyWebhookEvent (webhookEvent, webhookHeaders, callback) {
  var webhookId = exports.webhook.id;
  debug('webhookId: ' + webhookId);
  paypal.notification.webhookEvent.verify(webhookHeaders, webhookEvent,
                                          webhookId,
                                          function (err, isOk) {
    var error = null;
    if (err) {
      error = new Error('Verify webhook error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    }
    debug('isOk: ' + JSON.stringify(isOk));
    callback(error, isOk);
  });
}
exports.verifyWebhookEvent = verifyWebhookEvent;


function searchWebhookEvents(callback) {
  // TODO:
  var parameters = {
    "page_size": 100,
    "start_time": "2015-05-16T11:00:00Z",
    "end_time": "2015-06-20T11:00:00Z"
  };
  paypal.notification.webhookEvent.list(parameters,
                                        function (err, webhookEvents) {
    var error = null;
    if (err) {
      error = new Error('Search webhook events error: ' + err.message +
                        ', err: ' + JSON.stringify(err));
    } else {
      debug('webhookEvents: ' + JSON.stringify(webhookEvents));
    }
    callback(error, webhookEvents);
  });
}
exports.searchWebhookEvents = searchWebhookEvents;


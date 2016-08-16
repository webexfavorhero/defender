var debug = require('debug')('plans');
debug('start');

var async = require('async');
var nconf = require('nconf');

var log = require('../td_common/libs/log');

var agenda = require('../libs/agenda');
var User = require('../models/user');
var billing = require('../libs/billing');


// TODO: payment declined inform -- remove?


function checkPaidPlans (finishCallback) {
  log.info('Check paid plans');
  var totalOutstanding = 0;

  function checkUser (user, checkUserCallback) {

    debug('user.paypal.agreementId: ' + user.paypal.agreementId);
    async.waterfall([
      function getPlanBillingAgreement (callback) {
        if (user.paypal.agreementId) {
          billing.getBillingAgreement (user.paypal.agreementId, callback);
        } else {
          callback(null, null);
        }
      },
      function checkUserPlan (planBillingAgreement, callback) {
        debug('Got user plan billing agreement ' +
                                        JSON.stringify(planBillingAgreement));
        if (planBillingAgreement &&
            planBillingAgreement.state === 'Active') {
          if (user.trial) {
            // switch plan from trial to full
            var cyclesCompleted = planBillingAgreement.agreement_details.
                                                   cycles_completed;
            if (cyclesCompleted >= 1) {
              user.trial = false;
              log.info('User ' + user.email + ' plan switched from ' +
                       ('trial-'+user.plan) + ' to ' + user.plan);
            }
          }
        } else if (user.isAdmin) {
          // do noting
          // Admin has paid account always (with billing agreement or without)
        } else if (user.plan !== 'free') {
          log.info('User ' + user.email + ' cancel his billing agreement ' +
                   'for plan ' + user.plan, ', plan switched to free');
          // may be cancel all billing agreements?
          user.paid = false;
          user.plan = 'free';
          user.trial = false;
        }
        var billingAgreements = [];
        if (planBillingAgreement) {
          billingAgreements.push(planBillingAgreement);
        }
        callback(null, billingAgreements);
      },
      function checkUserServices (billingAgreements, callback) {
        async.eachSeries(user.paypal.services,
                   function iterator (service, eachCallback) {
          debug('checkUserServices - service: ' + JSON.stringify(service));
          billing.getBillingAgreement(service.agreementId,
                                      function (err, serviceBillingAgreement) {
            if (serviceBillingAgreement.state === 'Active') {
            } else {
              log.info('User ' + user.email + ' cancel his billing ' +
                       'agreement for service ' + service.serviceId);
              var serviceOptions = nconf.get('services:' + service.serviceId);
              switch(serviceOptions.type) {
                case 'extraSlots':
                  user.extraSlots -= serviceOptions.count;
                  break;
              }
              service.remove();
            }
            billingAgreements.push(serviceBillingAgreement);
            eachCallback(null); // continue processing at error
          });
        }, function finishEach () {
          callback(null, billingAgreements);
        });
      },
      function checkOutstanding (billingAgreements, callback) {
        var userOutstanding = 0;
        var details = [];
        for (var i in billingAgreements) {
          var billingAgreement = billingAgreements[i];
          var outstanding = parseFloat(billingAgreement.agreement_details.
                                       outstanding_balance.value);
          if (outstanding > 0) {
            userOutstanding += outstanding;
            details.push(billingAgreement.agreement_details);
          }
        }
        if (userOutstanding > 0) {
          totalOutstanding += userOutstanding;

          // TODO: inform user about outstanding

          if (userOutstanding < 500) {
            log.info('User ' + user.email + ' has outstanding $' +
                     userOutstanding + ', details: ' +
                     JSON.stringify(details));
          } else {
            log.warn('!!! User ' + user.email + ' has a VERY LARGE ' +
                     'outstanding $' + userOutstanding +
                     '. MAY BE CANCEL HIS BILLING AGREEMENTS? ' +
                     'Details: ' + JSON.stringify(details));
          }
        }
        callback(null);
      },
      function saveUser (callback) {
        if (user.isModified()) {
          user.save(function(err) {
            return callback(err);
          });
        }
        callback(null);
      },
    ], function finishCheckUser (err) {
      if (err) {
        log.error('Check user plan/services error: ' + err.message);
      }
      checkUserCallback();
    });
  }

  async.waterfall([
    function findPaidUsers (callback) {
      User.find({ paid: true }, function (err, users) {
        callback(err, users);
      });
    },
    function forEachUser (users, callback) {
      async.eachSeries(users, function iterator (user, forEachUserCallback) {
        debug('forEachUser - user: ' + JSON.stringify(user));
        checkUser (user, function () {
          forEachUserCallback(null); // continue processing at error
        });
      }, function finishEach (err) {
        callback(err);
      });
    },
  ], function finishWaterfall (err) {
    if (err) {
      log.error('Check paid plans error: ' + err.message);
    }
    if (totalOutstanding > 0) {
      log.warn('Total outstanding: $' + totalOutstanding);
    }
    if (finishCallback) {
      finishCallback();
    }
  });
}


exports.define = function defineJobs () {
  agenda.define('check paid plans', function resetHitsJob (job, done) {
    checkPaidPlans();
    done();
  });
};

exports.reset = function resetJobs () {
  log.info('Schedule check paid plans (and services)');
  // every day at 0:00
  agenda.every('0 0 * * *', 'check paid plans');
};


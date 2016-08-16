var express = require('express');
var router = express.Router();
var nconf = require('nconf');

var log = require('../td_common/libs/log');

var checkAdmin = require('../libs/check_admin');
var checkAuth = require('../libs/check_auth');
var agenda = require('../libs/agenda');


router.get('/', checkAuth, checkAdmin, function(req, res) {
  res.render('test', { title: 'Test'});
});


// for redirect test

// router.get('/redirect', function (req, res) {
//   res.redirect("http://www.pc-help2.com/lp_1_6/Warning_alert.html");
//   // res.redirect("http://s6b3m.voluumtrk.com/8175c005-db88-4ee9-bc33-2079babff8d4");
//   // res.redirect("http://google.com");
//   // res.redirect("http://www.helpbar.ru");
// });

// router.get('/redirect-redirect', function (req, res) {
//   res.redirect("http://" + req.headers.host + "/test/redirect");
// });

// router.get('/redirect-redirect-redirect', function (req, res) {
//   res.redirect("http://" + req.headers.host + "/test/redirect-redirect");
// });

router.get('/check', checkAuth, checkAdmin, function(req, res) {
  var plans = nconf.get('plans');
  var plan;
  for (plan in plans) {
    var planOpts = plans[plan];
    var frequency = planOpts.checkFrequency;
    if (frequency !== "0") {
      log.info('Now monitors for plan ' + plan + ' at ' + frequency);
      agenda.now('monitors for ' + plan, { plan: plan });
    }
  }
  setTimeout(function(){
    res.redirect('/dashboard');
  }, 3000);
});

router.get('/notify', checkAuth, checkAdmin, function(req, res) {
  var frequencies = nconf.get('notifier:frequencies');
  for (var i in frequencies) {
    var freq = frequencies[i].value;
    log.info('Now notifier for frequency ' + freq);
    agenda.now('notifier for ' + freq, { frequency: freq });
  }
  res.redirect('/dashboard');
});

router.get('/plans', checkAuth, checkAdmin, function(req, res) {
  log.info('Now check paid plans');
  agenda.now('check paid plans');
  res.redirect('/dashboard');
});

module.exports = router;


var debug = require('debug')('dashboard');
debug('start');

var express = require('express');
var router = express.Router();

var log = require('../td_common/libs/log');
log.debug('start');

var checkAuth = require('../libs/check_auth');

router.get('/', checkAuth, function(req, res){
  res.render('dashboard', { title: "Dashboard",
                            flashMessage: req.flash('error') });
});

module.exports = router;


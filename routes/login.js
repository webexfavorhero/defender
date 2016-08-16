var debug = require('debug')('login');

var express = require('express');
var router = express.Router();
var passport = require('passport');

var log = require('../td_common/libs/log');
log.info('login log start');


router.get('/', function (req, res) {
  res.render('login', { title: "Login",
                        // we use passport.js lib for login,
                        // passport accepts just Strings for flash('error')
                        // and doesn't accept object {e: String}
                        flashMessage: { e: req.flash('error') }});
});

function rememberme (req, res, next) {
  debug('req.body.rememberme :' + req.body.rememberme);

  if (Boolean(req.body.rememberme) === true) {
    debug("remember fo 30 days");
    req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000
                                            // Rememeber 'me' for 30 days
  } else {
    debug("don't remember");
    req.session.cookie.expires = false;
  }
  next();
}

router.post('/', rememberme,
            passport.authenticate('local', { successRedirect: '/dashboard',
                                             failureRedirect: '/login',
                                             failureFlash: true }));

module.exports = router;


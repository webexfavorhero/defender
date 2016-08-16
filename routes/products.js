var debug = require('debug')('products');

var express = require('express');
var router = express.Router();
var async = require('async');
var nconf = require('nconf');

var log = require('../td_common/libs/log');

var checkAuth = require('../libs/check_auth');
var billing = require('../libs/billing');


router.get('/', checkAuth, function(req, res) {
	debug('body: ' + JSON.stringify(req.body));
  var user = req.user;
  var productId = req.query.productId;
  debug('productId: ' + productId);

  async.waterfall([

    function createPayment(callback) {
      var productOptions = nconf.get('products:' + productId);
      debug('productOptions: ' + JSON.stringify(productOptions));
      if (!productOptions) {
        return callback(new Error('Product is not defned: id=' + productId));
      }
      billing.createPayment(productOptions.id, productOptions.name,
                            productOptions.price,
                            function (err, redirectTo, paymentToken) {
        callback(err, productOptions, redirectTo, paymentToken);
      });
    },

    function updateUser (productOptions, redirectTo, paymentToken, callback) {
      user.paypal.paymentToken = paymentToken;
      user.paypal.saleProduct = productOptions.id;
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


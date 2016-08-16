var express = require('express');
var router = express.Router();

var checkAuth = require('../libs/check_auth');
var checkAdmin = require('../libs/check_admin');
var User = require('../models/user');
var UrlStatus = require('../models/urlstatus');
var Notification = require('../models/notification');
var Traffic = require('../models/traffic');

router.get('/', checkAuth, checkAdmin, function (req, res) {
  res.send('json ok');
});

router.get('/user.json', checkAuth, checkAdmin, function (req, res) {
  User.find({}, function (err, docs) {
    res.json(docs);
  });
});

router.get('/status.json', checkAuth, checkAdmin, function (req, res) {
  UrlStatus.find({}, function (err, docs) {
    res.json(docs);
  });
});

router.get('/status.json/:status', checkAuth, checkAdmin, function (req, res) {
  if (req.params.status) {
    UrlStatus.find({ status: req.params.status }, function (err, docs) {
        res.json(docs);
    });
  }
});

router.get('/notification.json', checkAuth, checkAdmin, function (req, res) {
  Notification.find({}, function (err, docs) {
    res.json(docs);
  });
});

router.get('/traffic.json', checkAuth, checkAdmin, function (req, res) {
  Traffic.find({}, function (err, docs) {
    res.json(docs);
  });
});

module.exports = router;


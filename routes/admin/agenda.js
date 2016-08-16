var debug = require('debug')('admin:sheduler');

var express = require('express');
var router = express.Router();

var checkAuth = require('../../libs/check_auth');
var checkAdmin = require('../../libs/check_admin');

var agenda = require('../../libs/agenda');
var agendaUI = require('agenda-ui');

router.use('/', checkAuth, checkAdmin, agendaUI(agenda, { poll: 10*60*1000 }));

module.exports = router;


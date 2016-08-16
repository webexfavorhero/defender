var debug = require('debug')('resolve');

var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');
var hogan = require('hogan.js');

var log = require('../td_common/libs/log');

var Notification = require('../models/notification');
var websockets = require('../libs/websockets');


var messageTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/resolved_msg.tmpl', 'utf8'));


router.get('/:resolveToken', function(req, res) {
  var resolveToken = req.params.resolveToken;
  if (!resolveToken) {
    res.render('message',
               { title: 'Error',
                 error: 'Link is invalid.' });
  } else {
    Notification.findOne({ resolveToken: resolveToken })
                .populate('userId')
                .populate('urlStatusId')
                .exec(function(err, notice) {
      if (err) {
        log.error('finding notification for resolve error: ' + err.message);
      }
      if (!notice) {
        res.render('message',
                   { title: 'Error',
                     error: 'Resolve token not found.' });
      } else if (notice.resolved) {
        res.render('message',
                   { title: 'Warning',
                     warning: 'The problem was resolved earlier at ' +
                              moment(notice.resolvedAt).format('lll') });
      } else {
        var now = Date.now();
        notice.active = false;
        notice.deactivatedAt = now;
        notice.resolved = true;
        notice.resolvedAt = now;
        notice.save(function (err) {
          if (err) {
            log.error('Saving resolved notice error: ' + err.message);
          }

          var user = notice.userId;
          var us = notice.urlStatusId;
          var contact = user.contacts.id(notice.contactId);
          var templData = {
            contactName: contact.name,
            url: us.url,
            urlName: us.name };
          var message = { w: messageTemplate.render(templData) };
          websockets.emitToUser(user._id, 'message', message);

          res.render('message',
                     { title: 'Resolved',
                       info: 'Now, problem is resolved.' });
        });
      }
    });
  }
});

module.exports = router;


var debug = require('debug')('contacts');

var _ = require('lodash');
var nconf = require('nconf');
var hogan = require('hogan.js');
var fs = require('fs');

var log = require('../td_common/libs/log');

var mail = require('../libs/mail');
var sms = require('../libs/sms');

var User = require('../models/user');


var emailTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/test_email.tmpl', 'utf8'));

var subjectTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/test_subj.tmpl', 'utf8'));

var smsTemplate = hogan.compile(
  fs.readFileSync(__dirname+'/../templates/test_sms.tmpl', 'utf8'));


// contacts sends to client in controllers/dashboard.js
// other contacts functionality is here

function addContact (userId, co, callback) {
	debug("add contact co: ", JSON.stringify(co));
  User.findById(userId, function (err, user) {
    if (err) {
      log.error('Find user in add contact error: ' + err.message);
      message.e = 'Can\'t find user';
      return callback(message);
    }
    var message = {};
    var contact = {};
    if (co.hasOwnProperty('nm')) {
      contact.name = co.nm;
    }
    if (co.hasOwnProperty('ph')) {
      contact.phone = co.ph;
    }
    if (co.hasOwnProperty('em')) {
      contact.email = co.em;
    }
    if (co.hasOwnProperty('nf')) {
      var frequencies = nconf.get('notifier:frequencies');
      var frequency = _.find(frequencies, { 'id': parseInt(co.nf, 10) });
      contact.notificationFrequency = frequency.value;
    }
    debug('    contact: ' + JSON.stringify(contact));
    user.contacts.push(contact);
    user.save(function (err) {
      if (err) {
        message.e = "Can't save contact";
      }
      callback(message);
    });
  });
}

function editContact (userId, co, callback) {
  var message = {};

  User.findById(userId, function (err, user) {
    if (err) {
      log.error('Find user in edit contact error: ' + err.message);
      message.e = 'Can\'t find user';
      return callback(message);
    }

    function isEditable() {
      if (contact._id === user.contacts[0]._id) {
        message.e = 'Main contact name, email and phone number edit allowed ' +
                    'only in profile';
        return false;
      }
      return true;
    }

    debug("co: ", JSON.stringify(co));
    var contact = user.contacts.id(co._id);
    if (co.hasOwnProperty('nm') && isEditable()) {
      contact.name = co.nm;
    }
    if (co.hasOwnProperty('ph') && isEditable()) {
      contact.phone = co.ph;
    }
    if (co.hasOwnProperty('em') && isEditable()) {
      contact.email = co.em;
    }
    if (co.hasOwnProperty('nf')) {
      var frequencies = nconf.get('notifier:frequencies');
      var frequency = _.find(frequencies, { 'id': parseInt(co.nf, 10) });
      contact.notificationFrequency = frequency.value;
    }
    user.save(function (err) {
      if (err) {
        message.e = "Can't save contact";
      }
      callback(message);
    });
  });
}

function removeContact (userId, co, callback) {
	debug("co: ", JSON.stringify(co));
  var message = {};
  User.findById(userId, function (err, user) {
    if (err) {
      log.error('Find user in remove contact error: ' + err.message);
      message.e = 'Can\'t find user';
      return callback(message);
    }
    var contact = user.contacts.id(co._id);
    if (contact._id === user.contacts[0]._id) {
      message.e = "Can't remove main contact";
      return callback(message);
    }
    contact.remove();
    user.save(function (err) {
      if (err) {
        message.e = "Can't save contact";
      }
      callback(message);
    });
  });
}

function testContact (userId, co, callback) {
	debug("co: ", JSON.stringify(co));
  User.findById(userId, function (err, user) {
    if (err) {
      log.error('Find user in test contact error: ' + err.message);
      message.e = 'Can\'t find user';
      return callback(message);
    }
    var message = {};
    var contact = user.contacts.id(co._id);
    var templData = { contactName: contact.name };
    if (co.hasOwnProperty('te') && co.te && contact.email) {
      var emailHtml = emailTemplate.render(templData);
      var subject = subjectTemplate.render(templData);
      var mailOptions = {
        from: nconf.get('notifier:emailFrom'),
        to: contact.email,
        subject: subject,
        html: emailHtml };
      debug('send test email');
      mail.send(mailOptions, function (err, info) {
        debug('test email info: ' + JSON.stringify(info));
      });
    }
    if (co.hasOwnProperty('tp') && co.tp && contact.phone) {
      var smsText = smsTemplate.render(templData);
      var smsOptions = {
        to: contact.phone,
        from: nconf.get('notifier:smsFrom'),
        body: smsText };
      debug('send test sms');
      sms.sendPaid(smsOptions, userId, function (err, message) {
        debug('test sms info: ' + JSON.stringify(message));
      });
    }
    callback(message);
  });
}

exports.websocketHandlers = [

  function addContactHandler (socket, userId) {
    socket.on('add contact', function (co) {
      addContact(userId, co, function (message) {
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

  function editContactHandler (socket, userId) {
    socket.on('edit contact', function (co) {
      editContact(userId, co, function (message) {
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

  function removeContactHandler (socket, userId) {
    socket.on('remove contact', function (co) {
      removeContact(userId, co, function (message) {
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

  function testContactHandler (socket, userId) {
    socket.on('test contact', function (co) {
      testContact(userId, co, function (message) {
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

];


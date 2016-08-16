var debug = require('debug')('test');

var moment = require('moment');
var config = require('../td_common/libs/config');
var db = require('../td_common/libs/db');

var User = require('../models/user');
var UrlStatus = require('../models/urlstatus');
var Notification = require('../models/notification');

function hello1 () {
  UrlStatus
    .find()
    .populate({
      path: 'userId',
      match: { paid: true },
    })
    .exec(function(err, uss) {

      if (!uss) return;
      uss = uss.filter(function(us) { return us.userId; });

      for (i in uss) {
        var us = uss[i];
        //if (!us.userId) continue;
        console.log('us' +
                    ', user.email: ' + us.userId.email +
                    ', userId.paid: ' + us.userId.paid +
                    ', url:' + us.url);
        console.log('us.userId: ' + us.userId._id);
      }
    });
}

function hello2() {
  var frequency = "15 minutes";

  Notification
    .find({ active: true })
    .populate({
      path: 'userId',
      match: { paid: true },
    })
    .populate('urlStatusId')
    .exec(function (err, notices) {

    notices = notices
                .filter(function filterPopulated (notice) {
                  return notice.userId && notice.urlStatusId;
                })
                .filter(function filterFrequency (notice) {
                  var contactId = notice.urlStatusId.contactId;
                  var contacts = notice.userId.contacts;
                  var contact  = contacts.id(contactId);
                  var freq = contact.notificationFrequency;
                  return freq === frequency;
                });

    for (i in notices) {
      var notice = notices[i];

      var contactId = notice.urlStatusId.contactId;
      var contacts = notice.userId.contacts;
      var contact  = contacts.id(contactId);
      var freq = contact.notificationFrequency;

      console.log('\nnotice' +
                  ', freq: ' + freq)
                  // ', urlStatus: ' + notice.urlStatusId + '\n' +
                  // ', urlStatus.contactId: ' + notice.urlStatusId.contactId);
    }
  });
}

function hello3() {
  var zones = [ -12, -11, -10, -9, -8, -7, -6, -5, -4, -3.5, -3, -2, -1, 0,
    1, 2, 3, 3.5, 4, 4.5, 5, 5.5, 5.75, 6, 6.5, 7, 8, 9, 9.5, 10, 11, 12, 13];
  for (var i in zones) {
    var zone = zones[i];

    var zoneMoment = moment().utcOffset(zone);
    var zoneHour = zoneMoment.hour();
    var zoneDayOfWeek = zoneMoment.day();
    var zoneDayOfMonth = zoneMoment.date();
    if (zoneHour === 0) {
      console.log('zone: ' + zone);
      console.log(zoneHour + ' hours');
      console.log('day of week: ' + zoneDayOfWeek);
      console.log('day of month: ' + zoneDayOfMonth);
      console.log('zone time: ' + zoneMoment.format());
      if (zoneDayOfWeek
      console.log('----');
    }
  }
  console.log('moment: ' + moment().format());
  console.log('   utc: ' + moment().utc().format());
}

console.log('Hello, World!');

// db.connectToDb();

// hello1();
// hello2();
hello3();

console.log('bye!');



var debug = require('debug')('test:openphish');

require('../td_common/libs/config');
// connect to DB
// var db = require('../td_common/libs/db');
// db.connectToDb();

var User = require('../models/user');
var UrlStatus = require('../models/urlstatus');

var eventStream = require('event-stream');
var request = require('request');

// function check (callback) {
//   //request({ url: 'https://openphish.com/feed.txt', encoding: null })
//   request({ url: 'https://openphish.com/feed.txt' })
//     .pipe(eventStream.split())
//     .pipe(eventStream.map(function (line, mapCallback) {
//       debug('line: ' + line);
//         mapCallback(null, null);
//         // mapCallback(err, line);
//     }))
//     .on("error", function (err){
//       debug('err: ' + err);
//       return callback(err);
//     })
//     .on("end", function (){
//       debug('parse end');
//         return callback(null);
//     });
// }


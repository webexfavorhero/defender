var mongoose = require('mongoose');
var nconf = require('nconf');

var log = require('./log');


var connected = false;

function connectToDb (callback) {
  var db = nconf.get("app:mongodb");
  log.info("Connecting to DB: " + db);
	mongoose.connect(db, function (err, res) {
		if (err) {
	 		log.error('connecting to DB error: ' + err);
		} else {
      connected = true;
    }
		if (callback) callback(err, res);
	});
}
exports.connectToDb = connectToDb;

exports.dbClose = function (err) {
	if (err) {
		log.error(err);
	}
	mongoose.connection.close();
  connected = false;
};

exports.isConnect = function () {
  return (connected && mongoose.connection.readyState ? true : false);
};


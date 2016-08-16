var debug = require('debug')('mail');

var nconf = require('nconf');
var sendgrid = require("sendgrid")(nconf.get("sendgrid:user"), nconf.get("sendgrid:key"));
var nodemailer = require('nodemailer');

var log = require('../td_common/libs/log');


exports.send = function (mailOptions, callback) {

  mailService = nconf.get("mail:service");

  if (mailService == "sendgrid") {

    var email = new sendgrid.Email();
    email.addTo(mailOptions.to);
    email.setFrom(mailOptions.from);
    email.setSubject(mailOptions.subject);
    email.setHtml(mailOptions.html);

    sendgrid.send(email, function(err, json) {
      debug("sendgrid: send mail to: " + mailOptions.to +
            " result: " + JSON.stringify(json));
      if (err) {
        return log.error("Sendgrid error: " + err);
      }
      if (callback) {
        callback(error, JSON.stringify(json));
      }
    });

  } else if (mailService == "nodemailer") {

    var transporter = nodemailer.createTransport(nconf.get("nodemailer"));
    transporter.sendMail(mailOptions, function(error, info){
      if(error) {
          log.error("Nodemailer error: " + error);
      } else {
          debug("nodemailer: sent mail to: " + mailOptions.to +
                " result: " + info.response);
      }
      if (callback) {
        callback(error, info);
      }
    });

  } else {
    var error = "Unknown mail service: " + mailService;
    log.error(error);
    if (callback) {
      callback(error);
    }
  }
};


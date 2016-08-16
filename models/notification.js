var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var NotificationSchema = new mongoose.Schema({

  urlStatusId: { type: ObjectId, required: true, ref: 'UrlStatus' },
  userId: { type: ObjectId, required: true, ref: 'User' },
  contactId: { type: ObjectId, required: true },

  active: { type: Boolean, default: true, required: true },
  createdAt: { type: Date, required: true },
  deactivatedAt: Date,

  resolved: { type: Boolean, default: false, required: true },
  resolvedAt: Date,
  resolveToken: { type: String, unique: true },

  emailSentAt: [Date],
  smsSentAt: [Date],

  statusType: String,
  oldStatus: String,
  newStatus: String

});


var Notification = mongoose.model('Notification', NotificationSchema);

module.exports = exports = Notification;


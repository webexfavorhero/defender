var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var TrafficSchema = new mongoose.Schema({

  urlStatusId: { type: ObjectId, required: true, ref: 'UrlStatus' },
  userId: { type: ObjectId, required: true, ref: 'User' },

  visitKey: { type: String, required: true },

  visitAt: Date,
  acceptAt: Date,
  visitorIp: String,
  apiVersion: String,
  userAgent: String,
  refererUrl: String,
  loadedAfterMs: Number,
  closedAfterMs: Number,
});


var Traffic = mongoose.model('Traffic', TrafficSchema);

module.exports = exports = Traffic;


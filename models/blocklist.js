var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BlocklistSchema = new Schema({

  url: { type: String, unique: true, required: true },
  monitors: {
    phishtank: {
      flagged: { type: Boolean, default: false },
      updating: { type: Boolean, default: false },
      details: Schema.Types.Mixed,
    },
    openphish: {
      flagged: { type: Boolean, default: false },
      updating: { type: Boolean, default: false },
      details: Schema.Types.Mixed,
    },
    cleanmxPhishing: {
      flagged: { type: Boolean, default: false },
      updating: { type: Boolean, default: false },
      details: Schema.Types.Mixed,
    },
    cleanmxMissused: {
      flagged: { type: Boolean, default: false },
      updating: { type: Boolean, default: false },
      details: Schema.Types.Mixed,
    },
    cleanmxMalware: {
      flagged: { type: Boolean, default: false },
      updating: { type: Boolean, default: false },
      details: Schema.Types.Mixed,
    },
    malwaredomainlist: {
      flagged: { type: Boolean, default: false },
      updating: { type: Boolean, default: false },
      details: Schema.Types.Mixed,
    },
    wot: {
      flagged: { type: Boolean, default: false },
      updating: { type: Boolean, default: false },
      details: Schema.Types.Mixed,
    },
  }

});


var Blocklist = mongoose.model('Blocklist', BlocklistSchema);

module.exports = exports = Blocklist;


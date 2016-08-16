var debug = require('debug')('urlstatus');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var _ = require('lodash');
var nconf = require('nconf');

var websockets = require('../libs/websockets');


var UrlStatusSchema = new Schema({

  userId: { type: ObjectId, required: true, ref: 'User' },

  url: { type: String, required: true },

  active: { type: Boolean, default: true },
  name: { type: String, required: true },
  dateAdded: { type: Date, required: true },
  contactIds: { type: [ObjectId], required: true },

  //TODO: redirectUrls: [String],

  key: { type: String, required: true, unique: true },

  switches: {
    flag: { type: Boolean, default: false, required: true },
    server: { type: Boolean, default: false, required: true },
    traffic: { type: Boolean, default: false, required: true },
  },

  monitors: {
    safebrowsing_lookup: {
      status: { type: String, default: ""},
      dateChanged: Date,
      hits: {
        day: { type: Number, default: 0, required: true },
        week: { type: Number, default: 0, required: true },
        month: { type: Number, default: 0, required: true },
        allTime: { type: Number, default: 0, required: true },
        lastAt: Date,
      },
      details: Schema.Types.Mixed,
    },
    servermon: {
      status: { type: String, default: ""},
      dateChanged: Date,
      hits: {
        day: { type: Number, default: 0, required: true },
        week: { type: Number, default: 0, required: true },
        month: { type: Number, default: 0, required: true },
        allTime: { type: Number, default: 0, required: true },
        lastAt: Date,
      },
      details: Schema.Types.Mixed,
    },
    trafficmon: {
      status: { type: String, default: ""},
      dateChanged: Date,
      hits: {
        day: { type: Number, default: 0, required: true },
        week: { type: Number, default: 0, required: true },
        month: { type: Number, default: 0, required: true },
        allTime: { type: Number, default: 0, required: true },
        lastAt: Date,
      },
      details: Schema.Types.Mixed,

      // exclusive fields for trafficmon:
      visitorInterval: { type: Number, default: 0, required: true },
      lastVisitAt: Date,
    },
    safebrowsing_go: {
      status: { type: String, default: ""},
      dateChanged: Date,
      hits: {
        day: { type: Number, default: 0, required: true },
        week: { type: Number, default: 0, required: true },
        month: { type: Number, default: 0, required: true },
        allTime: { type: Number, default: 0, required: true },
        lastAt: Date,
      },
      details: Schema.Types.Mixed,
    },
    phishtank: {
      status: { type: String, default: ""},
      dateChanged: Date,
      hits: {
        day: { type: Number, default: 0, required: true },
        week: { type: Number, default: 0, required: true },
        month: { type: Number, default: 0, required: true },
        allTime: { type: Number, default: 0, required: true },
        lastAt: Date,
      },
      details: Schema.Types.Mixed,
    },
    openphish: {
      status: { type: String, default: ""},
      dateChanged: Date,
      hits: {
        day: { type: Number, default: 0, required: true },
        week: { type: Number, default: 0, required: true },
        month: { type: Number, default: 0, required: true },
        allTime: { type: Number, default: 0, required: true },
        lastAt: Date,
      },
      details: Schema.Types.Mixed,
    },
    cleanmx: {
      status: { type: String, default: ""},
      dateChanged: Date,
      hits: {
        day: { type: Number, default: 0, required: true },
        week: { type: Number, default: 0, required: true },
        month: { type: Number, default: 0, required: true },
        allTime: { type: Number, default: 0, required: true },
        lastAt: Date,
      },
      details: Schema.Types.Mixed,
    },
    malwaredomainlist: {
      status: { type: String, default: ""},
      dateChanged: Date,
      hits: {
        day: { type: Number, default: 0, required: true },
        week: { type: Number, default: 0, required: true },
        month: { type: Number, default: 0, required: true },
        allTime: { type: Number, default: 0, required: true },
        lastAt: Date,
      },
      details: Schema.Types.Mixed,
    },
    wot: {
      status: { type: String, default: ""},
      dateChanged: Date,
      hits: {
        day: { type: Number, default: 0, required: true },
        week: { type: Number, default: 0, required: true },
        month: { type: Number, default: 0, required: true },
        allTime: { type: Number, default: 0, required: true },
        lastAt: Date,
      },
      details: Schema.Types.Mixed,
    },
  },

  deleted: { type: Boolean, default: false, required: true },
  deletedAt: Date,

});

UrlStatusSchema.methods.resetDayHits = function () {
  for (var mon in this.monitors.toObject()) {
    this.monitors[mon].hits.day = 0;
  }
};

UrlStatusSchema.methods.resetWeekHits = function () {
  for (var mon in this.monitors.toObject()) {
    this.monitors[mon].hits.week = 0;
  }
};

UrlStatusSchema.methods.resetMonthHits = function () {
  for (var mon in this.monitors.toObject()) {
    this.monitors[mon].hits.month = 0;
  }
};

UrlStatusSchema.methods.getMonitor = function (monitorId) {
  return this.monitors[monitorId];
};

UrlStatusSchema.methods.getMonitorStatus = function (monitorId) {
  return this.monitors[monitorId].status;
};

UrlStatusSchema.methods.incMonitorHits = function (monitorId) {
  var monitor = this.monitors[monitorId];
  monitor.hits.day++;
  monitor.hits.week++;
  monitor.hits.month++;
  monitor.hits.allTime++;
  monitor.hits.lastAt = Date.now();
};

UrlStatusSchema.methods.getMonitorsByType = function (monitorType) {
  var monitorsWithType = [];
  var allMonitors = this.monitors.toObject();
  for (var mon in allMonitors) {
    if (monitorType === nconf.get('monitors:' + mon + ':type')) {
      monitorsWithType[mon] = allMonitors[mon];
      monitorsWithType[mon]._conf_options = nconf.get('monitors:' + mon);
    }
  }
  return monitorsWithType;
};

UrlStatusSchema.methods.getMonitorTypeCounters =
                                      function (monitorType, checkModified) {
  var current = 0;
  var total = 0;
  var modified = false;
  for (var mon in this.monitors.toObject()) {
    if (monitorType === nconf.get('monitors:' + mon + ':type')) {
      if (this.isModified('monitors.' + mon + '.status')) {
        modified = true;
      }
      if (this.monitors[mon].status !== 'ok' &&
          this.monitors[mon].status !== '') {
        current++;
      }
      total++;
    }
  }
  if (checkModified && !modified) {
    return undefined;
  }
  return { current: current, total: total };
};

UrlStatusSchema.methods.getLatestNotification = function (checkModified) {
  var lastNotifications = [];
  for (var mon in this.monitors.toObject()) {
    if (!checkModified ||
       (checkModified && this.isModified('monitors.' + mon + '.dateChanged'))){
      var monitorType = nconf.get('monitors:' + mon + ':type');
      var type;
      if (monitorType === 'flag') { type = 0; }
      else if (monitorType === 'server') { type = 1; }
      else if (monitorType === 'traffic') { type = 2; }
      lastNotifications.push({ type: type,
                               at: this.monitors[mon].dateChanged });
    }
  }
  var latestNotification;
  if (lastNotifications.length > 0) {
    latestNotification = _.max(lastNotifications, 'at');
    debug('modifed latestNotification type: ' + latestNotification.type +
                                     ', at: ' + latestNotification.at);
  }
  return latestNotification;
};

UrlStatusSchema.pre('save', function (next) {
  debug('us pre save');
  var us = this;
  debug('us: ' + JSON.stringify(us));

  if (us.isModified('deleted') && us.deleted) {
    debug('remove us: ' + JSON.stringify(us));
    var removeSlots = [{
      _id: us._id,
      _nm: us.name,
      _url: us.url,
    }];
    websockets.emitToUser(us.userId, 'remove slots', removeSlots);
    return next();
  }

  var slot = {};
  if(us.isModified('name')) {
    debug('modified name: ' + us.name);
    slot._nm = us.name;
  }
  if (us.isModified('url')) {
    debug('modified url: ' + us.url);
    slot._url = us.url;
  }
  if (us.isModified('dateAdded')) {
    debug('modifed dateAdded: ' + us.dateAdded);
    slot._ad = us.dateAdded;
  }

  if (us.isModified('active')) {
    debug('modifed active: ' + us.active);
    slot.msw = us.active ? 1 : 0;
  }
  if (us.isModified('switches.flag')) {
    debug('modifed switches.flag: ' + us.switches.flag);
    slot.fsw = us.switches.flag ? 1 : 0;
  }
  if (us.isModified('switches.server')) {
    debug('modifed switches.server: ' + us.switches.server);
    slot.ssw = us.switches.server ? 1 : 0;
  }
  if (us.isModified('switches.traffic')) {
    debug('modifed switches.traffic: ' + us.switches.traffic);
    slot.tsw = us.switches.traffic ? 1 : 0;
  }

  var flagCounters = us.getMonitorTypeCounters('flag', true);
  if (flagCounters) {
    debug('current flag counters: ' + flagCounters.current);
    debug('total flag counters: ' + flagCounters.total);
    slot.fms = flagCounters.current;
    slot.ftb = flagCounters.total;
  }
  if (us.isModified('monitors.servermon.status')) {
    debug('modifed monitors.servermon: ' + us.monitors.servermon.status);
    slot.sms = us.monitors.servermon.status;
  }
  if (us.isModified('monitors.trafficmon.status')) {
    debug('modifed monitors.trafficmon.status: ' +
                                               us.monitors.trafficmon.status);
    slot.tms = us.monitors.trafficmon.status === 'ok' ? 1 : 0;
  }

  if (us.isModified('monitors.trafficmon.hits.allTime')) {
    debug('modifed monitors.trafficmon.hits.allTime: ' +
                                         us.monitors.trafficmon.hits.allTime);
    slot.tc = us.monitors.trafficmon.hits.allTime;
  }
  if (us.isModified('monitors.trafficmon.lastVisitAt')) {
    debug('modifed monitors.trafficmon.lastVisitAt: ' +
                                          us.monitors.trafficmon.lastVisitAt);
    slot._lv = us.monitors.trafficmon.lastVisitAt;
  }
  if (us.isModified('monitors.trafficmon.visitorInterval')) {
    debug('modifed monitors.trafficmon.visitorInterval: ' +
                                      us.monitors.trafficmon.visitorInterval);
    slot._to = us.monitors.trafficmon.visitorInterval;
  }

  if (us.isModified('contactIds')) {
    debug('modifed contactId: ' + us.contactIds);
    slot._co = us.contactIds;
  }

  var latestNotification = this.getLatestNotification(true);
  if (latestNotification) {
    slot.nti = latestNotification.type;
    slot.ntd = latestNotification.at;
  }


  if (!_.isEmpty(slot)) {
    slot._id = us._id;
    debug('emit to user: ' + JSON.stringify(slot));
    debug('-----> us.userId = '+us.userId);
    websockets.emitToUser(us.userId, 'update dashboard', {s: [slot]});
  }

  next();
});

UrlStatusSchema.post('save', function (us) {
  debug('us post save');
  debug('us: ' + JSON.stringify(us));

});

UrlStatusSchema.post('remove', function (us) {
  debug('us post remove');
  debug('us: ' + JSON.stringify(us));
  var removeSlots = [{
    _id: us._id,
    _nm: us.name,
    _url: us.url,
  }];
  websockets.emitToUser(us.userId, 'remove slots', removeSlots);
});


var UrlStatus = mongoose.model('UrlStatus', UrlStatusSchema);

module.exports = exports = UrlStatus;


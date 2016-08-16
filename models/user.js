var debug = require('debug')('user');

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var nconf = require('nconf');
var _ = require('lodash');

var websockets = require('../libs/websockets');


var SALT_WORK_FACTOR = 10;

var ContactSchema = new mongoose.Schema({
  name: { type: String, unique: false, required: true },
  email: String,   // if empty, no email notification
  phone: String,   // if empty, no sms notification
  notificationFrequency: { type: String, default: "0", required: true }
});

ContactSchema.pre('save', function (next) {
  if ('invalid' == this.name) return next(new Error('Invalid ContactSchema'));
  var user = this.parent();
  var contact = this;

  var co = {};
  if (contact.isModified('name')) {
    co.nm = contact.name;
  }
  if (contact.isModified('phone')) {
    co.ph = contact.phone;
  }
  if (contact.isModified('email')) {
    co.em = contact.email;
  }
  if (contact.isModified('notificationFrequency')) {
    var frequencies = nconf.get('notifier:frequencies');
    var frequency = _.find(frequencies,
                           { 'value': contact.notificationFrequency });
    debug('frequency: ' + JSON.stringify(frequency));
    co.nf = frequency.id;
    debug('co.nf: ' + co.nf);
  }
  if (!_.isEmpty(co)) {
    co._id = contact._id;
    debug('co: ' + JSON.stringify(co));
    websockets.emitToUser(user._id, 'update dashboard', {co: [co]});
  }

  next();
});

ContactSchema.post('remove', function (contact) {
  var user = this.parent();
  var removeContacts = [{
    _id: contact._id,
    nm: contact.name,
  }];
  websockets.emitToUser(user._id, 'remove contacts', removeContacts);
});

var ServiceSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  agreementId: { type: String, required: true },
});


var UserSchema = new mongoose.Schema({

  // fields for login/registration
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  isAdmin: { type: Boolean, default: false },

  // additional fields
  username: { type: String, required: true },
  phone: String,
  createdAt: { type: Date, required: true },
  timezone: String,

  // funds
  plan: { type: String, default: 'free', required: true },
  trial: { type: Boolean, default: false, required: true },
  paid: { type: Boolean, default: false, required: true },
  extraSlots: { type: Number, default: 0 },
  sms: { type: Number, default: 0 },

  paypal: {
    // current plan billing agreement and services
    agreementId: String,
    services: [ ServiceSchema ],

    // for upgrade user plan
    agreementToken: String,
    newPlan: String,

    // for sale products (ex. sms packages) to user
    paymentToken: String,
    saleProduct: String,

    // for subscribe user to services (ex. extra slots)
    serviceAgreementToken: String,
    addService: String,
  },

  contacts: [ ContactSchema ],

  billing: {
    firstName: String,
    middleName: String,
    lastName: String,
    company: String,
    address: String,
    address2: String,
    city: String,
    state: String,
    postalCode: String,
    countryCode: String
  },

  // for remember me
  accessToken: { type: String },

  // for reset password
  resetPasswordToken: String,
  resetPasswordExpires: Date,

});

UserSchema.virtual('planOptions').get( function getPlanOptions () {
  return nconf.get('plans:' + this.plan);
});

UserSchema.virtual('slots').get( function getPaid () {
  var slots = this.planOptions.slots;
  if (this.extraSlots) {
    slots += this.extraSlots;
  }
  return slots;
});

UserSchema.methods.getMainContact = function () {
  return this.contacts.create({ name: this.username,
                                email: this.email,
                                phone: this.phone,
                                notificationFrequency: 0
                              });
};

UserSchema.methods.getContact = function (contactId) {
  var contact;
  if (contactId) {
    contact = this.contacts.id(contactId);
  }
  if (!contact) {
    contact = this.getMainContact();
  }
  return contact;
};

UserSchema.pre('save', function (next) {
  debug('save');
  var user = this;

  var profile = {};
  if (user.isModified('email')) {
    profile.em = user.email;
  }
  if (user.isModified('username')) {
    profile.un = user.username;
  }
  if (user.isModified('phone')) {
    profile.ph = user.phone;
  }
  if (user.isModified('createdAt')) {
    profile.ca = user.createdAt;
  }
  if (user.isModified('timezone')) {
    profile.tz = user.timezone;
  }
  if (user.isModified('plan')) {
    profile.pl = user.plan;
  }
  if (user.isModified('trial')) {
    profile.tr = user.trial;
  }
  if (user.isModified('paid')) {
    profile.pd = user.paid ? 1 : 0;
  }
  if (user.isModified('sms')) {
    profile.sm = user.sms;
  }
  if (user.isModified('extraSlots')) {
    profile.es = user.extraSlots;
  }
  if (user.isModified('billing.firstName')) {
    profile.fn = user.billing.firstName;
  }
  if (user.isModified('billing.middleName')) {
    profile.mn = user.billing.middleName;
  }
  if (user.isModified('billing.lastName')) {
    profile.ln = user.billing.lastName;
  }
  if (user.isModified('billing.company')) {
    profile.cm = user.billing.company;
  }
  if (user.isModified('billing.address')) {
    profile.ad = user.billing.address;
  }
  if (user.isModified('billing.address2')) {
    profile.a2 = user.billing.address2;
  }
  if (user.isModified('billing.city')) {
    profile.ci = user.billing.city;
  }
  if (user.isModified('billing.state')) {
    profile.st = user.billing.state;
  }
  if (user.isModified('billing.postalCode')) {
    profile.pc = user.billing.postalCode;
  }
  if (user.isModified('billing.countryCode')) {
    profile.cc = user.billing.countryCode;
  }

  if (!_.isEmpty(profile)) {
    debug('profile updates: ' + JSON.stringify(profile));
    websockets.emitToUser(user._id, 'profile updates', profile);
  }

  // Bcrypt middleware
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Password verification
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = exports = User;


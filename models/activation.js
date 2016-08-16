var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var ActivationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true},
  hashedEmail: { type: String, required: true, unique: true },
  verified: Boolean,
  createdAt: { type: Date, expires: '2h' }
});

ActivationSchema.pre('save', function(next) {
  var _status = this;

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(_status.email, salt, function(err, hash) {
      if(err) return next(err);
      _status.hashedEmail = hash;
      next();
    });
  });
});

var Activation = mongoose.model('Activation', ActivationSchema);


module.exports = exports = Activation;


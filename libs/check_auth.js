var debug = require('debug')('auth');

module.exports = function (req, res, next) {
  debug("checkAuth: req.user: " + JSON.stringify(req.user));
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};


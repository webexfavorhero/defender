var debug = require('debug')('checkadmin');

module.exports = function (req, res, next) {
  debug("checkAdmin for " + req.user.email + ": " +
                                      req.user.isAdmin ? "Admin" : "user");
  if (req.user.isAdmin) {
    next();
  } else {
    res.send('Just for Admins');
  }
};


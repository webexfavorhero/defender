var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('privacy', { title: "Privacy",
                          flashMessage: req.flash('error') });
});


module.exports = router;


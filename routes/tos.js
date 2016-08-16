var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('tos', { title: "Terms Of Service",
                      flashMessage: req.flash('error') });
});


module.exports = router;


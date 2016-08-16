var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index2', { flashMessage: req.flash('error') });
});


module.exports = router;


var express = require('express');
var router = express.Router();

/* GET home page - redirect to courses */
router.get('/', function(req, res, next) {
  res.redirect('/courses');
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/last.txt', function(req, res, next) {
  let time = new Time();
  res.send({time});
});

module.exports = router;

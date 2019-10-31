var express = require('express');
var router = express.Router();

var zapme = require('../whatsapp');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',page: zapme.getPage().target._target});
});

module.exports = router;

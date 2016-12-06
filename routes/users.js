var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (req.session.logged) {
  	res.send('respond with a resource');
	} else {
		res.render('index');
	}
});

module.exports = router;

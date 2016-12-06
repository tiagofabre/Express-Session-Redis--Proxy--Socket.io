var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signin', function (req, res, next) {
  const login = req.body.login
  const password = req.body.password

  req.session.logged = true
  res.redirect('/users')  
})

module.exports = router;

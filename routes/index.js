const express = require('express');

const router = express.Router();

const middlewares = require('./middlewares');

/* GET home page. */

router.get('/', middlewares.anonRoute, (req, res, next) => {
  res.render('auth/login', { errorMessage: req.flash('error') });
});


module.exports = router;

const express = require('express');

const router = express.Router();

const middlewares = require('../middlewares');

/* GET home page. */

router.get('/', middlewares.anonRoute, (req, res, next) => {
  res.render('user/login', { errorMessage: req.flash('error') });
});


module.exports = router;

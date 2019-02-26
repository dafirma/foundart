const express = require('express');

const router = express.Router();
const User = require('../models/user');

const mwAuth = require('./middlewares');

/* GET home page. */

router.get('/', (req, res, next) => {
  res.render('auth/login');
});

module.exports = router;

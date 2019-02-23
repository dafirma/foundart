const express = require('express');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;
const router = express.Router();
const User = require('../models/user');
const mwAuth = require('./middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/user/signup', mwAuth.anonRoute, (req, res, next) => {
  res.render('auth/signup'/*, { errorMessage: req.flash('error') }*/);
});

module.exports = router;

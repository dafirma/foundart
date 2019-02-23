const express = require('express');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;
const router = express.Router();
const User = require('../../models/user');

/* GET signup form */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

/* CREATE USER */
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass,
  })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

/* GET LOGIN FORM */

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

/* LOGGIN USER */

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/login', () => {
      console.log('Please enter both, username and password to sign up.');
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('auth/login', () => {
          console.log('Please enter both, username and password to sign up.');
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth/login', () => {
          console.log('Please enter both, username and password to sign up.');
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// LOGOUT

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;

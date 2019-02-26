const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../../models/user');
const middlewares = require('../middlewares');

const bcryptSalt = 10;
const router = express.Router();


/* GET signup form */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

/* CREATE USER */
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  
  if (username === '' || password === '') {
    req.flash('error', 'campos vacios');
    return res.redirect('/signup');
  }
  User.findOne({ username })
    .then((user) => {
      if (user) {
        req.flash('error', 'el usuario no existe');
        
        res.redirect('/signup');

      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
        User.create({
          username,
          password: hashPass,
        })
          .then(() => {
            req.flash('success', 'Usuario creado');
            res.redirect('/');
          })
          .catch((error) => {
            next(error);
          });
      }
    })
    .catch((error) => {
      next(error);
    });
});

/* LOGGIN USER */

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    req.flash('error', 'campos vacios');
    res.redirect('/');
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        req.flash('error', 'usuario o contraseña incorrectos');
        res.redirect('/');
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        req.flash('success', 'usuario logeado correctamente');
        res.redirect('/main');
      } else {
        req.flash('error', 'usuario o contraseña incorrectos');
        res.redirect('/');
      }
    })
    .catch((error) => {
      next(error);
    });
});

// LOGOUT

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    req.flash('success', 'Sesión cerrada');
    res.redirect('auth/login');
  });
});

module.exports = router;

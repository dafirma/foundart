const express = require('express');
const bcrypt = require('bcrypt');

const moment = require('moment');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const middlewares = require('../middlewares');
const geo = require('../middlewares/geo');
const bcryptSalt = 10;
const router = express.Router();


/* GET signup form */
router.get('/signup', middlewares.anonRoute, (req, res, next) => {
  res.render('user/signup', {
    errorMessage: req.flash('error'),
  });
});

/* CREATE USER */
router.post('/signup', middlewares.anonRoute, (req, res, next) => {
  const {
    name,
    lastName,
    username,
    telephone,
    email,
    street,
    number,
    zipcode,
    city,
    country,
    lat,
    long,
    password,
  } = req.body;


  if (username === '' || password === '') {
    req.flash('error', 'Empty fields');
    return res.redirect('/signup');
  }
  User.findOne({
    username,
  })
    .then((user) => {
      if (user) {
        req.flash('error', 'User do not exist');
        res.redirect('/signup');
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
        User.create({
          name,
          lastName,
          username,
          telephone,
          email,
          address: {
            street,
            number,
            zipcode,
            city,
            country,
          },
          loc: {
            type: 'Point',
            coordinates: [long, lat],
          },
          password: hashPass,
        })
          .then(() => {
            req.flash('success', 'User created');
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

router.post('/login', middlewares.anonRoute, (req, res, next) => {
  const {
    username,
    password,
  } = req.body;

  if (username === '' || password === '') {
    req.flash('error', 'no empty fields');
    res.redirect('/');
    return;
  }

  User.findOne({
    username,
  })
    .then((user) => {
      if (!user) {
        req.flash('error', 'user or password wrong.');
        res.redirect('/');
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!

        req.session.currentUser = user;
        console.log(user.username);

        req.flash('success', `welcome, ${user.username}`);
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
    // req.flash('success', 'Sesión cerrada correctamente');  LA SESIÓN SE BORRA!!
    res.redirect('/');
  });
});

// MESSAGE

router.post('/message', (req, res, next) => {
  const userID = req.session.currentUser;
  const { owner } = req.body;
  const { articleId } = req.body;
  const { objOwner } = req.body;
  
  // console.log(date);
  console.log(`owner obj:' ${objOwner}`);
  console.log(`current user:${userID.username}`);
  // console.log(owner);
  // console.log( articleId); ok 
  User.findById(owner)
    .then((owner) => {
      // console.log(owner);
      // console.log(owner.username);
      // console.log(userID);
      // console.log(articleId);
      res.render('user/message', {
        owner, userID, articleId, objOwner,
      });
    })
    .catch((error) => {
      next(error);
    });
});
router.post('/message/send', (req, res, next) => {
  const userID = req.session.currentUser._id;
  const { text, dest } = req.body;
  const date = moment().format();
  // console.log(`current user: ${userID}`);
  // console.log(`text:${text}`);
  // console.log(date);
  // console.log(`dest: ${dest}`);
  const user1 = userID;
  const user2 = dest;
  const sender = userID;
  console.log(sender);
  console.log(date);
  Conversation.create({ user1, user2 }, { $push: { text, sender, date } })
    .then((msg) => {
      console.log(msg);
      req.flash('success', 'Message sent');
      res.redirect('/');
    })
    .catch((error) => {
      console.log(error);
    });
});


// SHOW PROFILE

router.get('/:id', (req, res, next) => {
  const {
    id,
  } = req.params;
  User.findById(id)
    .then((user) => {
      res.render('user/show', {
        user,
      });
    })
    .catch((error) => {
      next(error);
    });
});

// UPDATE PROFILE
router.get('/:id/update', (req, res, next) => {
  const {
    id,
  } = req.params;

  User.findById(id)
    .then((user) => {
      res.render('user/update', {
        user,
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/test/test', (req, res, next) => {
  User.find({
    loc: {
      $near: {
        $maxDistance: 90000,
        $geometry: {
          type: 'Point',
          coordinates: [2, 41],
        },
      },
    },
  })
    .then((user) => {
      console.log(user);
    });
});
// UPDATE PROFILE
router.post('/update', (req, res, next) => {
  const {
    id,
    name,
    lastName,
    telephone,
    email,
    street,
    number,
    zipcode,
    city,
    country,
    oldPassword,
    password,
    passwordCompare,
  } = req.body;

  const userPass = req.session.currentUser.password;

  if (bcrypt.compareSync(oldPassword, userPass) && password !== passwordCompare) {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    User.findByIdAndUpdate(id, {
      name,
      lastName,
      telephone,
      email,
      address: {
        street,
        number,
        zipcode,
        city,
        country,
      },
      password: hashPass,
    })
      .then((user) => {
        req.flash('success', 'User updated');
        // eslint-disable-next-line no-underscore-dangle
        res.redirect(`/user/${user._id}`);
      })
      .catch((error) => {
        next(error);
      });
  } else {
    req.flash('error', 'old password incorrect');
    res.redirect('/');
  }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');

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
    // req.flash('success', 'Sesión cerrada correctamente');  LA SESIÓN SE BORRA!!
    res.redirect('/');
  });
});

// MESSAGE


router.post('/conv/message', (req, res, next) => {
  const {
    articleId, articleTitle, articleOwnerId,
    articleOwnerUsername,
  } = req.body;
  // console.log(articleId); ok
  // console.log('ok');
  // console.log(articleOwnerId);
  // console.log(articleOwnerId.username);
  // console.log(articleTitle); ok
  // res.redirect('/main');ok
  res.render('user/conversation', {
    articleOwnerUsername, articleId, articleOwnerId, articleTitle,
  });
});

router.get('/conversation', (req, res, next) => {
  console.log('ok');
  res.redirect('/main');
  // res.redirect('/user/message');
});
/*
router.post('/conv/send', (req, res, next) => {
  // const text = req.body.text;
  const abc = req.body.text;
  const user2 = req.body.articleOwnerId;
  const user1 = req.session.currentUser._id;
  // eslint-disable-next-line no-underscore-dangle
  //const message = { text };
  // const sender = user1;
  // console.log(text)
  )
    .then(() => {
      req.flash('sucess', 'Message sent');
      res.redirect('/main');
    })
    .catch((error) => {
      next(error);
    });
});
*/
// User.findById(articleOwnerId)
   // .then((owner) => {
     // console.log(owner);
     // res.redirect('/main');
    // });



router.get('/send', (req, res, next) => {
  res.render('/main');
});

router.get('/conv/message/show', (req, res, next) => {
  res.render('/');
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

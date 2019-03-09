/* eslint-disable no-underscore-dangle */
const express = require('express');
const moment = require('moment');
const Article = require('../models/article');
const User = require('../models/user');

const middlewares = require('../middlewares');

const app = express();

const router = express.Router();
router.use(middlewares.protectedRoute);

router.get('/', (req, res, next) => {
  const userID = req.session.currentUser._id;
  // Article.find({ userID })
  Article.find({ rent: { $elemMatch: { lesseeID: userID } } }).limit(1)
  // Article.find({ $and: [{rent:{elemMatch: {state: 'Accept'}}}, rent: { $elemMatch: { lesseeID: userID } } })
    .then((articles) => {
      res.render('main/dashboard',
        { articles, userID, successMessage: req.flash('success') });
    })
    .catch((error) => {
      next(error);
    });
});

// RENTS
router.get('/rents', (req, res, next) => {
  const userID = req.session.currentUser._id;
  Article.find({ userID })
    .then((articles) => {
      res.render('main/rents', { articles, userID });
    })
    .catch((error) => {
      next(error);
    });
});

// SEARCH
router.get('/search', (req, res, next) => {
  const currentUserId = req.session.currentUser;
  const {
    type, dateInitial, dateFinal, category,
  } = req.query;
  const ds = moment(dateInitial);
  const de = moment(dateFinal);
  const totalPrice = de.diff(ds, 'days');
  console.log('days: + ', totalPrice);
  const articles = [];
  if (dateInitial === '' || dateFinal === '') {
    req.flash('error', 'Date empty');
    res.redirect('/main');
  }
  if (dateInitial > dateFinal) {
    req.flash('error', 'No valid date');
    res.redirect('/main');
  }
  Article.find({ type, category }).populate('userID')
    .then((allarticles) => {
      /*
      allarticles.forEach((article) => {
        article.rent.forEach((rent) => {
          const dsrent = rent.dateStart;
          const derent = rent.dateEnd;
          if (dsrent > dateInitial && dsrent < dateFinal) {
            console.log('no disponible');
          } else if (derent > dateFinal && derent < dateFinal) {
            console.log('no disponible');
          } else {
            articles.push(rent);
          }
        });
      }); */
  
      res.render('main/search', {
        allarticles, currentUserId, dateFinal, dateInitial,
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

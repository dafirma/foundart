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
  if (dateInitial === '' || dateFinal === '') {
    req.flash('error', 'Date empty');
    res.redirect('/main');
  }
  if (dateInitial > dateFinal) {
    req.flash('error', 'No valid date');
    res.redirect('/main');
  }
  const ds = moment(dateInitial).format();
  const de = moment(dateFinal).format();
  if (category === 'all' && type === 'all') {
    Article.find({
      $and: [{ rent: { $elemMatch: { dataStart: null, dataEnd: null } } },
        {
          $or: [{ rent: { $elemMatch: { dateStart: { $gt: de } } } },
            { rent: { $elemMatch: { dateEnd: { $lt: ds } } } }],
        }],
    })
      .then((allarticles) => {
        res.render('main/search', {
          allarticles, currentUserId, dateFinal, dateInitial,
        });
      })
      .catch((error) => {
        next(error);
      });
  } else if (category === 'all') {
    Article.find({
      $and: [{ type }, { rent: { $elemMatch: { dataStart: null, dataEnd: null } } },
        {
          $or: [{ rent: { $elemMatch: { dateStart: { $gt: de } } } },
            { rent: { $elemMatch: { dateEnd: { $lt: ds } } } }],
        }],
    }).then((allarticles) => {
      res.render('main/search', {
        allarticles, currentUserId, dateFinal, dateInitial,
      });
    })
      .catch((error) => {
        next(error);
      });
  } else if (type === 'all') {
    Article.find({
      $and: [{ category }, { rent: { $elemMatch: { dataStart: null, dataEnd: null } } },
        {
          $or: [{ rent: { $elemMatch: { dateStart: { $gt: de } } } },
            { rent: { $elemMatch: { dateEnd: { $lt: ds } } } }],
        }],
    }).then((allarticles) => {
      res.render('main/search', {
        allarticles, currentUserId, dateFinal, dateInitial,
      });
    })
      .catch((error) => {
        next(error);
      });
  } else {
    Article.find({
      $and: [{ type }, { category }, { rent: { $elemMatch: { dataStart: null, dataEnd: null } } },
        {
          $or: [{ rent: { $elemMatch: { dateStart: { $gt: de } } } },
            { rent: { $elemMatch: { dateEnd: { $lt: ds } } } }],
        }],
    })
      .then((allarticles) => {
        console.log(allarticles);
        res.render('main/search', {
          allarticles, currentUserId, dateFinal, dateInitial,
        });
      })
      .catch((error) => {
        next(error);
      });
  }
});

module.exports = router;

// eslint-disable-next-line max-len
// ok $or: [{ rent: { $elemMatch: { dateStart: { $gt: de } } } }, { rent: { $elemMatch: { dateEnd: { $lt: ds } } } }]

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

  Article.find({
    rent: {
      $elemMatch: {
        lesseeID: userID,
      },
    },
  }).limit(1)
    .then((articles) => {
      res.render('main/dashboard', {
        articles,
        userID,
        successMessage: req.flash('success'),
      });
    })
    .catch((error) => {
      next(error);
    });
});

// RENTS
router.get('/rents', (req, res, next) => {
  const userID = req.session.currentUser._id;
  Article.find({
    userID,
  })
    .then((articles) => {
      res.render('main/rents', {
        articles,
        userID,
      });
    })
    .catch((error) => {
      next(error);
    });
});

// SEARCH
router.get('/search', async (req, res, next) => {
  const currentUserId = req.session.currentUser;
  const usersId = [];
  const {
    type,
    dateInitial,
    dateFinal,
    category,
    distance,
    lat,
    long,
  } = req.query;

  const ds = moment(dateInitial).format();
  const de = moment(dateFinal).format();

  if (dateInitial === '' || dateFinal === '') {
    req.flash('error', 'Date empty');
    res.redirect('/main');
  }
  if (dateInitial > dateFinal) {
    req.flash('error', 'No valid date');
    res.redirect('/main');
  };
  try {
    const users = await User.find(
      {loc:
        {$geoWithin:
          { $centerSphere: [[long, lat], distance / 6378.1] },
        },
      },
    );
    
    users.forEach((user) => {
      usersId.push(user._id);
    });
  } catch (error) {
    next(error);
  }
  try {
    let allarticles;
    if (category === 'all' && type === 'all') {
      allarticles = await Article.find({
        $and: [
          { userID: { $in: usersId } },
          {
            $or: [
              { rent: { $size: 0 } },
              { rent: { $elemMatch: { dateStart: { $gt: de } } } },
              { rent: { $elemMatch: { dateEnd: { $lt: ds } } } }
            ],
          },
        ],
      });
    } else if (category === 'all') {
      allarticles = await Article.find({
        $and: [
          { userID: { $in: usersId } },
          { type },
          { rent: { $elemMatch: { dataStart: null, dataEnd: null } } },
          { $or: [
            { rent: { $size: 0 } },
            { rent: { $elemMatch: { dateStart: { $gt: de } } } },
            { rent: { $elemMatch: { dateEnd: { $lt: ds } } } }
          ]},
        ]},
      );
    } else if (type === 'all') {
      allarticles = await Article.find(
        { $and: [
          { userID: { $in: usersId } },
          { category },
          { $or: [
            { rent: { $size: 0 } },
            { rent: { $elemMatch: { dateStart: { $gt: de } } } },
            { rent: { $elemMatch: { dateEnd: { $lt: ds } } } }
          ]},
        ]},
      );
    } else {
      allarticles = await Article.find(
        { $and: [
          { userID: { $in: usersId } },
          { type },
          { category },
          { $or: [
            { rent: { $size: 0 } },
            { rent: { $elemMatch: { dateStart: { $gt: de } } } },
            { rent: { $elemMatch: { dateEnd: { $lt: ds } } } }
          ]},
        ]},
      );
    }
    res.render('main/search', {
      allarticles,
      currentUserId,
      dateFinal,
      dateInitial,
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;

// eslint-disable-next-line max-len
// ok $or: [{ rent: { $elemMatch: { dateStart: { $gt: de } } } }, { rent: { $elemMatch: { dateEnd: { $lt: ds } } } }]

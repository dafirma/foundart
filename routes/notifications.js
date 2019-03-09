/* eslint-disable no-underscore-dangle */
const express = require('express');

const Article = require('../models/article');
const middlewares = require('../middlewares');

const router = express.Router();
router.use(middlewares.protectedRoute);


// GET NOTIFICATIONS LIST
router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
  const userID = user._id;
  Article.find({ $and: [{ userID }, { rent: { $elemMatch: { state: 'In progress' } } }] })
    .then((articles) => {
      res.render('notifications/list', { articles, successMessage: req.flash('success') });
    })
    .catch((error) => {
      next(error);
    });
});

// GET NOTIFICATION DETAIL
router.get('/:articleId/:rentId', (req, res, next) => {
  const { articleId, rentId } = req.params;
  Article.findById(articleId)
    .then((article) => {
      res.render('notifications/show', { article, rentId });
    })
    .catch((error) => {
      next(error);
    });
});


// UPDATE STATE ACCEPTED OR REJECTED
router.post('/update', (req, res, next) => {
  const { articleId, rentId, state } = req.body;
  // Looks state and gives accepted or rejected value to 'value' variable
  let value;
  const val = () => {
    if (!state) {
      value = 'Rejected';
    } else if (state) {
      value = 'Accepted';
    }
    return value;
  };

  // Changes the state depending on the value of 'value' variable
  Article.findOneAndUpdate(
    { _id: articleId, rent: { $elemMatch: { _id: rentId } } },
    { $set: { 'rent.$.state': val() } },
  )
    .then(() => {
      req.flash('success', `Rent request ${value}`);
      res.redirect('/notifications');
    })
    .catch((error) => {
      next(error);
    });
});


module.exports = router;

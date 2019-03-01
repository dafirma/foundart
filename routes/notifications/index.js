const express = require('express');
const bcrypt = require('bcrypt');

const Article = require('../../models/article');
const middlewares = require('../middlewares');

const router = express.Router();


router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
  const userID = user._id;
  Article.find({ $and: [{ userID }, { rent: { $elemMatch: { state: 'In progress' } } }] })
    .then((articles) => {
      res.render('notifications/list', { articles });
    })
    .catch((error) => {
      next(error);
    });
});

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

router.get('/:articleId/:rentId/:state', (req, res, next) => {
  const { articleId, rentId, state } = req.params;
  let value;
  const val = () => {
    if (state === 'reject') {
      value = 'Rejected';
    } else if (state === 'accept') {
      value = 'Accepted';
    }
    return value;
  };

  Article.findOneAndUpdate(
    { _id: articleId, rent: { $elemMatch: { _id: rentId } } },
    { $set: { 'rent.$.state': val() } },
  )
    .then((art) => {
      res.redirect('/notifications');
    })
    .catch((error) => {
      next(error);
    });
});


module.exports = router;

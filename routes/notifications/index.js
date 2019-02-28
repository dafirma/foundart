const express = require('express');
const bcrypt = require('bcrypt');

const Article = require('../../models/article');
const middlewares = require('../middlewares');

const router = express.Router();


router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
  const userID = user._id;
  Article.find({$and: [{ userID }, { rent: { $elemMatch: { state: 'In progress' } } }] })
    .then((articles) => {
      res.render('notifications/list', { articles });
    })
    .catch((error) => {
      next(error);
    });
});



router.post('/:id/reject', (req, res, next) => {
 
});


module.exports = router;

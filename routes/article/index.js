const express = require('express');
const User = require('../../models/user');

const Article = require('../../models/article');

const router = express.Router();

/* GET new article */

router.get('/new', (req, res, next) => {
  res.render('article/new');
});

/* POST new article */
router.post('/new', (req, res, next) => {
  const {
    title, price, category, imageArticle, type, description,
  } = req.body;
  // const userID = req.session.currentUser._id;
  Article.create({
    title,
    price,
    category,
    imageArticle,
    type,
    description,
  })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

/* GET list article */
router.get('/article/list', (req, res, next) => {
  res.render('article/list');
});


module.exports = router;

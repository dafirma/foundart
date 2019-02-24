const express = require('express');
const Article = require('../../models/article');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('main/dashboard');
});

router.get('/search', (req, res, next) => {
  const { type, dateInitial, dateFinal } = req.query;
  Article.find({ type })
    .then((articles) => {
      res.render('main/search', { articles });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

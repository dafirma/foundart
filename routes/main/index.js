const express = require('express');
const Article = require('../../models/article');

const middlewares = require('../middlewares');

const app = express();

const router = express.Router();
router.use(middlewares.protectedRoute);

router.get('/', (req, res, next) => {
  const userID = req.session.currentUser._id;
  // Article.find({ userID })
  Article.find({ rent: { $elemMatch: { lesseeID: userID } } })
    .then((articles) => {
      console.log(articles);
      res.render('main/dashboard', { articles });
    })
    .catch((error) => {
      next(error);
    });
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

router.get('/test', (req, res, next) => {
  res.render('main/test');
});

module.exports = router;

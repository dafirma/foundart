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
  // Article.find({ $and: [{rent:{elemMatch: {state: 'Accept'}}}, rent: { $elemMatch: { lesseeID: userID } } })
    .then((articles) => {
      const objUser = req.session.currentUser.username;
      console.log(objUser.username);
      res.render('main/dashboard',
        { articles, userID, objUser, successMessage: req.flash('success') });
    })
    .catch((error) => {
      next(error);
    });
});
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

router.get('/search', (req, res, next) => {
  const { type, dateInitial, dateFinal } = req.query;
  console.log(dateFinal);
  if (dateInitial > dateFinal) {
    req.flash('error', 'No valid date');
    res.redirect('/main');
    return;
  }
  if (dateInitial === '' || dateFinal === '' ) {
    req.flash('error', 'Date empty');
    res.redirect('/main');
  }
  Article.find({ type })
    .then((articles) => {
      res.render('main/search', { articles });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

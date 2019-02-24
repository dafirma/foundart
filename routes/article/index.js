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
    title, price, category, imageArticle, type, description,
  })
    .then(() => {
      res.redirect('list');
    })
    .catch((error) => {
      next(error);
    });
});

/* GET list article */
router.get('/list', (req, res, next) => {
  Article.find()
    .then((articles) => {
      res.render('article/list', {
        articles
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Article.findById(id)
    .then((article) => {
      res.render('article/show', { article });
    })
    .catch((error) => {
      next(error);
    });
});

/* GET update article */
router.get('/:id/update', (req, res, next) => {
  const { id } = req.params;

  Article.findById(id)
    .then((article) => {
      res.render('article/update', { article });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/:id', (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    price,
    category,
    imageArticle,
    type,
    description,
  } = req.body;
  Article.findByIdAndUpdate(id, {
    title, price, category, imageArticle, type, description,
  })
    .then(() => {
      res.redirect('list');
    })
    .catch((error) => {
      next(error);
    });
});


router.post('/:id/request', (req, res, next) => {
  const { id } = req.params;
  const { dateStart, dateEnd } = req.body;
  const rent = {
    lesseeID: undefined,
    dateStart,
    dateEnd,
    state: 'In progress',
  };
  Article.findOneAndUpdate({ _id: id }, {
    $push: { rent },
  })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});


module.exports = router;
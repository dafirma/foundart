const express = require('express');
const multer = require('multer');
const moment = require('moment');
const uploadCloud = require('../config/cloudinary.js');
const middlewares = require('../middlewares');
const User = require('../models/user');

const upload = multer({ dest: './public/uploads/' });
const Article = require('../models/article');

const router = express.Router();
router.use(middlewares.protectedRoute);

/* GET new article */

router.get('/new', (req, res, next) => {
  res.render('article/new');
});

/* POST new article */
router.post('/new', uploadCloud.single('photo'), (req, res, next) => {
  const {
    title, price, category, photo, type, description, imgName,
  } = req.body;

  // Validation of empty fields
  if (title === '' || price === '' || category === ''
      || photo === '' || type === '' || description === '') {
    req.flash('error', 'Empty fields');
    res.redirect('/article/new');
  }

  // Set img url and name
  const imgPath = req.file.url;
  // const imgPath = `/uploads/${req.file.filename}`; to upload image local
  const originalName = req.file.originalname;

  // Set currrentUser as leessee
  const userID = req.session.currentUser._id;
  const lesseeID = userID;

  // Create
  Article.create({
    title, price, category, photo, imgPath, imgName, originalName, lesseeID, userID, type, description,
  })
    .then(() => {
      req.flash('success', 'Created new article');
      res.redirect('/article/list');
    })
    .catch((error) => {
      next(error);
    });
});


// FAVORITE


router.get('/favorites', (req, res, next) => {
  const userID = req.session.currentUser._id;
  User.findById(userID)
    .populate('favorite.articleID')
    .then((users) => {
      console.log(users);
      res.render('article/favorites', { users });
    })
    .catch((error) => {
      next(error);
    });
});


router.post('/favorites', (req, res, next) => {
  const userID = req.session.currentUser._id;
  const { articleId } = req.body;
  const favorite = { articleID: articleId };
  User.findOneAndUpdate({ _id: userID }, {
    $push: { favorite },
  })
    .then((user) => {
      // console.log('test');
      console.log(user);
      res.redirect('/main');
    })
    .catch((error) => {
      next(error);
    });
});
/*
router.get('/favtest', (req, res, next) => {
  const userID = req.session.currentUser._id;
  console.log(userID);
  res.render('/main');
});
*/


/* GET list article */
router.get('/list', (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  const currentUserId = req.session.currentUser._id;
  Article.find({ userID: currentUserId }).populate('userID')
    .then((articles) => {
      res.render('article/list', { articles, currentUserId, successMessage: req.flash('success') });
    })
    .catch((error) => {
      next(error);
    });
});


/*
router.get('/list/:page', (req, res, next) => {
  const userID = req.session.currentUser._id;
  const { page } = req.params;
  const perPage = 3;
  console.log(page);
  Article.find({ userID }).skip((perPage * page) - perPage).limit(perPage)
    .then((articles) => {
      res.render('article/list', { articles, successMessage: req.flash('success') });
    })
    .catch((error) => {
      next(error);
    });
});
*/


// GET single article
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Article.findById(id).populate('userID')
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

// UPDATE article
router.post('/update', (req, res, next) => {
  const {
    id, title, price, category, imageArticle, type, description,
  } = req.body;
  Article.findByIdAndUpdate(id, {
    title, price, category, imageArticle, type, description,
  })
    .then(() => {
      req.flash('success', 'Article updated');
      res.redirect('list');
    })
    .catch((error) => {
      next(error);
    });
});

/* DELETE article */
router.post('/delete', (req, res, next) => {
  const { articleId } = req.body;
  Article.findByIdAndDelete(articleId)
    .then(() => {
      req.flash('success', 'Article deleted');
      res.redirect('/article/list');
    })
    .catch((error) => {
      next(error);
    });
});

// Creates a rent request for the article
router.post('/request', (req, res, next) => {
  const {
    dateStart, dateEnd, articleId, articlePrice,
  } = req.body;
  const userID = req.session.currentUser;
  const ds = moment(dateStart);
  const de = moment(dateEnd);
  const totalPrice = (de.diff(ds, 'days')) * articlePrice;
  const rent = {
    lesseeID: userID,
    dateStart,
    dateEnd,
    state: 'In progress',
    totalPrice,
  };
  
  Article.findOneAndUpdate({ _id: articleId }, {
    $push: { rent },
  })
    .then(() => {
      req.flash('success', 'Article requested');
      res.redirect('/main');
    })
    .catch((error) => {
      next(error);
    });
});


/*
router.get('/favorites', (req, res, next) => {
  const userID = req.session.currentUser._id;
  User.findById({ userID })
    .then((favorite) => {
      console.log('hgghj');
      res.render('/articles/favorites', { favorite });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/fav', (req, res, next) => {
  const { articleId } = req.body;
  const userID = req.session.currentUser;
  const favorites = { articleID: articleId };
  console.log(articleId);
  console.log(userID.username);
  console.log(favorites);
  User.findOneAndUpdate({ _id: userID }, {
    $push: { favorite },
  })
    .then(() => {
      console.log();
      res.redirect('/main');
    })
    .catch((error) => {
      next(error);
    });
});
*/
module.exports = router;

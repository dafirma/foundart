const express = require('express');
const multer = require('multer');
const uploadCloud = require('../../config/cloudinary.js');

const User = require('../../models/user');


const upload = multer({ dest: './public/uploads/' });
const Article = require('../../models/article');

const router = express.Router();

/* GET new article */

router.get('/new', (req, res, next) => {
  res.render('article/new');
});

/* POST new article */
router.post('/new', uploadCloud.single('photo'), (req, res, next) => {
  const {
    title, price, category, photo, type, description,
  } = req.body;
  const imgPath = req.file.url;
  // const imgPath = `/uploads/${req.file.filename}`; to upload image local
  const { imgName } = req.body;
  const originalName = req.file.originalname;
  const user = req.session.currentUser;
  const userID = user._id;
  console.log(userID);
  

  Article.create({
    title, price, category, photo, imgPath, imgName, originalName, userID, type, description,
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
      res.render('article/list', { articles });
    })
    .catch((error) => {
      next(error);
    });
});

// GET single article
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

/* DELETE article */
router.post('/:id/delete', (req, res, next) => {
  const { id } = req.params;
  Article.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/article/list');
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
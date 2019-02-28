const createError = require('http-errors');
const flash = require('connect-flash');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const dotenv = require('dotenv');

const { notifications } = require('./routes/middlewares');

dotenv.load();

const notificationRouter = require('./routes/notifications');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/auth/user');
const articleRouter = require('./routes/article');
const mainRouter = require('./routes/main');


const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to mongo');
  })
  .catch((error) => {
    console.log(error);
  });

// view engine setup
app.use(sassMiddleware({
  src: path.join(__dirname, 'stylesheets'),
  dest: path.join(__dirname, 'stylesheets'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true, // true for .map; false no .map file
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sesions
app.use(session({
  secret: 'ironhack',
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});

app.use(notifications);
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/article', articleRouter);
app.use('/notifications', notificationRouter);
app.use('/main', mainRouter);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

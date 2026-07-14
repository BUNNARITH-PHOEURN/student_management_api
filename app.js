var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var courseRouter = require('./routes/course');
var authRoutes = require("./routes/authRoutes");
var authViewRoutes = require("./routes/authViewRoutes");
var requireAuth = require('./middleware/requireAuth');


var studentRouter = require('./routes/student');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Public routes: sign in and registration only.
app.use("/auth", authRoutes);
app.use("/", authViewRoutes);

// Every application route is protected individually. This prevents direct URL
// access such as /courses or /students before the user logs in.
app.use('/', requireAuth, indexRouter);
app.use('/users', requireAuth, usersRouter);
app.use('/courses', requireAuth, courseRouter);
app.use('/students', requireAuth, studentRouter);

// Do not reveal any other non-public application path to unauthenticated users.
app.use(requireAuth);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

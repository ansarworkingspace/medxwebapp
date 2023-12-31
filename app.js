var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload=require('express-fileupload')
var userRouter = require('./routes/user');
var nocache=require('nocache')
var adminRouter = require('./routes/admin');
var hbs=require('express-handlebars')
var db=require('./config/connection')
var session = require('express-session')
const handlebars= require('handlebars')

var app = express();
// const nodeFetch = require('node-fetch');
// import nodeFetch from 'node-fetch';
const nodemailer = require('nodemailer');




handlebars.registerHelper('gte', function (a, b) {
  return a >= b;
});

handlebars.registerHelper('subtract', function (a, b) {
  return a - b;
});

handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

handlebars.registerHelper('add', function (a, b) {
  return parseInt(a) + parseInt(b);
});

handlebars.registerHelper('times', function (n, block) {
  let accum = '';
  for (let i = 0; i < n; ++i) {
    accum += block.fn(i);
  }
  return accum;
});

handlebars.registerHelper('parseInt', function (value) {
  return parseInt(value);
});

handlebars.registerHelper('or', function () {
  const args = Array.prototype.slice.call(arguments, 0, -1);
  return args.some(Boolean);
});

handlebars.registerHelper('gt', function (a, b) {
  return a > b;
});

handlebars.registerHelper('lt', function (a, b) {
  return a < b;
});

handlebars.registerHelper('and', function () {
  const args = Array.prototype.slice.call(arguments, 0, -1);
  return args.every(Boolean);
});

// Define the "lte" helper
handlebars.registerHelper('lte', function (value1, value2, options) {
  if (value1 <= value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials/'
}));




app.use(express.json());
app.use(session({ secret: "key", resave:false, saveUninitialized: false,cookie:{maxAge:600000}}))
// app.use(function (req, res, next) { 
//   res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//    next(); });
app.use(nocache())
app.set('etag', false);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

db.connect((err)=>{
  if(err) console.log("Connection Error"+err);
 
  else  console.log("Database Connected");
})

app.use('/', userRouter);
app.use('/admin', adminRouter);








// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

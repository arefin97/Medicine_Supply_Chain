
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var validator = require('express-validator');
const date = require('date-and-time');

var csrf = require('csurf');
var csrfProtection=csrf();
//var enrollAdmin = require('./routes/functions/enrollAdmin');
//var registerUser = require('./routes/functions/registerUser');

var indexRouter = require('./routes/index');
var signUpRouter = require('./routes/signup');
var loginRouter = require('./routes/login');

var usersRouter = require('./routes/user');

var app = express();

// view engine setup

var hbs = exphbs.create({
  extname: 'hbs' ,
  defaultLayout: 'layout' ,
  layoutsDir: __dirname + '/views/layouts/' ,
  helpers: {

    concate: function(a , b){
      return a + b ;
    },

    print: function (a){
      return a;
    },
    if_eq: function(a, b, opts) {
      if (a == b) {
          return opts.fn(this);
      } else {
          return opts.inverse(this);
      }
  },
  get: function(kk){
    return kk;
  }

  }
});
app.engine('hbs',hbs.engine);
/*
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/',  helpers: {

  concate: function(a,b){
    return a+b ;
  },

  print: function (a){
    return a;
  }
}
}));*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');





// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//var memoryStore=new session.MemoryStore();

app.use(session({
 // secret: 'keyboard cat',
  secret: 'mySecret',

  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
  //store:memoryStore
}))


//hbs.registerHelper('concate', function(x , y, options) {
  //return x+y ;
//});


app.use(function(req, res, next) {
  res.locals.login = req.session.UId;
  res.locals.name = req.session.name;
 
  res.locals.userType = req.session.uType;
  res.locals.Img_Path = req.session.Img_Path;
  console.log("asche :",res.locals.login);
  //console.log("id peyechi: ",req.session);
  next();
});

/*app.use(function(req, res, next) {  
  app.locals.expreq = req;
  next();
})*/
//enrollAdmin();
//registerUser();

//app.use('/signup', signUpRouter);
//app.use('/login', loginRouter);
app.use('/user', usersRouter);
app.use('/', indexRouter);
app.use(csrfProtection);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

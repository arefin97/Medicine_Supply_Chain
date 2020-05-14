var express = require('express');
var router = express.Router();
var enrollAdmin = require('./functions/enrollAdmin');
var registerUser = require('./functions/registerUser');
var query = require('./functions/query');
var invoke= require('./functions/invoke');
var createUser= require('./functions/createUser');
var queryUser = require('./functions/queryUser');
var bodyParser = require('body-parser');

var app=require("../app");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: true });

function checkSignIn(req, res){
    if(req.session.name){
       next();     //If session exists, proceed to page
    } else {
       var err = new Error("Not logged in!");
       console.log(req.session.name);
       next(err);  //Error, trying to access unauthorized page!
    }
  }
  router.get('/click', checkSignIn, function(req, res){
    res.render('profile', {name: req.session.name});
  });
  
  router.get('/', function(req, res){
    //res.render('login',{csrfToken: req.csrfToken()});
    res.render('login');
 });
  router.post('/click',urlencodedParser,async function(req, res, next) {
      try{
    var result = await queryUser(req.body.email);
    
    //const ob=JSON.parse(obj);
     //res.send(result.toString());
  //var result = await queryUser(req.body.email);
  
    if(!req.body.email || !req.body.password){
       res.render('login', {message: "Please enter both email and password"});
    } else {
      var ob = JSON.parse(result);
      var x=ob.Email;
     console.log(x);
          if(ob.Email === req.body.email && ob.Password === req.body.password){
             req.session.name = ob.Name;
             req.session.id = ob.NID;
             res.redirect('profile');
          }
          else{
           req.session.error = true;
           //res.redirect('/user');
          res.render('login', {message: "Invalid credentials!"});
          }
    }
  }catch(error) {
    //res.status(error.response.status)
    return res.send(error.message);
 }

  });
  
  router.get('/logout', function(req, res){
    req.session.destroy(function(){
       console.log("user logged out.")
    });
    res.redirect('login');
  });


  //router.use('/profile', function(err, req, res, next){
  //console.log(err);
    //User should be authenticated! Redirect him to log in.
    //res.redirect('/login');
  //});
 module.exports=router;
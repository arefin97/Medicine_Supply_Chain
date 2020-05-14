
var express = require('express');
var router = express.Router();
var enrollAdmin = require('./functions/enrollAdmin');
var registerUser = require('./functions/registerUser');
var createMedicine = require('./functions/createMedicine');
var queryMedicine = require('./functions/queryMedicineById');
var queryAllMedicine=require('./functions/queryAllMedicine');
var bcrypt = require('bcrypt')
var groupBy=require('../routes/supportings/groupBy');
//var Product=require('../models/product')
var csrf = require('csurf');
var csrfProtection = csrf();

router.use(csrfProtection);

var app = require("../app");

function Product(name,company,cStage){
    
  this.Name = name;
  this.PCompany =  company;
  this.Currstage=cStage;
return this;
};

function makeid(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

/* GET home page. */
/*router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Cool, huh!', condition: true, anyArray: [1,2,3] });
  res.render('home');
});
*/
router.get('/',function(req,res,next){
  res.render('home/welcome',{ csrfToken:req.csrfToken() });
});

router.get('/enrollAdmin', function(req, res, next) {
   enrollAdmin();
   res.send('Admin created');
 });
 router.get('/registerUser', function(req, res, next) {
   registerUser();
   res.send('User created');
 });
 ////////
 router.get('/viewAllMedicine', async function (req, res, next) {
 // var successMsg = req.flash('success')[0];
  var result = await queryAllMedicine();
  /*
var ob = JSON.parse(result);

var products = [];

for(var x in products){
  products.push(ob[x]);
}
  */
 var ob = JSON.parse(result);
 var test=[];
 for (var i = 0; i < ob.length; i +=1) {

var Array = ob[i].Record;

test.push(Array);
//console.log(test);
//console.log(Array);
var Property = "Id";
var product = [];
product.push(new Product(Array.Name,Array.PCompany,Array.Currstage));
//var productById = groupBy(Array, Property); 
//console.log(productById);
//docs.push(productById);
//docs.push(Array);
 }
 //console.log(product);
 
 
    /*Product.find(function (err, docs) {
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize) {
          productChunks.push(docs.slice(i, i + chunkSize));
      }*/
      //console.log(productChunks);
     // console.log(docs);
      res.render('home/welcome', {title: Array.Type, products: test});
 // });
});

router.get('/insertMedicine', async function (req, res,next){
res.render('medicine/insert_medicine', { csrfToken:req.csrfToken() });
});

 router.post('/insertMedicine', async function (req, res,next) {
  var name = req.body.name;
  var id = req.body.id;
  var cStage = req.body.cStage;
  var company = req.body.company;
  var pDate = req.body.pDate;
  var expDate = req.body.expDate;
  var img=req.body.img;
  var img1=img.toString();
  //console.log(img1);
  var key = makeid(20)

  await createMedicine(key,id, name,company, pDate, expDate, cStage,img1);
  //res.send(JSON.stringify({ key,id, name, company, pDate, expDate, cStage}));

  console.log("Medicine added");
  res.redirect('/');
});

/*router.get('/viewAllMedicine', async function (req, res,next) {
  const result = await contract.evaluateTransaction('queryAllMedicine');

  var resultData = result.toString();
  var medicine = JSON.parse(resultData);

  var html = `<html><body>${resultData}</body></html>`;

  
  res.send(html);   
});
*/
router.get('/queryMedicineById', async function (req, res,next) {
 res.redirect('/');
});

router.post('/queryMedicineById', async function (req, res,next) {
  var id = req.body.search;
  //var id= search.getElementById("search").value;
  console.log("id :",id);
  
  //now I have to call the chaincode 
  //we are  going to get that code from the invoke.js file

  var result = await queryMedicine(id);
  var obj=JSON.parse(result);
  console.log("obj :",obj);
  var test=[];
  var Array = obj[0].Record;
  test.push(Array);
  //var Property = "Id";
  //var productById = _.groupBy(Array, Property);
  //docs.push(productById);
  
    //Product.find(function (err, docs) {
       // var productChunks = productById;

 // res.redirect('/home/welcome',{name:x.Name,ID:x.Id,pCompany:x.Pcompany,pDate:x.Pdate,expDate:x.Expdate,cStage:x.Currstage});
  res.render('home/welcome',{title: 'Medicine', products: test});
 // res.redirect('/home/welcome',{title: 'Medicine', products: productChunks, successMsg: "succes!", noMessages: !successMsg});
  //res.send(result.toString());

  console.log("query completed");
});
////////
router.get('/view_details/:id',async function(req,res,next){
  var id = req.params.id;
  console.log("paitesi: ",id);
  var result = await queryMedicine(id);
  var ob = JSON.parse(result);
  //console.log(ob);
 var test1=[];
 //for (var i = 0; i < ob.length; i +=1) {

 var Array1 = ob[0].Record;

test1.push(Array1);
 //}
  //console.log("test: ",Array1);
  res.render('medicine/details',{ products: test1});
});



 module.exports = router;
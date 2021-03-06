
var express = require('express');
var router = express.Router();
var enrollAdmin = require('./functions/enrollAdmin');
var registerUser = require('./functions/registerUser');
var createMedicine = require('./functions/createMedicine');
var queryMedicine = require('./functions/queryMedicineById');
var queryAllMedicine = require('./functions/queryAllMedicine');
var addNotifications = require('./functions/addNotifications');
var getNotifications = require('./functions/getNotifications');
var getNotificationsByPId = require('./functions/getNotificationsByPId');
var addSeller = require('./functions/addSeller');
var getSeller = require('./functions/getSeller');
var addPath = require('./functions/addPath');
var getPath = require('./functions/getPath');
var addHistory = require('./functions/addHistory');
var getHistory = require('./functions/getHistory');
var addFlag = require('./functions/addFlag');
var getFlag = require('./functions/getFlag');
var deleteData = require('./functions/deleteNoti');
var changeMedicineOwner = require('./functions/changeMedicineOwner');
var addComplain = require('./functions/addComplain');
var getComplain = require('./functions/getComplain');
var getComplainById = require('./functions/getComplainById');
var queryUserById = require('./functions/queryUserById');
var queryAllUser = require('./functions/queryAllUser');

var bcrypt = require('bcrypt')
var groupBy = require('../routes/supportings/groupBy');
//var date = require('date-and-time');

//var Product=require('../models/product')
var csrf = require('csurf');
var csrfProtection = csrf();

router.use(csrfProtection);

var app = require("../app");

function User(id, name, email, phone, userType, img,not_own) {
  this.NID = id;
  this.Name = name;
  this.Email = email;
  this.Phone = phone;
  this.UserType = userType;
  this.Img_Path = img;
  this.not_own=not_own;

  return this;
};

function Product(id, name, company, ownerid, pdate, expdate, cStage, path, img_path, flag, del, expired) {
  this.Id = id;
  this.Name = name;
  this.PCompany = company;
  this.OwnerId = ownerid;
  this.Pdate = pdate;
  this.Expdate = expdate,
    this.Currstage = cStage;
  this.Path = path;
  this.Img_path = img_path;
  this.Flg = flag;
  this.del = del;
  this.expired = expired;
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


function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

router.get('/', function (req, res, next) {
  //var datetime = new Date();
  //console.log("time :", datetime);
  //console.log("date :", datetime.toLocaleDateString());
  //console.log("time :", datetime.toLocaleTimeString());
  //var d1 = datetime.toLocaleDateString();
  //var MFG = getTime(d1, 0);
  //var EXP = getTime(d1, 24);
  //console.log("MFG:----------------", MFG);
  //console.log("EXP:-----------------", EXP);

  //var date = d1.split("-");
  //var day = date[2];
  //var month = date[1];
  //var year = date[0];
  //console.log("date : day,month,year", day, month, year);
  //var d2 = datetime.toLocaleTimeString();
  //var time = d2.split(":");
  //var hour = time[0];
  //var minute = time[1];
  //var second = time[2];
  //console.log("time : hour,min,second", hour, minute, second);
  //const givenDate = new Date("2020-02-01T09:29:05.000Z") - datetime;
  //console.log("givenDate: ", givenDate);
  //const now = new Date();
  //console.log("now: ", now);
  // const later = now.add(1, 'day');
  //var later = new Date(now.setMonth(now.getMonth() + 14));
  //d2 = datetime.toLocaleTimeString();
  //var time = d2.split(":");
  //var hour = time[0];
  //var minute = time[1];
  //var second = time[2];

  //console.log("fhgh", later);

  res.render('home/welcome', { csrfToken: req.csrfToken() });
});

router.get('/enrollAdmin', function (req, res, next) {
  enrollAdmin();
  res.send('Admin created');
});
router.get('/registerUser', function (req, res, next) {
  registerUser();
  res.send('User created');
});
/////
router.get('/addSeller', function (req, res, next) {
  res.render('medicine/addSeller', { csrfToken: req.csrfToken() });
});

router.post('/addSeller', async function (req, res, next) {

  var id = req.body.id;
  var type = req.body.type;
  var name = req.body.name;
  var email = req.body.email;
  
  if(!id||!type||!name||!email){
    res.render('medicine/addSeller', { mode:"danger",message: "Fill up all the fields!", csrfToken: req.csrfToken() });
  }
  var result=await getSeller(id);
   if(result!="[]"){
    res.render('medicine/addSeller', { mode:"danger",message: type +" with ID " +id+" already exist!", csrfToken: req.csrfToken() });
  }
   
  else{
 
  
  var key = makeid(20);
  await addSeller(key, id, name, email, type);
  res.render('medicine/addSeller', {mode:"succes", message: type + " " + "added", csrfToken: req.csrfToken() });
  }
});
//////
router.get('/notification', async function (req, res, next) {
  var nn = await getNotifications(req.session.UId);
  console.log("*** :", nn);
  if (nn === "[]") {
    res.render('user/notification', { title: "Notification", message: "No notification", csrfToken: req.csrfToken() });
  }
  else {
    var ob = JSON.parse(nn);

    var test = [];
    for (var i = 0; i < ob.length; i += 1) {

      var Array = ob[i].Record;
      test.push(Array);
    }
    console.log("Notir test", test);
    res.render('user/notification', { title: "Notification", notifications: test, csrfToken: req.csrfToken() });
  }
});
////////
router.get('/viewAllMedicine', async function (req, res, next) {
  if (req.session.UId != "2016331070") {
    res.render('medicine/view_medicine', { message: "You are not admin!!!", csrfToken: req.csrfToken() });
  }
  else {

    // var successMsg = req.flash('success')[0];
    //await addNotifications('d1','user1');
    var result = await queryAllMedicine();
    console.log("result: ", result);
    /*
  var ob = JSON.parse(result);
  
  var products = [];
  
  for(var x in products){
    products.push(ob[x]);
  }
    */
    var ob = JSON.parse(result);
    var test = [];
    if (result === "[]") {
      console.log("Enter");
      res.render('home/welcome', { message: "No result Found!", csrfToken: req.csrfToken() });
    }
    else {


      for (var i = 0; i < ob.length; i += 1) {

        var Array = ob[i].Record;
        var id = Array.Id;
        //test.push(Array);

        var f_result = await getFlag(id);
        var ff_result;
        var fff_result;
        var fff_id;
        console.log("....", f_result);
        if (f_result != "[]") {
          ff_result = JSON.parse(f_result);
          fff_result = ff_result[0].Record.Flg;
          fff_id = ff_result[0].Record.BuyerId;
          console.log("fff_id :", fff_id);
          console.log(req.session.UId);
        }
        var del = false;
        if (req.session.UId === "2016331070" || (req.session.uType === "producer" && req.session.UId === Array.OwnerId)) {
          del = true;
        }

        var f = true;
        if (f_result === "[]") { f = true; }
        if ((fff_id === req.session.UId && f_result != "[]")) { f = false; }
        if (!req.session.name) { f = true; }
        var expired = false;
        var now1 = new Date();
        var now = new Date(now1.setMonth(now1.getMonth()));
        var presentDate1 = now.toLocaleDateString();
        var presentDate = presentDate1.split("-");
        var day1 = parseInt(presentDate[2]);
        var month1 = parseInt(presentDate[1]);
        var year1 = parseInt(presentDate[0]);

        var date = Array.Expdate.split("-");
        var day = parseInt(date[2]);
        var month = parseInt(date[1]);
        var year = parseInt(date[0]);
        if (year1 > year) {
          var expired = true;
          console.log("Expired");
        }
        else if (year1 === year && month1 > month) {
          var expired = true;
        }
        else if (year1 === year && month1 === month && day1 > day) {
          var expired = true;
        }
        else {
          var expired = false;
        }

        test.push(new Product(Array.Id, Array.Name, Array.PCompany, Array.OwnerId, Array.Pdate, Array.Expdate, Array.Currstage, Array.Path, Array.Img_path, f, del, expired));

      }

      res.render('medicine/view_medicine', { title: "Medicine", products: test, del: del, csrfToken: req.csrfToken() });
    }
  }
});
////////
//view all medicine in your stock

router.get('/viewAllMedicineOfYourStock', async function (req, res, next) {
  if (!req.session.UId) {
    res.render('medicine/view_medicine', { message: "Log in first!!!", csrfToken: req.csrfToken() });
  }
  else {

    // var successMsg = req.flash('success')[0];
    //await addNotifications('d1','user1');
    var result = await queryAllMedicine();
    console.log("result: ", result);
    /*
  var ob = JSON.parse(result);
  
  var products = [];
  
  for(var x in products){
    products.push(ob[x]);
  }
    */
    var ob = JSON.parse(result);
    var test = [];
    for (var i = 0; i < ob.length; i += 1) {

      var Array = ob[i].Record;
      var id = Array.Id;
      //test.push(Array);

      var f_result = await getFlag(id);
      var ff_result;
      var fff_result;
      var fff_id;
      console.log("....", f_result);
      if (f_result != "[]") {
        ff_result = JSON.parse(f_result);
        fff_result = ff_result[0].Record.Flg;
        fff_id = ff_result[0].Record.BuyerId;
        console.log("fff_id :", fff_id);
        console.log(req.session.UId);
      }
      var del = false;
      if (req.session.UId === "2016331070" || (req.session.uType === "producer" && req.session.UId === Array.OwnerId)) {
        del = true;
      }

      var f = true;
      if (f_result === "[]") f = true;
      if ((fff_id === req.session.UId && f_result != "[]")) f = false;
      if (!req.session.name) f = true;
      var expired = false;
      var now1 = new Date();
      var now = new Date(now1.setMonth(now1.getMonth()));
      var presentDate1 = now.toLocaleDateString();
      var presentDate = presentDate1.split("-");
      var day1 = parseInt(presentDate[2]);
      var month1 = parseInt(presentDate[1]);
      var year1 = parseInt(presentDate[0]);

      var date = Array.Expdate.split("-");
      var day = parseInt(date[2]);
      var month = parseInt(date[1]);
      var year = parseInt(date[0]);
      if (year1 > year) {
        var expired = true;
        console.log("Expired");
      }
      else if (year1 === year && month1 > month) {
        var expired = true;
      }
      else if (year1 === year && month1 === month && day1 > day) {
        var expired = true;
      }
      else {
        var expired = false;
      }
      if (req.session.UId === Array.OwnerId) {
        console.log("pacchi: ");
        test.push(new Product(Array.Id, Array.Name, Array.PCompany, Array.OwnerId, Array.Pdate, Array.Expdate, Array.Currstage, Array.Path, Array.Img_path, f, del, expired));
      }
    }
    console.log("test :", test);
    if (test === "[]") {
      console.log("Enter");
      res.render('medicine/view_medicine', { title: "Medicine", message: "You have no medicine in your stock!", csrfToken: req.csrfToken() });
    }
    else {
      res.render('medicine/view_medicine', { title: "Medicine", products: test, del: del, csrfToken: req.csrfToken() });
    }
  }
});

router.get('/insertMedicine', async function (req, res, next) {
  res.render('medicine/insert_medicine', { csrfToken: req.csrfToken() });
});

router.post('/insertMedicine', async function (req, res, next) {
  var name = req.body.name;
  var id = req.body.id;
  var cStage = req.session.name;
  var company = cStage;
  var ownerId = req.session.UId;
  var now1 = new Date();
  var now = new Date(now1.setMonth(now1.getMonth() - 0));

  var pDate = now.toLocaleDateString();
  var val_month = parseInt(req.body.val_month.toString());
  var later = new Date(now1.setMonth(now1.getMonth() + val_month));
  var expDate = later.toLocaleDateString();
  var img = req.body.img;
  var img1 = img.toString();
  //console.log(img1);

  var key = makeid(20)
  await createMedicine(key, id, name, company, ownerId, pDate, expDate, cStage, img1);

  //res.send(JSON.stringify({ key,id, name, company, pDate, expDate, cStage}));
  var result = await queryMedicine(id);
  var f_result = await getFlag(id);
  var ff_result;
  var fff_result;
  var fff_id;
  console.log("....", f_result);
  if (f_result != "[]") {
    ff_result = JSON.parse(f_result);
    fff_result = ff_result[0].Record.Flg;
    fff_id = ff_result[0].Record.BuyerId;
    console.log("fff_id :", fff_id);
    console.log(req.session.UId);
  }
  if ((result === "[]") || (fff_id != req.session.UId && f_result != "[]")) {
    res.render('medicine/view_medicine', { message: "No result Found!", csrfToken: req.csrfToken() });
  }
  else {
    var obj = JSON.parse(result);
    console.log("obj :", obj);
    var test = [];
    var Array = obj[0].Record;
    var del = false;
    if (req.session.UId === "2016331070" || (req.session.uType === "producer" && req.session.UId === Array.OwnerId)) {
      del = true;
    }
    //test.push(Array);
    var f = true;
    if (f_result === "[]") f = true;
    if ((fff_id === req.session.UId && f_result != "[]")) f = false;
    if (!req.session.name) { f = true; }
    var expired = false;
    var now1 = new Date();
    var now = new Date(now1.setMonth(now1.getMonth()));
    var presentDate1 = now.toLocaleDateString();
    var presentDate = presentDate1.split("-");
    var day1 = parseInt(presentDate[2]);
    var month1 = parseInt(presentDate[1]);
    var year1 = parseInt(presentDate[0]);
    console.log("presentDate:--------" + day1 + "-" + month1 + "-" + year1);

    var date = Array.Expdate.split("-");
    var day = parseInt(date[2]);
    var month = parseInt(date[1]);
    var year = parseInt(date[0]);
    console.log("expiredDate:--------" + day + "-" + month + "-" + year);
    if (year1 > year) {
      var expired = true;
      console.log("Expired");
    }
    else if (year1 === year && month1 > month) {
      var expired = true;
    }
    else if (year1 === year && month1 === month && day1 > day) {
      var expired = true;
    }
    else {
      var expired = false;
    }

    test.push(new Product(Array.Id, Array.Name, Array.PCompany, Array.OwnerId, Array.Pdate, Array.Expdate, Array.Currstage, Array.Path, Array.Img_path, f, del, expired));


    console.log(test);
    // res.redirect('/home/welcome',{name:x.Name,ID:x.Id,pCompany:x.Pcompany,pDate:x.Pdate,expDate:x.Expdate,cStage:x.Currstage});
    res.render('medicine/view_medicine', { title: 'Medicine', message: "Medicine added", products: test, csrfToken: req.csrfToken() });
    // res.redirect('/home/welcome',{title: 'Medicine', products: productChunks, successMsg: "succes!", noMessages: !successMsg});
    //res.send(result.toString());

    console.log("query completed");
  }

});


router.get('/queryMedicineById', async function (req, res, next) {
  res.render(res.redirect(req.get('referrer')), { csrfToken: req.csrfToken() });
});

router.post('/queryMedicineById', async function (req, res, next) {
  var id = req.body.search;
  //var id= search.getElementById("search").value;
  console.log("id :", id);

  //now I have to call the chaincode 
  //we are  going to get that code from the invoke.js file

  var result = await queryMedicine(id);
  var f_result = await getFlag(id);
  var ff_result;
  var fff_result;
  var fff_id;
  console.log("....", f_result);
  if (f_result != "[]") {
    ff_result = JSON.parse(f_result);
    fff_result = ff_result[0].Record.Flg;
    fff_id = ff_result[0].Record.BuyerId;
    console.log("fff_id :", fff_id);
    console.log(req.session.UId);
  }
  if ((result === "[]") || (fff_id != req.session.UId && f_result != "[]")) {
    res.render('medicine/view_medicine', { message: "No result Found!", csrfToken: req.csrfToken() });
  }
  else {
    var obj = JSON.parse(result);
    console.log("obj :", obj);
    var test = [];
    var Array = obj[0].Record;
    var del = false;
    if (req.session.UId === "2016331070" || (req.session.uType === "producer" && req.session.UId === Array.OwnerId)) {
      del = true;
    }
    //test.push(Array);
    var f = true;
    if (f_result === "[]") { f = true; }
    if ((fff_id === req.session.UId && f_result != "[]")) { f = false; }
    if (!req.session.name) { f = true; }
    var expired = false;
    var now1 = new Date();
    var now = new Date(now1.setMonth(now1.getMonth()));
    var presentDate1 = now.toLocaleDateString();
    var presentDate = presentDate1.split("-");
    var day1 = parseInt(presentDate[2]);
    var month1 = parseInt(presentDate[1]);
    var year1 = parseInt(presentDate[0]);
    console.log("presentDate:--------" + day1 + "-" + month1 + "-" + year1);

    var date = Array.Expdate.split("-");
    var day = parseInt(date[2]);
    var month = parseInt(date[1]);
    var year = parseInt(date[0]);
    console.log("expiredDate:--------" + day + "-" + month + "-" + year);

    if (year1 > year) {
      var expired = true;
      console.log("Expired");
    }
    else if (year1 === year && month1 > month) {
      var expired = true;
    }
    else if (year1 === year && month1 === month && day1 > day) {
      var expired = true;
    }
    else {
      var expired = false;
    }

    test.push(new Product(Array.Id, Array.Name, Array.PCompany, Array.OwnerId, Array.Pdate, Array.Expdate, Array.Currstage, Array.Path, Array.Img_path, f, del, expired));

    //var Property = "Id";
    //var productById = _.groupBy(Array, Property);
    //docs.push(productById);

    //Product.find(function (err, docs) {
    // var productChunks = productById;

    console.log(test);
    // res.redirect('/home/welcome',{name:x.Name,ID:x.Id,pCompany:x.Pcompany,pDate:x.Pdate,expDate:x.Expdate,cStage:x.Currstage});
    res.render('medicine/view_medicine', { title: 'Medicine', products: test, del: del, csrfToken: req.csrfToken() });
    // res.redirect('/home/welcome',{title: 'Medicine', products: productChunks, successMsg: "succes!", noMessages: !successMsg});
    //res.send(result.toString());

    console.log("query completed");
  }
});
////////
router.get('/queryMedicineById/:id', async function (req, res, next) {
  var pId = req.params.id;
  console.log("paitesi: ", pId);
  var result = await queryMedicine(pId);
  if (result === "[]") {
    res.render('medicine/view_medicine', { title: "Medicine", message: "This medicine is no longer available!!!", csrfToken: req.csrfToken() });
  }
  else {
    var ob = JSON.parse(result);
    //console.log(ob);
    var test1 = [];
    //for (var i = 0; i < ob.length; i +=1) {

    var Array1 = ob[0].Record;

    test1.push(Array1);
    //}
    console.log("test: ", test1);
    res.render('medicine/details', { products: test1 });
  }
});
///////

router.get('/view_details/:iD', async function (req, res, next) {
  var pId = req.params.iD;
  console.log("paitesi: ", pId);
  var result = await queryMedicine(pId);
  var ob = JSON.parse(result);
  //console.log(ob);
  var test1 = [];
  //for (var i = 0; i < ob.length; i +=1) {

  var Array1 = ob[0].Record;

  test1.push(Array1);
  //}
  console.log("test: ", test1);
  res.render('medicine/details', { products: test1 });
});

//buy_click
router.get('/buy_click/:id', async function (req, res, next) {
  var prodId = req.params.id;

  console.log("buy_click er id paitesi: ", prodId);
  if (!req.session.name) {
    res.render('medicine/view_medicine', { message: "Please,Log In First!", csrfToken: req.csrfToken() });
  }

  //await addFlag(prodId,"requested");
  else {
    var key = makeid(15);
    await addFlag(key, prodId, req.session.UId, "requested");
    var result3 = await queryMedicine(prodId);
    var ob3 = JSON.parse(result3);

    var Array = ob3[0].Record;
    console.log("Array1 paisi:", Array);
    var key1 = makeid(20)
    var buyerId = req.session.UId;
    //console.log("buyerID :",buyerId);
    var buyerName = req.session.name;
    var datetime = new Date().toString();
    //console.log("time :", datetime);
    await addNotifications(key1, Array.OwnerId, Array.Currstage, buyerId, buyerName, prodId, datetime);
    var test = [];
    //for (var i = 0; i < ob3.length; i +=1) {

    //var Array = ob[i].Record;
    var f = false;
    test.push(new Product(Array.Id, Array.Name, Array.PCompany, Array.OwnerId, Array.Pdate, Array.Expdate, Array.Currstage, Array.Path, Array.Img_path, f));
    //test.push(Array1);
    console.log("TEST :", test);


    res.render('medicine/view_medicine', { title: 'Medicine', products: test, csrfToken: req.csrfToken() });
  }
});


//////
router.get('/cancel_click/:id', async function (req, res, next) {
  var prodId = req.params.id;

  console.log("cancel_click er id paitesi: ", prodId);
  if (!req.session.name) {
    res.render('medicine/view_medicine', { message: "Please,Log In First!", csrfToken: req.csrfToken() });
  }
  //await addFlag(prodId,"requested");
  var rr = await getFlag(prodId);
  var rrr = JSON.parse(rr);
  var key = rrr[0].Key;
  console.log("rrr ", rrr);
  console.log("key :", key);
  await deleteData(key);

  var result3 = await queryMedicine(prodId);
  var ob3 = JSON.parse(result3);
  var Array = ob3[0].Record;
  console.log("Array paisi:", Array);

  var nn = await getNotificationsByPId(prodId);
  var nnn = JSON.parse(nn);
  var key3 = nnn[0].Key;
  console.log("nnn ", nnn);
  console.log("key3 :", key3);
  await deleteData(key3);
  var test = [];
  var f = true;
  test.push(new Product(Array.Id, Array.Name, Array.PCompany, Array.OwnerId, Array.Pdate, Array.Expdate, Array.Currstage, Array.Path, Array.Img_path, f));


  //for (var i = 0; i < ob3.length; i +=1) {

  //var Array = ob[i].Record;

  //test.push(Array1);
  console.log("TEST :", test);

  res.render('medicine/view_medicine', { title: 'Medicine', products: test, csrfToken: req.csrfToken() });
});
//////
router.get('/confirm_click/:id', async function (req, res, next) {
  var prodId = req.params.id;

  console.log("confirm_click er id paitesi: ", prodId);
  if (!req.session.name) {
    res.render('home/welcome', { message: "Please,Log In First!", csrfToken: req.csrfToken() });
  }


  //await addFlag(prodId,"requested");
  var rr = await getNotificationsByPId(prodId);
  var rrr = JSON.parse(rr);
  var rrr1 = rrr[0].Record;
  var key = rrr[0].Key;
  ///change owner
  var result3 = await queryMedicine(prodId);
  var ob3 = JSON.parse(result3);
  var key1 = ob3[0].Key;
  await changeMedicineOwner(key1, rrr1.BuyerName, rrr1.BuyerId);
  //add path
  await addPath(key1, rrr1.BuyerName);
  //add History
  var kkey = makeid(20);
  var datetime = new Date().toString();

  await addHistory(kkey, rrr1.SellerId, rrr1.ProductId, "Sold", rrr1.BuyerId, datetime, "to");
  var kkkey = makeid(20)
  await addHistory(kkkey, rrr1.BuyerId, rrr1.ProductId, "Bought", rrr1.SellerId, datetime, "from");
  //notification delete
  await deleteData(key);
  //delete flag
  var nn = await getFlag(prodId);
  var nnn = JSON.parse(nn);
  var key5 = nnn[0].Key;
  console.log("nnn ", nnn);
  console.log("key :", key5);
  await deleteData(key5);

  res.redirect('/notification');
});
////
router.get('/reject_click/:id', async function (req, res, next) {
  var prodId = req.params.id;

  console.log("reject_click er id paitesi: ", prodId);
  if (!req.session.name) {
    res.render('home/welcome', { message: "Please,Log In First!", csrfToken: req.csrfToken() });
  }
  var nn = await getNotificationsByPId(prodId);
  var nnn = JSON.parse(nn);
  //var nnn1=nnn[0].Record;
  var key4 = nnn[0].Key;
  console.log("nnn ", nnn);
  console.log("key4 :", key4);
  await deleteData(key4);
  //await addFlag(prodId,"requested");
  var rr = await getFlag(prodId);
  var rrr = JSON.parse(rr);
  var key1 = rrr[0].Key;
  console.log("rrr ", rrr);
  console.log("key :", key1);
  await deleteData(key1);

  res.redirect('/notification');
});
//////
//view transaction
router.get('/view_transaction/:id', async function (req, res, next) {
  var prodId = req.params.id;

  console.log("view transaction er id paitesi: ", prodId);
  var result = await getHistory(prodId);
  if (result === "[]") {
    res.render('medicine/view_history', { message: "You didn't make any Transaction.", csrfToken: req.csrfToken() });
  }
  else {
    var ob = JSON.parse(result);
    var test = [];
    for (var i = 0; i < ob.length; i += 1) {
      var arr = ob[i].Record;
      test.push(arr);
    }
    res.render('medicine/view_history', { title: "Your Transactions", history: test, csrfToken: req.csrfToken() });
  }
});
//delete Medicine
router.get('/delete_medicine/:id', async function (req, res, next) {
  var prodId = req.params.id;

  console.log("delete medicine er id paitesi: ", prodId);
  var result = await queryMedicine(prodId);
  var ob = JSON.parse(result);
  //var rr = ob[0].Record;
  var key = ob[0].Key;
  await deleteData(key);

  res.render('medicine/view_medicine', { message: "Medicine successfully deleted", csrfToken: req.csrfToken() });
});
/////
router.get('/leave_complain', async function (req, res, next) {
  res.render('user/complain_form', { csrfToken: req.csrfToken() });
});

router.post('/leave_complain', async function (req, res, next) {
  var complain_to = req.body.complain_to.toLowerCase();
  var complain = req.body.complain;
  //var complain=complain1.toString();
  console.log("complain: ", complain);
  var datetime1 = new Date();
  var datetime = datetime1.toString();
  console.log("time :", datetime);
  if (complain_to === "admin") {
    complain_to = "admin97@gmail.com";
  }
  var complainee_name = req.session.name;
  var complainee_id = req.session.UId;
  var key = makeid(20);
  var id = key;
  await addComplain(key, id, complain_to, complainee_id, complainee_name, complain, datetime);
  res.render('user/complain_form', { message: "Your complain has been posted", csrfToken: req.csrfToken() });
});
/////
//check_complain
router.get('/check_complain', async function (req, res, next) {
  var email = req.session.email;
  console.log("check complain er id paitesi: ", email);
  var result = await getComplain(email);
  if (result === "[]") {
    res.render('user/complain', { title: "Complain", message: "No complain to you.", csrfToken: req.csrfToken() });
  }
  else {
    var ob = JSON.parse(result);
    var test = [];
    for (var i = 0; i < ob.length; i += 1) {
      var arr = ob[i].Record;
      test.push(arr);
    }
    res.render('user/complain', { title: "Complains", complain: test, csrfToken: req.csrfToken() });
  }
});
/////
router.get('/complain_details/:id', async function (req, res, next) {
  var id = req.params.id;
  console.log("details complain er id paitesi: ", id);
  var result = await getComplainById(id);

  if (result === "[]") {
    res.render('user/complain_details', { title: "Complains", message: "No complain to you.", csrfToken: req.csrfToken() });
  }
  else {
    var ob = JSON.parse(result);
    var test = [];
    for (var i = 0; i < ob.length; i += 1) {
      var arr = ob[i].Record;
      test.push(arr);
    }
    res.render('user/complain_details', { title: "Complains", complain: test, csrfToken: req.csrfToken() });
  }
});

router.get('/delete_complain/:id', async function (req, res, next) {
  var id = req.params.id;
  console.log("details complain er id paitesi: ", id);
  var result = await getComplainById(id);
  var ob = JSON.parse(result);
  var key1 = ob[0].Key;
  await deleteData(key1);

  res.render('user/complain_details', { title: "Complains", message: "Complain Successfully deleted", csrfToken: req.csrfToken() });
});

router.get('/reply_complain/:id', async function (req, res, next) {
  var id = req.params.id;
  var email;
  if (id === "2016331070") {
    email = "admin97@gmail.com"
  }
  else {
    var result = await queryUserById(id);
    var ob = JSON.parse(result);
    var email = ob[0].Record.Email;
  }
  res.render('user/complain_form', { email: email, csrfToken: req.csrfToken() });
});
router.post('/reply_complain', async function (req, res, next) {
  var complain_to = req.body.email;
  var complain = req.body.complain;
  //var complain=complain1.toString();
  console.log("complain: ", complain);
  var datetime1 = new Date();
  var datetime = datetime1.toString();
  console.log("time :", datetime);
  if (complain_to === "admin") {
    complain_to = "admin97@gmail.com";
  }
  var complainee_name = req.session.name;
  var complainee_id = req.session.UId;
  var key = makeid(20);
  var id = key;
  await addComplain(key, id, complain_to, complainee_id, complainee_name, complain, datetime);
  res.render(res.redirect(req.get('referrer')), { email: complain_to, message: "You replied to this complain", csrfToken: req.csrfToken() });
});
/////
router.get('/viewAllUser', async function (req, res, next) {
  if (req.session.UId != "2016331070") {
    res.render('user/view_user', { message: "You are not admin!!!", csrfToken: req.csrfToken() });
  }
  else {
    // var successMsg = req.flash('success')[0];
    //await addNotifications('d1','user1');
    var result = await queryAllUser();
    console.log("result: ", result);

    var ob = JSON.parse(result);
    var test = [];
    var not_own=false;
    test.push(new User("2016331070", "Admin", "admin97@gmail.com", "+880 0317777", "admin", "bigstock-Doctor-With-Health-Insurance-H-304669417_1024X684.png",not_own));

    for (var i = 0; i < ob.length; i += 1) {

      var Array = ob[i].Record;
      var id = Array.Id;
      //test.push(Array);


      test.push(new User(Array.NID, Array.Name, Array.Email, Array.Phone, Array.UserType, Array.Img_Path));

    }

    res.render('user/view_user', { title: "User", user: test, csrfToken: req.csrfToken() });
  }

});
/////
router.get('/viewUser/:id', async function (req, res, next) {
  id = req.params.id;
  if (!req.session.UId) {
    res.render('user/view_user', { message: "Please,Sign in first!!!", csrfToken: req.csrfToken() });
  }
 
  else {
    var not_own=true;
    var test = [];
    if (id === "2016331070") {
      test.push(new User("2016331070", "Admin", "admin97@gmail.com", "+880 0317777", "admin", "bigstock-Doctor-With-Health-Insurance-H-304669417_1024X684.png",not_own));
    }
    else {
      var result = await queryUserById(id);
      console.log("result: ", result);

      var ob = JSON.parse(result);

      var Array = ob[0].Record;
      //test.push(Array);


      test.push(new User(Array.NID, Array.Name, Array.Email, Array.Phone, Array.UserType, Array.Img_Path,not_own));

    }
    res.render('user/profile', { title: "User", user: test, csrfToken: req.csrfToken() });
  }


});
////
router.get('/view_user_details/:iD', async function (req, res, next) {
  var pId = req.params.iD;
  console.log("paitesi: ", pId);
  var result = await queryUserById(pId);
  if (result === "[]") {
    res.render('user/view_user', { title: "User", message: "This user no longer exist!!!" ,csrfToken: req.csrfToken() });
  }
  else {
    var ob = JSON.parse(result);
    //console.log(ob);
    var test1 = [];
    //for (var i = 0; i < ob.length; i +=1) {

    var Array1 = ob[0].Record;

    test1.push(Array1);
    //}
    console.log("test: ", test1);
    res.render('user/view_user', { title: "User", user: test1, csrfToken: req.csrfToken() });
  }
});
////
router.get('/delete_user/:id', async function (req, res, next) {
  var prodId = req.params.id;

  console.log("delete user er id paitesi: ", prodId);
  var result = await queryUserById(prodId);
  var ob = JSON.parse(result);
  //var rr = ob[0].Record;
  var key = ob[0].Key;
  await deleteData(key);

  res.render('user/view_user', { message: "User successfully deleted", csrfToken: req.csrfToken() });
});
////

function checkSignIn(req, res, next) {
  if (req.session.name) {
    next();     //If session exists, proceed to page
  } else {
    //res.redirect('/');
    var err = new Error("Not logged in!");
    console.log(req.session.name);
    next(err);  //Error, trying to access unauthorized page!
  }
}
module.exports = router;

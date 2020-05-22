
var express = require('express');
var router = express.Router();
var app = require("../app");


var Product = function(name,company){
    
    this.Name = name;
    this.Pcompany =  company;
return this;
};

module.exports =router;
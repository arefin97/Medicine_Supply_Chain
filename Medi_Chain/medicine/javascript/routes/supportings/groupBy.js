var express = require('express');
var router = express.Router();

var groupBy = function (xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  module.exports = router;
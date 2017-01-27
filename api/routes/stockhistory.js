"use strict";
var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mysql      = require('mysql');
var config     = require('../config');

var pool        = mysql.createPool({
  connectionLimit : 30,
  host            : config.mysql.host,
  user            : config.mysql.user,
  password        : config.mysql.password,
  database        : config.mysql.db
});

var router = express.Router();


router.route('/stocknames/:stockid')
  //get one stock
  .get(function(req,res){
    pool.query('SELECT * FROM stocknames WHERE stockid=' + req.params.stockid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows[0]);
    });
  })
  //Update a stock
  .put()
  //Delete a stock
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM stocknames WHERE stockid = ' + req.params.stockid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "Stock" + req.params.stockid + "deleted successfully!"});
    });
  });


router.route('/stockhistory')
.post(function(req, res){
  pool.query('INSERT INTO stockhistory (stockid, stockvalue, volume) VALUES(\''  + req.body.stockid + '\', \'' + req.body.stockvalue + '\', \''+req.body.volume + '\')', function(err, rows, fields){
    if(err) console.log(err);
    res.json("Stock " +req.body.stockid+ " updated")
  });
});



module.exports = router;

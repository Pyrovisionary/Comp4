"use strict";
var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mysql      = require('mysql');
var config     = require('../config');

//Create a pool connection to SQL database
var pool        = mysql.createPool({
  connectionLimit : 30,
  host            : config.mysql.host,
  user            : config.mysql.user,
  password        : config.mysql.password,
  database        : config.mysql.db
});

var router = express.Router();

router.route('/stocknames')
  .get(function(req, res){
    //Get all stocknames (stockid's/names/tickers/ipoyear/sector/industry)
    pool.query('Select * FROM stocknames', function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  });

router.route('/stocknames/stockhistory')
    .get(function(req, res){
    //Gets all the newest stockhistory data in descending order
        pool.query('SELECT sampletime FROM stockhistory LIMIT 1', function(err, rows, fields){
          if (err) console.log(err);
          var newestsampletime = rows[0].sampletime ;
    //Gets the stocknames joined with their newest stock history
          pool.query('SELECT stocknames.stockname, stocknames.stockid, stocknames.stockticker, stockhistory.stockvalue, stockhistory.stockvaluepercentagechange FROM stocknames INNER JOIN stockhistory ON stocknames.stockid=stockhistory.stockid WHERE sampletime ="' + newestsampletime + '" ORDER BY stockname DESC', function(err, getrows, fields){
            if (err) console.log(err);
            res.json(getrows);
          });
        });
    })
    //Add stock(By name)
    .post(function(req, res){
      pool.query('INSERT INTO stockname (stockticker, stockname) VALUES(\''  + req.body.stockticker + '\', \'' + req.body.stockname + req.body.ipoyear + '\', \'' + req.body.sector + '\', \'' + req.body.industry + '\')', function(err, rows, fields){
        if(err) console.log(err);
        res.json("Stock " +req.body.stockname+ " created")
      });
    });

router.route('/stocknames/:stockid')
  //get one stock
  .get(function(req,res){
    pool.query('SELECT * FROM stocknames WHERE stockid=' + req.params.stockid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows[0]);
    });
  })
  //Delete a stock
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM stocknames WHERE stockid = ' + req.params.stockid, function(err, rows, fields){
      if(err) console.log(err);
      res.json({message: "Stock" + req.params.stockid + "deleted successfully!"});
    });
  });


router.route('/stockhistory')
//Creates a item in stockhistory
.post(function(req, res){
  pool.query('INSERT INTO stockhistory (stockid, stockvalue, volume) VALUES(\''  + req.body.stockid + '\', \'' + req.body.stockvalue + '\', \''+req.body.volume + '\')', function(err, rows, fields){
    if(err) console.log(err);
    res.json("Stock " +req.body.stockid+ " updated")
  });
});



module.exports = router;

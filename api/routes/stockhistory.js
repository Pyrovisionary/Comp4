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

router.route('/stocknames/stockhistory')
    .get(function(req, res){
    //Gets all the newest stockhistory data in descending order
        pool.query('SELECT sampletime FROM stockhistory LIMIT 1', function(err, rows, fields){
          if (err) console.log(err);
          var newestsampletime = rows[0].sampletime ;
    //Gets the stocknames joined with their newest stock history
          pool.query('SELECT stocknames.stockname, stocknames.sector, stocknames.stockid, stocknames.stockticker, stockhistory.stockvalue, stockhistory.stockvaluepercentagechange, stockhistory.stockexchange, stockhistory.stockmarketcap FROM stocknames INNER JOIN stockhistory ON stocknames.stockid=stockhistory.stockid WHERE sampletime ="' + newestsampletime + '" ORDER BY stockname ASC', function(err, getrows, fields){
            if (err) console.log(err);
            res.json(getrows);
          });
        });
    })
    //Add stock(By name)
    .post(function(req, res){
      pool.query('INSERT INTO stockname (stockticker, stockname, ipoyear, sector, industry) VALUES(?, ?, ?, ?, ?)', [req.body.stockticker, req.body.stockname, req.body.ipoyear, req.body.sector, req.body.industry], function(err, rows, fields){
        if(err) console.log(err);
        res.json("Stock " +req.body.stockname+ " created")
      });
    });

router.route('/stockhistory/:stockid')
  //get the latest price of a specific stock
  .get(function(req,res){
    //console.log(req.params.stockid)
    pool.query('SELECT * FROM stockhistory WHERE stockid = ? ORDER BY sampletime LIMIT 1', [req.params.stockid], function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows[0]);
    });
  });

module.exports = router;

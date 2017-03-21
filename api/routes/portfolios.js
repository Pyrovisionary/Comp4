"use strict";
var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var asynchronous  = require('async');
var mysql         = require('mysql');
var config        = require('../config');

//Create a pool connection to SQL database
var pool        = mysql.createPool({
  connectionLimit : 30,
  host            : config.mysql.host,
  user            : config.mysql.user,
  password        : config.mysql.password,
  database        : config.mysql.db
});

var router = express.Router();

router.route('/portfolios')
//Get all portfolios
  .get(function(req, res){
    pool.query('Select * FROM portfolios', function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })
  //Create a new portfolio
  .post(function(req, res){
    pool.query('INSERT INTO portfolios (userid, portfolioname) VALUES(\''  + req.body.userid + '\', \'' + req.body.portfolioname +'\')', function(err, rows, fields){
      if(err) console.log(err);
      res.json("Portfolio " +req.body.portfolioname+ " created")
    });
  });


router.route('/portfolios/:portfolioid')
  //Get a specific portfolio
  .get(function(req, res){
    pool.query('SELECT * FROM portfolios WHERE portfolioid=' + req.params.portfolioid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows[0]);
    });
  })
  //Update a specific portfolio
  .put(function(req, res){
  })
  //Delete a specific portfolio
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM portfolios WHERE portfolioid = ' + req.params.portfolioid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "Portfolio deleted successfully!"});
    });
  });

router.route('/portfolios/stocks/:portfolioid')
  //Add a specific stock to a specific portfolio
  .post(function(req, res){
    pool.query('SELECT TOP 1 FROM stockhistory WHERE stockid = ' + req.body.stockid +' ORDER BY sampletime DESC', function(err, rows, fields){
      if(err) console.log(err);
      var buyprice = rows[0].stockvalue
      pool.query(' INSERT INTO portfoliostocklink (portfolioid, stockid, buyprice, volume) VALUES(\''  + req.body.portfolioid + '\', \'' + req.body.stockid + '\', \'' + buyprice + '\', \''+ req.body.volume+'\')', function(err, rows, fields){
        if(err) console.log(err);
        res.json("Stock " +req.body.stockid+ " added to portfolio " + req.body.portfolioid)
      });
    });
  });


router.route('/portfolios/users/:userid')
  //Get all of a user's portfolios
  .get(function(req, res){
    var portfolios = [];
    var stockinportfolio = [];
    pool.query('SELECT * FROM portfolios WHERE userid=' + req.params.userid, function(err, rows, fields){
      if (err) console.log(err);
      asynchronous.each(rows, function(portfoliostock, callback){
        portfolios.push(portfoliostock.portfolioname)
        pool.query('SELECT portfolios.portfolioname, portfoliostocklink.buyprice, portfoliostocklink.volume, stocknames.stockname, stocknames.stockticker FROM portfolios INNER JOIN portfoliostocklink ON portfolios.portfolioid = portfoliostocklink.portfolioid INNER JOIN stocknames ON portfoliostocklink.stockid = stocknames.stockid WHERE userid = ' + req.params.userid + ' AND portfolios.portfolioid =' + portfoliostock.portfolioid, function(err, getrows, fields){
          console.log(getrows);
          stockinportfolio.push(getrows);
          callback();
        });
      }, function(err){
        if (err) console.log(err);
        var response = [portfolios, stockinportfolio];
        res.json(response);
      })
    });
  });


/*router.route('/portfolios/users/:portfolioid')
  //Get a specific portfolio + all the portfoliostocklink data
  .get(function(req, res){
    pool.query('SELECT * FROM portfolios INNER JOIN portfoliostocklink ON portfolios.portfolioid = portfoliostocklink.portfolioid  AND WHERE userid = ' + req.body.userid + ' AND WHERE portfolioid =' + req.body.portfolioid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })*/



module.exports = router;

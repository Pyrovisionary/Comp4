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
  //Create a new portfolio
  .post(function(req, res){
    pool.query('INSERT INTO portfolios (userid, portfolioname) VALUES(?, ?)', [req.body.userid, req.body.portfolioname], function(err, rows, fields){
      if(err) console.log(err);
      res.json("Portfolio " +req.body.portfolioname+ " created")
    });
  });


router.route('/portfolios/:portfolioid')
  //Get a specific portfolio
  .get(function(req, res){
    pool.query('SELECT * FROM portfolios WHERE portfolioid = ? ', [req.params.portfolioid], function(err, rows, fields){
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
    pool.query('DELETE FROM portfolios WHERE portfolioid = ?;', [req.params.portfolioid], function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "Portfolio deleted successfully!"});
    });
  });

router.route('/portfolios/stocks/users/')
  //Add a specific stock to a specific portfolio (Buy a stock)
  .post(function(req, res){
    pool.query('SELECT portfolioid FROM portfolios WHERE portfolioname = ? AND userid = ?', [req.body.portfolioname, req.body.userid], function(err, getrows, fields){
      if (err) console.log(err);
      var portfolioid = getrows[0].portfolioid;
      pool.query('INSERT INTO portfoliostocklink (portfolioid, stockid, buyprice, volume) VALUES(?, ?, ?, ?)', [portfolioid, req.body.stockid, req.body.price, req.body.volume], function(err, rows, fields){
        if(err) console.log(err);
        res.json("Stock " + req.body.stockid + " added to portfolio " + req.body.portfolioid)
      });
    });
  })
  //Remove a specific stock from a specific portfolio (sell a stock)
  .delete(function(req,res){
      pool.query('DELETE FROM portfoliostocklink WHERE portfoliostocklinkid = ? ;', [req.query.portfoliostocklinkid], function(err, rows, fields){
        res.json('Stock sold!')
        console.log('Delete request')
      });
  })
  .put(function(req,res){
    var newvolume = req.query.volume - req.query.sellvolume;
    pool.query('UPDATE portfoliostocklink SET volume = ? WHERE portfoliostocklinkid = ? ;', [newvolume, req.query.portfoliostocklinkid], function(err, rows, fields){
      if (err) console.log(err);
      res.json('Stock sold')
    });
  });


router.route('/portfolios/users/:userid')
  //Get all of a user's portfolios
  .get(function(req, res){
    var portfolios = [];
    var stockinportfolio = [];
    pool.query('SELECT * FROM portfolios WHERE userid = ?;', [req.params.userid], function(err, rows, fields){
      if (err) console.log(err);
      asynchronous.each(rows, function(portfoliostock, callback){
        portfolios.push(portfoliostock.portfolioname)
        pool.query('SELECT portfoliostocklink.portfoliostocklinkid, portfolios.portfolioid, stocknames.stockid, portfolios.portfolioname, stocknames.stockname, stocknames.stockticker, portfoliostocklink.buyprice, portfoliostocklink.volume FROM portfolios INNER JOIN portfoliostocklink ON portfolios.portfolioid = portfoliostocklink.portfolioid INNER JOIN stocknames ON portfoliostocklink.stockid = stocknames.stockid WHERE userid = ? AND portfolios.portfolioid = ?', [req.params.userid, portfoliostock.portfolioid], function(err, getrows, fields){
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



module.exports = router;

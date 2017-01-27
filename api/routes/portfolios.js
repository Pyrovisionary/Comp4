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

router.route('/portfolios/:portfolioid/:stockid')
  //Add a specific stock to a specific portfolio
  .post(function(req, res){
    pool.query('SELECT TOP 1 FROM stockhistory WHERE stockid = ' + req.params.stockid +' ORDER BY sampletime DESC', function(err, rows, fields){
      if(err) console.log(err);
      var buyprice = rows[0].stockvalue
      pool.query(' INSERT INTO portfoliostocklink (portfolioid, stockid, buyprice, volume) VALUES(\''  + req.body.portfolioid + '\', \'' + req.body.stockid + '\', \'' + buyprice + '\', \''+ req.body.volume+'\')', function(err, rows, fields){
        if(err) console.log(err);
        res.json("Stock " +req.body.stockid+ " added to portfolio " + req.body.portfolioid)
      });
    });
  });


router.route('/portfolios/:userid')
  //Get a user's portfolio
  .get(function(req, res){
    pool.query('SELECT * FROM portfolios WHERE userid=' + req.params.userid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  });


router.route('/portfolios/:userid/:portfolioid')
  //Get a specific portfolio + all the portfoliostocklink data
  .get(function(req, res){
    pool.query('SELECT * FROM portfolios INNER JOIN portfoliostocklink ON portfolios.'+req.params.portfolioid+' = portfoliostocklink.'+req.params.portfolioid+'  AND WHERE userid = ' + req.params.userid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })



module.exports = router;

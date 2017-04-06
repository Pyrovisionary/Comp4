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


router.route('/users')
  //Get all users (Without passwords)
  .get(function(req, res){
    pool.query('Select username, forename, surname, teacher, email, accountbalance FROM users', function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  });

router.route('/users/:userid')
  //Get a user
  .get(function(req,res){
    console.log(req.params);
    console.log('Got to API');
    pool.query('SELECT * FROM users WHERE userid = ? ', [req.params.userid], function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows[0]);
    });
  })
  //Delete a user
  .delete(function(req,res){
    console.log('Attempting to delete');
    pool.query('DELETE FROM users WHERE userid = ?', [req.params.userid], function(err, rows, fields){
      if(err) console.log(err);
      res.json({message: "User deleted successfully!"});
    });
  });

router.route('/users/stocks/')
  //Update a user's accountbalance
  .put(function(req, res){
    pool.query('SELECT accountbalance FROM users WHERE userid = ? ', [req.body.userid], function(err, rows, fields){
      var newBalance=rows[0].accountbalance + req.body.cost;
      pool.query('UPDATE users SET accountbalance = ? WHERE userid = ?', [newBalance, req.body.userid], function(err, rows, fields){
        if (err) console.log(err);
        res.json("Balance updated")
      });
    });
  });


module.exports = router;

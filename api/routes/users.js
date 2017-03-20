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
  //Get all users
  .get(function(req, res){
    pool.query('Select * FROM users', function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  });

router.route('/users/:userid')
  //Get a user
  .get(function(req,res){
    pool.query('SELECT * FROM users WHERE userid=' + req.params.userid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows[0]);
    });
  })
  //Update a user
  //TODO: update users route, write it u mong.
  /*.put(function(req, res){
    pool.query('UPDATE users SET'+req.body.changeddatatype+'=' +req.body.changeddata+ 'WHERE userid = ' + req.params.userid, function(err, rows, fields){
      if (err) console.log(err);
      res.json("User " + req.params.userid + " updated");
    });
  })*/

  //Delete a user
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM users WHERE userid = ' + req.params.userid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "User deleted successfully!"});
    });
  });

module.exports = router;

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
  })
  //Add user
  .post(function(req, res){
    pool.query('INSERT INTO users (username, forename, surname, email, teacher) VALUES(\''  + req.body.username + '\', \'' + req.body.forename + '\', \'' + req.body.surname + '\', \'' + req.body.email + '\', \'' + req.body.teacher +'\')', function(err, rows, fields){
      if(err) console.log(err);
      res.json("User " +req.body.username+ " created")
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
  .put(function(req, res){
    pool.query('UPDATE users SET'+req.body.changeddatatype+'=' +req.body.changeddata+ 'WHERE userid = ' + req.params.userid, function(err, rows, fields){
      if (err) console.log(err);
      res.json("User " + req.params.userid + " updated");
    });
  })
  //Delete a user
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM users WHERE userid = ' + req.params.userid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "User deleted successfully!"});
    });
  });


router.route('users/:userid/:classes')
//Get a user's classes
  .get(function(req, res){
    pool.query('Select * FROM classes WHERE userid = ' + req.params.userid , function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  });

module.exports = router;

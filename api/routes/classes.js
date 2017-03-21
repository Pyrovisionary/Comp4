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

router.route('/classes')
  //Get all classes (Just Id's and names)
  .get(function(req, res){
    pool.query('SELECT * FROM classes', function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })
  //Create a class
  .post(function(req, res){
    pool.query('INSERT INTO classes (classname) VALUES(\''  + req.body.className +'\')', function(err, rows, fields){
      if(err) console.log(err);
      console.log("Class " +req.body.className+ " created");
    });
  });

router.route('/classes/users/:userid')
//Get a user's classes
//TODO: get this to return a JSON object
  .get(function(req, res){
    var classes = [];
    var usersinclass = [];
    pool.query('SELECT * FROM classuserlink INNER JOIN classes on classes.classid = classuserlink.classid WHERE userid = ' + req.params.userid , function(err, rows, fields){
      if (err) console.log(err);
      asynchronous.each(rows, function(userclass, callback){
        classes.push(userclass.classname);
        pool.query('SELECT classes.classname, users.forename, users.surname, users.teacher FROM classes INNER JOIN classuserlink on classes.classid = classuserlink.classid INNER JOIN users ON classuserlink.userid = users.userid WHERE classes.classid = ' + userclass.classid, function(err, getrows, fields){
          usersinclass.push(getrows);
          callback();
        });
        },
        function(err){
          if (err) {console.log(err)};
          var response =  [classes, usersinclass];
          res.json(response);
      });
    });
  });

//router.route();

router.route('/classes/:classid')
  //Get a specific class
  .get(function(req, res){
    pool.query('SELECT * FROM classes INNER JOIN classuserlink ON classes.classid = classuserlink.classid WHERE classid = ' + req.body.classid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM classes WHERE classid = ' + req.body.classid +"; DELETE FROM classuserlink WHERE classid = " +req.body.classid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "Class " + req.body.classid + " deleted successfully!"});
    });
  })
  //Add a pupil to a class
  .post(function(req, res){
    pool.query('SELECT * FROM classuserlink WERE userid =' + req.body.userid + ' AND WHERE classid =' + req.body.classid, function(err, rows, fields){
      if (rows.length === 0){
        pool.query('INSERT INTO classuserlink (classid, userid) VALUES(\''  +req.body.classid+'\', \'' +req.body.userid+'\')', function(err, rows, fields){
          if(err) console.log(err);
          console.log("User " +req.body.userid+ " added to class " + req.body.classid );
        });
      } else {
        console.log('User already in class')
      }
    });
  });

module.exports = router;

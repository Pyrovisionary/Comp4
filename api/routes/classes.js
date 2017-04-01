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
  //Creates a class and adds the user to the class
  .post(function(req, res){
    var classname = req.body.classname;
    var userid = req.body.userid;
    pool.query('SELECT * FROM classes WHERE classname ="' + classname+'"', function(err, rows, fields) {
      console.log(rows[0]);
      if (!rows[0]) {
        pool.query('INSERT INTO classes (classname) VALUES(\''  + classname +'\')', function(err, getrows, fields) {
          if(err) console.log(err);
          pool.query('SELECT * FROM classes WHERE classname="'+classname+'"', function(err, getrow, fields) {
            console.log()
            pool.query('INSERT INTO classuserlink (classid, userid) VALUES(\''  +getrow[0].classid+'\', \'' +userid+'\')', function(err, rows, fields){
              if(err) console.log(err);
              console.log("User " +userid+ " added to class " + classname );
              res.json("User " +userid+ " added to class " + classname)
            });
          });
        });
      } else{
        res.json('Cannot create class, a class of that name already exists');
        console.log('Cannot create class, a class of that name already exists');
      }
    });
  });

router.route('/classes/users/:userid')
//Get a user's classes
  .get(function(req, res){
    var classes = [];
    var usersinclass = [];
    pool.query('SELECT * FROM classuserlink INNER JOIN classes on classes.classid = classuserlink.classid WHERE userid = ' + req.params.userid , function(err, rows, fields){
      if (err) console.log(err);
      asynchronous.each(rows, function(userclass, callback){
        classes.push(userclass);
        pool.query('SELECT classes.classname, classes.classid, users.forename, users.userid, users.surname, users.teacher FROM classes INNER JOIN classuserlink on classes.classid = classuserlink.classid INNER JOIN users ON classuserlink.userid = users.userid WHERE classes.classid = ' + userclass.classid, function(err, getrows, fields){
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
  })
  //delete a user from a class
  .delete(function(req, res){
    pool.query('DELETE FROM classuserlink WHERE classid = ' + req.query.classid + ' AND userid =' +req.params.userid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "User" + req.params.userid + " removed from class " + req.query.classid + " successfully!"});
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
  //Add a user to a class
  .post(function(req, res){
    pool.query('SELECT * FROM classuserlink WERE userid =' + req.body.userid + ' AND WHERE classid =' + req.body.classid, function(err, rows, fields){
      if (!rows){
        pool.query('INSERT INTO classuserlink (classid, userid) VALUES(\''  +req.body.classid+'\', \'' +req.body.userid+'\')', function(err, rows, fields){
          if(err) console.log(err);
          console.log("User " +req.body.userid+ " added to class " + req.body.classid );
          res.json("User " +req.body.userid+ " added to class " + req.body.classid );
        });
      } else {
        console.log('User already in class');
        res.json('User already in class');
      }
    });
  });

module.exports = router;

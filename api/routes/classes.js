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
  .get(function(req, res){
    pool.query('Select * FROM classuserlink WHERE userid = ' + req.params.userid , function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  });


router.route('/classes/users/:classid')
  //Get a specific class
  .get(function(req, res){
    pool.query('SELECT * FROM classes INNER JOIN classuserlink ON classes.classid = classuserlink.classid WHERE classid = ' + req.body.classid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })
  //Update a specific class
  .put(function(req,res){
    pool.query('UPDATE classes SET classname="'+ req.body.classname +'" WHERE classid =' + req.body.classid, function(err, rows, fields){
      if (err) console.log(err);
      res.json("Classname updated");
    });

  })
  //Add a pupil to a class
  .post(function(req, res){
    //console.log(req.body);
    pool.query('INSERT INTO classuserlink (classid, userid) VALUES(\''  +req.body.classid+'\', \'' +req.body.userid+'\')', function(err, rows, fields){
      if(err) console.log(err);
      console.log("User " +req.body.userid+ " added to class " + req.body.classid );
    });
  })
  //Delete a specific class
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM classes WHERE classid = ' + req.body.classid +"; DELETE FROM classuserlink WHERE classid = " +req.body.classid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "Class " + req.body.classid + " deleted successfully!"});
    });
  });

module.exports = router;

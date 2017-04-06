'use strict';
var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
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
  //Creates a class and adds the user to the class
  .post(function(req, res){
    var classname = req.body.classname;
    var userid = req.body.userid;
    pool.query('SELECT * FROM classes WHERE classname = ?', [className], function(err, rows, fields) {
      console.log(rows[0]);
      if (rows[0] === undefined || rows[0].length === 0) {
        pool.query('INSERT INTO classes (classname) VALUES(?)', [className], function(err, getrows, fields) {

          if(err) console.log(err);
          pool.query('SELECT * FROM classes WHERE classname = ?', [className], function(err, getrow, fields) {

            console.log()
            pool.query('INSERT INTO classuserlink (classid, userid) VALUES( ?, ? )', [getrow[0].classid, userid], function(err, rows, fields){

              if(err) console.log(err);
              console.log('User ' +userid+ ' added to class ' + classname );
              res.json("User " + userid+ " added to class " + classname)
            });
          });
        });
      } else{
        res.json("Cannot create class, a class of that name already exists");
        console.log('Cannot create class, a class of that name already exists');
      }
    });
  });

router.route('/classes/users/:userid')
  //Get all of a user's classes
  .get(function(req, res){
    var classes = [];
    var usersInClass = [];
    pool.query('SELECT * FROM classuserlink INNER JOIN classes on classes.classid = classuserlink.classid WHERE userid = ?', [req.params.userid], function(err, rows, fields){
      if (err) console.log(err);
      asynchronous.each(rows, function(userClass, callback){
        classes.push(userClass);
        pool.query('SELECT classes.classname, classes.classid, users.forename, users.userid, users.surname, users.teacher FROM classes INNER JOIN classuserlink on classes.classid = classuserlink.classid INNER JOIN users ON classuserlink.userid = users.userid WHERE classes.classid = ?', [userClass.classid], function(err, getRows, fields){
          usersInClass.push(getRows);
          callback();
        });
        },
        function(err){
          if (err) {console.log(err)};
          var response =  [classes, usersInClass];
          res.json(response);
      });
    });
  })
  //delete a user from a class
  .delete(function(req, res){
    pool.query('DELETE FROM classuserlink WHERE classid = ? AND userid = ?', [req.query.classid, req.params.userid], function(err, rows,fields){
      if(err) console.log(err);
      res.json({
        message: "User" + req.params.userid + " removed from class " + req.query.classid + " successfully!"
      });
    });
  });

router.route('/classes/:classid')
  //Get data for a specific class
  .get(function(req, res){
    pool.query('SELECT * FROM classes INNER JOIN classuserlink ON classes.classid = classuserlink.classid WHERE classid = ?', [req.body.classid], function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })
  //Delete a specific class
  .delete(function(req,res){
    console.log('Attempting to delete');
    pool.query('DELETE FROM classuserlink WHERE classid = ?; DELETE FROM classes WHERE classid = ?;', [req.body.classid, req.body.classid], function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "Class " + req.body.classd + " deleted successfully!"});
    });
  })
  //Add a user to a class
  .post(function(req, res){
    pool.query('SELECT * FROM classes WHERE classid = ?;', [req.params.classid], function(err, getRows, fields){
      if(getRows.length>0){
        pool.query('SELECT * FROM classuserlink WHERE userid = ? AND classid = ?', [req.body.userid, req.params.classid], function(err, rows, fields){
          console.log(rows);
          if (rows === undefined || rows.length===0){
            pool.query('INSERT INTO classuserlink (classid, userid) VALUES(?, ?)', [req.body.classid, req.body.userid], function(err, rows, fields){
              if(err) console.log(err);
              console.log('User ' + req.body.userid + ' added to class ' + req.body.classid );
              res.json({
                success:true,
                message: "User " + req.body.userid + " added to class " + req.body.classid
              });
            });
          } else {
              console.log('User already in class');
              res.json("User already in class");
            }
        });
      } else {
          res.json({
            success: false
          })
        }
    });
  });

module.exports = router;

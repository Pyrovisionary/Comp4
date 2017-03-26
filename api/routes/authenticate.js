"use strict";
var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mysql      = require('mysql');
var jwt        = require('jsonwebtoken');
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
app.set('SecretVariable', config.json.secret); // sets secret variable for JWT encryption

/*router.get('/authenticate', function(req, res){
  res.json({message: 'got here'});
});*/

function authenticateUser(req, res, pool) {
  pool.query("SELECT * FROM users WHERE username = \'" + req.body.username + "\'", function(err, rows, fields){
    if (err) throw(err);
    if  (rows.length!==0) {
      if (rows[0].pass == req.body.pass) {
        var user = {
          "username"        : rows[0].username,
          'userid'          : rows[0].userid,
          "teacher"         : rows[0].teacher
          }
        var token = jwt.sign(user, app.get('SecretVariable'), {
          expiresIn: 86400
        });
        res.json({
          success:true,
          message:"Auth successful",
          token: token
        });
      }
      else {
        res.json({
          success: false,
          message: "Auth failed, password incorrect"
        })
      }
    }
    else {
      //console.log(req.body.username);
      //console.log(req.body.pass);
      res.json({
        success: false,
        message: "Auth failed, user does not exist"
      })
    };
  });

};

router.route('/authenticate')
  .post(function(req, res){
      authenticateUser(req, res, pool);
  });

router.route('/authenticate/users')
  .post(function(req, res){
    var teacher = 0;
    console.log(req.body);
    if (req.body.teacher == true){teacher=1;} else {teacher = 0;}
    pool.query("SELECT * FROM users WHERE username = \'" +req.body.username + "\'", function(err, rows, fields){
      if (rows.length == 0){
        //TODO: you've hashed the password here, great, but how do you compare hashes now, how to use this hasing method on client side to get login working
        pool.query('INSERT INTO users (username, forename, surname, pass, email, teacher, accountbalance) VALUES(\'' + req.body.username + '\', \'' + req.body.forename + '\', \'' + req.body.surname + '\', PASSWORD(\'' + req.body.pass + '\'), \'' + req.body.email + '\', \'' + teacher +'\', "10000")', function(err, rows, fields){
          if(err) console.log(err);
          authenticateUser(req, res, pool);
        });
      } else{
        res.json({
          success:false,
          message:"Auth unsuccessful, username already exists"

        })
      }
    });
  });

module.exports = router;

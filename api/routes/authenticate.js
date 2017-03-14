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

router.route('/authenticate')
  .get(function(req,res){
      res.json({ message: "GOT"});
  })
  .post(function(req, res){
    //TODO: mke so you don't have to use this serverside workaround
    //console.log(req.body);
    var request = JSON.parse(Object.keys(req.body)[0]);
    pool.query("SELECT * FROM users WHERE username = \'" +request.username + "\'", function(err, rows, fields){
      if (err) throw(err);
      if  (rows.length!==0) {
        if (rows[0].pass == request.pass) {
          var user = {
            "username" : rows[0].username,
            "teacher"  : rows[0].teacher
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
        console.log(req.body);
        //console.log(req.body.username);
        //console.log(req.body.pass);
        res.json({
          success: false,
          message: "Auth failed, user does not exist"
        })
      };
    });
  });

router.route('/authenticate/users')
  .post(function(req, res){
    var request = JSON.parse(Object.keys(req.body)[0]);
    var teacher = 0;
    if (request.teacher == true){teacher=1;} else {teacher = 0;}
    pool.query("SELECT * FROM users WHERE username = \'" +request.username + "\'", function(err, rows, fields){
      if (rows.length == 0){
        pool.query('INSERT INTO users (username, forename, surname, pass, email, teacher) VALUES(\'' + request.username + '\', \'' + request.forename + '\', \'' + request.surname + '\', \'' + request.pass + '\', \'' + request.email + '\', \'' + teacher +'\')', function(err, rows, fields){
          if(err) console.log(err);
          var user = {
            "username" : request.username,
            "password" : request.pass
            }
          var token = jwt.sign(user, app.get('SecretVariable'), {
            //"iss" : ,
            //sub : rows[0].username,
            expiresIn: 86400
          });
          res.json({
            success:true,
            message:"Auth successful",
            token: token
          });
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

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
    pool.query("SELECT * FROM users WHERE username = \'" +req.body.username + "\'", function(err, rows, fields){
      //TODO: glitch where wrong username or password is entered returns error. Should return "user does not exist" etc
      if (err) throw(err);
      if  (rows.length!==0) {
        if (rows[0].pass == req.body.pass) {
          var user = {
            "username" : rows[0].username,
            "password" : rows[0].pass
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
        }
        else {
          res.json({
            success: false,
            message: "Auth failed, password incorrect"
          })
        }
      }
      else {
        res.json({
          success: false,
          message: "Auth failed, user does not exist"
        })
      };
    });
  });

module.exports = router;

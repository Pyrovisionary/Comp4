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
      if (err) throw(err);
      if (rows[0].pass == req.body.pass) {
        var user = {
          "username" : rows[0].username,
          "password" : rows[0].pass
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
      };
    });
  });

module.exports = router;

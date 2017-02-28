"use strict";
//Express module dependencies
var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var morgan     = require("morgan");
var mysql      = require('mysql');
var jwt        = require('jsonwebtoken');
var config     = require('./config');

//Create pooled connection to database
var pool        = mysql.createPool({
  connectionLimit : 30,
  host            : config.mysql.host,
  user            : config.mysql.user,
  password        : config.mysql.password,
  database        : config.mysql.db
});

// Load routes
var users          = require('./routes/users');
var portfolios     = require('./routes/portfolios');
var stockhistory   = require('./routes/stockhistory');
var classes        = require('./routes/classes');

app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(bodyParser.json({limit: "50mb"}));

app.use(morgan("dev"));

//Allow requests from different domains
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST");
  next();
});

//Set port to 8080
var port = process.env.port || 8080;
var router = express.Router();
app.set('SecretVariable', config.json.secret); // sets secret variable for JWT encryption

//Test route to test that everything's working ok
router.get("/", function(req, res){
  res.json({ message: "API incoming!"});
});

router.route('/authenticate')
  .post(function(req, res){
    console.log("step 1 complete");
    pool.query("SELECT pass FROM users WHERE username = " +req.body.username, function(err, rows, fields){
      if (err) throw(err);
      if (rows == req.body.pass) {
        var token = jwt.sign(user, app.get("SecretVariable"), {
          expiresInMinutes: 1440
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

//Use routes
app.use('/api/', users);
app.use('/api/', portfolios);
app.use('/api/', stockhistory);
app.use('/api/', classes);
app.listen(port);
//Show API is working in console
console.log("example API is running on port 8080");

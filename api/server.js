"use strict";
var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var morgan     = require("morgan");
var mysql      = require('mysql');
var config     = require('./config');

var pool        = mysql.createPool({
  connectionLimit : 30,
  host            : config.mysql.host,
  user            : config.mysql.user,
  password        : config.mysql.password,
  database        : config.mysql.db
});

// load routes
var users          = require('./routes/users');
var portfolios     = require('./routes/portfolios');
var stockhistory   = require('./routes/stockhistory');
var classes        = require('./routes/classes');

app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(bodyParser.json({limit: "50mb"}));

app.use(morgan("dev"));

//allow requests from different domains
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST");
  next();
});

var port = process.env.port || 8080;
var router = express.Router();

//test route to test that everything's working ok
router.get("/", function(req, res){
  res.json({ message: "API incoming!"});
});

//CRUD routes for widgets

router.route('/stocknames')
    .get(function(req, res){
        pool.query('Select TOP 1 sampletime FROM stockhistory ORDER BY sampletime DESC', function(err, rows, fields){
          if (err) console.log(err);
          var newestsampletime = rows[0].sampletime;
          pool.query('Select * FROM stocknames INNER JOIN stockhistory ON stocknames.stockid=stockhistory.stockid WHERE sampletime =' + newestsampletime + ' ORDER BY stockname', function(err, rows, fields){
            if (err) console.log(err);
            res.json(rows);
          });
        });
    })
    //Add stock(By name)
    .post(function(req, res){
      pool.query('INSERT INTO stockname (stockticker, stockname) VALUES(\''  + req.body.stockticker + '\', \'' + req.body.stockname + '\')', function(err, rows, fields){
        if(err) console.log(err);
        res.json("Stock " +req.body.stockname+ " created")
      });
    });

app.use('/api/', users);
app.use('/api/', portfolios);
app.use('/api/', stockhistory);
app.use('/api/', classes);
app.listen(port);
console.log("example API is running on port 8080");

"use strict";
var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var morgan     = require("morgan");
var mysql      = require('mysql');

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

//TODO: put mysql config details in a config.json file
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'Jamesk',
  password : 'Jamesk1',
  database : 'Database'
});

//CRUD routes for widgets
router.route('/stocks')
  //Should get all widgets
  .get( function(req, res){
      //Query the database for all stocks - returns all stocks in a 'rows' object
      /*
      connection.connect();
      connection.query('Select * FROM Stocks ORDER BY Name', function(err, rows, fields){
        if (err) throw err;

        res.json(rows);
      })
      connection.end(); */
      var testArray = [
        {
          'idStock': "1",
          'StockName': 'Google'
        },
        {
          'idStock': "2",
          'StockName': 'Apple'
        }
      ]

      res.json(testArray)
  })
  .post()
  .put()
  .delete();

router.route('/stocks/:stockid')
  .get(function(req,res){
    connection.connect();

    connection.query('SELECT * FROM stocks WHERE stockid = ' + req.params.stockid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });

    connection.end();
  });

app.use("/api", router);
app.listen(port);
console.log("example API is running on port 8080");

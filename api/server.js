"use strict";
var express    = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json({limit: "50mb"}));
app.user(bodyParser.json({limit: "50mb", extended: true}))

//allow requests from different domains
app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST");
  next();
});

port = process.env.port || 8081;
router = express.Router();

//test route to test that everything's working ok
router.get("/", function(req, res){
  res.json({ message: "API incoming!"});
});

app.listen(port);
console.log("example API is running on port 8081")

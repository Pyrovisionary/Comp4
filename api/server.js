"use strict";

var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var morgan        = require("morgan");
var mysql         = require('mysql');
var jwt           = require('jsonwebtoken');
var config        = require('./config');
var asynchronous  = require('async');
var cors          = require('cors');

//Create pooled connection to database, using data from the database config file
var pool        = mysql.createPool({
  connectionLimit : 30,
  host            : config.mysql.host,
  user            : config.mysql.user,
  password        : config.mysql.password,
  database        : config.mysql.db
});

// Load routes from files
var users          = require('./routes/users');
var portfolios     = require('./routes/portfolios');
var stockhistory   = require('./routes/stockhistory');
var classes        = require('./routes/classes');
var authenticate   = require('./routes/authenticate');

// Set a default limit on data transfers (50mb is much higher than the default),
// and suits our data transmission purposes much better
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(bodyParser.json({limit: "50mb"}));

app.use(morgan("dev"));
app.use(cors());

app.options('*', cors());

//Set port to 8080
var port = process.env.port || 8080;
var router = express.Router();
app.set('secretVariable', config.json.secret); // sets secret variable for JWT encryption

//Test route to test that everything's working ok
//The following message is displayed on the console when the server starts up.
router.get("/", function onEnd(req, res){
  res.json({ message: "API incoming!"});
});

router.use(function(req, res, next){

  //The following code handles JWT authorisation.
  //find the token from the request, as either a header or in the body.
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  //Determine if the request is a CORS preflight options request
  var option = req.headers['access-control-request-method'];

  if (option) {
    //If the request is a CORS preflight options request, return with a 200
    //status to allow following reqeusts
    return res.sendStatus(200);
    next();
  } else{
    if (token) {
      jwt.verify(token, app.get('secretVariable'), function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: "Authentication failed, token rejected" });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      //Return error when no token is provided
      return res.status(403).send({
          success: false,
          message: "No token provided."
      });
    }
}

});

//Use routes
app.use('/api/', authenticate);
app.use('/api', router);
app.use('/api/', users);
app.use('/api/', portfolios);
app.use('/api/', stockhistory);
app.use('/api/', classes);
app.listen(port);
//Show API is working in console
console.log('API is running on port 8080');

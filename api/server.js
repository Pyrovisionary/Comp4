"use strict";
//Express module dependencies
//Express is what runs the server, and it is then defined as a variable to shorten
//later code. Body parser is used to TODO: why do we use body parser and morgan
// Mysql is used to allow the server to communicate with the database, JWT to create and sign JSON web tokens
// Our config is required, this is so the passwords for the database are stored in a seperate file, one that
//isnt uploaded to the git repository. Async is used to asynchronously deal with requests.
var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var morgan        = require("morgan");
var mysql         = require('mysql');
var jwt           = require('jsonwebtoken');
var config        = require('./config');
var asynchronous  = require('async');

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
var cors           = require('cors')

// Set a default limit on data transfers (50mb is much higher than the default),
// and suits our data transmission purposes much better
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(bodyParser.json({limit: "50mb"}));

//Use morgan, TODO: why do I use morgan
app.use(morgan("dev"));
//Use cors module to enable options and put AJAX requests
app.use(cors());



//Allow requests from different domains, allow GET, POST and OPTIONS requests,
//allow the following headers when cross origin requests are made
app.options('*', cors());
/*app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET", 'PUT', "POST", 'OPTIONS' );
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, origin, Authorization, x-access-token, accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});*/

//Set port to 8080
var port = process.env.port || 8080;
var router = express.Router();
app.set('SecretVariable', config.json.secret); // sets secret variable for JWT encryption

//Test route to test that everything's working ok
//The following message is displayed on the console when the server starts up.
router.get("/", function(req, res){
  res.json({ message: "API incoming!"});
});

router.use(function(req, res, next){

//The following code handles JWT authorisation.
//find the token from the request, as either a header or in the body.
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

//Determine if the request is a CORS preflight options request
  var option = req.headers['access-control-request-method'];

//If the request is a CORS preflight options request, return with a 200 status to allow following reqeusts
  if (option) {
    return res.sendStatus(200);
    next();
  } else{
//If the request isn't an CORS preflight options request;
    if (token) {
//If the user has a JWT
//Decode the JSON web-token using the secret variable
      jwt.verify(token, app.get('SecretVariable'), function(err, decoded) {
//If there's an error decoding it, reject the token and send the following message
        if (err) {
          return res.json({ success: false, message: 'Authentication failed, token rejected' });
        } else {
// if the token is valid, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
//Return error when no token is provided
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
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
console.log("example API is running on port 8080");

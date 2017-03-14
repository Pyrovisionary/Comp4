'use strict';

var express    = require('express');
var morgan     = require('morgan');
var bodyParser = require('body-parser');
var app        = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(express.static(__dirname + '/public'));

//single page app
app.use(function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var port = process.env.PORT || 8088;

app.listen(port);
console.log('LloydGeorge UI running on port ' + port);

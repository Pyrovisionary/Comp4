"use strict";
//Define dependencies. Node schedule is used to repeat a task within a certain time frame.
var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mysql         = require('mysql');
var config        = require('./config');
var schedule      = require('node-schedule');
var asynchronous  = require('async');
var request       = require('request');

//Pool a connection to the mysql database
var pool          = mysql.createPool({
  connectionLimit : 30,
  host            : config.mysql.host,
  user            : config.mysql.user,
  password        : config.mysql.password,
  database        : config.mysql.db
});

//Log to the console that the stockautoupdater is online
console.log("Scheduled stock autoupdate online");

// Schedule the following code to repeat every TODO: decide timeframe, else, every hour.
//var j = schedule.scheduleJob('* */60 * * *', function(){
  var builtstrings = [];

//Select all of the stocktickers from the stocknames table in the DB.
  pool.query('Select stockticker FROM stocknames', function(err, rows, fields){
    if (err) console.log(err);

//The stock autoupdater uses Yahoo query language to get stock info from the Yahoo finance api.
//The following variables are the begining and end of the http request that the stock autoupdater
//sends off to get stock values. The variable x='"' is defined so that I can quickly and easly concat
//quotation marks around stocknames whilst building the resuest string
    var requeststring = "https://query.yahooapis.com/v1/public/yql?q=select Symbol, LastTradePriceOnly, MarketCapitalization, StockExchange, Change from yahoo.finance.quote where symbol in (";
    var endrequeststring = ")&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&jsonCompat=new&callback=";
//This establishes the timestamp variable, to record the datetime when the data is collected.
//As the stockdata requests are sent off and responded to, and entered into the db asynchronously,
//This variable makes sure that they all have the same timestamp for reference.
    var timestamp = Math.floor(Date.now()/1000);
    var x = '"';
//Yahoo's finance api will only accept requests for info on up to 1000 stocks at a time, hence the
//maxrequestlength variable is set to 1000
    var maxrequestlength = 1000;
//The total amount of stocks to get the prices of is divided by 1000, then rounded up, to determine
//how many requests to Yahoo's finance API will be needed. As the stocknames table has between 3 and 4
//Thousand stocks to get info on, the amount of requests needed is usually 4.
    var len=Math.ceil(rows.length/maxrequestlength);

//The autoupdater loops through the following code for the amount of requests that are needed. (in this case, 4 times)
    for(var i=0;  i<len; i++){

//The variable that this program will use to concat the request is cleared.
      var querystring = '';
      var end=((i+1)*maxrequestlength);
      if (i==len-1) {
        end=((i)*maxrequestlength)+(rows.length-(maxrequestlength*(len-1)))};
      querystring = querystring + requeststring;
      for(var j=(i*maxrequestlength); j<end; j++){
        querystring = querystring + x + rows[j].stockticker+ x;
        if(j<end-1) querystring = querystring + ',';
      };
      querystring = querystring + endrequeststring;
      builtstrings.push(querystring);
    };
    asynchronous.each(builtstrings, function(querystring, complete){
      console.log("Request sent");
      request(querystring, function(err, res, body){
        if(err) console.log(err);
        if(body === null || body === undefined){
          console.log('Request has failed to return any results');
        };
      body=JSON.parse(body);
      //console.log(body.query.results.quote[0])
      //complete()
        asynchronous.each(body.query.results.quote, function(stock, callback){

          pool.query('SELECT stockid FROM stocknames WHERE stockticker='+"'"+stock.Symbol+"'", function(err, rows, field){
              if(err) console.log(err);
              for(var k=0; k<rows.length; k++){
                pool.query('INSERT INTO stockhistory (stockid, stockvalue, stockvaluepercentagechange, sampletime, stockmarketcap, stockexchange) VALUES(\''  + rows[k].stockid+ '\', \'' + stock.LastTradePriceOnly+ '\', \''+stock.Change+ '\', \''+timestamp+'\', \''+ stock.MarketCapitalization +'\', \''+ stock.StockExchange + '\')', function(err){
                  if(err) console.log(err);
                  callback();
                });
              };
            });
        },
        function(err){
          console.log('done!')
          complete();
        });
      });
    }, function(err){
    console.log(' all done!');
    });
  });
//});

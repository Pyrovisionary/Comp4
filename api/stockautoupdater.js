"use strict";
var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mysql         = require('mysql');
var config        = require('./config');
var schedule      = require('node-schedule');
var asynchronous  = require('async');
var request       = require('request');

var pool          = mysql.createPool({
  connectionLimit : 30,
  host            : config.mysql.host,
  user            : config.mysql.user,
  password        : config.mysql.password,
  database        : config.mysql.db
});
console.log("Scheduled stock autoupdate online");
var j = schedule.scheduleJob('* * */12 * * *', function(){
  console.log("Stocks updated!");
  var builtstrings = [];
  pool.query('Select stockticker FROM stocknames', function(err, rows, fields){
    if (err) console.log(err);
    var requeststring = "https://query.yahooapis.com/v1/public/yql?q=select Symbol, LastTradePriceOnly, Volume from yahoo.finance.quote where symbol in (";
    var endrequeststring = ")&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&jsonCompat=new&callback=";
    var x = '"';
    var maxrequestlength = 1000;
    var len=Math.ceil(rows.length/maxrequestlength);
    for(var i=0;  i<len; i++){
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
        asynchronous.each(body.query.results.quote, function(stock, callback){
          pool.query('SELECT stockid FROM stocknames WHERE stockticker='+"'"+stock.Symbol+"'", function(err, rows, field){
              if(err) console.log(err);
              for(var k=0; k<rows.length; k++){
                pool.query('INSERT INTO stockhistory (stockid, stockvalue, volume) VALUES(\''  + rows[k].stockid+ '\', \'' + stock.LastTradePriceOnly + '\', \''+stock.Volume + '\')', function(err){
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
});

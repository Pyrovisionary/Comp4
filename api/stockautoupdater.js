"use strict";
var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mysql      = require('mysql');
var config     = require('./config');
var schedule   = require('node-schedule');
var async      = require('async');
var request = require('request');

var pool        = mysql.createPool({
  connectionLimit : 30,
  host            : config.mysql.host,
  user            : config.mysql.user,
  password        : config.mysql.password,
  database        : config.mysql.db
});

//var j = schedule.scheduleJob('* * */12 * * *', function(){

var requeststring = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(";
var endrequeststring = ")&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
var x = '"';
var builtstrings= new Array;
pool.query('Select stockticker FROM stocknames', function(err, rows, fields){
  if (err) console.log(err);
  var maxrequestlength = 1000;
  var len=Math.ceil(rows.length/maxrequestlength);
  for(var i=0;  i<len; i++){
    var querystring = '';
    var end=((i+1)*maxrequestlength);
    if (i==len-1) {
      end=((i)*maxrequestlength)+(rows.length-(maxrequestlength*(len-1)))};
    querystring = querystring + requeststring;
    for(var j=(i*maxrequestlength); j<end; j++){
      //console.log(rows[j])
      querystring = querystring + x + rows[j].stockticker+ x;
      if(j<end-1) querystring = querystring + ',';
    };
    querystring = querystring + endrequeststring;
    builtstrings.push(querystring);
    //console.log(querystring)
  };
});
console.log(builtstrings);
async.each(builtstrings, function(querystring, complete){
  request(querystring, function(err, res, body){
    if(err) console.log(err);
    if(body === null || body === undefined){
      console.log('Request has failed to return any results');
    }
    async.each(body.query.results.quote, function(stock, callback){
      console.log(stock);
        pool.query('SELECT stockid FROM stocknames WHERE stockticker='+stock.Symbol, function(err, rows, field){
          console.log(rows);
          if(err) console.log(err);
          pool.query('INSERT INTO stockhistory (stockid, stockvalue, volume) VALUES(\''  + rows.stockid + '\', \'' + body.quote.LastTradePriceOnly + '\', \''+body.quote.Volume + '\')', function(err){
            if(err) console.log(err);
            callback();
          });
        });
    },
    function(err){
      console.log('all done!')
      complete();
    });
  });
}, function(err){
console.log('done!');
});

//});

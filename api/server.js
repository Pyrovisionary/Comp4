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
var auth            = require('./routes/auth');
var departments     = require('./routes/departments');
var ensembles       = require('./routes/ensembles');

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
router.route('/classes')
  //Get all classes (Just Id's and names)
  .get(function(req, res){
    pool.query('SELECT * FROM classes', function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })
  //Create a class
  .post(function(req, res){
    pool.query('INSERT INTO classes (classname) VALUES(\''  + req.body.classname +'\')', function(err, rows, fields){
      if(err) console.log(err);
      res.json("Class " +req.body.classname+ " created")
    });
  });


router.route('/classes/:classid')
  //Get a specific class
  .get(function(req, res){
    pool.query('SELECT * FROM classes INNER JOIN classuserlink ON classes.classid = classuserlink.classid WHERE classid = ' + req.params.classid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })
  //Update a specific class
  .put(function(req,res){
    pool.query('UPDATE classes SET classname="'+ req.body.classname +'" WHERE classid =' + req.params.classid, function(err, rows, fields){
      if (err) console.log(err);
      res.json("Classname updated");
    });

  })
  //Add a pupil to a class
  .post(function(req, res){
    pool.query('INSERT INTO classuserlink (classid, userid) VALUES(\''  + req.body.classid +'\' \'' + req.body.userid +'\')', function(err, rows, fields){
      if(err) console.log(err);
      res.json("User " +req.body.userid+ " added to class " + req.body.classid )
    });
  })
  //Delete a specific class
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM classes WHERE classid = ' + req.params.classid +"; DELETE FROM classuserlink WHERE classid = " +req.params.classid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "Class " + req.params.classid + "deleted successfully!"});
    });
  });


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


router.route('/stocknames/:stockid')
  //get one stock
  .get(function(req,res){
    pool.query('SELECT * FROM stocknames WHERE stockid=' + req.params.stockid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows[0]);
    });
  })
  //Update a stock
  .put()
  //Delete a stock
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM stocknames WHERE stockid = ' + req.params.stockid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "Stock" + req.params.stockid + "deleted successfully!"});
    });
  });


router.route('/stockhistory')
.post(function(req, res){
  pool.query('INSERT INTO stockhistory (stockid, stockvalue, volume) VALUES(\''  + req.body.stockid + '\', \'' + req.body.stockvalue + '\', \''+req.body.volume + '\')', function(err, rows, fields){
    if(err) console.log(err);
    res.json("Stock " +req.body.stockid+ " updated")
  });
});


router.route('/users')
  //Get all users
  .get(function(req, res){
    pool.query('Select * FROM users', function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })
  //Add user
  .post(function(req, res){
    pool.query('INSERT INTO users (username, forename, surname, email, teacher) VALUES(\''  + req.body.username + '\', \'' + req.body.forename + '\', \'' + req.body.surname + '\', \'' + req.body.email + '\', \'' + req.body.teacher +'\')', function(err, rows, fields){
      if(err) console.log(err);
      res.json("User " +req.body.username+ " created")
    });
  });

router.route('/users/:userid')
  //Get a user
  .get(function(req,res){
    pool.query('SELECT * FROM users WHERE userid=' + req.params.userid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows[0]);
    });
  })
  //Update a user
  .put(function(req, res){
    pool.query('UPDATE users SET'+req.body.changeddatatype+'=' +req.body.changeddata+ 'WHERE userid = ' + req.params.userid, function(err, rows, fields){
      if (err) console.log(err);
      res.json("User " + req.params.userid + " updated");
    });
  })
  //Delete a user
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM users WHERE userid = ' + req.params.userid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "User deleted successfully!"});
    });
  });


router.route('users/:userid/:classes')
//Get a user's classes
  .get(function(req, res){
    pool.query('Select * FROM classes WHERE userid = ' + req.params.userid , function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  });

router.route('/portfolios')
//Get all portfolios
  .get(function(req, res){
    pool.query('Select * FROM portfolios', function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })
  //Create a new portfolio
  .post(function(req, res){
    pool.query('INSERT INTO portfolios (userid, portfolioname) VALUES(\''  + req.body.userid + '\', \'' + req.body.portfolioname +'\')', function(err, rows, fields){
      if(err) console.log(err);
      res.json("Portfolio " +req.body.portfolioname+ " created")
    });
  });


router.route('/portfolios/:portfolioid')
  //Get a specific portfolio
  .get(function(req, res){
    pool.query('SELECT * FROM portfolios WHERE portfolioid=' + req.params.portfolioid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows[0]);
    });
  })
  //Update a specific portfolio
  .put(function(req, res){
  })
  //Delete a specific portfolio
  .delete(function(req,res){
    console.log("Attempting to delete");
    pool.query('DELETE FROM portfolios WHERE portfolioid = ' + req.params.portfolioid, function(err, rows,fileds){
      if(err) console.log(err);
      res.json({message: "Portfolio deleted successfully!"});
    });
  });

router.route('/portfolios/:portfolioid/:stockid')
  //Add a specific stock to a specific portfolio
  .post(function(req, res){
    pool.query('SELECT TOP 1 FROM stockhistory WHERE stockid = ' + req.params.stockid +' ORDER BY sampletime DESC', function(err, rows, fields){
      if(err) console.log(err);
      var buyprice = rows[0].stockvalue
      pool.query(' INSERT INTO portfoliostocklink (portfolioid, stockid, buyprice, volume) VALUES(\''  + req.body.portfolioid + '\', \'' + req.body.stockid + '\', \'' + buyprice + '\', \''+ req.body.volume+'\')', function(err, rows, fields){
        if(err) console.log(err);
        res.json("Stock " +req.body.stockid+ " added to portfolio " + req.body.portfolioid)
      });
    });
  });


router.route('/portfolios/:userid')
  //Get a user's portfolio
  .get(function(req, res){
    pool.query('SELECT * FROM portfolios WHERE userid=' + req.params.userid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  });


router.route('/portfolios/:userid/:portfolioid')
  //Get a specific portfolio + all the portfoliostocklink data
  .get(function(req, res){
    pool.query('SELECT * FROM portfolios INNER JOIN portfoliostocklink ON portfolios.'+req.params.portfolioid+' = portfoliostocklink.'+req.params.portfolioid+'  AND WHERE userid = ' + req.params.userid, function(err, rows, fields){
      if (err) console.log(err);
      res.json(rows);
    });
  })


app.use("/api", router);
app.use('/api/', auth);
app.use('/api/', departments);
app.use('/api/', ensembles);
app.listen(port);
console.log("example API is running on port 8080");

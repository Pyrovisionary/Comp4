(function() {

var app = angular.module('myApp', ['ngRoute', 'ngResource']);

app.factory('authInterceptor', function(API, auth, $location){
  //Add the auth header to each request
  return {
      request: function(config) {
        var token = auth.getToken();
        if(config.url.indexOf(API) === 0 && token) {
          config.headers['x-access-token'] =token;
        }
        return config;
    },
    //Save tokens that get returned
    response: function(res) {
      if ( res.status=== 401 || res.status === 403 ){
        //$location.path('/login');
      }

      if(res.config.url.indexOf(API) === 0 && res.data.token) {
        auth.saveToken(res.data.token);
        $location.path('/profile');
        $location.replace();
      }
      return res;
    }

  };
});


//Log a user in (Authorise them)
app.factory('AuthLogin', function($resource, API){
  return $resource( API + '/authenticate/', {username: "@user", pass: '@password'});
});

//Create a user
app.factory('AuthRegister', function($resource, API){
  return $resource( API + '/authenticate/users/', {username:'@user', forename:'@forename', surname:'@surname', pass:'@pass', email:'@email', teacher:'@teacher'});
});

//GET all of a user's data
app.factory('UserData', function($resource, API){
  return $resource( API + '/users/:userid', {userid:'@userid'});
});

//Rename a user TODO: put request

//Create a class
app.factory('ClassCreate', function($resource, API) {
  return $resource(API + '/classes', {classname:'@classname'});
});

//Rename a class TODO: put request

//Add a user to a class
app.factory('ClassAddUsers', function($resource, API){
  return $resource(API + '/classes/:classid', {classid:'@classid', userid:'@userid'});
});

//Remove a user from a class TODO: add deleting to be allowed requests in some cases

//Get a student's portfolios as a teacher TODO: this

//Get all of a user's classes' IDs
app.factory('GetUserClasses', function($resource, API){
  return $resource(API + '/classes/users/:userid', {userid:'@userid'});
});

//Create a portfolio
app.factory('CreatePortfolio', function($resource, API){
  return $resource(API + '/portfolios', {userid:'@userid', portfolioname:'@portfolioname'});
});

//Rename a portfolio TODO: make this route
/*app.factory('RenamePortfolio', function($resource, API){
  return $resource(API + '/portfolios', {userid:'@userid', portfolioname:'@portfolioname'});
});*/

//Get all of a user's portfolios
app.factory('GetUserPortfolios', function($resource, API){
  return $resource(API + '/portfolios/users/:userid', {userid:'@userid'});
});

app.factory('UpdateAccountBalance', function($resource, API){
  var data = $resource(API + '/users/stocks/', {userid:'@userid', cost:'@cost'}, {
    update:{
      method:'PUT'
    }
  });
  return data
});

//Get the value of a user's portfolio TODO: make this route
/*app.factory('GetPortfolioValue', function($resource, API){
  return $resource(API + '/portfolios', {userid:'@userid', portfolioid:'@portfolioid'});
});*/

//Remove a stock (sell it) from a portfolio
app.factory('SellStock', function($resource, API){
  return $resource(API + '/portfolios/stocks/users/', {portfoliostocklinkid:'@portfoliostocklinkid', sellvolume:'@sellvolume', volume:'@volume'});
});

//Get latest data for one stock
app.factory('GetStockPrice', function($resource, API){
  return $resource(API + '/stockhistory/:stockid', {stockid:'@stockid'})
});

//Get all stocks
app.factory('GetStocks', function($resource, API){
  return $resource(API + '/stocknames/stockhistory');
});

//Search stocks (get stocks by name/ticker) TODO: this
app.factory('GetSearchedStocks', function($resource, API){
  //return $resource(API + '/portfolios', {userid:'@userid', portfolioid:'@portfolioid'});
});

//Buy stock
app.factory('BuyStock', function($resource, API){
  return $resource(API + '/portfolios/stocks/users/', {stockid:'@stockid', userid:'@userid', portfolioname:'@portfolioname', volume:'@volume', price:'@price'});
});

app.constant('API', 'http://localhost:8080/api');

//TODO: make these filters look more authentic
app.filter('pagination', function(){
  return function(input, start){
    start = +start;
    return input.slice(start);
    };
});

app.filter('unique', function() {
   return function(collection, keyname) {
      var output = [];
      var keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});

})();

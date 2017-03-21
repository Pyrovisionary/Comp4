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

//Get all of the stocks in a user's portfolio
app.factory('GetPortfolioStocks', function($resource, API){
  return $resource(API + '/portfolios/users/:portfolioid', {userid:'@userid', portfolioid:'@portfolioid'});
});

//Get the value of a user's portfolio TODO: make this route
/*app.factory('GetPortfolioValue', function($resource, API){
  return $resource(API + '/portfolios', {userid:'@userid', portfolioid:'@portfolioid'});
});*/

//Remove a stock (sell it) from a portfolio
app.factory('SellStock', function($resource, API){
  //return $resource(API + '/portfolios', {userid:'@userid', portfolioid:'@portfolioid'});
});

//Get stocks
app.factory('GetStocks', function($resource, API){
  //return $resource(API + '/portfolios', {userid:'@userid', portfolioid:'@portfolioid'});
});

//Search stocks (get stocks by name/ticker)
app.factory('GetSearchedStocks', function($resource, API){
  //return $resource(API + '/portfolios', {userid:'@userid', portfolioid:'@portfolioid'});
});

//Buy stock
app.factory('BuyStock', function($resource, API){
  return $resource(API + '/portfolios/stocks/:portfolioid', {stockid:'@stockid', portfolioid:'@portfolioid', volume:'@volume'});
});

app.constant('API', 'http://localhost:8080/api');

})();

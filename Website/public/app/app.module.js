(function() {

angular
  .module('myApp', [
    'ngRoute',
    'ngResource',
    'ngSanitize'
  ])
  .factory('authInterceptor', authInterceptor)
  .factory('authLogin', authLogin)
  .factory('authRegister', authRegister)
  .factory('userData', userData)
  .factory('classCreate', classCreate)
  .factory('classAddUsers', classAddUsers)
  .factory('removeUserFromClass', removeUserFromClass)
  .factory('getUserClasses', getUserClasses)
  .factory('createPortfolio', createPortfolio)
  .factory('getUserPortfolios', getUserPortfolios)
  .factory('updateAccountBalance', updateAccountBalance)
  .factory('sellStockDelete', sellStockDelete)
  .factory('sellStockPut', sellStockPut)
  .factory('getStockPrice', getStockPrice)
  .factory('getStocks', getStocks)
  .factory('buyStock', buyStock)
  .constant('API', 'http://localhost:8080/api')
  .filter('pagination', pagination)
  .filter('uniqueFilter', uniqueFilter);

  function authInterceptor(API, auth, $location){
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
  };

  //Log a user in (Authorise them)
  function authLogin($resource, API){
    return $resource( API + '/authenticate/', {username: "@user", pass: '@password'});
  };

  //Register a user
  function authRegister($resource, API){
    return $resource( API + '/authenticate/users/', {username:'@user', forename:'@forename', surname:'@surname', pass:'@pass', email:'@email', teacher:'@teacher'});
  };

  //Get all of a user's data
  function userData($resource, API){
    return $resource( API + '/users/:userid', {userid:'@userid'});
  };

  //Create a class
  function classCreate($resource, API) {
    return $resource(API + '/classes', {classname:'@classname'});
  };

  //Add a user to a class
  function classAddUsers($resource, API){
    return $resource(API + '/classes/:classid', {classid:'@classid', userid:'@userid'});
  };

  //Remove a user from a class
  function removeUserFromClass($resource, API){
    return $resource(API + '/classes/users/:userid', {userid:'@userid', classid:'@classid'});
  };

  //Gets all of a user's classes
  function getUserClasses($resource, API){
   return $resource(API + '/classes/users/:userid', {userid:'@userid'});
 };

 //Create a portfolios
 function createPortfolio($resource, API){
   return $resource(API + '/portfolios', {userid:'@userid', portfolioname:'@portfolioname'});
 };

 //Gets all of a user's portfolios
 function getUserPortfolios($resource, API){
   return $resource(API + '/portfolios/users/:userid', {userid:'@userid'});
 };

 //Updates a user's account balance
 function updateAccountBalance($resource, API){
   var data = $resource(API + '/users/stocks/', {userid:'@userid', cost:'@cost'}, {
     update:{
       method:'PUT'
     }
   });
   return data
 };

 //Sells all of a user's stock
 function sellStockDelete($resource, API){
   return $resource(API + '/portfolios/stocks/users/', {portfoliostocklinkid:'@portfoliostocklinkid', sellvolume:'@sellvolume', volume:'@volume'});
 };

 //Sells some of a user's stocks
 function sellStockPut($resource, API){
   var data = $resource(API + '/portfolios/stocks/users/', {portfoliostocklinkid:'@portfoliostocklinkid', sellvolume:'@sellvolume', volume:'@volume'},{
     update:{
       method:'PUT'
       }
     });
   return data;
 };

 //Gets the latest data for one stock
 function getStockPrice($resource, API){
   return $resource(API + '/stockhistory/:stockid', {stockid:'@stockid'})
 };

 //Gets all stocks
 function getStocks($resource, API){
   return $resource(API + '/stocknames/stockhistory');
 };

 //Buy a stock
 function buyStock($resource, API){
   return $resource(API + '/portfolios/stocks/users/', {stockid:'@stockid', userid:'@userid', portfolioname:'@portfolioname', volume:'@volume', price:'@price'});
 };


 //Filter through a list and return a list of unique items
 function uniqueFilter() {
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
 }

 //Paginate a list
 function pagination(){
   return function(input, start){
     start = +start;
     return input.slice(start);
     };
 }

})();

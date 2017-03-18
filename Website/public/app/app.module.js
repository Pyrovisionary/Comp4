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

//Create a class
app.factory('ClassCreate', function($resource, API) {
  return $resource(API + '/classes', {classname:'@classname'});
});

//Add a user to a class
app.factory('ClassAddUsers', function($resource, API){
  return $resource(API + '/classes/:classid', {classid:'@classid', userid:'@userid'});
});

//Get all of a user's classes' IDs
app.factory('GetUserClassIds', function($resource, API){
  return $resource(API + '/classes/users/:userid', {userid:'@userid'});
});

//Get the name of a class by its ID
app.factory('GetUserClassNames', function($resource, API){
  return $resource(API + '/classes/:classid', {classid:'@classid'});
});

//Get all of the users in a class
app.factory('GetUsersByClass', function($resource, API){
  return $resource(API + '/', {classid:'@classid'});
});


app.constant('API', 'http://localhost:8080/api');

})();

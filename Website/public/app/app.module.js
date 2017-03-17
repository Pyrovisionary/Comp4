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


// TODO: use $resource to start making requests
app.factory('AuthLogin', function($resource, API){
  return $resource( API + '/authenticate/', {username: "@user", pass: '@password'});
});

app.factory('UserData', function($resource, API){
  return $resource( API + '/users/:userid', {userid:'@userid'});
});

app.factory('AuthRegister', function($resource, API){
  return $resource( API + '/authenticate/users/', {username:'@user', forename:'@forename', surname:'@surname', pass:'@pass', email:'@email', teacher:'@teacher'});
});


app.service('data', function( auth, $http, API){
  var self = this;

  self.getUserData() = function() {
    var token = auth.getToken();
    return $http({
      method: 'GET',
      url: API +'/users',
      headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'username':username,
        'pass':password
            }
    });
  };


});

app.constant('API', 'http://localhost:8080/api');

})();

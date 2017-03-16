(function() {

var app = angular.module('myApp', ['ngRoute', 'ngResource']);

app.factory('authInterceptor', function(API, auth, $location){
  //Add the auth header to each request
  return {
      request: function(config) {
        var token = auth.getToken();
        if(config.url.indexOf(API) === 0 && token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    //Save tokens that get returned
    response: function(res) {
      if ( res.status=== 401 || res.status === 403 ){
        $location.path('/login');
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
app.factory('AuthService', function($resource, API){
  return $resource( API + '/authenticate',{user: "@user"});
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

app.controller('onLoadCtrl', function(auth, $scope){
    auth.RedirectIfLoggedIn();
  });

app.controller('navbarCtrl', function(auth, $scope){
  var self = this;

  //TODO: active tab has outline (copy from tabs section of Codeschool's angular course)

  self.logout = function() {
    auth.logout && auth.logout()
  };

  self.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  };
});


})();

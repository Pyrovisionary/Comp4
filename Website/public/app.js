(function() {

var app = angular.module('myApp', ['ngRoute']);

app.factory('authInterceptor', function(API, auth){
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
      if(res.config.url.indexOf(API) === 0 && res.data.token) {
        auth.saveToken(res.data.token);
      };
      return res;
    }
  };
});

app.service('user', function($http, API, auth){
  var self = this;

  self.register = function( newusername, newforename, newsurname, newpassword, newemail, teacheryn){
    return $http({
      method: 'POST',
      url: API +'/authenticate/users/',
      headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'username': newusername,
        'forename': newforename,
        'surname':  newsurname,
        'pass': newpassword,
        'email': newemail,
        'teacher': teacheryn
      }
    });

  };

  self.login = function(username, password){
    return $http({
      method: 'POST',
      url: API +'/authenticate',
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

app.service('auth', function($window){
  var self = this;

  self.parseJwt = function(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  };

  self.saveToken = function(token) {
    $window.localStorage['jwtToken'] = token;
  };

  self.getToken = function() {
    return $window.localStorage['jwtToken'];
  };

  self.isAuthed = function() {
    var token = self.getToken();
    if(token) {
      var params = self.parseJwt(token);
      return Math.round(new Date().getTime() / 1000) <= params.exp;
    } else {
      return false;
    };
  };

  self.logout = function() {
    $window.localStorage.removeItem('jwtToken');
  };
});

app.constant('API', 'http://localhost:8080/api');

app.config(function($httpProvider, $routeProvider, $locationProvider) {
  $routeProvider
    .when("/", {
        templateUrl : "routes/profile.htm"
    })
    .when('/portfolios', {
        templateUrl : 'routes/portfolios.htm'
    })
    .when('/classes', {
        templateUrl : 'routes/classes.htm'
    })
    .when('/stocks', {
        templateUrl : 'routes/stocks.htm'
    });
    $httpProvider.interceptors.push('authInterceptor');
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    } );

});

app.controller('login', function(user, auth, $scope){
  var self = this;

  function handleRequest(res) {
    console.log(res.data);
    var token = res.data ? res.data.token : null;
    if(token) { console.log('JWT:', token); }
    self.message = res.data.message;
  };

  self.login = function($scope) {
    console.log('Username is: ' + self.username + ', Password is: ' + self.password);
    user.login(self.username, self.password)
      .then(handleRequest, handleRequest);
  };

  self.register = function() {
    user.register(self.newusername, self.newforename, self.newsurname, self.newpassword, self.newemail, self.teacheryn)
      .then(handleRequest, handleRequest)
  };

  self.logout = function() {
    auth.logout && auth.logout()
  };

  self.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  };

  $scope.activeTab = 1;
  $scope.isSet = function(tabName){
    return $scope.activeTab === tabName;
  };
  $scope.setTab = function(newValue){
    $scope.activeTab = newValue;
  };
});

app.controller('dash', function($scope){


});


})();

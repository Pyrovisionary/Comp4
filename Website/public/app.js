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
      if ( res.status=== 401 || res.status === 403 ){
        $location.path('/login');
      }

      if(res.config.url.indexOf(API) === 0 && res.data.token) {
        auth.saveToken(res.data.token);
      }
      return res;
    },

  };
});

app.service('user', function($http, API, auth, $window, $location){
  var self = this;

  self.register = function( newusername, newforename, newsurname, newpassword, newemail, teacheryn){
    $location.path('/profile');
    $location.replace();
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
    $location.path('/profile');
    $location.replace();
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

app.service('auth', function($window, $rootScope, $location){
  var self = this;

  self.parseJwt = function(token) {
    $rootScope.token = token;
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
    //$rootScope.user = JSON.parse($window.atob(base64));
  };

  /*self.isAuthed = function(){
    console.log('Got to service')
    console.log($rootScope.user);
    return !!$rootScope.user;
  };

  self.getUser = function(){
    return $rootScope.user;
  };

  self.getToken = function(){
    return $rootScope.token;
  };*/

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
    $location.path('/login');
    $location.replace();
    $window.localStorage.removeItem('jwtToken');
  };
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


};

app.constant('API', 'http://localhost:8080/api');

app.config(function($httpProvider, $routeProvider, $locationProvider) {
  $routeProvider
    .when("/profile", {
        templateUrl : "routes/profile.htm",
        controller  : 'profileCtrl',
        controllerAs: 'profile'
    })
    .when('/login', {
        templateUrl : 'routes/login.htm',
        controller  : 'loginCtrl',
        controllerAs: 'login'
    })
    .when('/register', {
        templateUrl : 'routes/register.htm',
        controller  : 'loginCtrl',
        controllerAs: 'login'
    })
    .when('/portfolios', {
        templateUrl : 'routes/portfolios.htm',
        controller  : 'portfolioCtrl',
        controllerAs: 'portfolios'
    })
    .when('/classes', {
        templateUrl : 'routes/classes.htm',
        controller  : 'classCtrl',
        controllerAs: 'classes'
    })
    .when('/stocks', {
        templateUrl : 'routes/stocks.htm',
        controller  : 'stockCtrl',
        controllerAs: 'stocks'
    })
    .when('/',{
      templateUrl : 'routes/login.htm',
      controller  : 'loginCtrl',
      controllerAs: 'login'
    });
    $httpProvider.interceptors.push('authInterceptor');
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    } );

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

app.controller('profileCtrl', function(auth){
  var self = this;

  self.logout = function() {
    auth.logout && auth.logout()
  };

  self.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  };

});

app.controller('stockCtrl', function(auth){
  var self = this;

  self.logout = function() {
    auth.logout && auth.logout()
  };

  self.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  };
});

app.controller('portfolioCtrl', function(auth){
  var self = this;

  self.logout = function() {
    auth.logout && auth.logout()
  };

  self.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  };
});

app.controller('classCtrl', function(auth){
  var self = this;

  self.logout = function() {
    auth.logout && auth.logout()
  };

  self.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  };
});

app.controller('loginCtrl', function(user, auth, $scope){
  var self = this;

  function handleRequest(res) {
    console.log(res.data);
    var token = res.data ? res.data.token : null;
    if(token) { console.log('JWT:', token); }
    self.message = res.data.message;
  };

  self.login = function($scope) {
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
});

})();

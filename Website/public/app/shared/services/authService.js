(function(){
  'use strict';

  angular.module('myApp')
    .service('auth', function($window, $rootScope, $location){
      var self = this;

      self.parseJwt = function(token) {
        $rootScope.token = token;
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
        //$rootScope.userService = JSON.parse($window.atob(base64));
      };

//TODO: redo auth with own code, perhaps using $rootscope

      /*self.isAuthed = function(){
        console.log('Got to service')
        console.log($rootScope.userService);
        return !!$rootScope.userService;
      };

      self.getUser = function(){
        return $rootScope.userService;
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

      self.RedirectIfLoggedIn = function() {
        if ((($location.path() === '/login') || ($location.path()==='/')) && (self.isAuthed()) ) {
          console.log('authed');
          $location.path('/profile');
          $location.replace();
        }
        if ($location.path() !== '/login' && (!self.isAuthed())) {
          console.log('not authed');
          $location.path('/login');
          $location.replace();
        }


      };
    });

})();

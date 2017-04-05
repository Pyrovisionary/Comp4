(function(){
  'use strict';

  angular.module('myApp')
    .controller('loginCtrl', function(userService, auth, $scope, $route, $sanitize){
      var self = this;

      self.login = function($scope) {
        userService.login($sanitize(self.username), $sanitize(self.password));
      };

      self.register = function() {
        userService.register($sanitize(self.newusername), $sanitize(self.newforename), $sanitize(self.newsurname), $sanitize(self.newpassword), $sanitize(self.newemail), $sanitize(self.teacheryn))
      };

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

    });


})();

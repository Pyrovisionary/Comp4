(function(){
  'use strict';

  angular.module('myApp')
    .controller('loginCtrl', function(userService, auth, $scope, $route){
      var self = this;

      self.login = function($scope) {
        userService.login(self.username, self.password);
      };

      self.register = function() {
        userService.register(self.newusername, self.newforename, self.newsurname, self.newpassword, self.newemail, self.teacheryn)
      };

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

    });


})();

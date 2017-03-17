(function(){
  'use strict';

  angular.module('myApp')
    .controller('loginCtrl', function(userService, auth, $scope){
      var self = this;

      //Handlerequest would print the response from the server but cba
      function handleRequest(res) {
        console.log(res.data);
        var token = res.data ? res.data.token : null;
        self.message = res.data.message;
      };

      self.login = function($scope) {
        userService.login(self.username, self.password)
          //.then(handleRequest, handleRequest)
      };

      self.register = function() {
        userService.register(self.newusername, self.newforename, self.newsurname, self.newpassword, self.newemail, self.teacheryn)
          //.then(handleRequest, handleRequest)
      };

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

    });


})();

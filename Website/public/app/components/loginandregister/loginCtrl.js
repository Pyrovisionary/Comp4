(function(){
  'use strict';

  angular.module('myApp')
    .controller('loginCtrl', function(auth, $scope, $route, $sanitize, AuthLogin, AuthRegister){
      var self = this;
      self.registersuccess=true;
      self.loginsuccess=true;

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

      self.register = function(){
        AuthRegister.save({
          username: $sanitize(self.newusername),
          forename: $sanitize(self.newforename),
          surname:  $sanitize(self.newsurname),
          pass:     $sanitize(self.newpassword),
          email:    $sanitize(self.newemail),
          teacher:  self.teacheryn
        }).$promise.then(
          function(response){
            self.registersuccess=response.success;
          });
      };

      self.login = function(username, password){
        AuthLogin.save({username:$sanitize(self.username), pass:$sanitize(self.password)}).$promise.then(
          function(response){
            self.loginsuccess=response.success;
          });
      };

    });
})();

(function(){
  'use strict';

  angular.module('myApp')
    .controller('LoginController', function(auth, $scope, $route, $sanitize, authLogin, authRegister){
      var self = this;
      self.registerSuccess=true;
      self.loginSuccess=true;

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

      self.register = function(){
        authRegister.save({
          username: $sanitize(self.newusername),
          forename: $sanitize(self.newforename),
          surname:  $sanitize(self.newsurname),
          pass:     $sanitize(self.newpassword),
          email:    $sanitize(self.newemail),
          teacher:  self.teacheryn
        }).$promise.then(
          function(response){
            self.registerSuccess=response.success;
          });
      };

      self.login = function(username, password){
        authLogin.save({username:$sanitize(self.username), pass:$sanitize(self.password)}).$promise.then(
          function(response){
            self.loginSuccess=response.success;
            if (response.success = true) {

            };
          });
      };

    });
})();

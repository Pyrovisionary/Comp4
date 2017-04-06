(function(){
  'use strict';

  angular.module('myApp')
    .controller('ProfileController', function(auth, $scope, userData, $route){
      var self = this;

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

      var token = auth.parseJwt(auth.getToken());
      userData.get({userid:token.userid}).$promise.then(function(data){
        self.user = data
      });
    });
})();

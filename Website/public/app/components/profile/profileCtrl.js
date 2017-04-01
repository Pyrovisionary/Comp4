(function(){
  'use strict';

  angular.module('myApp')
    .controller('profileCtrl', function(auth, $scope, UserData, $route){
      var self = this;

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

      var token = auth.parseJwt(auth.getToken());
      $scope.user = UserData.get({userid:token.userid});
    });
})();

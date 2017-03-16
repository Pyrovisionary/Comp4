(function(){
  'use strict';

  angular.module('myApp')
    .controller('profileCtrl', function(auth, $scope){
      var self = this;

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

    });

})();

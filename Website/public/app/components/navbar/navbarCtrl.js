(function(){
  'use strict';
  angular.module('myApp')
    .controller('navbarCtrl', function(auth, $scope){
      var self = this;
      //TODO: active tab has outline (copy from tabs section of Codeschool's angular course)

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };
    });

})();

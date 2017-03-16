(function(){
  'use strict';

  angular.module('myApp', [ 'ngRoute', 'ngResource'])
    .controller('classCtrl', function(auth){
      var self = this;

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };
    });

})();

(function(){
  'use strict';

  angular.module('myApp', [ 'ngRoute', 'ngResource'])
    .controller('stockCtrl', function(auth){
      var self = this;

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };
    });

})();
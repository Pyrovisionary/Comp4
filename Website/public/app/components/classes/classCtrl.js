(function(){
  'use strict';

  angular.module('myApp')
    .controller('classCtrl', function(auth){
      var self = this;

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };
    });

    self.isTeacher = function(){
      var token = auth.parseJwt(auth.getToken());
      console.log(token);
      if (token.teacher === 1){
        return true
      } else{
        return false
      }
    };

})();

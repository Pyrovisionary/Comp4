(function(){
  'use strict';
  angular.module('myApp')
    .controller('navbarCtrl', function(auth, $scope, $route){
      var self = this;
      $scope.tab=1;
      $scope.$route = $route;


      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

      self.setTab = function(newValue){
      $scope.tab = newValue;
    };

    self.isSet = function(tabName){
      return $scope.tab === tabName;
    };
    });

})();

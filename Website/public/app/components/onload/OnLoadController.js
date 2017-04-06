(function(){
  'use strict';
  angular.module('myApp')
    .controller('OnLoadController', function(auth, $scope){
        auth.redirectIfLoggedIn();
      });

})();

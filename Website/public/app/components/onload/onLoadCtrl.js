(function(){
  'use strict';
  angular.module('myApp', [ 'ngRoute', 'ngResource'])
    .controller('onLoadCtrl', function(auth, $scope){
        auth.RedirectIfLoggedIn();
      });

})();

(function(){
  'use strict';
  angular.module('myApp')
    .controller('onLoadCtrl', function(auth, $scope){
        auth.RedirectIfLoggedIn();
      });

})();

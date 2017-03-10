(function() {
var app = angular.module('myApp', ['ngResource']);

app.controller('TabController', function($scope){
    $scope.tab = 1;
    $scope.isSet = function(tabName){
      return $scope.tab === tabName;
    };
    $scope.setTab = function(){
    }
  });



})();

(function(){
  'use strict';

  angular.module('myApp')
    .controller('stockCtrl', function($scope, $rootScope, auth, GetStocks, GetUserPortfolios, BuyStock){
      var self = this;
      $scope.stocks = [];
      $scope.curPage = 0;
      $scope.pageSize = 15;
      $scope.datalists = [];
      var token = auth.parseJwt(auth.getToken());
      $scope.user = UserData.get({userid:token.userid});

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

      self.getAllStocks = function(){
        return GetStocks.query()
      };

      self.getAllStocks().$promise.then(function(data){
          //console.log(data[0])
          $scope.datalists = data

      });

      self.getUserPortfolios = function(){
        var token = auth.parseJwt(auth.getToken());
        return GetUserPortfolios.query({userid:token.userid})

      };

      self.getUserPortfolios().$promise.then(function(data){
        $scope.userportfolionames = data[0];
      });

      self.buyStock = function(stockid, stockvalue){

        if ($scope.user.accountbalance - (self.buyvolume*stockvalue) >=0){
          
          buyStock.save({stockid:stockid, portfolioid:self.portfolioname, volume:self.buyvolume})
        } else {
          console.log('Insufficient funds');
        }
      };

      $scope.numberOfPages = function() {
        return Math.ceil($scope.datalists.length / $scope.pageSize);
      };

    });

})();

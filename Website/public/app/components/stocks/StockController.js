(function(){
  'use strict';

  angular.module('myApp')
    .controller('StockController', function($scope, $sanitize, $route, userData, $rootScope, auth, getStocks, getUserPortfolios, buyStock, updateAccountBalance){
      var self = this;
      self.InsufficientFunds = false ;
      $scope.curPage = 0;
      $scope.pageSize = 15;
      $scope.stockItems = [];
      $scope.search = {};
      $scope.search.stockname = '';
      $scope.stockselected=false;
      self.stockBought=false;
      var token = auth.parseJwt(auth.getToken());
      $scope.user = userData.get({userid:token.userid});
      $scope.stockview=null;


      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

      self.getAllStocks = function(){
        return getStocks.query();
      };

      self.getAllStocks().$promise.then(function(data){
          $scope.stockItems = data;
      });

      self.getUserPortfolios = function(){
        return getUserPortfolios.query({userid:token.userid})

      };

      self.getUserPortfolios().$promise.then(function(data){
        $scope.userportfolionames = data[0];
      });

      self.buyStock = function(stockid, stockvalue){
        var buyVolume = $sanitize(self.buyvolume);
        var portfolioname= $sanitize(self.portfolioname);
        var stocksCost = -1*buyVolume*stockvalue;
        if ($scope.user.accountbalance + stocksCost >=0){
          buyStock.save({stockid:stockid, userid:token.userid, portfolioname:portfolioname, volume:buyVolume, price:stockvalue}).$promise.then(function(){
            updateAccountBalance.update({userid:token.userid, cost:stocksCost})
            self.buyvolume ='';
            self.portfolioname ='';
            self.stockBought=true;
          });
        } else {
          self.InsufficientFunds = true ;
          $scope.stocks.buyvolume ='';
        }
      };

      self.setStockView = function(stockticker){
          $scope.stockview=stockticker;
          $scope.stockselected=true;
      };

    });

})();

(function(){
  'use strict';

  angular.module('myApp')
    .controller('stockCtrl', function($scope, $route, UserData, $rootScope, auth, GetStocks, GetUserPortfolios, BuyStock, UpdateAccountBalance){
      var self = this;
      self.InsufficientFunds = false ;
      $scope.curPage = 0;
      $scope.pageSize = 15;
      $scope.stockitems = [];
      $scope.search = {};
      $scope.search.stockname = '';
      var token = auth.parseJwt(auth.getToken());
      $scope.user = UserData.get({userid:token.userid});
      $scope.stockview=null;
      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

      self.getAllStocks = function(){
        return GetStocks.query();
      };

      self.getAllStocks().$promise.then(function(data){
          //console.log(data[0])
          $scope.stockitems = data

      });

      self.getUserPortfolios = function(){
        var token = auth.parseJwt(auth.getToken());
        return GetUserPortfolios.query({userid:token.userid})

      };

      self.getUserPortfolios().$promise.then(function(data){
        $scope.userportfolionames = data[0];
      });

      self.buyStock = function(stockid, stockvalue){
        var buyvolume = $sanitize(self.buyvolume);
        var portfolioname= $sanitize(self.portfolioname);
        var stockscost = -1*buyvolume*stockvalue;
        if ($scope.user.accountbalance + stockscost >=0){
          var token = auth.parseJwt(auth.getToken());
          BuyStock.save({stockid:stockid, userid:token.userid, portfolioname:portfolioname, volume:buyvolume, price:stockvalue}).$promise.then(function(){
            UpdateAccountBalance.update({userid:token.userid, cost:stockscost})
            $scope.stocks.buyvolume ='';
            $scope.stocks.portfolioname ='';

          });
        } else {
          self.InsufficientFunds = true ;
          $scope.stocks.buyvolume='';
        }
      };

      $scope.numberOfPages = function() {
        return Math.ceil($scope.stockitems.length / $scope.pageSize);
      };

      self.setStockView = function(stockticker){
          $scope.stockview=stockticker;
      };

    });

})();

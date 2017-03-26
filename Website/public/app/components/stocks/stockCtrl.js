(function(){
  'use strict';

  angular.module('myApp')
    .controller('stockCtrl', function($scope, UserData, $rootScope, auth, GetStocks, GetUserPortfolios, BuyStock, UpdateAccountBalance){
      var self = this;
      $scope.curPage = 0;
      $scope.pageSize = 15;
      $scope.stockitems = [];
      $scope.searched = [];
      $scope.search = {};
      $scope.search.stockname = '';
      var token = auth.parseJwt(auth.getToken());
      $scope.user = UserData.get({userid:token.userid});

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
        var stockscost = -1*self.buyvolume*stockvalue;
        if ($scope.user.accountbalance + stockscost >=0){
          var token = auth.parseJwt(auth.getToken());
          BuyStock.save({stockid:stockid, userid:token.userid, portfolioname:self.portfolioname, volume:self.buyvolume, price:stockvalue}).$promise.then(function(){
            UpdateAccountBalance.update({userid:token.userid, cost:stockscost})
            $scope.stocks.buyvolume ='';
            $scope.stocks.portfolioname ='';

          });
        } else {
          console.log('Insufficient funds');
        }
      };

      $scope.numberOfPages = function() {
        return Math.ceil($scope.stockitems.length / $scope.pageSize);
      };

    });

})();

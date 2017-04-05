(function(){
  'use strict';

  angular.module('myApp')
    .controller('portfolioCtrl', function(auth, UserData, $sanitize, $scope, $route, CreatePortfolio, GetUserPortfolios, GetStockPrice, SellStockDelete, SellStockPut, UpdateAccountBalance){
      var self = this;
      $scope.portfoliostocks = [];
      $scope.stockview=null;
      $scope.stockviewprice=null;
      self.InsufficientVolume = false ;
      $scope.stockselected=false;
      var token = auth.parseJwt(auth.getToken());
      $scope.user = UserData.get({userid:token.userid});

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };


    self.createPortfolio = function(){
      var token = auth.parseJwt(auth.getToken());
      var portfolioname = $sanitize(self.portfolioname);
      CreatePortfolio.save({userid:token.userid, portfolioname:portfolioname}).$promise.then(function(){
        $scope.portfolios.portfolioname ='';
        $route.reload()
      });
    };

    self.sellStock = function(portfoliostocklinkid, stockid, volume){
      var token = auth.parseJwt(auth.getToken());
      var sellvolume = $sanitize(self.sellvolume);
      console.log('Selling')
      if (volume<sellvolume){
        self.InsufficientVolume = true ;
        $scope.portfolios.sellvolume='';
      } else {
        if(volume==sellvolume){
          SellStockDelete.remove({portfoliostocklinkid:portfoliostocklinkid, sellvolume:sellvolume, volume:volume}).$promise.then(function(){
            GetStockPrice.get({stockid:stockid}).$promise.then(function(data){
              var value = data.stockvalue*sellvolume;
              UpdateAccountBalance.update({userid:token.userid, cost:value})
              $scope.portfolios.sellvolume ='';
              $route.reload()
            });
          });
      } else {
          SellStockPut.update({portfoliostocklinkid:portfoliostocklinkid, sellvolume:sellvolume, volume:volume}).$promise.then(function(){
            GetStockPrice.get({stockid:stockid}).$promise.then(function(data){
              var value = data.stockvalue*sellvolume;
              UpdateAccountBalance.update({userid:token.userid, cost:value})
              $scope.portfolios.sellvolume ='';
              $route.reload()
            });
        });
        }
      }
    };

    self.getUserPortfolios = function(){
      var token = auth.parseJwt(auth.getToken());
      return GetUserPortfolios.query({userid:token.userid})

    };

    self.getUserPortfolios().$promise.then(function(data){
      $scope.userportfolionames = data[0];
      for ( var i = 0; i < Object.keys(data[1]).length; i++) {
        for ( var j = 0; j < Object.keys(data[1][i]).length; j++) {
          $scope.portfoliostocks.push(data[1][i][j]);
        }
      }
    });

    self.setStockView = function(stockname){
        $scope.stockview=stockname;
        $scope.stockselected=true;
    };

    self.getCurrentPrice = function(stockid){
        GetStockPrice.get({stockid:stockid}).$promise.then(function(data){
          $scope.stockviewprice=data.stockvalue;
        });
    };


  });

})();

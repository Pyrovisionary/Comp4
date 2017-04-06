(function(){
  'use strict';

  angular.module('myApp')
    .controller('PortfolioController', function(auth, userData, $sanitize, $scope, $route, createPortfolio, getUserPortfolios, getStockPrice, sellStockDelete, sellStockPut, updateAccountBalance){
      var self = this;
      $scope.portfoliostocks = [];
      $scope.stockview=null;
      $scope.stockviewprice=null;
      self.InsufficientVolume = false ;
      $scope.stockselected=false;
      var token = auth.parseJwt(auth.getToken());
      $scope.user = userData.get({userid:token.userid});

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };


    self.createPortfolio = function(){
      var portfolioname = $sanitize(self.portfolioname);
      createPortfolio.save({userid:token.userid, portfolioname:portfolioname}).$promise.then(function(){
        $scope.portfolios.portfolioname ='';
        $route.reload()
      });
    };

    self.sellStock = function(portfoliostocklinkid, stockid, volume){
      var token = auth.parseJwt(auth.getToken());
      var sellVolume = $sanitize(self.sellvolume);
      console.log('Selling')
      if (volume<sellVolume){
        self.InsufficientVolume = true ;
        $scope.portfolios.sellvolume='';
      } else {
        if(volume==sellVolume){
          sellStockDelete.remove({portfoliostocklinkid:portfoliostocklinkid, sellVolume:sellVolume, volume:volume}).$promise.then(function(){
            getStockPrice.get({stockid:stockid}).$promise.then(function(data){
              var value = data.stockvalue*sellVolume;
              updateAccountBalance.update({userid:token.userid, cost:value})
              $scope.portfolios.sellvolume ='';
              $route.reload()
            });
          });
        } else {
            sellStockPut.update({portfoliostocklinkid:portfoliostocklinkid, sellvolume:sellVolume, volume:volume}).$promise.then(function(){
              getStockPrice.get({stockid:stockid}).$promise.then(function(data){
                var value = data.stockvalue*sellVolume;
                updateAccountBalance.update({userid:token.userid, cost:value})
                $scope.portfolios.sellvolume ='';
                $route.reload()
              });
            });
          }
      }
    };

    self.getPortfolios = function(){
      return getUserPortfolios.query({userid:token.userid})
    };

    self.getPortfolios().$promise.then(function(data){
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
        getStockPrice.get({stockid:stockid}).$promise.then(function(data){
          $scope.stockviewprice=data.stockvalue;
        });
    };


  });

})();

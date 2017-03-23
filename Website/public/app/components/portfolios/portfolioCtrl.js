(function(){
  'use strict';

  angular.module('myApp')
    .controller('portfolioCtrl', function(auth, $scope, CreatePortfolio, GetUserPortfolios, $route){
      var self = this;
      $scope.portfoliostocks = [];

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };


    self.createPortfolio = function(){
      var token = auth.parseJwt(auth.getToken());
      CreatePortfolio.save({userid:token.userid, portfolioname:self.portfolioname}).$promise.then(function(){
        $scope.portfolios.portfolioname ='';
        $route.reload()
      });
    };

    self.getUserPortfolios = function(){
      var token = auth.parseJwt(auth.getToken());
      return GetUserPortfolios.query({userid:token.userid})

    };

    self.getUserPortfolios().$promise.then(function(data){
      //console.log(data[0]);
      $scope.userportfolionames = data[0];

    })

    });

})();

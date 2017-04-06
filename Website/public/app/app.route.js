(function(){
  'use strict';

  angular.module('myApp')
    .config(function($httpProvider, $routeProvider, $locationProvider) {
      $routeProvider
        .when("/profile", {
            templateUrl : "app/components/profile/profile.htm",
            controller  : 'ProfileController',
            controllerAs: 'profile',
            activetab: 'profile'
        })
        .when('/login', {
            templateUrl : 'app/components/loginandregister/login.htm',
            controller  : 'LoginController',
            controllerAs: 'login',
            activetab: 'login'
        })
        .when('/register', {
            templateUrl : 'app/components/loginandregister/register.htm',
            controller  : 'LoginController',
            controllerAs: 'login',
            activetab:'register'
        })
        .when('/portfolios', {
            templateUrl : 'app/components/portfolios/portfolios.htm',
            controller  : 'PortfolioController',
            controllerAs: 'portfolios',
            activetab:'portfolios'
        })
        .when('/classes', {
            templateUrl : 'app/components/classes/classes.htm',
            controller  : 'ClassController',
            controllerAs: 'classes',
            activetab: 'classes'
        })
        .when('/stocks', {
            templateUrl : 'app/components/stocks/stocks.htm',
            controller  : 'StockController',
            controllerAs: 'stocks',
            activetab: 'stocks'
        })
        .when('/',{
          templateUrl : 'app/components/profile/profile.htm',
          controller  : 'ProfileController',
          controllerAs: 'profile',
          activetab: 'profile'
        });
        $httpProvider.interceptors.push('authInterceptor');
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        } );

  });
})();

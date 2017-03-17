(function(){
  'use strict';

  angular.module('myApp')
    .config(function($httpProvider, $routeProvider, $locationProvider) {
      $routeProvider
        .when("/profile", {
            templateUrl : "app/components/profile/profile.htm",
            controller  : 'profileCtrl',
            controllerAs: 'profile'
        })
        .when('/login', {
            templateUrl : 'app/components/loginandregister/login.htm',
            controller  : 'loginCtrl',
            controllerAs: 'login'
        })
        .when('/register', {
            templateUrl : 'app/components/loginandregister/register.htm',
            controller  : 'loginCtrl',
            controllerAs: 'login'
        })
        .when('/portfolios', {
            templateUrl : 'app/components/portfolios/portfolios.htm',
            controller  : 'portfolioCtrl',
            controllerAs: 'portfolios'
        })
        .when('/classes', {
            templateUrl : 'app/components/classes/classes.htm',
            controller  : 'classCtrl',
            controllerAs: 'classes'
        })
        .when('/stocks', {
            templateUrl : 'app/components/stocks/stocks.htm',
            controller  : 'stockCtrl',
            controllerAs: 'stocks'
        })
        .when('/',{
          templateUrl : 'app/components/profile/profile.htm',
          controller  : 'profileCtrl',
          controllerAs: 'profile'
        });
        $httpProvider.interceptors.push('authInterceptor');
        //$httpProvider.defaults.headers.common = {};
        //$httpProvider.defaults.headers.post = {};
        //$httpProvider.defaults.headers.put = {};
        //$httpProvider.defaults.headers.patch = {};

        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        } );

  });
})();

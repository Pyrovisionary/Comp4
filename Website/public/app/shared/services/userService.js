(function(){
  'use strict';

  angular.module('myApp', [ 'ngRoute', 'ngResource'])
    .service('userService', function($http, API, AuthLogin){
      var self = this;

      self.register = function(newusername, newforename, newsurname, newpassword, newemail, teacheryn){
        console.log( 'These are the parameters: ' + newusername + ' ' +  newforename + ' ' +  newsurname+ ' ' +  newpassword+ ' ' +  newemail + ' ' +  teacheryn );
        return $http({
          method: 'POST',
          url: API +'/authenticate/users/',
          headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            'username': newusername,
            'forename': newforename,
            'surname':  newsurname,
            'pass': newpassword,
            'email': newemail,
            'teacher': teacheryn
          }
        });
      };

      self.login = function(username, password){
        console.log('got to login');
        AuthLogin.save({username:username, pass:password});
        /*return $http({
          method: 'POST',
          url: API +'/authenticate',
          headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            'username':username,
            'pass':password
                }
        })*/
      };
    });
})();

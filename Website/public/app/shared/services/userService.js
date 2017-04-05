(function(){
  'use strict';

  angular.module('myApp')
    .service('userService', function($http, API, AuthLogin, AuthRegister){
      var self = this;

      self.register = function(newusername, newforename, newsurname, newpassword, newemail, teacheryn){
        console.log( 'These are the parameters: ' + newusername + ' ' +  newforename + ' ' +  newsurname+ ' ' +  newpassword+ ' ' +  newemail + ' ' +  teacheryn );
        AuthRegister.save({
          username: newusername,
          forename: newforename,
          surname:  newsurname,
          pass: newpassword,
          email: newemail,
          teacher: teacheryn
        });
      };

      self.login = function(username, password){
        AuthLogin.save({username:username, pass:password});
      };

    });
})();

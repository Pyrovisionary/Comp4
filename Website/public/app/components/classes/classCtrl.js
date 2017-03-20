(function(){
  'use strict';

  angular.module('myApp')
    .controller('classCtrl', function(auth,  ClassCreate, GetUserClasses, ClassAddUsers,  $scope){
      var self = this;
      //console.log(token.userid);

      self.displayUserClasses = function(res) {
        console.log(res.data);
      }

      self.logout = function() {
        auth.logout && auth.logout()
      };

      self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
      };

      self.isTeacher = function(){
        var token = auth.parseJwt(auth.getToken());
        if (token.teacher === 1){
          return true
        } else{
          return false
        }
      };

      self.createClass = function(){
        ClassCreate.save({className:self.className});
      // ClassAddUsers.post({classid:, userid:token.userid});

      };

      self.AddUserToClass = function(){
        var token = auth.parseJwt(auth.getToken());
        ClassAddUsers.save({classid:self.joinClass, userid:token.userid});
      };
      var classes = [];

      self.getUserClasses = function(){
        var token = auth.parseJwt(auth.getToken());
        return GetUserClasses.query({userid:token.userid})
      };

      self.getUserClasses().$promise.then(function(data){
        $scope.userclasses = data;
        console.log(data);
      });

    });


})();

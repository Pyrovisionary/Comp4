(function(){
  'use strict';

  angular.module('myApp')
    .controller('classCtrl', function(auth,  ClassCreate, GetUserClasses, ClassAddUsers,  $scope){
      var self = this;
      //console.log(token.userid);
      $scope.userclasses=[];

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
        $scope.userclassnames = data[0];
        for ( var i = 0; i < Object.keys(data[1]).length; i++) {
          //console.log(Object.keys(data[1][i]).length);
          for ( var j = 0; j < Object.keys(data[1][i]).length; j++) {
            //console.log(data[1][i][j])
            $scope.userclasses.push(data[1][i][j]);
          }
        }
        //console.log(Object.keys(data[1][1]).length);
      });

    });


})();

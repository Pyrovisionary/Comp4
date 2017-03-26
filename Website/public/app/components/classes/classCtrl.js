(function(){
  'use strict';

  angular.module('myApp')
    .controller('classCtrl', function(auth,  ClassCreate, GetUserClasses, ClassAddUsers,  $scope, $route){
      var self = this;
      //console.log(token.userid);
      $scope.userclasses=[];

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
        var token = auth.parseJwt(auth.getToken());
        ClassCreate.save({ userid:token.userid, classname:self.classname}).$promise.then(function(){
          $scope.classes.classname ='';
          $route.reload()
        });

      };

      self.AddUserToClass = function(){
        var token = auth.parseJwt(auth.getToken());
        ClassAddUsers.save({classid:self.joinClass, userid:token.userid}).$promise.then(function(){
          $scope.classes.joinClass ='';
          $route.reload()
        });
      };
      var classes = [];

      self.getUserClasses = function(){
        $scope.userclasses=[];
        var token = auth.parseJwt(auth.getToken());
        return GetUserClasses.query({userid:token.userid})
      };

      self.getUserClasses().$promise.then(function(data){
        $scope.userclassnames = data[0];
        for ( var i = 0; i < Object.keys(data[1]).length; i++) {
          for ( var j = 0; j < Object.keys(data[1][i]).length; j++) {
            $scope.userclasses.push(data[1][i][j]);
          }
        }
        //console.log(Object.keys(data[1][1]).length);
      });

    });


})();

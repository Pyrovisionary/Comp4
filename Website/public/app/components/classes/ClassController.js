(function(){
  'use strict';

  angular.module('myApp')
    .controller('ClassController', function($route, $sanitize, auth, classCreate, getUserClasses, classAddUsers,  $scope, getUserPortfolios, removeUserFromClass){
      var self = this;
      //console.log(token.userid);
      $scope.userclasses=[];
      $scope.studentselected=false;

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
        var classname = $sanitize(self.classname)
        classCreate.save({ userid:token.userid, className:classname}).$promise.then(function(response){
          $scope.classes.classname ='';
          $route.reload()
        });

      };

      self.addUserToClass = function(){
        var token = auth.parseJwt(auth.getToken());
        var classid = $sanitize(self.classid)
        classAddUsers.save({classid:classid, userid:token.userid}).$promise.then(function(response){
          self.classjoinsuccess=response.success;
          $scope.classes.classid ='';
          if(response.success == true){
          $route.reload()
          }
        });
      };

      self.getUserClasses = function(){
        $scope.userclasses=[];
        var token = auth.parseJwt(auth.getToken());
        return getUserClasses.query({userid:token.userid})
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

      self.getStudentPortfolios = function(userid, forename, surname){
          $scope.studentselected=true;
          $scope.studentportfoliostocks=[];
          $scope.studentforename=forename;
          $scope.studentsurname=surname;
          getUserPortfolios.query({userid:userid}).$promise.then(function(data){
            $scope.studentportfolionames = data[0];
            for ( var i = 0; i < Object.keys(data[1]).length; i++) {
              for ( var j = 0; j < Object.keys(data[1][i]).length; j++) {
                $scope.studentportfoliostocks.push(data[1][i][j]);
              }
            }
          });
      };

      self.removeStudent = function(userid, classid){
        if(self.isTeacher()){
        removeUserFromClass.remove({userid:userid, classid:classid}).$promise.then(function(){
          $route.reload()
        });
      } else {
        console.log('User is not a teacher, not authed to expel students from a class')
        }
      }
    });


})();

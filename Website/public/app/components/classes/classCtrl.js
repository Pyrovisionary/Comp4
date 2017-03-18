(function(){
  'use strict';

  angular.module('myApp')
    .controller('classCtrl', function(auth, $promise, ClassCreate, GetUserClassIds, ClassAddUsers, GetUserClassNames, GetUsersByClass, $scope){
      var self = this;

      //console.log(token.userid);

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

      self.getClassIds = function(){
        var token = auth.parseJwt(auth.getToken());
        var rows = GetUserClassIds.query({userid:token.userid});
        return rows
      };

      self.getClassNames = function(rows){
        var classes =[];
        console.log(rows);
        console.log(rows.length);
        for( var i = 0; i < rows.length; count++){
          console.log(i);
          console.log(rows[i]);
          var userClass = GetUserClassNames.get({classid:rows[i].classid});
          classes.push(userClass);
        };
        console.log(classes);
        return classes
      };

      self.getClassIds().$promise.then(self.getClassNames(rows));

      self.DisplayUserClasses = function(classes){
        console.log(classes)
      };
      self.DisplayClassesMaster = function(){
        self.DisplayUserClasses(self.getClassNames(self.getClassIds()));
      };

    });


})();

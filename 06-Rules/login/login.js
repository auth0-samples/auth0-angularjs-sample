angular.module('app')
.controller('LoginCtrl', ['$scope', 'auth', 'store', loginCtrlFunc]);

function loginCtrlFunc($scope, auth, store){
  $scope.auth = auth;
  $scope.login = function () {
    auth.signin({popup:true}, function(profile, idToken){
      store.set('profile', profile);
      store.set('token', idToken);
    }, function(err){
      console.log(err);
    });
  }
}

angular.module('app')
.controller('LoginCtrl', ['$scope', 'auth', 'store', loginCtrlFunc]);

function loginCtrlFunc($scope, auth, store){
  $scope.auth = auth;
}

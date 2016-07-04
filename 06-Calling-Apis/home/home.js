angular.module('app')
.controller('HomeCtrl', ['$scope', 'store', homeCtrlFunc]);

function homeCtrlFunc($scope, store){
  $scope.userProfile = store.get('profile');
}

angular.module('app')
.controller('HomeCtrl', ['$scope', 'store', homeCtrlFunc]);

function homeCtrlFunc($scope, store){
  $scope.popupModeProfile = store.get('profile');
}

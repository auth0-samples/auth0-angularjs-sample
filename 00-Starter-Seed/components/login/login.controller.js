(function() {

  'use strict';

  angular
    .module('app')
    .controller('loginController', loginController);

    loginController.$inject = ['$scope', 'auth'];

    function loginController($scope, auth) {
      $scope.auth = auth;
    }

})();

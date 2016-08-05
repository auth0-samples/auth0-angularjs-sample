(function() {

  'use strict';

  angular
    .module('app')
    .controller('homeController', homeController);

    homeController.$inject = ['$scope', 'auth'];

    function homeController($scope, auth) {
      $scope.auth = auth;
    }

})();

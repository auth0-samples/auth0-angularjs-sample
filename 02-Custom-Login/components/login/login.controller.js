(function () {

  'use strict';

  angular
    .module('app')
    .controller('LoginController', loginController);

  loginController.$inject = ['$scope', 'authService'];

  function loginController($scope, authService) {

    // Put the authService on $scope to access
    // the login method in the view
    $scope.authService = authService;

    $scope.login = function () {
      // Show loading indicator
      $scope.message = 'loading...';
      $scope.loading = true;
      authService.login($scope.user, $scope.pass, function (err) {
        if (err) {
          $scope.message = "something went wrong: " + err.message;
          $scope.loading = false;
        }
      });
    };

    $scope.signup = function () {
      // Show loading indicator
      $scope.message = 'loading...';
      $scope.loading = true;
      authService.signup($scope.user, $scope.pass, function (err) {
        if (err) {
          $scope.message = "something went wrong: " + err.message;
          $scope.loading = false;
        }
      });
    };

    $scope.googleLogin = function () {
      $scope.message = 'loading...';
      $scope.loading = true;

      authService.googleLogin(function (err) {
        if (err) {
          $scope.message = "something went wrong: " + err.message;
          $scope.loading = false;
        }
      });
    };
  }

})();

(function () {

  'use strict';

  angular
    .module('app')
    .run(function ($rootScope, authService) {

      // Put the authService on $rootScope so its methods
      // can be accessed from the nav bar
      $rootScope.authService = authService;

      // Process the auth token if it exists and fetch the profile
      authService.authenticateAndGetProfile();
    });

})();
(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope', 'authService'];

  function run($rootScope, authService) {
    // Put the authService on $rootScope so its methods
    // can be accessed from the nav bar
    $rootScope.authService = authService;

    // Use the authService to check for
    // the user's authentication state when the page is
    // refreshed and maintain authentication
    authService.checkAuthOnRefresh();
  }

})();
(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope', 'authService', 'lock'];

  function run($rootScope, authService, lock) {
    // Put the authService on $rootScope so its methods
    // can be accessed from the nav bar
    $rootScope.authService = authService;

    // Register the authentication listener that is
    // set up in auth.service.js
    authService.registerAuthenticationListener();

    // Use the authService to check for
    // the user's authentication state when the page is
    // refreshed and maintain authentication
    authService.checkAuthOnRefresh();

    // Register synchronous hash parser
    lock.interceptHash();
  }

})();

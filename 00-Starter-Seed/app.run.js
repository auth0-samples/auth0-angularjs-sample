(function() {

  'use strict';

  angular
    .module('app')
    .run(function($rootScope, authService, authManager) {
      
      // Put the authService on $rootScope so its methods
      // can be accessed from the nav bar
      $rootScope.authService = authService;

      // Register the authentication listener that is
      // set up in auth.service.js
      authService.registerAuthenticationListener();

      // Use the authManager from angular-jwt to check for
      // the user's authentication state when the page is
      // refreshed and maintain authentication
      authManager.checkAuthOnRefresh();

      // Listen for 401 unauthorized requests and redirect
      // the user to the login page
      authManager.redirectWhenUnauthenticated();
    });

})();
(function() {

  'use strict';

  angular
    .module('app')
    .run(function($rootScope, auth) {
      $rootScope.auth = auth;
      auth.authenticatedAndGetProfile();
      auth.checkAuthState();
    });

})();
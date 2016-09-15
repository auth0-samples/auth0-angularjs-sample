(function() {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$rootScope', 'lock', 'authManager', '$state'];

  function authService($rootScope, lock, authManager, $state) {

    var userProfile = JSON.parse(localStorage.getItem('profile')) || {};

    function login() {
      lock.show();
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authManager.unauthenticate();
      userProfile = {};
    }

    // Set up the logic for when a user authenticates
    // This method is called from app.run.js
    function registerAuthenticationListener() {
      lock.on('authenticated', onAuth);
    }

    function onAuth(authResult) {
      localStorage.setItem('id_token', authResult.idToken);
      authManager.authenticate();

      $state.go('home');

      lock.getProfile(authResult.idToken, function(error, profile) {
        if (error) {
          console.log(error);
        }

        localStorage.setItem('profile', JSON.stringify(profile));
        $rootScope.$broadcast('userProfileSet', profile);
      });
    }

    function authInterceptor() {
      var auth0 = new Auth0({clientID: AUTH0_CLIENT_ID, domain: AUTH0_DOMAIN});
      var authResult = auth0.parseHash(window.location.hash);
      if (authResult && authResult.idToken) {
        onAuth(authResult);
      }
    }

    return {
      userProfile: userProfile,
      login: login,
      logout: logout,
      registerAuthenticationListener: registerAuthenticationListener,
      authInterceptor: authInterceptor
    }
  }
})();
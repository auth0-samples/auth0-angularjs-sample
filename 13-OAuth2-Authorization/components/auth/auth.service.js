(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['angularAuth0', 'authManager', '$location'];

  function authService(angularAuth0, authManager, $location) {

    function login(username, password, callback) {
      angularAuth0.login({
        responseType: 'id_token token',
        scope: 'openid profile {API_SCOPES}',
        audience: '{API_IDENTIFIER}'
      });
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('access_token');
      authManager.unauthenticate();
    }

    function authenticateAndGetProfile() {
      var result = angularAuth0.parseHash(window.location.hash);

      if (result && result.idToken) {
        localStorage.setItem('access_token', result.accessToken);
        localStorage.setItem('id_token', result.idToken);
        authManager.authenticate();
      } else if (result && result.error) {
        alert('error: ' + result.error);
      }
    }

    return {
      login: login,
      logout: logout,
      authenticateAndGetProfile: authenticateAndGetProfile
    }
  }
})();

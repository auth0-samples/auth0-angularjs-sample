(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['angularAuth0', 'authManager', '$location', '$state'];

  function authService(angularAuth0, authManager, $location, $state) {

    function login(username, password) {
      angularAuth0.client.login({
        realm: 'Username-Password-Authentication',
        username: username,
        password: password,
      }, function(err, authResult) {
        if (err) alert(err.description);
        if (authResult && authResult.idToken) {
          setUser(authResult);
          $state.go('home');
        }
      });
    }

    function signup(username, password) {
      angularAuth0.redirect.signupAndLogin({
        connection: 'Username-Password-Authentication',
        email: username,
        password: password
      });
    }

    function loginWithGoogle() {
      angularAuth0.authorize({
        connection: 'google-oauth2'
      });
    }
    
    function handleParseHash() {
      angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.idToken) {
          setUser(authResult);
        }
      });
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
    }

    function setUser(authResult) {
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
    }

    function isAuthenticated() {
      return authManager.isAuthenticated();
    }

    return {
      login: login,
      signup: signup,
      loginWithGoogle: loginWithGoogle,
      handleParseHash: handleParseHash,
      logout: logout,
      isAuthenticated: isAuthenticated
    }
  }
})();

(function() {

  'use strict';

  angular
    .module('app')
    .service('auth', auth);

  auth.$inject = ['lock', '$location'];

  function auth(lock, $location) {

    var authenticated = false;
    var user = {};

    function login() {
      lock.show();
    }

    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authenticated = false;
      user = {};
    }

    function authenticatedAndGetProfile() {
      lock.on('authenticated', function(authResult) {
        localStorage.setItem('id_token', authResult.idToken);

        lock.getProfile(authResult.idToken, function(error, profile) {
          if (error) {
            console.log(error);
          }

          localStorage.setItem('profile', JSON.stringify(profile));
          authenticated = true;
          user = profile;
        });
      });
    }

    function checkAuthState() {
      if (localStorage.getItem('id_token')) {
        authenticated = true;
        user = JSON.parse(localStorage.getItem('profile'));
      }
    }

    function isAuthenticated() {
      return authenticated;
    }

    function currentUser() {
      return user;
    }

    return {
      login: login,
      logout: logout,
      authenticatedAndGetProfile: authenticatedAndGetProfile,
      checkAuthState: checkAuthState,
      isAuthenticated: isAuthenticated,
      currentUser: currentUser
    }
  }


})();
(function() {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$rootScope', 'lockPasswordless', 'authManager', '$location'];

  function authService($rootScope, lockPasswordless, authManager, $location) {

    var userProfile = JSON.parse(localStorage.getItem('profile')) || {};

    function login() {
      lockPasswordless.emailcode(function(error, profile, id_token) {
        if (error) {
          alert("Error: " + error);
          return;
        }
        localStorage.setItem('id_token', id_token);
        authManager.authenticate();
        localStorage.setItem('profile', JSON.stringify(profile));
        $rootScope.$broadcast('userProfileSet', profile);
        $location.path('/');
      });
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authManager.unauthenticate();
      userProfile = {};
    }

    function getuserProfile() {
      return userProfile;
    }

    return {
      userProfile: userProfile,
      login: login,
      logout: logout,
      getuserProfile: getuserProfile
    }
  }
})();
(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$rootScope', 'lock', 'angularAuth0', 'authManager', 'jwtHelper', '$q'];

  function authService($rootScope, lock, angularAuth0, authManager, jwtHelper, $q) {

    var userProfile = JSON.parse(localStorage.getItem('profile')) || null;
    var deferredProfile = $q.defer();

    if (userProfile) {
      deferredProfile.resolve(userProfile);
    }

    function login() {
      lock.show();
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      deferredProfile = $q.defer();
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authManager.unauthenticate();
      userProfile = null;
    }

    // Set up the logic for when a user authenticates
    // This method is called from app.run.js
    function registerAuthenticationListener() {
      lock.on('authenticated', function (authResult) {
        localStorage.setItem('id_token', authResult.idToken);
        authManager.authenticate();

        lock.getProfile(authResult.idToken, function (error, profile) {
          if (error) {
            return console.log(error);
          }

          localStorage.setItem('profile', JSON.stringify(profile));
          deferredProfile.resolve(profile);
        });

      });
    }

    function getProfileDeferred() {
      return deferredProfile.promise;
    }

    function checkAuthOnRefresh() {
        var token = localStorage.getItem('id_token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            if (!$rootScope.isAuthenticated) {
              authManager.authenticate();
            }
          }
        } else {
          angularAuth0.getSSOData(function (err, data) {
            if (!err && data.sso) {
              angularAuth0.signin({
                scope: 'openid name picture',
                responseType: 'token'
              });
            }
          });
        }
    }

    return {
      login: login,
      logout: logout,
      registerAuthenticationListener: registerAuthenticationListener,
      checkAuthOnRefresh: checkAuthOnRefresh,
      getProfileDeferred: getProfileDeferred
    }
  }
})();

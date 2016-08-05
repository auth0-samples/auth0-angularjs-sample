(function() {

  'use strict';

  angular
    .module('app', ['auth0.lock', 'angular-jwt', 'ngRoute'])
    .config(config);

    config.$inject = ['$routeProvider', 'lockProvider'];

    function config($routeProvider, lockProvider) {

      lockProvider.init({
        clientID: AUTH0_CLIENT_ID,
        domain: AUTH0_DOMAIN
      });

      $routeProvider
        .when( '/', {
          controller: 'homeController',
          templateUrl: 'components/home/home.html'
        })
        .when( '/login', {
          controller: 'loginController',
          templateUrl: 'components/login/login.html'
        });
    }

})();

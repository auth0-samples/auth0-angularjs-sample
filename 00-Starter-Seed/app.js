(function() {

  'use strict';

  angular
    .module('app', ['auth0.lock', 'angular-jwt', 'ngRoute'])
    .config(config);

    config.$inject = ['$routeProvider', 'lockProvider'];

    function config($routeProvider, lockProvider) {

      lockProvider.init({
        clientID: 'w4ibtscMzP2Zs3jk6MteHwXZ422gGyQc',
        domain: 'blogtest.auth0.com'
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

(function() {

  'use strict';

  angular
    .module('app', ['auth0.lockPasswordless', 'angular-jwt', 'ngRoute'])
    .config(config);

    config.$inject = ['$routeProvider', '$httpProvider', 'lockPasswordlessProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider'];

    function config($routeProvider, $httpProvider, lockPasswordlessProvider, jwtOptionsProvider, jwtInterceptorProvider) {

      // Initialization for the Passworless Lock widget
      lockPasswordlessProvider.init({
        clientID: AUTH0_CLIENT_ID,
        domain: AUTH0_DOMAIN
      });

      // Configuration for angular-jwt
      jwtOptionsProvider.config({
        tokenGetter: function() {
          return localStorage.getItem('id_token');
        },
        whiteListedDomains: ['localhost'],
        unauthenticatedRedirectPath: '/login'
      });

      // Add the jwtInterceptor to the array of HTTP interceptors
      // so that JWTs are attached as Authorization headers
      $httpProvider.interceptors.push('jwtInterceptor');

      $routeProvider
        .when('/', {
          controller: 'homeController',
          templateUrl: 'components/home/home.html'
        })
        .when('/login', {
          controller: 'loginController',
          templateUrl: 'components/login/login.html'
        })
        .when('/ping', {
          controller: 'pingController',
          templateUrl: 'components/ping/ping.html'
        });
    }

})();

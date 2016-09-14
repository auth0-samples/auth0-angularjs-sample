(function() {

  'use strict';

  angular
    .module('app', ['auth0.lock', 'angular-jwt', 'ui.router'])
    .config(config);

    config.$inject = ['$httpProvider', 'lockProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider', '$stateProvider', '$urlRouterProvider','$locationProvider'];

    function config($httpProvider, lockProvider, jwtOptionsProvider, jwtInterceptorProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

      // Initialization for the Lock widget
      lockProvider.init({
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

      // $urlRouterProvider.otherwise('/home');

      $stateProvider
        .state('home', {
          url: '/home',
          controller: 'homeController',
          templateUrl: 'components/home/home.html'
        })
        .state('login', {
          url: '/login',
          controller: 'loginController',
          templateUrl: 'components/login/login.html'
        })
        .state('ping', {
          url: '/ping',
          controller: 'pingController',
          templateUrl: 'components/ping/ping.html'
        });
    }

})();

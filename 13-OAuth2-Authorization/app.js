(function () {

  'use strict';

  angular
    .module('app', ['auth0.auth0', 'angular-jwt', 'ui.router'])
    .config(config);

  config.$inject = ['$stateProvider', 'angularAuth0Provider', '$urlRouterProvider', '$httpProvider', 'jwtOptionsProvider'];

  function config($stateProvider, angularAuth0Provider, $urlRouterProvider, $httpProvider, jwtOptionsProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'components/home/home.html',
        controllerAs: 'vm'
      })
      .state('ping', {
        url: '/ping',
        controller: 'PingController',
        templateUrl: 'components/ping/ping.html',
        controllerAs: 'vm'
      });

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      callbackURL: AUTH0_CALLBACK_URL
    });

    jwtOptionsProvider.config({
      tokenGetter: function() {
        return localStorage.getItem('access_token');
      },
      whiteListedDomains: ['localhost']
    });

    $urlRouterProvider.otherwise('/home');

    // Add the jwtInterceptor to the array of HTTP interceptors
    // so that JWTs are attached as Authorization headers
    $httpProvider.interceptors.push('jwtInterceptor');
  }

})();

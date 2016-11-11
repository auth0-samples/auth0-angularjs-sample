(function () {

  'use strict';

  angular
    .module('app', ['auth0.auth0', 'auth0.lock', 'angular-jwt', 'ui.router'])
    .config(config);

  config.$inject = ['$stateProvider', 'lockProvider', '$urlRouterProvider', 'angularAuth0Provider'];

  function config($stateProvider, lockProvider, $urlRouterProvider, angularAuth0Provider) {

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'components/home/home.html',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'components/login/login.html',
        controllerAs: 'vm'
      });

    lockProvider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN
    });

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      callbackURL: 'http://localhost:3001'
    });

    $urlRouterProvider.otherwise('/home');
  }

})();

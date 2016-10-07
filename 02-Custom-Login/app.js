(function () {

  'use strict';

  angular
    .module('app', ['auth0.auth0', 'angular-jwt', 'ui.router'])
    .config(config);

  config.$inject = ['$stateProvider', 'angularAuth0Provider', '$urlRouterProvider'];

  function config($stateProvider, angularAuth0Provider, $urlRouterProvider) {

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

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN
    });

    $urlRouterProvider.otherwise('/home');
  }

})();

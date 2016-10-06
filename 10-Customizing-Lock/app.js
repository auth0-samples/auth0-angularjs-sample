(function () {

  'use strict';

  angular
    .module('app', ['auth0.lock', 'angular-jwt', 'ui.router'])
    .config(config);

  config.$inject = ['$stateProvider', 'lockProvider', '$urlRouterProvider'];

  function config($stateProvider, lockProvider, $urlRouterProvider) {

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
      domain: AUTH0_DOMAIN,
      options: {
        theme: {
          logo: 'https://auth0.com/lib/homepage/img/logo-tmz.svg',
          primaryColor: "#b81b1c"
        },
        languageDictionary: {
          title: "Log me in"
        }
      }
    });

    $urlRouterProvider.otherwise('/home');
  }

})();


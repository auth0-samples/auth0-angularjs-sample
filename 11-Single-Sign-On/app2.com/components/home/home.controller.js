(function () {

  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$window', 'authService', 'angularAuth0'];

  function HomeController($window, authService, angularAuth0) {

    var vm = this;
    vm.authService = authService;

    authService.getProfileDeferred().then(function (profile) {
      vm.profile = profile;
    });

    vm.logoutFromAuth0 = function() {
      angularAuth0.logout({
        returnTo: 'http://localhost:3000/',
        client_id: AUTH0_CLIENT_ID
      });
      authService.logout();
    }

  }

}());

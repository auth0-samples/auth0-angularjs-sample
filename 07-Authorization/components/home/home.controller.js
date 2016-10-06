(function () {

  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['authService'];

  function HomeController(authService) {

    var vm = this;
    vm.authService = authService;


    authService.getProfileDeferred().then(function (profile) {
      vm.profile = profile;
    });


  }

}());

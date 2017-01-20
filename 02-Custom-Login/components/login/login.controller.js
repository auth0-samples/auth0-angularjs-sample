(function () {

  'use strict';

  angular
    .module('app')
    .controller('LoginController', loginController);

  loginController.$inject = ['authService'];

  function loginController(authService) {

    var vm = this;
    vm.auth = authService;

  }

})();

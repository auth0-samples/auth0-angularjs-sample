(function () {
  'use strict';

  angular
    .module('app')
    .controller('PingController', PingController);

  PingController.$inject = ['authService', '$http'];

  function PingController(authService, $http) {

    var vm = this;
    vm.authService = authService;

    // The user's JWT will automatically be attached
    // as an authorization header on HTTP requests
    vm.ping = function () {
      $http.get('http://localhost:7001/secured/ping')
        .then(function (result) {
          vm.pingResult = result.data.text;
        }, function (error) {
          console.log(error);
          vm.pingResult = error.statusText;
        });
    }

  }

})();

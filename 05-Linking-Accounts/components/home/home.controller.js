(function () {

  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'authService'];

  function HomeController($scope, authService) {

    var vm = this;
    vm.authService = authService;
    vm.linkAccount = linkAccount;
    vm.unLinkAccount = unLinkAccount;

    vm.identities = [];

    function refreshIdentities() {
      vm.profile.identities.shift();
      vm.identities = vm.profile.identities;
    }

    function linkAccount() {
      authService.linkAccount()
        .then(function (profile) {
          vm.profile = profile;
          refreshIdentities();
        })
    }

    function unLinkAccount(account) {
      account.hiddenItem = true;
      authService.unLinkAccount(account)
        .then(function (profile) {
          vm.profile = profile;
          refreshIdentities();
        });
    }

    authService.getProfileDeferred().then(function (profile) {
      vm.profile = profile;
      refreshIdentities();
    });

  }

}());

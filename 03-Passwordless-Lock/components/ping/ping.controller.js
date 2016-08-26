(function() {

  'use strict';

  angular
    .module('app')
    .controller('pingController', pingController);

    pingController.$inject = ['$scope', '$http'];

    function pingController($scope, $http) {
      
      // The user's JWT will automatically be attached
      // as an authorization header on HTTP requests
      $scope.ping = function() {
        $http.get('http://localhost:3001/secured/ping')
          .then(function(result) {
            $scope.pingResult = result.data;
          }, function(error) {
            console.log(error);
          });
      }
    }

})();
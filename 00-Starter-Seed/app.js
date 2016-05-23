angular.module('app', ['auth0', 'angular-storage', 'angular-jwt', 'ngRoute'])
.config(['$routeProvider', configFunction])
.run(runFunction);

function configFunction($routeProvider){
  // Configure routes for your application
  $routeProvider
    .when( '/', {
      controller: 'HomeCtrl',
      templateUrl: 'home/home.html'
    })
    .when( '/settings', {
      controller: 'SettingsCtrl',
      templateUrl: 'settings/settings.html'
    })
    .when( '/login', {
      controller: 'LoginCtrl',
      templateUrl: 'login/login.html'
    });
  }

function runFunction (){

}

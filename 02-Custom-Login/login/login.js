angular.module('app')
.controller('LoginCtrl', ['$scope', 'auth', 'store', '$location', loginCtrlFunc]);

function loginCtrlFunc($scope, auth, store, $location){
  $scope.auth = auth;

  $scope.user = '';
  $scope.pass = '';

  function onLoginSuccess(profile, token) {
    $scope.message = '';
    store.set('profile', profile);
    store.set('token', token);
    $location.path('/');
    $scope.loading = false;
  }

  function onLoginFailed() {
    $scope.message = 'invalid credentials';
    $scope.loading = false;
  }

  $scope.login = function () {
    $scope.message = 'loading...';
   $scope.loading = true;
   auth.signin({
     connection: 'Username-Password-Authentication',
     username: $scope.user,
     password: $scope.pass,
     authParams: {
       scope: 'openid name email'
     }
   }, onLoginSuccess, onLoginFailed);
  }

  $scope.signup = function () {
    $scope.message = 'loading...';
   $scope.loading = true;
   auth.signup({
     connection: 'Username-Password-Authentication',
     username: $scope.user,
     password: $scope.pass,
     authParams: {
       scope: 'openid name email'
     }
   }, onLoginSuccess, onLoginFailed);
  }

  $scope.googleLogin = function () {
    $scope.message = 'loading...';
    $scope.loading = true;

    auth.signin({
      popup: true,
      connection: 'google-oauth2',
      scope: 'openid name email'
    }, onLoginSuccess, onLoginFailed);
  };
}

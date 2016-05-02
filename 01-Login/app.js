var app = angular.module('app', ['auth0']);

app.config(function myAppConfig (authProvider) {
  //TODO: Replace with dynmaic credentials and update using seperate file
  authProvider.init({
    domain: 'chris92.auth0.com',
    clientID: 'G7IwfyxcX3O5dHU2ikjdOXDpa7HAtjyr'
  });

    //Called when login is successful
  authProvider.on('loginSuccess', function(idToken, $rootScope) {
    console.log("Login successful with token " + idToken);
    $rootScope.token = idToken;
  });

  //Called when login fails
  authProvider.on('loginFailure', function() {
    alert("Error");
  });

  //Called when user is authenticated (Authentication flag is true)
  authProvider.on('authenticated', function() {
    console.log("Authenticated");
  });
});

app.controller('LoginCtrl', function ($scope, auth) {
  // Add auth to $scope object so we can bind to view
  $scope.auth = auth;

  $scope.signin = function (){
    auth.signin({}, //The first argument is scope of data you need to return
      function(profile, idToken){
        $scope.token = idToken;
      },
      function(err) {
        $scope.err = err;
      });
  }
});
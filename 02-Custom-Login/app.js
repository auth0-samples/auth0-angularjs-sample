angular.module('app', ['auth0', 'angular-storage', 'angular-jwt', 'ngRoute'])
.config(['$routeProvider', 'authProvider', configFunction])
.run(['$rootScope', 'auth', 'store', 'jwtHelper', '$location', runFunction]);

function configFunction($routeProvider, authProvider){
  // Configure routes for your application
  $routeProvider
    .when( '/', {
      controller: 'HomeCtrl',
      templateUrl: 'home/home.html',
      requiresLogin: true
    })
    .when( '/settings', {
      controller: 'SettingsCtrl',
      templateUrl: 'settings/settings.html',
      requiresLogin: true
    })
    .when( '/login', {
      controller: 'LoginCtrl',
      templateUrl: 'login/login.html'
    });

   //Configure Auth0
    authProvider.init({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      loginUrl: '/login'
    });

    //Called when login is successful
    authProvider.on('loginSuccess', ['$location', 'profilePromise', 'idToken', 'store', '$rootScope',
    function($location, profilePromise, idToken, store, $rootScope) {
      // Successfully log in
      // Access to user profile and token
      profilePromise.then(function(profile){
        // Empty loading message
         $rootScope.message = '';
         //Store credentials
         store.set('profile', profile);
         store.set('token', idToken);
         // Hide loading indicator
         $rootScope.loading = false;
         // Go home
         $location.path('/');
      });
    }]);

    //Called when login fails
    authProvider.on('loginFailure', ['$rootScope', function($rootScope) {
      // If anything goes wrong
       $rootScope.message = 'invalid credentials';
       // Hide loading indicator
       $rootScope.loading = false;
    }]);

    authProvider.on('authenticated', function() {
      // if user is authenticated.
      // Useful in re-authentication
    });

  }

function runFunction ($rootScope, auth, store, jwtHelper, $location){
  // Listen to a location change event
  $rootScope.$on('$locationChangeStart', function() {
    // Grab the user's token
    var token = store.get('token');
    // Check if token was actually stored
    if (token) {
      // Check if token is yet to expire
      if (!jwtHelper.isTokenExpired(token)) {
        // Check if the user is not authenticated
        if (!auth.isAuthenticated) {
          // Re-authenticate with the user's profile
          auth.authenticate(store.get('profile'), token);
        }
      } else {
        // Either show the login page
        $location.path('/login');
      }
    }
  });
}

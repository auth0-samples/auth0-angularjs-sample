angular.module('app', ['auth0', 'angular-storage', 'angular-jwt', 'ngRoute'])
.config(['$routeProvider', 'authProvider', 'jwtInterceptorProvider', '$httpProvider', configFunction])
.run(['$rootScope', 'auth', 'store', 'jwtHelper', '$location', runFunction]);

function configFunction($routeProvider, authProvider, jwtInterceptorProvider, $httpProvider){
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
    .when( '/ping', {
      controller: 'PingCtrl',
      templateUrl: 'ping/ping.html',
      requiresLogin: true
    })
    .when( '/login', {
      controller: 'LoginCtrl',
      templateUrl: 'login/login.html'
    });


    //Configure Auth0
    authProvider.init({
      domain: 'chris92.auth0.com',
      clientID: 'NZLIDgaaGwXtq7AcfJGPhZWne2YiSY1l',
      loginUrl: '/login'
    });

    //Called when login is successful
    authProvider.on('loginSuccess', ['$rootScope', '$location', 'profilePromise', 'idToken', 'store',
    function($rootScope, $location, profilePromise, idToken, store) {
      // Successfully log in
      // Access to user profile and token
      profilePromise.then(function(profile){
        // profile
        console.log(profile);
        store.set('profile', profile);
        store.set('token', idToken);
        $rootScope.redirectModeProfile = profile
      });
      $location.url('/');
    }]);

    //Called when login fails
    authProvider.on('loginFailure', function() {
      // If anything goes wrong
    });

    // JWT interceptor for HTTP requests
    jwtInterceptorProvider.tokenGetter = function(store) {
      return store.get('token');
    }

    // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
    // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
    // want to check the delegation-token example
  $httpProvider.interceptors.push('jwtInterceptor');
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
        // $location.path('/');
        // .. or
        // or use the refresh token to get a new idToken
        auth.refreshIdToken(token);
      }
    }

  });

}

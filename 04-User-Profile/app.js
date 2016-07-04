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
  }

function runFunction ($rootScope, auth, store, jwtHelper, $location){
  $rootScope.authenticated = false;
  // Wrapper function to handle profile and toke storage
  var saveUserInfo = function(profile, token) {
    store.set('profile', profile);
    store.set('token', token);
  };
  // Called when lock shows
  auth.lockOn('show', function () {
    alert('shown');
  });
  // Called when lock hides
  auth.lockOn('hide', function () {
    alert('hidden');
  });
  // Called when authentication is successful
  auth.lockOn("authenticated", function(authResult) {
    console.log(authResult);
    auth.getProfile(authResult.idToken).then(function (profile) {

      console.log(profile);
      // Save user info to local storage
      saveUserInfo(profile, authResult.idToken);
      $rootScope.authenticated = true;
    })
  });
  // Called when authentication fails
  auth.lockOn("error", function(error) {
    console.log(error);
  });
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
          $rootScope.authenticated = true;
        }
      } else {
        // Show the login page
        $location.path('/login');
        $rootScope.authenticated = true;
      }
    }

  });

  $rootScope.logOut = function () {
    store.remove('profile');
    store.remove('token');
    $location.url('/login');
    $rootScope.authenticated = false;
  }
}

angular.module('app', ['auth0', 'angular-storage', 'angular-jwt', 'ngRoute'])
.config(['$routeProvider', 'authProvider', 'jwtInterceptorProvider', '$httpProvider', configFunction])
.run(['$rootScope', 'auth', 'store', 'jwtHelper', '$location', 'authHelper', runFunction])
.factory('authHelper', ['$http', authHelperFunction]);

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
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      loginUrl: '/login'
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

function runFunction ($rootScope, auth, store, jwtHelper, $location, authHelper){
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
      var token = store.get('token');
      console.log(profile);
      if(token === null){
        // Perform a login
        // Save user info to local storage
        saveUserInfo(profile, authResult.idToken);
      } else {
        // We are probably trying to link an account
        profile = store.get('profile');
        //Use authHelper service to try linking
        authHelper.tryLinking(authResult, token, profile.user_id)
          .success(function(linkResult){
            console.log('Link result', linkResult)
            // Go home if it was successful
            $location.path('/');
          }).error(function(err){
            console.log('Error linking', err)
          });
      }
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

function authHelperFunction($http){
  return {
    tryLinking: function (authResult, token, user_id) {
      console.log('Linking with ' + authResult.idToken);
      // Return an asynchronous call that tries to perform account linking with HTTP
      return $http(		
              {		
                  method: 'POST',		
                  url: 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + user_id + '/identities',		
                  headers: {		
                      Authorization: 'Bearer ' + token		
                  },		
                  data:{		
                      link_with: authResult.idToken	
                  }		
              }		
          );		
    }, 
    tryUnlinking: function (token, secondaryProvider, secondaryUserId, user_id) {
      // Return an asynchronous call that tries to unlink an account with HTTP
     return   $http(		
              {		
                    method: 'DELETE',		
                    url: 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + user_id + '/identities/' + secondaryProvider + '/' + secondaryUserId,		
                  headers: {		
                        Authorization: 'Bearer ' + token		
                    }		
                }		
            );		
    }
  }
}
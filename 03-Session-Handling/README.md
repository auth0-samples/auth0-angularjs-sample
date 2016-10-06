# Session Handling

This example shows how to manage sessions when authenticating with Auth0 in your application.

You can read a quickstart for this sample [here](https://auth0.com/docs/quickstart/spa/angularjs/03-session-handling).

## Getting Started

To run this quickstart you can fork and clone this repo.

Be sure to set the correct values for your Auth0 application in the `www/app/auth0.variables.js` file.

To run the application

```bash
# Install the dependencies
bower install

# Install simple web server
npm install -g serve

# Run
serve
```


## Important Snippets

### 1. Save token on login

```js
// components/auth/auth.service.js
(function () {

  ...

  function authService($rootScope, lock, authManager, jwtHelper) {

    ...

    // Set up the logic for when a user authenticates
    // This method is called from app.run.js
    function registerAuthenticationListener() {
      lock.on('authenticated', function (authResult) {
        localStorage.setItem('id_token', authResult.idToken);
        authManager.authenticate();
      });
    }

    ...

    return {
      ...
      
      registerAuthenticationListener: registerAuthenticationListener,
      
      ...
    }
  }
})();
```

### 2. Check if user is authenticated

```js
// components/auth/auth.service.js
(function () {

  ...

  function authService($rootScope, lock, authManager, jwtHelper) {

    ...
    function checkAuthOnRefresh() {
      var token = localStorage.getItem('id_token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!$rootScope.isAuthenticated) {
            authManager.authenticate();
          }
        }
      }
    }

    return {
      ...
     
      checkAuthOnRefresh: checkAuthOnRefresh
    }
  }
})();
```


### 3. Logout

```js
// components/auth/auth.service.js
(function () {

  ...

  function authService($rootScope, lock, authManager, jwtHelper) {

    ...

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authManager.unauthenticate();
    }

    ...

    return {
      ...
      
      logout: logout,
      
      ...
    }
  }
})();
```

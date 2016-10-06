# Passwordless Lock

This example shows how to add ***Login*** to your application using the `Lock-Passwordless` widget.

You can read a more about passwordless authentication [here](https://auth0.com/docs/connections/passwordless). 

## Getting Started

To run this quickstart you can fork and clone this repo.

Enable Email passwordless connection on the Auth0 [dashboard](https://manage.auth0.com/#/connections/passwordless) 

Be sure to set the correct values for your Auth0 application in the `auth0.variables.js` file.

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

### 1. Add `lock-passwordless.js` and `angular-lock-passwordless.js` dependencies

```html
<!-- index.html -->
<body>
  ...
  <!-- Auth0's Lock-Passwordless library -->
  <script type="text/javascript" src="bower_components/auth0-lock-passwordless/build/lock-passwordless.js"></script>
  <!-- angular-lock-passwordless -->
  <script type="text/javascript" src="bower_components/angular-lock-passwordless/dist/angular-lock-passwordless.js"></script>
  ...
</body>
```

### 2. Login with `lockPasswordless`	

```js
// components/auth/auth.service.js
(function () {

  ...

  function authService($rootScope, lockPasswordless, authManager, jwtHelper, $q, $state) {

    ...

    function login() {
      lockPasswordless.emailcode(function(error, profile, id_token) {
        if (error) {
          alert("Error: " + error);
          return;
        }
        localStorage.setItem('id_token', id_token);
        authManager.authenticate();
        localStorage.setItem('profile', JSON.stringify(profile));

        deferredProfile.resolve(profile);
        $state.go('home');
        lockPasswordless.close();
      });
    }

    ...

    return {
      login: login,
      
      ...
      
    }
  }
})();
```

### 3. Update the module dependencies and configure the service

```js
// app.js

(function () {

  'use strict';

  angular
    .module('app', ['auth0.lockPasswordless', 'angular-jwt', 'ui.router'])
    .config(config);

  config.$inject = ['$stateProvider', 'lockPasswordlessProvider', '$urlRouterProvider'];

  function config($stateProvider, lockPasswordlessProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'components/home/home.html',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'components/login/login.html',
        controllerAs: 'vm'
      });

    lockPasswordlessProvider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN
    });

    $urlRouterProvider.otherwise('/home');
  }

})();
```

```js
// app.run.js

(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope', 'authService'];

  function run($rootScope, authService) {
    // Put the authService on $rootScope so its methods
    // can be accessed from the nav bar
    $rootScope.authService = authService;

    // Use the authService to check for
    // the user's authentication state when the page is
    // refreshed and maintain authentication
    authService.checkAuthOnRefresh();
  }

})();
```
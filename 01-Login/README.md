# Login

This example shows how to add ***Login/SignUp*** to your application using the `Lock` widget.

You can read a quickstart for this sample [Angular 1.x Quickstart](https://auth0.com/docs/quickstart/spa/angularjs/01-login). 

## Getting Started

To run this quickstart you can fork and clone this repo.

Be sure to set the correct values for your Auth0 application in the `auth0.variables.js` file.

To run the application:

```bash
# Install the dependencies
bower install

# Install simple web server
npm install -g serve

# Run
serve
```


## Important Snippets

### 1. Add the module dependencies and configure the service

```js
// app.js
(function () {

  'use strict';

  angular
    .module('app', ['auth0.lock', 'angular-jwt', 'ui.router'])
    .config(config);

  config.$inject = ['$stateProvider', 'lockProvider', '$urlRouterProvider'];

  function config($stateProvider, lockProvider, $urlRouterProvider) {

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

    lockProvider.init({
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

  run.$inject = ['$rootScope', 'authService', 'lock'];

  function run($rootScope, authService, lock) {
    // Put the authService on $rootScope so its methods
    // can be accessed from the nav bar
    $rootScope.authService = authService;

    // Register the authentication listener that is
    // set up in auth.service.js
    authService.registerAuthenticationListener();

    // Register the synchronous hash parser
    lock.interceptHash();
  }

})();
```

### 2. Implement the auth service

```js
// components/auth/auth.service.js
(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['lock', 'authManager'];

  function authService(lock, authManager) {

    function login() {
      lock.show();
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authManager.unauthenticate();
    }

    // Set up the logic for when a user authenticates
    // This method is called from app.run.js
    function registerAuthenticationListener() {
      lock.on('authenticated', function (authResult) {
        localStorage.setItem('id_token', authResult.idToken);
        authManager.authenticate();
      });
    }

    return {
      login: login,
      logout: logout,
      registerAuthenticationListener: registerAuthenticationListener
    }
  }
})();
```

### 3. Implement the login controller

```js
// components/login/login.controller.js
(function () {
  'use strict';

  angular
    .module('app')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['authService'];

  function LoginController(authService) {

    var vm = this;
    vm.authService = authService;

  }

}());
```

### 4. Add the login view

```html
<!-- components/login/login.html -->
<div class="jumbotron">
  <h2 class="text-center"><img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg"></h2>
  <h2 class="text-center">Login</h2>
  <div class="text-center">
    <button class="btn btn-primary" ng-click="vm.authService.login()">Log In</button>
  </div>
</div>
```

### 5. Update the home controller

```js
// components/home/home.controller.js
(function () {

  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['authService'];

  function HomeController(authService) {

    var vm = this;
    vm.authService = authService;

  }

}());
```

### 6. Update the home view

```html
<!-- components/home/home.html -->
<div class="jumbotron">
  <h2 class="text-center"><img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg"></h2>
  <h2 class="text-center">Home</h2>
  <div class="text-center" ng-if="!isAuthenticated">
    <p>You are not yet authenticated. <a href="#/login">Log in.</a></p>
  </div>
  <div class="text-center" ng-if="isAuthenticated">
    <p>Thank you for logging in! <a href="javascript:;" ng-click="vm.authService.logout()">Log out.</a></p>
  </div>
</div>

```
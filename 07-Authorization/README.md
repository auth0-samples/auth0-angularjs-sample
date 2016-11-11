# Authorization

This example shows one of the ways of adding ***Authorization*** for a resource in your application.

You can read a quickstart for this sample [here](https://auth0.com/docs/quickstart/spa/angularjs/07-authorization). 

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

### 1. Check if the user is admin

```js
// components/auth/auth.service.js
(function () {

  ...

  function authService($rootScope, lock, authManager, jwtHelper, $q) {

   ...

    function isAdmin() {
      return userProfile && userProfile.app_metadata
        && userProfile.app_metadata.roles
        && userProfile.app_metadata.roles.indexOf('admin') > -1;
    }

    ...

  }
})();
```

### 2. Subscribe to `$stateChangeStart` and add user verification to the event callback function

```js
// components/home/home.controller.js
(function () {

  ...

  function authService($rootScope, lock, authManager, jwtHelper, $q) {

    ...

    $rootScope.$on('$stateChangeStart', function(event, nextRoute) {
      if (nextRoute.controller === 'AdminController') {
        if (!isAdmin()) {
          alert('You are not allowed to see the Admin content');
          return event.preventDefault();
        }
      }
    });

    ...
    
  }
})();
```

### 3. Create a new admin content in the `admin` template

```html
<!-- components/admin/admin.html -->
<div class="jumbotron">
  <h2 class="text-center"><img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg"></h2>
  <h2 class="text-center">Admin</h2>
  <div class="text-center">
    <h2>You are viewing this because you are logged in and you have 'admin' role</h2>
  </div>
</div>
```
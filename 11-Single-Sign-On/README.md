# Single Sign-On

This example shows how to ***Login*** using Single Sign On

You can read a more about client-side SSO in the Single Page Applications [here](https://auth0.com/docs/sso/single-page-apps-sso). 

## Getting Started

To run this quickstart you can fork and clone this repo.

Be sure to set the correct Auth0 credentials for your applications in the `auth0-variables.js` files of both applications in this sample.

Go to your [Clients](https://manage.auth0.com/#/clients), open your App, switch the `Use Auth0 instead of the IdP to do Single Sign On` flag on and save changes.

If you use two Auth0 applications for this example, enable `Use Auth0 instead of the IdP to do Single Sign On` flag for both of them.

You will also need to whitelist the URLs you want to redirect to when you log out of Auth0 SSO. These can be set in the [advanced settings](https://manage.auth0.com/#/account/advanced).  

To run applications

```bash
# Install simple web server
npm install -g serve

# Go to the first application
cd app1.com

# Install the dependencies for the first application
bower install

# Run the first application
serve

# Go to the second application
cd ../app2.com

# Install the dependencies for the second application
bower install

# Run the second application
serve --port 3001
```

Click `Logout from your Auth0 application` button on the example's `Home` page to clean all Auth0 cookies.

## Important Snippets

### 1. Add `angular-auth0.js` dependency

```html
<!-- index.html -->
<body>
  <!--auth0.js library -->
  <script type="text/javascript" src="bower_components/angular-auth0/dist/angular-auth0.js"></script>
</body>
```

### 2. Wrap the `authService.checkAuthOnRefresh` method in the Angular's $timeout

```js
// app.run.js

(function () {

  function run($rootScope, authService, lock, $timeout) {
  
    ...

    $timeout(authService.checkAuthOnRefresh);
    
  }

})();
```

### 3. Update the `checkAuthOnRefresh` method in the `auth.service.js` file

```js
// components/auth/auth.service.js

(function () {

  function authService($rootScope, lock, angularAuth0, authManager, jwtHelper, $q) {

    ...

    function checkAuthOnRefresh() {
        var token = localStorage.getItem('id_token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            if (!$rootScope.isAuthenticated) {
              authManager.authenticate();
            }
          }
        } else {
          angularAuth0.getSSOData(function (err, data) {
            if (!err && data.sso) {
              angularAuth0.signin({
                scope: 'openid name picture',
                responseType: 'token'
              });
            }
          });
        }
    }

    return {
      
      checkAuthOnRefresh: checkAuthOnRefresh,
      
      ...
      
    }
  }
})();
```

### 4. Add the link to the second application and `Logout from your Auth0 application` button

```html
<!-- components/home/home.html -->
<div class="jumbotron">
  <h2 class="text-center"><img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg"></h2>
  <h2 class="text-center">Home</h2>
  <div class="text-center" ng-if="!isAuthenticated">
    <p>You are not yet authenticated. <a href="#/login">Log in.</a></p>
  </div>
  <div class="text-center" ng-if="isAuthenticated">
    <h2>Welcome, {{ vm.profile.nickname }}</h2>
    <img ng-src="{{ vm.profile.picture }}">
  </div>
  <div class="text-center">
    <h2><a href="http://localhost:3001">Open the application #2</a></h2>
    <button class="btn btn-danger" ng-click="vm.logoutFromAuth0()">Logout from your Auth0 applications</button>
  </div>
</div>
```

### 5. Add SSO Logout

The **Logout** link in the navbar logs the user out from the individual app, but to log the user out of SSO, you must call `auth0Angular.logout`.

> **Note:** You must set the URL that is allowed to be redirected to after logout in your [Auth0 advanced settings](https://manage.auth0.com/#/account/advanced). 

```js
// components/home/home.controller.js

(function () {

  function HomeController(authService) {

    ...

    vm.logoutFromAuth0 = function() {
      angularAuth0.logout({returnTo: 'http://localhost:3001/'});
    }

  }

}());
```

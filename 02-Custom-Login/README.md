# Custom Login

This example shows how to add ***Login/SignUp*** to your application using a custom Login screen.

You can read a quickstart for this sample [Angular 1.x Quickstart](https://auth0.com/docs/quickstart/spa/angularjs/02-custom-login). 

## Getting Started

To run this quickstart you can fork and clone this repo.

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

### 1. Add `auth0.js` and `angular-auth.js` dependencies

```html
<!-- index.html -->
<body>
  ...
  <!-- Auth0's JS library -->
  <script type="text/javascript" src="bower_components/auth0.js/build/auth0.js"></script>
  <!-- auth0-angular -->
  <script type="text/javascript" src="bower_components/angular-auth0/dist/angular-auth0.js"></script>
  ...
</body>
```

### 2. Login with auth0	

```js
// components/auth/auth.service.js
(function () {

  ...

  function authService(angularAuth0, authManager, $location) {

    function login(username, password, callback) {
      angularAuth0.login({
        connection: 'Username-Password-Authentication',
        responseType: 'token',
        email: username,
        password: password,
      }, callback);
    }

    function signup(username, password, callback) {
      angularAuth0.signup({
        connection: 'Username-Password-Authentication',
        responseType: 'token',
        email: username,
        password: password
      }, callback);
    }

    function googleLogin(callback) {
      angularAuth0.login({
        connection: 'google-oauth2',
        responseType: 'token'
      }, callback);
    }


    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authManager.unauthenticate();
    }

    function authenticateAndGetProfile() {
      var result = angularAuth0.parseHash(window.location.hash);

      if (result && result.idToken) {
        localStorage.setItem('id_token', result.idToken);
        authManager.authenticate();
        angularAuth0.getProfile(result.idToken, function (error, profileData) {
          if (error) {
            console.log(error);
          }

          localStorage.setItem('profile', JSON.stringify(profileData));
          $location.path('/');
        });
      } else if (result && result.error) {
        alert('error: ' + result.error);
      }
    }

    return {
      login: login,
      logout: logout,
      authenticateAndGetProfile: authenticateAndGetProfile,
      signup: signup,
      googleLogin: googleLogin
    }
  }
})();
```

### 3. Display `username` and `password` inputs, `login` and `loginWithGoogle` buttons

```html
<!-- components/login/login.html -->
<div class="jumbotron">
  <h2 class="text-center"><img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg"></h2>
  <h2 class="text-center">Login</h2>
  <p class="text-center">{{message}}</p>
</div>
<div class="container">
  <div class="col-md-3">
    <div id="login-container">
      <form>
        <fieldset>
          <label for="user">User</label>
          <input class="form-control" id="user" type="text" name="user" ng-model="user" ng-disabled="loading"/>
          <br>
          <label for="password">Password</label>
          <input class="form-control" id="password" type="password" name="pass" ng-model="pass" ng-disabled="loading"/>
          <br>
          <button class="btn btn-primary" type="submit" ng-disabled="loading" ng-click="login()">Login</button>
          <button class="btn btn-primary" type="submit" ng-disabled="loading" ng-click="signup()">Sign Up</button>
        </fieldset>
      </form>
      <a href="" ng-click="googleLogin()">Login with Google</a><br/>
    </div>
  </div>
</div>
```

### 4. Update the `Login` controller

```js
// components/login/login.controller.js
(function () {

  ...

  function loginController($scope, authService) {

    // Put the authService on $scope to access
    // the login method in the view
    $scope.authService = authService;

    $scope.login = function () {
      // Show loading indicator
      $scope.message = 'loading...';
      $scope.loading = true;
      authService.login($scope.user, $scope.pass, function (err) {
        if (err) {
          $scope.message = "something went wrong: " + err.message;
          $scope.loading = false;
        }
      });
    };

    $scope.signup = function () {
      // Show loading indicator
      $scope.message = 'loading...';
      $scope.loading = true;
      authService.signup($scope.user, $scope.pass, function (err) {
        if (err) {
          $scope.message = "something went wrong: " + err.message;
          $scope.loading = false;
        }
      });
    };

    $scope.googleLogin = function () {
      $scope.message = 'loading...';
      $scope.loading = true;

      authService.googleLogin(function (err) {
        if (err) {
          $scope.message = "something went wrong: " + err.message;
          $scope.loading = false;
        }
      });
    };
  }

})();
```
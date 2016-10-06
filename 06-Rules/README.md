# Rules

This example shows how to work with `Auth0` rules, more information about them can be found [here](https://auth0.com/docs/rules).

You can read a quickstart for this sample [here](https://auth0.com/docs/quickstart/spa/angularjs/06-rules). 

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


# Rules

This example shows how to work with `Auth0` rules, more information about them can be found [here](https://auth0.com/docs/rules).

You can read a quickstart for this sample [here](https://auth0.com/docs/quickstart/native/ionic/05-rules). 

## Getting Started

To run this quickstart you can fork and clone this repo.

Be sure to set the correct values for your Auth0 application in the `www/app/auth0.variables.js` file.

To run the application

```bash
# Install the dependencies
bower install

# Get the plugins
ionic state restore --plugins

# Run
ionic serve
```


## Important Snippets

### 1. Update the home controller
 
```js
// components/home/home.controller.js
(function () {

  ...

  function HomeController(authService) {

    var vm = this;
    vm.authService = authService;

    authService.getProfileDeferred().then(function (profile) {
      vm.profile = profile;
    });

  }

}());
```

### 2. Display user country in the home view

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
    <h3 ng-if="vm.profile.country">from {{ vm.profile.country }} <span class="additional-info">(added by rule)</span> </h3>
    <img ng-src="{{ vm.profile.picture }}">
  </div>
</div>

```
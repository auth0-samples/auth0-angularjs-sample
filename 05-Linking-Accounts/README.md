# Linking Accounts

This example shows how to link/unlink different `Auth0` users accounts.

You can read a quickstart for this sample [here](https://auth0.com/docs/quickstart/spa/angularjs/05-linking-acounts). 

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

### 1. Implement sending link/unlink account requests

```js
/* ===== components/auth/auth.service.js ===== */
(function () {

  ...

  function authService($rootScope, lock, authManager, jwtHelper, $q, $http) {

    ...

    function linkAccount() {
      try {
        var profile = JSON.parse(localStorage.getItem('profile'));
        var token = localStorage.getItem('id_token');
      } catch (e) {
        return false;
      }

      var options = {
        rememberLastLogin: false,
        auth: {
          redirect: false,
          params: {
            scope: 'openid'
          }
        }
      };

      var lockLink = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, options);
      var deferred = $q.defer();

      lockLink.on('authenticated', function (authResult) {

        $http({
          method: 'POST',
          url: 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + profile.user_id + '/identities',
          headers: {
            Authorization: 'Bearer ' + token
          },
          data: {
            link_with: authResult.idToken
          }
        })
          .then(function () {
            lockLink.hide();

            lock.getProfile(token, function (error, profile) {
              if (!error) {
                localStorage.setItem('profile', JSON.stringify(profile));
                deferred.resolve(profile);
              } else {
                deferred.reject(error);
              }
            });

          });

      });

      lockLink.show();

      return deferred.promise;

    }

    function unLinkAccount(identity) {
      try {
        var profile = JSON.parse(localStorage.getItem('profile'));
        var token = localStorage.getItem('id_token');
      } catch (e) {
        return false;
      }

      var deferred = $q.defer();

      $http({
        method: 'DELETE',
        url: 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + profile.user_id + '/identities/' + identity.provider + '/' + identity.user_id,
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(function () {

          lock.getProfile(token, function (error, profile) {
            if (!error) {
              localStorage.setItem('profile', JSON.stringify(profile));
              deferred.resolve(profile);
            } else {
              deferred.reject(error);
            }
          });

        });

     ...

    }

    return {
    
      ... 
      
      linkAccount: linkAccount,
      unLinkAccount: unLinkAccount
    }
  }
})();
```

### 2. Update the home controller

```js
/* ===== components/home/home.controller.js ===== */
(function () {

  ...

  function HomeController($scope, authService) {

    var vm = this;
    vm.authService = authService;
    vm.linkAccount = linkAccount;
    vm.unLinkAccount = unLinkAccount;

    vm.identities = [];

    function refreshIdentities() {
      vm.profile.identities.shift();
      vm.identities = vm.profile.identities;
    }

    function linkAccount() {
      authService.linkAccount()
        .then(function (profile) {
          vm.profile = profile;
          refreshIdentities();
        })
    }

    function unLinkAccount(account) {
      account.hiddenItem = true;
      authService.unLinkAccount(account)
        .then(function (profile) {
          vm.profile = profile;
          refreshIdentities();
        });
    }

    authService.getProfileDeferred().then(function (profile) {
      vm.profile = profile;
      refreshIdentities();
    });

  }

}());
```

### 3. Display link account button and profile identities in the home view

```html
<!-- ===== components/home/home.html ===== -->
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
  <div class="identities-wrap">
    <button ng-if="isAuthenticated" class="btn btn-primary" ng-click="vm.linkAccount()">Link Account</button>
    <ul class="list-group identities-list">
      <li class="list-group-item identities-item" ng-repeat="identity in vm.identities">
        <img ng-src="{{identity.profileData.picture}}"/>
        <span>{{ identity.profileData.name || identity.profileData.email }}</span>
        <button class="btn btn-danger" ng-click="vm.unLinkAccount(identity)"><i class="glyphicon glyphicon-trash"></i></button>
      </li>
    </ul>
  </div>
</div>
```
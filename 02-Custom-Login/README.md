# 02 - Custom Login

This seed project shows an example of adding custom authentication to an Angular 1.x app with Auth0. This is useful for cases where you would like to provide your own UI for authenticating users. The sample uses [auth0.js](https://github.com/auth0/auth0.js) and [angular-auth0](https://github.com/auth0/angular-auth0).

## Installation

```bash
bower install
```

Place your Auth0 `clientID` and `domain` in `angularAuth0Provider.init`.

```js
// app.js

...

// Initialization for the angular-auth0 library
angularAuth0Provider.init({
  clientID: AUTH0_CLIENT_ID,
  domain: AUTH0_DOMAIN
});

...
```

Provide functions for logging in and signing up.

```js
// components/auth/auth.service.js

...

function authService($rootScope, angularAuth0, authManager, $location) {

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

...
```

To run this starter seed, you can use `http-server`:

```bash
npm install -g http-server

http-server
```

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [JSON Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free account in Auth0

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

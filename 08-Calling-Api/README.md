# Calling an API

This example shows how to make authenticated API calls using the JSON Web Token returned by Auth0 when you log into your application. It also demonstrates how to use UI Router with `html5Mode(true).`

The sample is configured to use a single `callback` route that is redirected to on successful authentication. This route needs to be added to your **Allowed Callack URLs** for your application in your [Auth0 dashboard](https://manage.auth0.com/#/clients).

You can clone and configure a [Node.js API sample](https://github.com/auth0/node-auth0/tree/master/examples/nodejs-api) to make authenticated calls to an API.

## Getting Started

To get started, rename the `auth0-variables.js.example` file in the `public` directory to `auth0-variables.js` and provide your Auth0 client ID and domain.

Next, install the dependencies and run the app.

```bash
# Install the dependencies
bower install
npm install

# Run the app
npm start
```

## How the Angular App is Served

This sample shows how to serve the application with a simple Node.js server using Express. The reason an Express server is set up rather than just using something like **http-server** or **serve** is that some configuation is needed to allow `html5Mode` routes to properly render. For more on this topic, see this [discussion](https://stackoverflow.com/questions/16569841/reloading-the-page-gives-wrong-get-request-with-angularjs-html5-mode).

# Using `html5Mode(true)` with Auth0

A common pattern in single page apps is to have a navigation bar at the top of the page and have various app routes rendered below with **Log In** button is provided in the navbar to allow users to log in from any route. This becomes a challenge when setting `$locationProvider.html5Mode(true)` because it will require that you set any possible route as an **Allowed Callback URL** in your Angular application, which isn't scalable.

To solve this issue, you can configure Lock to use a specific `callbackURL`. When specifying a `callbackURL`, your must set `responseType: token`. This is all done within the `options` object in your `lockProvider.init`.

```js
// app.js

lockProvider.init({
  clientID: AUTH0_CLIENT_ID,
  domain: AUTH0_DOMAIN,
  options: {
    auth: {
      params: {
        callbackURL: 'http://localhost:3000/callback',
        respone: 'token'
      }
    }
  }
});
```

With this set, the only route you need to whitelist in your **Allowed Callback URLs** in your Auth0 dashboard is `http://localhost:3000/callback`.

## Returning to the Last State

One implication of specifying a `callbackURL` when using Lock is that it forces you to return the user to a default location after login is successful. This default is usually specified with `$urlRouterProvider.otherwise`.

If you would like to return the user to where they left off before logging in, you can store their current state in local storage when they click the **Log In** button.

```js
// components/auth/auth.service.js

function login() {
  localStorage.setItem('returnTo', $state.current.name);
  lock.show();
}
```

This `returnTo` value can then be used in the authentication success handler to send the user back to the state they were at when they clicked the **Log In** button.

```js
// components/auth/auth.service.js

function registerAuthenticationListener() {
  lock.on('authenticated', function (authResult) {
    localStorage.setItem('id_token', authResult.idToken);
    authManager.authenticate();


    lock.getProfile(authResult.idToken, function (error, profile) {
      if (error) {
        return console.log(error);
      }

      localStorage.setItem('profile', JSON.stringify(profile));
      deferredProfile.resolve(profile);
      
      var returnTo = localStorage.getItem('returnTo');
      $state.go(returnTo);
    });

  });
}
```

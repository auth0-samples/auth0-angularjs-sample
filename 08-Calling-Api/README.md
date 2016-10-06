# Calling API

This example shows how to make authenticated API calls using the JSON Web Token given by Auth0 in your Ionic application.
You can read a quickstart for this sample [here](https://auth0.com/docs/quickstart/spa/angularjs/08-calling-apis). 

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


## Create a Simple Server

To demonstrate how a server would handle public and private endpoints, you can create a simple `node.js` server based on [`express`](https://expressjs.com/) and [`express-jwt`](https://github.com/auth0/express-jwt) with only two endpoints: `/ping` and `/secured/ping`:

```javascript
/* ===== ./server.js ===== */
var http = require('http');
var express = require('express');
var cors = require('cors');
var app = express();
var jwt = require('express-jwt');

var authenticate = jwt({
  secret: new Buffer('YOUR_SERCRET', 'base64'),
  audience: 'YOUR_CLIENT_ID'
});

app.use(cors());

app.get('/ping', function(req, res) {
  res.send(200, {text: "All good. You don't need to be authenticated to call this"});
});

app.get('/secured/ping', authenticate, function(req, res) {
  res.send(200, {text: "All good. You only get this message if you're authenticated"});
});

var port = process.env.PORT || 3001;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});
```

Both endpoints send a JSON response with a message attribute, but `/secured/ping` uses the __authenticate__ callback to validate the token received in the `Authorization` header. `express-jwt` is responsible for parsing and validating the token. (For more details, see the [express-jwt](https://github.com/auth0/express-jwt) documentation). 

To test the server, run `node server.js`. It should be listening on port 3001 of `localhost`.

Also you can [view](https://github.com/auth0-samples/auth0-angularjs-sample/tree/master/Server) the simple server on GitHub.


## Important Snippets

### 1. Implement the ping controller

```js
// components/ping/ping.controller.js
(function () {

  ...

  function PingController(authService, $http) {

    var vm = this;
    vm.authService = authService;

    // The user's JWT will automatically be attached
    // as an authorization header on HTTP requests
    vm.ping = function () {
      $http.get('http://localhost:3001/secured/ping')
        .then(function (result) {
          vm.pingResult = result.data.text;
        }, function (error) {
          console.log(error);
          vm.pingResult = error.statusText;
        });
    }

  }

}());
```

### 2. Display `ping` buttons in the ping view 

```html
<!-- components/ping/ping.html -->

<div class="jumbotron">
  <h2 class="text-center"><img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg"></h2>
  <h2 class="text-center">Ping</h2>
  <div class="text-center">
    <button ng-click="vm.ping()" class="btn btn-primary">Ping</button>
    <h2 ng-if="vm.pingResult">{{ vm.pingResult }}</h2>
  </div>
</div>
```
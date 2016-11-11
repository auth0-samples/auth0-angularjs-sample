# Angular OAuth 2.0 Authorization

This example demonstrates how use Auth0's OAuth 2.0 API authorization features. The application uses `auth0.js` to log a user in via Auth0's hosted Lock. An `access_token` is returned which may include fine-grained access control scopes which are configured in the [APIs](https://manage.auth0.com/#/apis) section of the Auth0 dashbaord.

For more information on how to set up an API in the Auth0 dashboard, read the [full quickstart tutorial](https://auth0.com/docs/quickstart/spa/angularjs/13-api-authorization).

## Getting Started

To get started, clone the repo and rename the `auth0-variables.js.example` file to `auth0-variables.js` and populate it with the client ID and domain for your application.

In the `login` method within `auth/auth.service.js`, be sure to set the identifier for your API in the `audience` key. The identifier for your API can be retrieved from the APIs area in the [dashboard](https://manage.auth0.com/#/apis).

To run the application:

```bash
# Install the dependencies
bower install

# Install simple web server
npm install -g serve

# Run
serve
```

## Pinging an API

The sample demonstrates how to ping an API with the `access_token` returned to the user. The Resource Server (API) should be configured to verify the JWT and any claims contained within it. Because the Resource Server is utilizing the RS256 signature method, tokens are signed using Auth0's private key for your account. Verification is done using the corresponding public key, which can be found at the following standard [JWKS (JSON Web Key set)](https://self-issued.info/docs/draft-ietf-jose-json-web-key.html). You can use any [recommended JWT library](https://jwt.io) to validate the standard claims returned in the token. More information can be found [in our documentation](https://auth0.com/docs/api-auth/config/asking-for-access-tokens).

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.
/**
 * Angular SDK to use with Auth0
 * @version v4.1.0 - 2016-05-18
 * @link https://auth0.com
 * @author Martin Gontovnikas
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

    angular.module('auth0', ['auth0.service', 'auth0.utils', 'auth0.directives'])
        .run(["auth", function(auth) {
            auth.hookEvents();
        }]);



    angular.module('auth0.utils', [])
        .provider('authUtils', function() {
            var Utils = {
                capitalize: function(string) {
                    return string ? string.charAt(0).toUpperCase() + string.substring(1).toLowerCase() : null;
                },
                fnName : function(fun) {
                    var ret = fun.toString();
                    ret = ret.substr('function '.length);
                    ret = ret.substr(0, ret.indexOf('('));
                    return ret ? ret.trim() : ret;
                }
            };

            angular.extend(this, Utils);

            this.$get = ["$rootScope", "$q", function($rootScope, $q) {
                var authUtils = {};
                angular.extend(authUtils, Utils);

                authUtils.safeApply = function(fn) {
                    var phase = $rootScope.$root.$$phase;
                    if(phase === '$apply' || phase === '$digest') {
                        if(fn && (typeof(fn) === 'function')) {
                            fn();
                        }
                    } else {
                        $rootScope.$apply(fn);
                    }
                };

                authUtils.callbackify = function (nodeback, success, error, self) {
                    if (angular.isFunction(nodeback)) {
                        return function (args) {
                            args = Array.prototype.slice.call(arguments);
                            var callback = function (err, response, etc) {
                                if (err) {
                                    error && error(err);
                                    return;
                                }
                                // if more arguments then turn into an array for .spread()
                                etc = Array.prototype.slice.call(arguments, 1);
                                success && success.apply(null, etc);
                            };
                            if (success || error) {
                                args.push(authUtils.applied(callback));
                            }
                            nodeback.apply(self, args);
                        };
                    }
                };

                authUtils.promisify = function (nodeback, self) {
                    if (angular.isFunction(nodeback)) {
                        return function (args) {
                            args = Array.prototype.slice.call(arguments);
                            var dfd = $q.defer();
                            var callback = function (err, response, etc) {
                                if (err) {
                                    dfd.reject(err);
                                    return;
                                }
                                // if more arguments then turn into an array for .spread()
                                etc = Array.prototype.slice.call(arguments, 1);
                                dfd.resolve(etc.length > 1 ? etc : response);
                            };

                            args.push(authUtils.applied(callback));
                            nodeback.apply(self, args);
                            // spread polyfill only for promisify
                            dfd.promise.spread = dfd.promise.spread || function (fulfilled, rejected) {
                                    return dfd.promise.then(function (array) {
                                        return Array.isArray(array) ? fulfilled.apply(null, array) : fulfilled(array);
                                    }, rejected);
                                };
                            return dfd.promise;
                        };
                    }
                };

                authUtils.applied = function(fn) {
                    // Adding arguments just due to a bug in Auth0.js.
                    return function (err, response) {
                        // Using variables so that they don't get deleted by UglifyJS
                        err = err;
                        response = response;
                        var argsCall = arguments;
                        authUtils.safeApply(function() {
                            fn.apply(null, argsCall);
                        });
                    };
                };

                return authUtils;
            }];



        });


    angular.module('auth0.service', ['auth0.utils'])
        .provider('auth', ["authUtilsProvider", function(authUtilsProvider) {
            var defaultOptions = {
                callbackOnLocationHash: true
            };
            var config = this;

            var innerAuth0libraryConfiguration = {
                'Auth0': {
                    signin: 'login',
                    signup: 'signup',
                    reset: 'changePassword',
                    validateUser: 'validateUser',
                    library: function() {
                        return config.auth0js;
                    },
                    parseOptions: function(options) {
                        var retOptions = angular.copy(options);
                        if (retOptions.authParams) {
                            angular.extend(retOptions, retOptions.authParams);
                            delete retOptions.authParams;
                        }
                        return retOptions;
                    }
                },
                'Auth0Lock': {
                    signin: 'show',
                    signup: 'showSignup',
                    reset: 'showReset',
                    library: function() {
                        return config.auth0lib;
                    },
                    parseOptions: function(options) {
                        return angular.copy(options);
                    }
                }
            };

            function getInnerLibraryMethod(name, libName) {
                libName = libName || config.lib;
                var library = innerAuth0libraryConfiguration[libName].library();
                return library[innerAuth0libraryConfiguration[libName][name]];
            }

            function getInnerLibraryConfigField(name, libName) {
                libName = libName || config.lib;
                return innerAuth0libraryConfiguration[libName][name];
            }

            function constructorName(fun) {
                if (fun) {
                    return {
                        lib: authUtilsProvider.fnName(fun),
                        constructor: fun
                    };
                }

                /* jshint ignore:start */
                if (null != window.Auth0Lock) {
                    return {
                        lib: 'Auth0Lock',
                        constructor: window.Auth0Lock
                    };
                }

                if (null != window.Auth0) {
                    return {
                        lib: 'Auth0',
                        constructor: window.Auth0
                    };
                }

                if (typeof Auth0Widget !== 'undefined') {
                    throw new Error('Auth0Widget is not supported with this version of auth0-angular' +
                        'anymore. Please try with an older one');
                }

                throw new Error('Cannot initialize Auth0Angular. Auth0Lock or Auth0 must be available');
                /* jshint ignore:end */
            }

            this.init = function(options, Auth0Constructor) {
                if (!options) {
                    throw new Error('You must set options when calling init');
                }
                this.loginUrl = options.loginUrl;
                this.loginState = options.loginState;
                this.clientID = options.clientID || options.clientId;
                var domain = options.domain;
                this.domain = domain;
                this.sso = options.sso;

                var constructorInfo = constructorName(Auth0Constructor);
                this.lib = constructorInfo.lib;
                if (constructorInfo.lib === 'Auth0Lock') {
                    this.auth0lib = new constructorInfo.constructor(this.clientID, domain, angular.extend(defaultOptions, options));
                    this.auth0js = this.auth0lib.getClient();
                    this.isLock = true;
                } else {
                    this.auth0lib = new constructorInfo.constructor(angular.extend(defaultOptions, options));
                    this.auth0js = this.auth0lib;
                    this.isLock = false;
                }

                this.initialized = true;
            };


            this.eventHandlers = {};

            this.on = function(anEvent, handler) {
                if (!this.eventHandlers[anEvent]) {
                    this.eventHandlers[anEvent] = [];
                }
                this.eventHandlers[anEvent].push(handler);
            };

            var events = ['loginSuccess', 'loginFailure', 'logout', 'forbidden', 'authenticated'];
            angular.forEach(events, function(anEvent) {
                config['add' + authUtilsProvider.capitalize(anEvent) + 'Handler'] = function(handler) {
                    config.on(anEvent, handler);
                };
            });

            this.$get = ["$rootScope", "$q", "$injector", "$window", "$location", "authUtils", "$http",
                function($rootScope, $q, $injector, $window, $location, authUtils, $http) {
                var auth = {
                    isAuthenticated: false
                };

                $rootScope.isAuthenticated = false;

                var getHandlers = function(anEvent) {
                    return config.eventHandlers[anEvent];
                };

                var callHandler = function(anEvent, locals) {
                    $rootScope.$broadcast('auth0.' + anEvent, locals);
                    angular.forEach(getHandlers(anEvent) || [], function(handler) {
                        $injector.invoke(handler, auth, locals);
                    });
                };

                // SignIn

                var onSigninOk = function(idToken, accessToken, state, refreshToken, profile, isRefresh) {
                    var profilePromise = auth.getProfile(idToken);

                    var response = {
                        idToken: idToken,
                        accessToken: accessToken,
                        state: state,
                        refreshToken: refreshToken,
                        profile: profile,
                        isAuthenticated: true
                    };

                    $rootScope.isAuthenticated = true;

                    angular.extend(auth, response);
                    callHandler(!isRefresh ? 'loginSuccess' : 'authenticated', angular.extend({
                        profilePromise: profilePromise
                    }, response));

                    return profilePromise;
                };

                function forbidden() {
                    if (config.loginUrl) {
                        $location.path(config.loginUrl);
                    } else if (config.loginState) {
                        $injector.get('$state').go(config.loginState);
                    } else {
                        callHandler('forbidden');
                    }
                }

                // Redirect mode
                $rootScope.$on('$locationChangeStart', function() {
                    if (!config.initialized) {
                        return;
                    }

                    var hashResult = config.auth0lib.parseHash($window.location.hash);
                    if (!auth.isAuthenticated) {
                        if (hashResult && hashResult.id_token) {
                            onSigninOk(hashResult.id_token, hashResult.access_token, hashResult.state, hashResult.refresh_token);
                            return;
                        }
                    }
                });

                $rootScope.$on('auth0.forbiddenRequest', function() {
                    forbidden();
                });

                if (config.loginUrl) {
                    $rootScope.$on('$routeChangeStart', function(e, nextRoute) {
                        if (!config.initialized) {
                            return;
                        }

                        verifyRoute(
                            (nextRoute.$$route && nextRoute.$$route.requiresLogin),
                            e,
                            function(){
                                return JSON.stringify({
                                    redirect_to: {
                                        path: $location.path()
                                    }
                                });
                            },
                            function(){
                                $location.path(config.loginUrl);
                            }
                        );
                    });
                }


                if (config.loginState) {
                    $rootScope.$on('$stateChangeStart', function(e, to, toParams) {
                        if (!config.initialized) {
                            return;
                        }

                        verifyRoute(
                            (to.data && to.data.requiresLogin),
                            e,
                            function() {
                                return JSON.stringify({
                                    redirect_to: {
                                        state: to.name,
                                        params: toParams
                                    }
                                });
                            },
                            function() {
                                $injector.get('$state').go(config.loginState);
                            }
                        );
                    });
                }

                function verifyRoute(requiresLogin, e, getState, redirectToLogin) {
                    if (!auth.isAuthenticated && !auth.refreshTokenPromise) {
                        if (config.sso) {
                            if (requiresLogin) {e.preventDefault();}
                            config.auth0js.getSSOData(authUtils.applied(function(err, ssoData) {
                                if (ssoData.sso) {
                                    var loginOptions = {
                                        popup: false,
                                        callbackOnLocationHash: true,
                                        connection: ssoData.lastUsedConnection.name,
                                        authParams: {
                                            state: getState()
                                        }
                                    };
                                    callHandler('ssoLogin', { loginOptions: loginOptions });
                                    auth.signin(loginOptions, null, null, 'Auth0');
                                } else if (requiresLogin) {
                                    e.preventDefault();
                                    redirectToLogin();
                                }
                            }));
                        } else if (requiresLogin) {
                            e.preventDefault();
                            redirectToLogin();
                        }
                    }
                }

                // Start auth service

                auth.config = config;

                var checkHandlers = function(options, successCallback) {
                    var successHandlers = getHandlers('loginSuccess');
                    if (!successCallback && !options.username && !options.email && (!successHandlers || successHandlers.length === 0)) {
                        throw new Error('You must define a loginSuccess handler ' +
                            'if not using popup mode or not doing ro call because that means you are doing a redirect');
                    }
                };

                var linkAccount = function(primaryJWT, secondaryJWT, profile){
                    var user_id = profile.user_id;
                    return $http(
                        {
                            method: 'POST',
                            url: 'https://' + config.domain + '/api/v2/users/' + user_id + '/identities',
                            headers: {
                                Authorization: 'Bearer ' + primaryJWT
                            },
                            data:{
                                link_with: secondaryJWT
                            }
                        }
                    )
                }

                var unLinkAccount = function(primaryJWT, user_id, secondaryProvider, secondaryUserId){
                    return $http(
                        {
                            method: 'DELETE',
                            url: 'https://' + config.domain + '/api/v2/users/' + user_id + '/identities/' + secondaryProvider + '/' + secondaryUserId,
                            headers: {
                                Authorization: 'Bearer ' + primaryJWT
                            }
                        }
                    )
                }

                auth.hookEvents = function() {
                    // Does nothing. Hook events on application's run
                };

                auth.init = angular.bind(config, config.init);

                auth.getToken = function(options) {
                    options = options || { scope: 'openid' };

                    if (!options.id_token && !options.refresh_token) {
                        options.id_token = auth.idToken;
                    }

                    var getDelegationTokenAsync = authUtils.promisify(config.auth0js.getDelegationToken, config.auth0js);

                    return getDelegationTokenAsync(options);
                };

                auth.refreshIdToken = function(refresh_token) {
                    var refreshTokenAsync = authUtils.promisify(config.auth0js.refreshToken, config.auth0js);

                    auth.refreshTokenPromise = refreshTokenAsync(refresh_token || auth.refreshToken).then(function (delegationResult) {
                        return delegationResult.id_token;
                    })['finally'](function() {
                        auth.refreshTokenPromise = null;
                    });

                    return auth.refreshTokenPromise;
                };

                auth.renewIdToken = function(id_token) {
                    var renewIdTokenAsync = authUtils.promisify(config.auth0js.renewIdToken, config.auth0js);

                    return renewIdTokenAsync(id_token || auth.idToken).then(function (delegationResult) {
                        return delegationResult.id_token;
                    });
                };

                auth.signin = function(options, successCallback, errorCallback, libName) {
                    options = options || {};
                    checkHandlers(options, successCallback, errorCallback);
                    options = getInnerLibraryConfigField('parseOptions', libName)(options);

                    var signinMethod = getInnerLibraryMethod('signin', libName);
                    var successFn = !successCallback ? null : function(profile, idToken, accessToken, state, refreshToken) {
                        if (!idToken && !angular.isUndefined(options.loginAfterSignup) && !options.loginAfterSignup) {
                            successCallback();
                        } else {
                            onSigninOk(idToken, accessToken, state, refreshToken, profile).then(function(profile) {
                                if (successCallback) {
                                    successCallback(profile, idToken, accessToken, state, refreshToken);
                                }
                            });
                        }
                    };

                    var errorFn = !errorCallback ? null : function(err) {
                        callHandler('loginFailure', { error: err });
                        if (errorCallback) {
                            errorCallback(err);
                        }
                    };

                    var signinCall = authUtils.callbackify(signinMethod, successFn, errorFn , innerAuth0libraryConfiguration[libName || config.lib].library());

                    signinCall(options);
                };

                auth.signup = function(options, successCallback, errorCallback) {
                    options = options || {};
                    checkHandlers(options, successCallback, errorCallback);
                    options = getInnerLibraryConfigField('parseOptions')(options);

                    var successFn = !successCallback ? null : function(profile, idToken, accessToken, state, refreshToken) {
                        if (!angular.isUndefined(options.auto_login) && !options.auto_login) {
                            successCallback();
                        } else {
                            onSigninOk(idToken, accessToken, state, refreshToken, profile).then(function(profile) {
                                if (successCallback) {
                                    successCallback(profile, idToken, accessToken, state, refreshToken);
                                }
                            });
                        }
                    };

                    var errorFn = !errorCallback ? null : function(err) {
                        callHandler('loginFailure', { error: err });
                        if (errorCallback) {
                            errorCallback(err);
                        }
                    };

                    var auth0lib = config.auth0lib;
                    var signupCall = authUtils.callbackify(getInnerLibraryMethod('signup'),successFn , errorFn, auth0lib);

                    signupCall(options);
                };
                
                auth.linkAccount = function (primaryJWT, primaryProfile, options, successCallback, errorCallback, libName) {
                    var defaultConfig = {popup: true};
                    if (!primaryJWT || !primaryProfile){
                        throw new Error('Available token and profile is needed to link to another');
                    }

                    if(!options.connection){
                        throw new Error('Connection type (eg: facebook, github) is required to link account');
                    }

                    options = options || {};

                    checkHandlers(options, successCallback, errorCallback);
                    angular.extend(options, defaultConfig);
                    options = getInnerLibraryConfigField('parseOptions', libName)(options);

                    var signinMethod = getInnerLibraryMethod('signin', libName);

                    var successFn = function(profile, idToken) {
                       linkAccount(primaryJWT, idToken, primaryProfile).then(function(response){

                           successCallback(response);

                       }, function(err) {
                               errorCallback(err);
                       });
                    };

                    var errorFn = function(err) {
                        if (errorCallback) {
                            errorCallback(err);
                        }
                    };


                    var linkAccountCall = authUtils.callbackify(signinMethod, successFn, errorFn , innerAuth0libraryConfiguration[libName || config.lib].library());

                    linkAccountCall(options);

                };

                auth.unLinkAccount = function (primaryJWT, user_id, secondaryProvider, secondaryUserId) {
                    if (!primaryJWT || !user_id || !secondaryProvider || !secondaryUserId){
                        throw new Error('All the arguments are required to unlink');
                    }

                    return unLinkAccount(primaryJWT,  user_id, secondaryProvider, secondaryUserId);

                };

                auth.reset = function(options, successCallback, errorCallback) {
                    options = options || {};

                    options = getInnerLibraryConfigField('parseOptions')(options);
                    var auth0lib = config.auth0lib;
                    var resetCall = authUtils.callbackify(getInnerLibraryMethod('reset'), successCallback, errorCallback, auth0lib);

                    resetCall(options);
                };

                auth.validateUser = function(options, successCallback, errorCallback) {
                    options = options || {};

                    options = getInnerLibraryConfigField('parseOptions')(options);
                    var auth0lib = config.auth0lib;
                    var validateUserCall = authUtils.callbackify(getInnerLibraryMethod('validateUser'), successCallback, errorCallback, auth0lib);

                    validateUserCall(options);
                };

                auth.signout = function() {
                    auth.isAuthenticated = false;
                    auth.profile = null;
                    auth.profilePromise = null;
                    auth.idToken = null;
                    auth.state = null;
                    auth.accessToken = null;
                    auth.tokenPayload = null;
                    $rootScope.isAuthenticated = false;
                    callHandler('logout');
                };

                auth.authenticate = function(profile, idToken, accessToken, state, refreshToken) {
                    return onSigninOk(idToken, accessToken, state, refreshToken, profile, true);
                };

                auth.getProfile = function(idToken) {
                    var getProfilePromisify = authUtils.promisify(config.auth0lib.getProfile, config.auth0lib);
                    auth.profilePromise = getProfilePromisify(idToken || auth.idToken);
                    return auth.profilePromise.then(function(profile) {
                        auth.profile = profile;
                        return profile;
                    });
                };

                auth.hide = function(callback) {
                    config.auth0lib.hide(callback);
                };

                return auth;
            }];
        }]);

angular.module('auth0.directives', ['auth0.service']);

angular.module('auth0.directives')
    .directive('ifUser', ["$rootScope", function($rootScope){
        return {
            link: function(scope, element){
                $rootScope.$watch('isAuthenticated',function(isAuth){
                    if(isAuth){
                        element.removeClass('ng-hide');
                    }else{
                        element.addClass('ng-hide');
                    }
                });
            }
        };
    }]);


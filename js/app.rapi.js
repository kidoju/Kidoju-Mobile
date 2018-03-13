/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        './vendor/valve/fingerprint',
        './window.assert',
        './window.logger',
        // './app.constants', // <-- optional
        './app.logger'
    ], f);
})(function () {

    'use strict';

    var app = window.app = window.app || {};

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        /* jshint maxstatements: 48 */
        var assert = window.assert;
        var logger = new window.Logger('app.rapi');
        var chrome = window.chrome;
        var Fingerprint = window.Fingerprint;
        var history = window.history;
        var localStorage = window.localStorage;
        var location = window.location;
        var navigator = window.navigator;
        var sessionStorage = window.sessionStorage;
        var rapi = app.rapi = {}; // rapi stands for Restful API
        var uris = app.uris = app.uris || {}; // they might have already been defined
        var UNDEFINED = 'undefined';
        var STRING = 'string';
        var NUMBER = 'number';
        var EQUALS = '=';
        var HASH = '#';
        var PROVIDERS = ['facebook', 'google', 'live', 'twitter'];
        var TOKEN = 'token';
        var ACCESS_TOKEN = 'access_token';
        var TOKEN_TYPE = 'token_type';
        var EXPIRES_IN = 'expires_in';
        var STATE = 'state';
        var DELETE = 'DELETE';
        var GET = 'GET';
        var POST = 'POST';
        var PUT = 'PUT';
        var COMMANDS = ['publish', 'draft'];
        var FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';
        var JSON_CONTENT_TYPE = 'application/json';
        var RX_ANDROID = /Android/;
        var RX_IEXPLORE = /;\s(MSIE\s|Trident\/)/;
        var RX_MONGODB_ID = /^[a-f0-9]{24}$/;
        var RX_LANGUAGE = /^[a-z]{2}$/;
        var RX_URL = /^https?\:\/\//;
        var AUTHENTICATION_SUCCESS = 'auth.success';
        var AUTHENTICATION_FAILURE = 'auth.failure';

        /**
         * This is a prerequisite for downloadFile
         * @see http://api.jquery.com/jquery.ajaxprefilter/
         * @see https://github.com/jquery/jquery/blob/master/test/unit/ajax.js#L1767
         */
        $.ajaxPrefilter('arraybuffer', function (s) {
            s.xhrFields = { responseType: 'arraybuffer' };
            s.responseFields.arraybuffer = 'response';
            s.converters['binary arraybuffer'] = true;
        });

        /**
         * Location of our RESTful server
         */
        uris.rapi = uris.rapi || {};
        if (!RX_URL.test(uris.rapi.root)) { // if not already defined
            if (app.DEBUG) {
                // Note best option is to modify the hosts file with a domain name as explained at http://www.rackspace.com/knowledge_center/article/how-do-i-modify-my-hosts-file
                // especially because some authentication providers do not support ip addresses and others do not support localhost
                // uris.rapi.root = 'http://jlchereau.local';
                // uris.rapi.root = 'http://10.0.0.105.xip.io:3001';
                uris.rapi.root = 'http://localhost:3001';
            } else {
                uris.rapi.root = 'https://www.kidoju.com';
            }
        }

        /**
         * Location of our api endpoints (contrary to root, we do not care whether they have already been defined)
         * TODO: Setup in config.jsx
         */
        uris.rapi.ping = '/api/ping';
        uris.rapi.oauth = {
            application: '/api/auth/application/{0}',
            refresh: '/api/auth/refresh',
            revoke: '/api/auth/revoke',
            signIn: '/api/auth/{0}/signin',
            signOut: '/api/auth/signout'
        };
        uris.rapi.v1 = {
            user: '/api/v1/users/{0}',
            me: '/api/v1/users/me',
            mySummaries: '/api/v1/users/me/{0}/summaries',
            myActivities: '/api/v1/users/me/{0}/activities',
            myFavourites: '/api/v1/users/me/{0}/favourites',
            myFavourite: '/api/v1/users/me/{0}/favourites/{1}',
            languages: '/api/v1/languages',
            language: '/api/v1/languages/{0}',
            categories: '/api/v1/languages/{0}/categories',
            summaries: '/api/v1/{0}/summaries',
            summary: '/api/v1/{0}/summaries/{1}',
            versions: '/api/v1/{0}/summaries/{1}/versions',
            version: '/api/v1/{0}/summaries/{1}/versions/{2}',
            activities: '/api/v1/{0}/summaries/{1}/activities',
            activity: '/api/v1/{0}/summaries/{1}/activities/{2}',
            upload: '/api/v1/{0}/summaries/{1}/upload',
            files: '/api/v1/{0}/summaries/{1}/files',
            file: '/api/v1/{0}/summaries/{1}/file/{2}'
        };
        uris.rapi.web = {
            search: '/api/web/search/{0}'
        };

        /**
         * Utility functions
         * @type {{format: Function, getFingerPrint: Function, uuid: Function, setState: Function, getState: Function, getAccessTokenHashPos: Function, parseToken: Function, setToken: Function, getAccessToken: Function, clearToken: Function, cleanUrl: Function, cleanHistory: Function, getHeaders: Function, onDocumentReady: Function}}
         */
        rapi.util = {

            /**
             * Simple format function to replace {n} with the (n+1)th argument
             * @param message
             * @returns {*}
             */
            format: function (message) {
                // Cannot assert message without exceeding the call stack size
                var ret = message; // aka arguments[0]
                for (var i = 1; i < arguments.length; i++) {
                    var rx = new RegExp('\\{' + (i - 1).toString() + '\\}', 'g');
                    ret = ret.replace(rx, (arguments[i] && typeof arguments[i].toString === 'function' ? arguments[i].toString() : ''));
                }
                return ret;
            },

            /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */

            /**
             * Uses https://github.com/Valve/fingerprintjs to return a unique browser fingerprint
             * See https://github.com/Memba/Kidoju-Server/issues/35
             * @returns {*}
             */
            getFingerPrint: function () {
                var hash = 0;
                if ($.type(Fingerprint) === 'function') {
                    hash = new Fingerprint({ canvas: true, ie_activex: false, screen_resolution: true }).get();
                } else if (navigator && navigator.userAgent) {
                    // See http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
                    var chr;
                    var agent = navigator.userAgent;
                    // hash = 0;
                    for (var i = 0; i < agent.length; i++) {
                        chr   = agent.charCodeAt(i);
                        // Unexpected use of '<<' and '|='
                        /* jshint -W016 */
                        hash  = ((hash << 5) - hash) + chr;
                        hash |= 0; // Convert to 32bit integer
                        /* jshint +W016 */
                    }
                }
                return Math.abs(hash); // We have experienced a negative fingerprint on PhantomJS in Travis-CI
            },

            /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

            /**
             * Get a uuid
             * @see https://github.com/Memba/Kidoju-Server/issues/31#issuecomment-77665098
             * @returns {number}
             */
            uuid: function () {
                var uuid = '';
                var crypto = window.crypto || window.msCrypto;
                if (crypto && $.isFunction(crypto.getRandomValues) && $.isFunction(Uint8Array) && navigator.userAgent.indexOf('PhantomJS') < 0) {
                    // Note: $.isFunction(Uint8Array) is false in Safari for Windows which is good because crypto.getRandomValues(new Uint8Array(32)) returns undefined
                    var Seed = function () {
                        var b = [];
                        Array.apply([], crypto.getRandomValues(new Uint8Array(32))).forEach(function (c) {
                            b = b.concat(c.toString(16).split(''));
                        });
                        return function (i) {
                            var t = '';
                            switch (i) {
                                case 8:
                                    t += '-' + b.pop();
                                    break;
                                case 12:
                                    t += '-4';
                                    break;
                                case 16:
                                    /* jshint -W016 */
                                    // Unexpected use of '&' and '|'
                                    t += '-' + (parseInt(b.pop(), 16) & 0x3 | 0x8).toString(16);
                                    /* jshint +W016 */
                                    break;
                                case 20:
                                    t += '-' + b.pop();
                                    break;
                                default:
                                    t += b.pop();
                            }
                            return t;
                        };
                    };
                    var seed = Seed();
                    for (var i = 0; i < 32; i++) {
                        uuid += seed(i);
                    }
                } else {
                    // see http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
                    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        /* jshint -W016 */
                        // Unexpected use of '&' and '|'
                        var r = Math.random() * 16|0;
                        var v = (c === 'x' ? r : (r & 0x3 | 0x8));
                        return v.toString(16);
                        /* jshint +W016 */
                    });
                }
                return uuid;
            },

            /**
             * Saves an oAuth state in session storage
             * @param state
             */
            setState: function (state) {
                assert.type(STRING, state, assert.format(assert.messages.type.default, 'state', STRING)); // Note: we could consider an assert.match here
                var storage = (RX_IEXPLORE.test(navigator.userAgent) || RX_ANDROID.test(navigator.userAgent)) ? localStorage : sessionStorage; // use localStorage in Android and IE
                if (storage) {
                    storage.setItem(STATE, state);
                    // window.alert('Write\n' + state);
                    logger.debug({
                        message: 'state added to sessionStorage',
                        method: 'util.setState',
                        data: { state: state }
                    });
                }
            },

            /**
             * Reads and clears the oAuth state from session storage
             */
            getState: function () {
                var state;
                var storage = (RX_IEXPLORE.test(navigator.userAgent) || RX_ANDROID.test(navigator.userAgent)) ? localStorage : sessionStorage; // use localStorage in Android and IE
                if (storage) {
                    state = storage.getItem(STATE);
                    // window.alert('Read\n' + state);
                    storage.removeItem(STATE);
                    logger.debug({
                        message: 'state read and cleared from sessionStorage',
                        method: 'util.getState',
                        data: { state: state }
                    });
                }
                return state;
            },

            /**
             * Get the position of the hash preceding the access_token
             * @param location
             * @returns {number}
             */
            getAccessTokenHashPos: function (location) {
                assert.type(STRING, location, assert.format(assert.messages.type.default, 'location', STRING));
                return Math.max(
                    location.indexOf(HASH + ACCESS_TOKEN), // Facebook and Google return access_token first
                    location.indexOf(HASH + TOKEN_TYPE), // Windows Live returns token_type first
                    location.indexOf(HASH + EXPIRES_IN), // Others might have them in a different order
                    location.indexOf(HASH + STATE)
                );
            },

            /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */

            /* This function's cyclomatic complexity is too high. */
            /* jshint -W074 */

            /**
             * Parse the access token into a Javascript object
             * @param url
             * @returns {{}}
             */
            parseToken: function (url) {
                // When running tests with grunt.mochaTest, the url is a file url - file:///C:/Users/Jacques-Louis/Creative Cloud Files/Kidoju/Kidoju.Server/test/client/app.cache.test.html
                // Also this assert fails in Phonegap InAppBrowser
                // assert.match(RX_URL, url, assert.format(assert.messages.match.default, 'url', RX_URL));
                var pos1 = rapi.util.getAccessTokenHashPos(url);
                var qs = {};
                var token = {};
                if (pos1 >= 0) {
                    logger.debug({
                        message: 'token found in url',
                        method: 'parseToken',
                        data: { url: url, pos: pos1 }
                    });

                    // remove any trailing # and split along &
                    var keyValues = url.substr(pos1 + 1).split('#')[0].split('&');

                    // then iterate through key=value pairs to populate qs, our querystring object
                    $.each(keyValues, function (index, keyValue) {
                        var pos2 = keyValue.indexOf(EQUALS);
                        if (pos2 > 0 && pos2 < keyValue.length - EQUALS.length) {
                            // Parse strings for numbers
                            var str = decodeURIComponent(keyValue.substr(pos2 + EQUALS.length));
                            var val = parseInt(str, 10);
                            qs[keyValue.substr(0, pos2)] = (!isNaN(val) && (val.toString() === str)) ? val : str;
                        }
                    });

                    // Check error
                    var hasVerifiedToken = false;
                    var hasVerifiedState = false;
                    var hasVerifiedTimestamp = false;

                    if ($.type(qs.error) !== STRING) {

                        // Check access_token
                        // Note: We could not find any better rule to match access tokens from facebook, google, live and twitter
                        hasVerifiedToken = ($.type(qs.access_token) === STRING && qs.access_token.length > 10);
                        if (!hasVerifiedToken) {
                            qs.error = 'Invalid token';
                        }

                        // Note: We could check expires (Google and Windows Live are 3600 = 60*60 = 1h amd Facebook and Twitter are 5184000 = 60*60*24*60 = 60d)

                        // Check state
                        // Note: rapi.util.getState() erases state, so it is not indempotent
                        hasVerifiedState = (rapi.util.getState() === qs.state && qs.state.indexOf(rapi.util.getFingerPrint()) === 0);
                        if (!hasVerifiedState) {
                            qs.error = 'Invalid state';
                        }

                        // Check timestamp
                        var now = Date.now();
                        // Note there might be a lag, therefore -30s is required
                        hasVerifiedTimestamp = ((now - qs.ts > -30 * 1000) && (now - qs.ts < 5 * 60 * 1000));
                        if (!hasVerifiedTimestamp) {
                            qs.error = 'Invalid timestamp';
                        }

                    }

                    logger.debug({
                        message: 'token verified',
                        method: 'parseToken',
                        data: { qs: qs }
                    });

                    if (hasVerifiedToken && hasVerifiedState && hasVerifiedTimestamp) {
                        // purge unwanted properties (especially state and token_type)
                        // as stated in https://github.com/Memba/Kidoju-Server/issues/29
                        token = {
                            access_token: qs.access_token,
                            expires: qs.expires,
                            ts: qs.ts
                        };
                        // setToken in localStorage
                        rapi.util.setToken(token);
                        // Notify page
                        setTimeout(function () { $(document).trigger(AUTHENTICATION_SUCCESS); }, 500);
                    } else {
                        token = {
                            error: qs.error
                        };
                        // Let's simply discard any attempt to set a token that does not pass the checks here above
                        rapi.util.clearToken();
                        // Notify page (we may have qs.error)
                        setTimeout(function () { $(document).trigger(AUTHENTICATION_FAILURE, { error: qs.error }); }, 500);
                    }

                }
                return token; // only for unit tests because all we need is setToken in localStorage
            },

            /* jshint +W074 */

            /**
             * Saves a token in local storage
             * @param accessToken
             */
            setToken: function (token) {
                assert.isPlainObject(token, assert.format(assert.messages.isPlainObject.default, 'token'));
                assert.type(STRING, token.access_token, assert.format(assert.messages.type.default, 'token.access_token', STRING));
                assert.type(NUMBER, token.expires, assert.format(assert.messages.type.default, 'token.expires', STRING));
                assert.type(NUMBER, token.ts, assert.format(assert.messages.type.default, 'token.ts', STRING));
                if (localStorage) {
                    localStorage.setItem(TOKEN, JSON.stringify(token));
                    logger.debug({
                        message: 'token added to localStorage',
                        method: 'util.setToken',
                        data: { token: token }
                    });
                }
            },

            /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

            /**
             * Read an access token from storage
             * @returns {*}
             */
            getAccessToken: function () {
                if (localStorage) {
                    var token = JSON.parse(localStorage.getItem(TOKEN));
                    if ((!token) || (token.ts && token.expires && token.ts + 1000 * token.expires < Date.now())) {
                        if (token) {
                            localStorage.removeItem(TOKEN);
                            logger.debug({
                                message: 'access token read from localStorage has expired',
                                method: 'util.getAccessToken',
                                data: { token: token }
                            });
                        }
                        return null;
                    }
                    logger.debug({
                        message: 'access token read from localStorage is still valid',
                        method: 'util.getAccessToken',
                        data: { token: token }
                    });
                    return token[ACCESS_TOKEN];
                } else {
                    logger.error({
                        message: 'without localStorage support, signing in cannot work',
                        method: 'util.getAccessToken'
                    });
                    return null;
                }
            },

            /**
             * Ensure a refreshed token before expiration
             */
            ensureToken: function () {
                if (localStorage) {
                    var token = JSON.parse(localStorage.getItem(TOKEN));
                    if ($.isPlainObject(token) &&  token.expires <= 24 * 60 * 60) {
                        // if we have a short life token (Google and Live), i.e. expires === 3600, read token every minute and refresh no later than 15 minutes before expiration
                        setInterval(function () {
                            // we need to read the token again because if we remain a couple of hours on the same page (e.g. test designer), the token might have already been refreshed
                            token = JSON.parse(localStorage.getItem(TOKEN));
                            if ($.isPlainObject(token) && (Date.now() > token.ts + (token.expires - 10 * 60) * 1000)) {
                                app.rapi.oauth.refresh();
                            }
                        }, 60 * 1000);
                    }
                    /*
                     } else if ($.isPlainObject(token) &&  token.expires > 24 * 60 * 60) {
                     // if we have a long life token (Facebook and Twitter), refresh is not available and we need to reset the token upon page load
                     if (Date.now() > token.ts + 1000 * token.expires - 7 * 24 * 60 * 60 * 1000) {
                     // Ideally, we should trigger the redirection required to acquire a new token silently (without login screen)
                     // See https://github.com/Memba/Kidoju-Server/issues/68
                     }
                     }
                     */
                } else {
                    logger.error({
                        message: 'without localStorage support, signing in cannot work',
                        method: 'util.ensureToken'
                    });
                }
            },

            /**
             * Clear (delete) an access token from storage
             */
            clearToken: function () {
                if (localStorage) {
                    localStorage.removeItem(TOKEN);
                    logger.debug({
                        message: 'token removed from localStorage',
                        method: 'util.clearToken'
                    });
                }
            },

            /**
             * Remove any token information from a url
             * Check its use in rapi.getSignInUrl where returnUrl would normally be window.location.href
             * In a browser, the whole authentication process redirects the browser to returnUrl#access_token=...
             * When authenticating again from this location, one would keep adding #access_token=... to the returnUrl, thus a requirement for cleaning it
             * @param url
             * @returns {*}
             */
            cleanUrl: function (url) {
                // This assert fails in Phonegap InAppBrowser
                // assert.match(RX_URL, url, assert.format(assert.messages.match.default, 'url', RX_URL));
                var ret = url;
                var pos = rapi.util.getAccessTokenHashPos(url);
                if (pos >= 0) {
                    ret = ret.substring(0, pos);
                }
                if (ret.slice(-1) === HASH) { // remove trailing hash if any
                    ret = ret.substring(0, ret.length - 1);
                }
                return ret;
            },

            /**
             * Clean the history from token information
             */
            cleanHistory: function () {
                var pos = rapi.util.getAccessTokenHashPos(location.hash);
                if (pos >= 0) {
                    if (history) {
                        history.replaceState({}, document.title, location.pathname + location.hash.substr(0, pos));
                    } else {
                        location.hash = location.hash.substr(0, pos); // for older browsers, might leave a # behind
                    }
                }
            },

            /**
             * Get headers for $.ajax calls
             * @param options
             * @returns {*}
             */
            getHeaders: function (options) {
                assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
                var headers = {};
                if (options.security === true) {
                    var accessToken = rapi.util.getAccessToken();
                    if (typeof accessToken === STRING) {
                        headers.Authorization = 'Bearer ' + accessToken;
                    }
                }
                if (app && app.constants && app.constants.appScheme) {
                    headers['X-App-Scheme'] = app.constants.appScheme;
                }
                if (options.trace === true) {
                    var trace = $('#trace').val();
                    if (typeof trace === STRING) {
                        headers['X-Trace-ID'] = trace.substr(0, 36); // should be long enough for a guid = 32 hex + 4 dashes
                    }
                }
                return headers;
            },

            /* Blocks are nested too deeply. */
            /* jshint -W073 */

            /* This function's cyclomatic complexity is too high. */
            /* jshint -W074 */

            /**
             * Merge partition into filter
             * @param query
             * @param partition
             */
            extendQueryWithPartition: function (query, partition) {
                /* jshint maxcomplexity: 11 */
                if (!$.isPlainObject(partition)) {
                    return query;
                }
                if (query && Array.isArray(query.filter)) {
                    query.filter = { logic: 'and', filters: query.filter };
                } else if (query && $.isPlainObject(query.filter) && $.type(query.filter.field) === STRING && $.type(query.filter.operator) === STRING/* && $.type(query.filter.value) === STRING*/) {
                    query.filter = { logic: 'and', filters: [query.filter] };
                } else if (query && $.isPlainObject(query.filter) && query.filter.logic === 'or' && Array.isArray(query.filter.filters)) {
                    query.filter = { logic: 'and', filters: [query.filter] };
                } else if (query && $.isPlainObject(query.filter) && query.filter.logic === 'and' && Array.isArray(query.filter.filters)) {
                    $.noop(); // query.filter = query.filter;
                } else {
                    query.filter = { logic: 'and', filters: [] };
                }
                assert.equal('and', query.filter.logic, assert.format(assert.messages.equal.default, 'query.filter.logic', 'and'));
                assert.isArray(query.filter.filters, assert.format(assert.messages.isArray.default, 'query.filter.filters'));
                for (var prop in partition) {
                    if (partition.hasOwnProperty(prop) && $.type(partition[prop]) !== UNDEFINED) {
                        var found;
                        for (var i = 0, length = query.filter.filters.length; i < length; i++) {
                            var filter = query.filter.filters[i];
                            if (filter.field === prop && filter.operator === 'eq' && filter.value === partition[prop]) {
                                found = filter;
                                break;
                            }
                        }
                        if (!found) {
                            query.filter.filters.push({ field: prop, operator: 'eq', value: partition[prop] });
                        }
                    }
                }
                delete query.partition; // if any
                return query;
            }

            /* jshint +W074 */
            /* jshint +W073 */

        };

        /**
         * Simple test functions
         * @type {{ping: app.rapi.test.ping, dummyResolvedDeferred: app.rapi.test.dummyResolvedDeferred, dummyRejectedDeferred: app.rapi.test.dummyRejectedDeferred}}
         */
        rapi.test = {

            /**
             * Checks a ping
             * @returns {*}
             */
            ping: function () {
                logger.debug({
                    message: '$.ajax',
                    method: 'test.ping'
                });
                return $.ajax({
                    cache: false,
                    headers: rapi.util.getHeaders({ trace: true }),
                    type: GET,
                    url: uris.rapi.root + uris.rapi.ping
                });
            },

            /**
             * Return a successful promise
             * Like $.noop(), used temporarily in development
             * @returns {*}
             */
            dummyResolvedDeferred: function () {
                logger.debug({
                    message: 'dummy request',
                    method: 'test.dummyResolvedDeferred'
                });
                var dfd = $.Deferred();
                setTimeout(function () {
                    dfd.resolve({ total: 0, data: [] });
                }, 50);
                return dfd.promise();
            },

            /**
             * Return a failing promise
             * Like $.noop(), used temporarily in development
             * @returns {*}
             */
            dummyRejectedDeferred: function () {
                logger.debug({
                    message: 'dummy request',
                    method: 'test.dummyRejectedDeferred'
                });
                var dfd = $.Deferred();
                setTimeout(function () {
                    dfd.reject(null, 0, 'Failed');
                }, 50);
                return dfd.promise();
            }

        };

        /**
         * oAuth authentication
         * @type {{getSignInUrl: Function, signOut: Function, revoke: Function}}
         */
        rapi.oauth = {

            /**
             * Returns the authentication provider URL to call for signing in
             * @param provider
             * @param returnUrl
             * @returns {*}
             */
            getSignInUrl: function (provider, returnUrl) {
                assert.enum(PROVIDERS, provider, assert.format(assert.messages.enum.default, 'provider', PROVIDERS));
                assert.match(RX_URL, returnUrl, assert.format(assert.messages.match.default, 'returnUrl', RX_URL));
                logger.info({
                    message: '$.ajax',
                    method: 'auth.getSignInUrl',
                    data: { provider: provider, returnUrl: returnUrl }
                });
                var ajax = $.Deferred();
                var logout = $.Deferred();
                if (provider === 'live' && $.type(window.cordova) === UNDEFINED) { // chrome apps?
                    // logout from Live to force a login screen (no need to clean up because there should be a redirection)
                    var iframe = $('#live-logout');
                    if (iframe.length) {
                        iframe.attr('src', 'https://login.live.com/oauth20_logout.srf');
                    } else {
                        $('<iframe id="live-logout" src="https://login.live.com/oauth20_logout.srf" style="position: absolute; left: -1000px; visibility: hidden;"></iframe>').appendTo('body');
                    }
                    $('#live-logout').on('load', function () { logout.resolve(); });
                } else {
                    logout.resolve();
                }
                logout.promise().always(function () {
                    var state = rapi.util.getFingerPrint() + '-' + rapi.util.uuid();
                    rapi.util.setState(state);
                    $.ajax({
                        cache: false,
                        data: {
                            returnUrl: rapi.util.cleanUrl(returnUrl),
                            state: state
                        },
                        headers: rapi.util.getHeaders({ trace: true }),
                        type: GET,
                        url: rapi.util.format(uris.rapi.root + uris.rapi.oauth.signIn, provider)
                    }).done(ajax.resolve).fail(ajax.reject);
                });
                return ajax;
            },

            /**
             * Sign out
             * @returns {*}
             */
            signOut: function () {
                logger.info({
                    message: '$.ajax',
                    method: 'auth.signout'
                });
                return $.ajax({
                    contentType: FORM_CONTENT_TYPE,
                    headers: rapi.util.getHeaders({ security: true, trace: true }),
                    type: POST,
                    url: uris.rapi.root + uris.rapi.oauth.signOut
                }).always(function () {
                    rapi.util.clearToken();
                });
            },

            /**
             * Refresh token
             * @returns {*}
             */
            refresh: function () {
                logger.info({
                    message: '$.ajax',
                    method: 'auth.refresh'
                });
                return $.ajax({
                    cache: false,
                    headers: rapi.util.getHeaders({ security: true, trace: true }),
                    type: GET,
                    url: uris.rapi.root + uris.rapi.oauth.refresh
                }).done(function (token) {
                    rapi.util.setToken(token);
                }).fail(function () {
                    rapi.util.clearToken();
                });
            },

            /**
             * Revoke
             * @returns {*}
             */
            revoke: function () {
                logger.info({
                    message: '$.ajax',
                    method: 'auth.revoke'
                });
                return $.ajax({
                    contentType: FORM_CONTENT_TYPE,
                    headers: rapi.util.getHeaders({ security: true, trace: true }),
                    type: POST,
                    url: uris.rapi.root + uris.rapi.oauth.revoke
                }).always(function () {
                    rapi.util.clearToken();
                });
            }

        };

        /**
         * API version 1
         * @type {{user: {getUser: Function, getMe: Function, updateMe: Function, getAllMyFavourites: Function, createMyFavourite: Function, deleteMyFavourite: Function, findMySummaries: Function, findMyActivities: Function}, taxonomy: {getAllLanguages: Function, getLanguage: Function, getAllCategories: Function}, content: {createSummary: Function, findSummaries: Function, getSummary: Function, updateSummary: Function, deleteSummary: Function, executeCommand: Function, findSummaryVersions: Function, getSummaryVersion: Function, getCurrentSummaryVersion: Function, updateSummaryVersion: Function, deleteSummaryVersion: Function, createSummaryActivity: Function, findSummaryActivities: Function, getSummaryActivity: Function, updateSummaryActivity: Function, deleteSummaryActivity: Function}}}
         */
        rapi.v1 = {

            /**
             * User profile, summaries and activities
             */
            user: {

                /**
                 * Get a public user profile
                 * @param userId
                 * @returns {*}
                 */
                getUser: function (userId) {
                    assert.match(RX_MONGODB_ID, userId, assert.format(assert.messages.match.default, 'userId', RX_MONGODB_ID));
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.user.getUser',
                        data: { userId: userId }
                    });
                    return $.ajax({
                        cache: false,
                        headers: rapi.util.getHeaders({ trace: true }),
                        type: GET,
                        url: uris.rapi.root + rapi.util.format(uris.rapi.v1.user, userId)
                    });
                },

                /**
                 * Get me (the authenticated user)
                 * @param querystring
                 * @returns {*}
                 */
                getMe: function (querystring) {
                    assert.isOptionalObject(querystring, assert.format(assert.messages.isOptionalObject.default, 'querystring'));
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.user.getMe',
                        data: { qs: querystring }
                    });
                    return $.ajax({
                        cache: false,
                        data: querystring,
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: GET,
                        url: uris.rapi.root + uris.rapi.v1.me
                    });
                },

                /**
                 * Update me (the authenticated user)
                 * @param user
                 * @returns {*}
                 */
                updateMe: function (user) {
                    assert.isPlainObject(user, assert.format(assert.messages.isPlainObject.default, 'user'));
                    // Note: considering we allow partial updates, we cannot check user properties here
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.user.updateMe',
                        data: { user: user }
                    });
                    return $.ajax({
                        contentType: JSON_CONTENT_TYPE,
                        data: JSON.stringify(user),
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: PUT,
                        url: uris.rapi.root + uris.rapi.v1.me
                    });
                },

                /**
                 * Get current user's list of favourites
                 * @param language
                 * @returns {*}
                 */
                getAllMyFavourites: function (language) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.user.getAllMyFavourites',
                        data: { language: language }
                    });
                    return $.ajax({
                        cache: false,
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: GET,
                        url: uris.rapi.root + rapi.util.format(uris.rapi.v1.myFavourites, language)
                    });
                },

                /**
                 * Create a new favourite
                 * @param language
                 * @param favourite ()
                 */
                createMyFavourite: function (language, favourite) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.isPlainObject(favourite, assert.format(assert.messages.isPlainObject.default, 'favourite'));
                    assert.type(STRING, favourite.name, assert.format(assert.messages.type.default, 'favourite.name', STRING));
                    assert.type(STRING, favourite.path, assert.format(assert.messages.type.default, 'favourite.path', STRING));
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.user.createMyFavourite',
                        data: { language: language, favourite: favourite }
                    });
                    return $.ajax({
                        contentType: JSON_CONTENT_TYPE,
                        data: JSON.stringify(favourite),
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: POST,
                        url: uris.rapi.root + rapi.util.format(uris.rapi.v1.myFavourites, language)
                    });
                },

                /**
                 * delete a favourite
                 * @param language
                 * @param favouriteId
                 */
                deleteMyFavourite: function (language, favouriteId) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, favouriteId, assert.format(assert.messages.match.default, 'favouriteId', RX_MONGODB_ID));
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.user.deleteMyFavourite',
                        data: { language: language, favouriteId: favouriteId }
                    });
                    return $.ajax({
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: DELETE,
                        url: uris.rapi.root + rapi.util.format(uris.rapi.v1.myFavourite, language, favouriteId)
                    });
                },

                /**
                 * Find the authenticated users' summaries
                 * IMPORTANT: includes non-published drafts
                 * @param language
                 * @param querystring
                 * @returns {*}
                 */
                findMySummaries: function (language, querystring) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.isOptionalObject(querystring, assert.format(assert.messages.isOptionalObject.default, 'querystring'));
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.user.findMySummaries',
                        data: { language: language, qs: querystring }
                    });
                    return $.ajax({
                        cache: false,
                        data: querystring,
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: GET,
                        url: uris.rapi.root + rapi.util.format(uris.rapi.v1.mySummaries, language)
                    });
                },

                /**
                 * Find the authenticated users' activities
                 * @param language
                 * @param querystring
                 * @returns {*}
                 */
                findMyActivities: function (language, querystring) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.isOptionalObject(querystring, assert.format(assert.messages.isOptionalObject.default, 'querystring'));
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.user.findMyActivities',
                        data: { language: language, qs: querystring }
                    });
                    return $.ajax({
                        cache: false,
                        data: querystring,
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: GET,
                        url: uris.rapi.root + rapi.util.format(uris.rapi.v1.myActivities, language)
                    });
                }
            },

            /**
             * Languages and categories
             */
            taxonomy: {

                /**
                 * Get all languages with categories
                 * @returns {*}
                 */
                getAllLanguages: function () {
                    var url = uris.rapi.root + uris.rapi.v1.languages;
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.taxonomy.getAllLanguages',
                        data: { url: url }
                    });
                    return $.ajax({
                        cache: true,
                        headers: rapi.util.getHeaders({ trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Get a language - not very useful except to check that a language has categories
                 * @param language
                 * @returns {*}
                 */
                getLanguage: function (language) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.language, language);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.taxonomy.getLanguage',
                        data: { url: url }
                    });
                    return $.ajax({
                        cache: true,
                        headers: rapi.util.getHeaders({ trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Get all categories for a language designated by its isoCode
                 * @param language
                 * @returns {*}
                 */
                getAllCategories: function (language) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.categories, language);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.taxonomy.getAllCategories',
                        data: { url: url }
                    });
                    return $.ajax({
                        cache: true,
                        headers: rapi.util.getHeaders({ trace: true }),
                        type: GET,
                        url: url
                    });
                }
            },

            /**
             * Summaries and activities
             */
            content: {

                /**
                 * Create a new summary
                 * @param language
                 * @param summary
                 */
                createSummary: function (language, summary) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.isPlainObject(summary, assert.format(assert.messages.isPlainObject.default, 'summary'));
                    // Note: we might want to check that this summary object has the required properties for a creation
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.summaries, language);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.createSummary',
                        data: { url: url, summary: summary }
                    });
                    return $.ajax({
                        contentType: JSON_CONTENT_TYPE,
                        data: JSON.stringify(summary),
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: POST,
                        url: url
                    });
                },

                /**
                 * Find summaries
                 * @param language
                 * @param querystring
                 */
                findSummaries: function (language, querystring) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.isOptionalObject(querystring, assert.format(assert.messages.isOptionalObject.default, 'querystring'));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.summaries, language);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.findSummaries',
                        data: { url: url, qs: querystring }
                    });
                    return $.ajax({
                        cache: false,
                        data: querystring,
                        headers: rapi.util.getHeaders({ trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Get a summary by its summaryId
                 * @param language
                 * @param summaryId
                 * @param querystring
                 * @returns {*}
                 */
                getSummary: function (language, summaryId, querystring) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.isOptionalObject(querystring, assert.format(assert.messages.isOptionalObject.default, 'querystring'));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.summary, language, summaryId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.getSummary',
                        data: { url: url, qs: querystring }
                    });
                    return $.ajax({
                        cache: false,
                        data: querystring,
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Update a summary by its summaryId
                 * @param language
                 * @param summaryId
                 * @param summary
                 * @returns {*}
                 */
                updateSummary: function (language, summaryId, summary) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.isPlainObject(summary, assert.format(assert.messages.isPlainObject.default, 'summary'));
                    // Note: considering we allow partial updates, we cannot check summary properties here
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.summary, language, summaryId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.updateSummary',
                        data: { url: url, summary: summary }
                    });
                    return $.ajax({
                        contentType: JSON_CONTENT_TYPE,
                        data: JSON.stringify(summary),
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: PUT,
                        url: url
                    });
                },

                /**
                 * Delete a summary by its summaryId
                 * @param language
                 * @param summaryId
                 * @returns {*}
                 */
                deleteSummary: function (language, summaryId) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.summary, language, summaryId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.deleteSummary',
                        data: { url: url, summaryId: summaryId }
                    });
                    return $.ajax({
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: DELETE,
                        url: url
                    });
                },

                /**
                 * Execute a command
                 * an exec is an object with a command and options
                 * @param language
                 * @param summaryId
                 * @param exec
                 * @returns {*}
                 */
                executeCommand: function (language, summaryId, exec) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.isPlainObject(exec, assert.format(assert.messages.isPlainObject.default, 'exec'));
                    assert.enum(COMMANDS, exec.command, assert.format(assert.messages.enum.default, 'exec.command', COMMANDS));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.versions, language, summaryId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.executeCommand',
                        data: { url: url, exec: exec }
                    });
                    return $.ajax({
                        contentType: JSON_CONTENT_TYPE,
                        data: JSON.stringify(exec),
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: POST,
                        url: url
                    });
                },

                /**
                 * Find summary versions
                 * Note: careful when including streams!!!!
                 * @param language
                 * @param summaryId
                 * @param querystring
                 */
                findSummaryVersions: function (language, summaryId, querystring) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.isOptionalObject(querystring, assert.format(assert.messages.isOptionalObject.default, 'querystring'));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.versions, language, summaryId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.findSummaryVersions',
                        data: { url: url, qs: querystring }
                    });
                    return $.ajax({
                        cache: false,
                        data: querystring,
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Get a summary version (including stream)
                 * @param language
                 * @param summaryId
                 * @param versionId
                 * @param querystring
                 */
                getSummaryVersion: function (language, summaryId, versionId, querystring) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.match(RX_MONGODB_ID, versionId, assert.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));
                    assert.isOptionalObject(querystring, assert.format(assert.messages.isOptionalObject.default, 'querystring'));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.version, language, summaryId, versionId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.getSummaryVersion',
                        data: { url: url, qs: querystring }
                    });
                    return $.ajax({
                        cache: false,
                        data: querystring,
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Get the current (published) summary version
                 * @param language
                 * @param summaryId
                 */
                getCurrentSummaryVersion: function (language, summaryId/*,querystring*/) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.version, language, summaryId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.getCurrentSummaryVersion',
                        data: { url: url }
                    });
                    return $.ajax({
                        cache: false,
                        // data: querystring,
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Update a summary version
                 * @param language
                 * @param summaryId
                 * @param versionId
                 * @param version
                 * @returns {*}
                 */
                updateSummaryVersion: function (language, summaryId, versionId, version) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.match(RX_MONGODB_ID, versionId, assert.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));
                    assert.isPlainObject(version, assert.format(assert.messages.isPlainObject.default, 'version'));
                    // Note: considering we allow partial updates, we cannot check version properties here
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.version, language, summaryId, versionId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.updateSummaryVersion',
                        data: { url: url, version: version }
                    });
                    return $.ajax({
                        contentType: JSON_CONTENT_TYPE,
                        data: JSON.stringify(version),
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: PUT,
                        url: url
                    });
                },

                /**
                 * Delete a summary version
                 * @param language
                 * @param summaryId
                 * @param versionId
                 * @returns {*}
                 */
                deleteSummaryVersion: function (language, summaryId, versionId) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.match(RX_MONGODB_ID, versionId, assert.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.version, language, summaryId, versionId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.deleteSummaryVersion',
                        data: { url: url }
                    });
                    return $.ajax({
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: DELETE,
                        url: url
                    });
                },

                /**
                 * Create summary activity
                 * @param language
                 * @param summaryId
                 * @param querystring
                 */
                createSummaryActivity: function (language, summaryId, activity) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.isPlainObject(activity, assert.format(assert.messages.isPlainObject.default, 'activity'));
                    // Note: we might want to check that this activity object has the required properties for a creation
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activities, language, summaryId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.createSummaryActivity',
                        data: { url: url, activity: activity }
                    });
                    return $.ajax({
                        contentType: JSON_CONTENT_TYPE,
                        data: JSON.stringify(activity),
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: POST,
                        url: url
                    });
                },

                /**
                 * Find summary activities
                 * @param language
                 * @param summaryId
                 * @param querystring
                 */
                findSummaryActivities: function (language, summaryId, querystring) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.isOptionalObject(querystring, assert.format(assert.messages.isOptionalObject.default, 'querystring'));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activities, language, summaryId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.findSummaryActivities',
                        data: { url: url, qs: querystring }
                    });
                    return $.ajax({
                        cache: false,
                        data: querystring,
                        headers: rapi.util.getHeaders({ trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Get a summary activity
                 * @param language
                 * @param summaryId
                 * @param activityId
                 * @param querystring
                 * @returns {*}
                 */
                getSummaryActivity: function (language, summaryId, activityId, querystring) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.match(RX_MONGODB_ID, activityId, assert.format(assert.messages.match.default, 'activityId', RX_MONGODB_ID));
                    assert.isOptionalObject(querystring, assert.format(assert.messages.isOptionalObject.default, 'querystring'));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activity, language, summaryId, activityId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.getSummaryActivity',
                        data: { url: url, qs: querystring }
                    });
                    return $.ajax({
                        cache: false,
                        data: querystring,
                        headers: rapi.util.getHeaders({ trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Update a summary activity
                 * @param language
                 * @param summaryId
                 * @param activityId
                 * @param activity
                 * @returns {*}
                 */
                updateSummaryActivity: function (language, summaryId, activityId, activity) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.match(RX_MONGODB_ID, activityId, assert.format(assert.messages.match.default, 'activityId', RX_MONGODB_ID));
                    assert.isPlainObject(activity, assert.format(assert.messages.isPlainObject.default, 'activity'));
                    // Note: considering we allow partial updates, we cannot check activity properties here
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activity, language, summaryId, activityId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.updateSummaryActivity',
                        data: { url: url, activity: activity }
                    });
                    return $.ajax({
                        contentType: JSON_CONTENT_TYPE,
                        data: JSON.stringify(activity),
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: PUT,
                        url: url
                    });
                },

                /**
                 * Delete a summary activity
                 * @param language
                 * @param summaryId
                 * @param activityId
                 * @returns {*}
                 */
                deleteSummaryActivity: function (language, summaryId, activityId) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.match(RX_MONGODB_ID, activityId, assert.format(assert.messages.match.default, 'activityId', RX_MONGODB_ID));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activity, language, summaryId, activityId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.deleteSummaryActivity',
                        data: { url: url }
                    });
                    return $.ajax({
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: DELETE,
                        url: url
                    });
                },

                /**
                 * Get a pre-signed url to upload summary files to Amazon S3
                 * @param language
                 * @param summaryId
                 * @param file
                 */
                getUploadUrl: function (language, summaryId, file) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    if (!app.DEBUG) {
                        // Note: when running unit tests, file is not an instance of window.Blob
                        // See also https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications
                        // assert.instanceof(window.File, file, assert.format(assert.messages.instanceof.default, 'file', 'File'));
                        assert.instanceof(window.Blob, file, assert.format(assert.messages.instanceof.default, 'file', 'Blob'));
                    }
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.upload, language, summaryId);
                    // Log
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.getUploadUrl',
                        data: { url: url, fileName: file.name, type: file.type, size: file.size }
                    });
                    // $.ajax
                    return $.ajax({
                        data: { name: file.name, type: file.type, size: file.size },
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Upload a file or a blob (with a name) to a signed url
                 * @param signedUrl
                 * @param file
                 */
                uploadFile: function (signedUrl, file) {
                    assert.match(RX_URL, signedUrl, assert.format(assert.messages.match.default, 'signedUrl', RX_URL));
                    // Note a window.File is a sort of window.Blob with a name
                    // assert.instanceof(window.File, file, assert.format(assert.messages.instanceof.default, 'file', 'window.File'));
                    assert.instanceof(window.Blob, file, assert.format(assert.messages.instanceof.default, 'file', 'window.Blob'));
                    assert.type(STRING, file.name, assert.format(assert.messages.type.default, 'file.name', STRING));
                    var dfd = $.Deferred();
                    // See http://stackoverflow.com/questions/11448578/how-to-send-binary-data-via-jquery-ajax-put-method
                    // See http://stackoverflow.com/questions/5392344/sending-multipart-formdata-with-jquery-ajax
                    // Log
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.uploadFile',
                        data: { url: signedUrl, fileName: file.name, type: file.type, size: file.size }
                    });
                    // $.ajax
                    $.ajax({
                        contentType: file.type,
                        data: file,
                        headers: {
                            // See http://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectPUT.html
                            // Should match the headers in the signed url
                            'x-amz-acl': 'public-read',
                            'cache-control': 'public, max-age=7776000, s-maxage=604800',
                            'content-type': file.type // ,
                            // 'content-length': file.length // <-- does not work
                        },
                        processData: false,
                        type: 'PUT',
                        url: signedUrl,
                        xhr: function () {
                            // Add a progress event handler to XmlHttpRequest
                            var xhr = $.ajaxSettings.xhr();
                            xhr.upload.onprogress = function (e) {
                                e.file = file;
                                dfd.notify(e);
                            };
                            return xhr;
                        }
                    }).done(function () {
                        // url: signedUrl.substr(0, signedUrl.indexOf('?'))
                        // A typical signedUrl would be like
                        // https://s3.amazonaws.com/memba.test/s/en/57d26b007dd0be0019024c92/Trans_dichlorotetraamminecobalt_III.png?AWSAccessKeyId=AKIAJL2KUGGU4SX7MS4Q&Cache-Control=public%2C%20max-age%3D7776000%2C%20s-maxage%3D604800&Content-Type=image%2Fpng&Expires=1490803058&Signature=kboNQaN%2BbGG2VHKGs5QTGJeV6cA%3D&x-amz-acl=public-read
                        // This first group which is discarded is the bucket: https://s3.amazonaws.com/memba.test
                        // The second group which is kept is the path to the file: /s/en/57d26b007dd0be0019024c92/Trans_dichlorotetraamminecobalt_III.png
                        // The third group which is also discarded is the query string
                        // We would have liked to make front end code completely agnostic to the backend, that is Amazon S3
                        // See https://github.com/jlchereau/Kidoju-Server/issues/154
                        var url = signedUrl.replace(/^(https:\/\/[\w\.]+\/[\w\.]+)(\/s\/[a-z]{2}\/[0-9a-f]{24}\/[^\?]+)([\s\S]+)$/, 'data:/$2');
                        // Note, we use a deferred to return the url of the uploaded file
                        dfd.resolve({
                            name: url.split('/').pop(),
                            size: file.size,
                            type: file.type,
                            url: url
                        });
                    }).fail(dfd.reject);
                    return dfd.promise();
                },

                /**
                 * Import a file from an http(s) url
                 * @param language
                 * @param summaryId
                 * @param fileUrl
                 * @returns {*}
                 */
                importFile: function (language, summaryId, fileUrl) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    assert.match(RX_URL, fileUrl, assert.format(assert.messages.match.default, 'fileUrl', RX_URL));
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.importFile',
                        data: { fileUrl: fileUrl }
                    });
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.files, language, summaryId);
                    return $.ajax({
                        contentType: JSON_CONTENT_TYPE,
                        data: JSON.stringify({ url: fileUrl }),
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: PUT,
                        url: url
                    });
                },

                /**
                 * Download a file from a url, returns a Blob
                 * @param url
                 */
                downloadFile: function (url) {
                    assert.match(RX_URL, url, assert.format(assert.messages.match.default, 'url', RX_URL));
                    var dfd = $.Deferred();
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.downloadFile',
                        data: { url: url }
                    });
                    $.ajax({
                        cache: true,
                        // crossDomain: true,
                        dataType: 'arraybuffer',
                        type: GET,
                        url: url
                    })
                        .done(function (response, status, xhr) {
                            if (xhr.status === 200) {
                                var blob = new window.Blob([response], { type: xhr.getResponseHeader('content-type') });
                                blob.name = url.split('/').pop();
                                dfd.resolve(blob);
                            } else {
                                dfd.reject(xhr, status, 'error');
                            }
                        })
                        .fail(dfd.reject); // Note: cross domain $.get from localhost is not allowed in Google Chrome and will end up here
                    return dfd.promise();
                },

                /**
                 * List all files for a summary designated by its id
                 * @param language
                 * @param summaryId
                 */
                getAllSummaryFiles: function (language, summaryId) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.files, language, summaryId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.getAllSummaryFiles',
                        data: { url: url }
                    });
                    return $.ajax({
                        headers: rapi.util.getHeaders({ trace: true }),
                        type: GET,
                        url: url
                    });
                },

                /**
                 * Delete a file designated by its id === name
                 * @param language
                 * @param summaryId
                 * @param fileId
                 * @returns {*}
                 */
                deleteFile: function (language, summaryId, fileId) {
                    assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
                    assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                    // assert.match(RX_MONGODB_ID, fileId, assert.format(assert.messages.match.default, 'fileId', RX_MONGODB_ID));
                    var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.file, language, summaryId, fileId);
                    logger.info({
                        message: '$.ajax',
                        method: 'v1.content.deleteFile',
                        data: { url: url }
                    });
                    return $.ajax({
                        headers: rapi.util.getHeaders({ security: true, trace: true }),
                        type: DELETE,
                        url: url
                    });
                }
            }

        };

        /***
         * rapi.v2 is used in Kidoju-Mobile
         * In order to have generic transports and strategies, we anted to have the same strcuture for rapi CRUD functions
         * The split between myActivities (user activities) and summary activities shows that it does not work very well
         * To be discussed: Genericity can only be achieved if any endpoint supports all CRUD operations, whereas myActivities only supports READ, but not CRATE, DELETE and UPDATE
         * The ideal would be to be able to create a generic class for all CRUD endpoints
         *
         *
         * @type {{activities: app.rapi.v2.activities, favourites: app.rapi.v2.favourites, files: app.rapi.v2.files, summaries: app.rapi.v2.summaries, versions: app.rapi.v2.versions}}
         */

        rapi.v2 = {

            /**
             * Activities
             * @param partition
             * @returns {{create: create, destroy: destroy, get: get, read: read, update: update}}
             */
            activities: function (partition) {
                assert.isOptionalObject(partition, assert.format(assert.messages.isOptionalObject.default, 'partition'));
                return {

                    /**
                     * Create (formerly rapi.v1.content.createSummaryActivity)
                     * @param doc
                     * @returns {*}
                     */
                    create: function (doc) {
                        assert.isPlainObject(doc, assert.format(assert.messages.isPlainObject.default, 'doc'));
                        assert.match(RX_LANGUAGE, partition['version.language'], assert.format(assert.messages.match.default, 'partition["version.language"]', RX_LANGUAGE));
                        // assert.match(RX_MONGODB_ID, partition['version.summaryId'], assert.format(assert.messages.match.default, 'partition["version.summaryId"]', RX_MONGODB_ID));
                        var url;
                        if (RX_MONGODB_ID.test(partition['version.summaryId'])) {
                            assert.equal(doc.version.summaryId, partition['version.summaryId'], assert.format(assert.messages.equal.default, 'partition["version.summaryId"]', doc.version.summaryId));
                            url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activities, partition['version.language'], partition['version.summaryId']);
                        } else {
                            assert.match(RX_MONGODB_ID, partition['actor.userId'], assert.format(assert.messages.match.default, 'partition["actor.userId"]', RX_MONGODB_ID));
                            assert.equal(doc.actor.userId, partition['actor.userId'], assert.format(assert.messages.equal.default, 'partition["actor.userId"]', doc.actor.userId));
                            assert.match(RX_MONGODB_ID, doc.version.summaryId, assert.format(assert.messages.match.default, 'doc.version.summaryId', RX_MONGODB_ID));
                            url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activities, partition['version.language'], doc.version.summaryId);
                        }
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.activities.create',
                            data: { url: url, doc: doc }
                        });
                        return $.ajax({
                            contentType: JSON_CONTENT_TYPE,
                            data: JSON.stringify(doc),
                            headers: rapi.util.getHeaders({ security: true, trace: true }),
                            type: POST,
                            url: url
                        });
                    },

                    /**
                     * Destroy (formerly rapi.v1.content.deleteSummaryActivity)
                     * @param id
                     * @returns {*}
                     */
                    destroy: function (id) {
                        assert.match(RX_MONGODB_ID, id, assert.format(assert.messages.match.default, 'id', RX_MONGODB_ID));
                        assert.match(RX_LANGUAGE, partition['version.language'], assert.format(assert.messages.match.default, 'partition["version.language"]', RX_LANGUAGE));
                        assert.match(RX_MONGODB_ID, partition['version.summaryId'], assert.format(assert.messages.match.default, 'partition["version.summaryId"]', RX_MONGODB_ID));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activity, partition['version.language'], partition['version.summaryId'], id);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.activities.destroy',
                            data: { url: url }
                        });
                        return $.ajax({
                            headers: rapi.util.getHeaders({ security: true, trace: true }),
                            type: DELETE,
                            url: url
                        });
                    },

                    /**
                     * Get (formerly rapi.v1.content.getSummaryActivity)
                     * @param id
                     * @param query
                     * @returns {*}
                     */
                    get: function (id, query) {
                        assert.match(RX_MONGODB_ID, id, assert.format(assert.messages.match.default, 'id', RX_MONGODB_ID));
                        assert.isOptionalObject(query, assert.format(assert.messages.isOptionalObject.default, 'query'));
                        assert.match(RX_LANGUAGE, partition['version.language'], assert.format(assert.messages.match.default, 'partition["version.language"]', RX_LANGUAGE));
                        assert.match(RX_MONGODB_ID, partition['version.summaryId'], assert.format(assert.messages.match.default, 'partition["version.summaryId"]', RX_MONGODB_ID));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activity, partition['version.language'], partition['version.summaryId'], id);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.activities.get',
                            data: { url: url, q: query }
                        });
                        return $.ajax({
                            cache: false,
                            data: query,
                            headers: rapi.util.getHeaders({ trace: true }),
                            type: GET,
                            url: url
                        });
                    },

                    /**
                     * Read (formerly rapi.v1.content.findSummaryActivities and rapi.v1.user.findMyActivities)
                     * @param query
                     * @returns {*}
                     */
                    read: function (query) {
                        assert.isOptionalObject(query, assert.format(assert.messages.isOptionalObject.default, 'query'));
                        assert.match(RX_LANGUAGE, partition['version.language'], assert.format(assert.messages.match.default, 'partition["version.language"]', RX_LANGUAGE));
                        // assert.match(RX_MONGODB_ID, partition['version.summaryId'], assert.format(assert.messages.match.default, 'partition["version.summaryId"]', RX_MONGODB_ID));
                        var headers;
                        var url;
                        // TODO: query.page and query.pageSize
                        // TODO: query aggregates and query.groups
                        // TODO: query.fields from Model???
                        // TODO: query.sort
                        // Extend query filter with partition
                        rapi.util.extendQueryWithPartition(query, partition);
                        if (RX_MONGODB_ID.test(partition['version.summaryId'])) {
                            headers = rapi.util.getHeaders({ trace: true });
                            url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activities, partition['version.language'], partition['version.summaryId']);
                        } else {
                            assert.match(RX_MONGODB_ID, partition['actor.userId'], assert.format(assert.messages.match.default, 'partition["actor.userId"]', RX_MONGODB_ID));
                            headers = rapi.util.getHeaders({ security: true, trace: true });
                            url = uris.rapi.root + rapi.util.format(uris.rapi.v1.myActivities, partition['version.language']);
                        }
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.activities.read',
                            data: { url: url, q: query }
                        });
                        return $.ajax({
                            cache: false,
                            data: query,
                            headers: headers,
                            type: GET,
                            url: url
                        });
                    },

                    /**
                     * Update (formerly rapi.v1.content.updateSummaryActivity)
                     * @param id
                     * @param doc
                     * @returns {*}
                     */
                    update: function (id, doc) {
                        assert.match(RX_MONGODB_ID, id, assert.format(assert.messages.match.default, 'id', RX_MONGODB_ID));
                        assert.isPlainObject(doc, assert.format(assert.messages.isPlainObject.default, 'doc'));
                        assert.match(RX_LANGUAGE, partition['version.language'], assert.format(assert.messages.match.default, 'partition["version.language"]', RX_LANGUAGE));
                        assert.match(RX_MONGODB_ID, partition['version.summaryId'], assert.format(assert.messages.match.default, 'partition["version.summaryId"]', RX_MONGODB_ID));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.activity, partition['version.language'], partition['version.summaryId'], id);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.activities.update',
                            data: { url: url, doc: doc }
                        });
                        return $.ajax({
                            contentType: JSON_CONTENT_TYPE,
                            data: JSON.stringify(doc),
                            headers: rapi.util.getHeaders({ security: true, trace: true }),
                            type: PUT,
                            url: url
                        });
                    }

                };
            },

            /**
             * Favourites
             * @param partition
             */
            favourites: function (partition) {
                assert.isOptionalObject(partition, assert.format(assert.messages.isOptionalObject.default, 'partition'));
                return { // TODO
                    create: $.noop,
                    destroy: $.noop,
                    get: $.noop,
                    read: $.noop,
                    update: $.noop
                };
            },

            /**
             * Files
             * @param partition
             */
            files: function (partition) {
                assert.isOptionalObject(partition, assert.format(assert.messages.isOptionalObject.default, 'partition'));
                return { // TODO
                    create: $.noop,
                    destroy: $.noop,
                    get: $.noop,
                    read: $.noop,
                    update: $.noop
                };
            },

            /**
             * Summaries
             * @param partition
             * @returns {{create: create, destroy: destroy, get: get, read: read, update: update}}
             */
            summaries: function (partition) {
                assert.isOptionalObject(partition, assert.format(assert.messages.isOptionalObject.default, 'partition'));
                return {

                    /**
                     * Create (formerly rapi.v1.content.createSummary)
                     * @param doc
                     * @returns {*}
                     */
                    create: function (doc) {
                        assert.isPlainObject(doc, assert.format(assert.messages.isPlainObject.default, 'doc'));
                        assert.match(RX_LANGUAGE, partition.language, assert.format(assert.messages.match.default, 'partition.language', RX_LANGUAGE));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.summaries, partition.language);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.summaries.create',
                            data: { url: url, doc: doc }
                        });
                        return $.ajax({
                            contentType: JSON_CONTENT_TYPE,
                            data: JSON.stringify(doc),
                            headers: rapi.util.getHeaders({ security: true, trace: true }),
                            type: POST,
                            url: url
                        });
                    },

                    /**
                     * Destroy (formerly rapi.v1.content.deleteSummary)
                     * @param id
                     * @returns {*}
                     */
                    destroy: function (id) {
                        assert.match(RX_MONGODB_ID, id, assert.format(assert.messages.match.default, 'id', RX_MONGODB_ID));
                        assert.match(RX_LANGUAGE, partition.language, assert.format(assert.messages.match.default, 'partition.language', RX_LANGUAGE));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.summary, partition.language, id);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.summaries.destroy',
                            data: { url: url }
                        });
                        return $.ajax({
                            headers: rapi.util.getHeaders({ security: true, trace: true }),
                            type: DELETE,
                            url: url
                        });
                    },

                    /**
                     * Get (formerly rapi.v1.content.getSummary)
                     * @param id
                     * @param query
                     * @returns {*}
                     */
                    get: function (id, query) {
                        assert.match(RX_MONGODB_ID, id, assert.format(assert.messages.match.default, 'id', RX_MONGODB_ID));
                        assert.isOptionalObject(query, assert.format(assert.messages.isOptionalObject.default, 'query'));
                        assert.match(RX_LANGUAGE, partition.language, assert.format(assert.messages.match.default, 'partition.language', RX_LANGUAGE));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.summary, partition.language, id);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.summaries.get',
                            data: { url: url, q: query }
                        });
                        return $.ajax({
                            cache: false,
                            data: query,
                            headers: rapi.util.getHeaders({ trace: true }),
                            type: GET,
                            url: url
                        });
                    },

                    /**
                     * Read (formerly rapi.v1.content.findSummaries)
                     * @param query
                     * @returns {*}
                     */
                    read: function (query) {
                        assert.isOptionalObject(query, assert.format(assert.messages.isOptionalObject.default, 'query'));
                        assert.match(RX_LANGUAGE, partition.language, assert.format(assert.messages.match.default, 'partition.language', RX_LANGUAGE));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.summaries, partition.language);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.summaries.read',
                            data: { url: url, q:  query }
                        });
                        return $.ajax({
                            cache: false,
                            data: query,
                            headers: rapi.util.getHeaders({ trace: true }),
                            type: GET,
                            url: url
                        });
                    },

                    /**
                     * Update (formerly rapi.v1.content.updateSummary))
                     * @param id
                     * @param doc
                     * @returns {*}
                     */
                    update: function (id, doc) {
                        assert.match(RX_MONGODB_ID, id, assert.format(assert.messages.match.default, 'id', RX_MONGODB_ID));
                        assert.isPlainObject(doc, assert.format(assert.messages.isPlainObject.default, 'doc'));
                        assert.match(RX_LANGUAGE, partition.language, assert.format(assert.messages.match.default, 'partition.language', RX_LANGUAGE));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.summary, partition.language, id);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.summaries.update',
                            data: { url: url, doc: doc }
                        });
                        return $.ajax({
                            contentType: JSON_CONTENT_TYPE,
                            data: JSON.stringify(doc),
                            headers: rapi.util.getHeaders({ security: true, trace: true }),
                            type: PUT,
                            url: url
                        });
                    }

                };
            },

            /**
             * Versions
             * @param partition
             * @returns {{create: create, destroy: destroy, get: get, read: read, update: update}}
             */
            versions: function (partition) {
                assert.isOptionalObject(partition, assert.format(assert.messages.isOptionalObject.default, 'partition'));
                return {

                    /**
                     * Create (formerly rapi.v1.content.createSummaryVersion)
                     * @param doc
                     */
                    create: function (doc) {
                        throw new Error('Not implemented: rapi.v1.content.executeCommand');
                    },

                    /**
                     * Destroy (formerly rapi.v1.content.deleteSummaryVersion)
                     * @param id
                     */
                    destroy: function (id) {
                        assert.match(RX_MONGODB_ID, id, assert.format(assert.messages.match.default, 'id', RX_MONGODB_ID));
                        assert.match(RX_LANGUAGE, partition.language, assert.format(assert.messages.match.default, 'partition.language', RX_LANGUAGE));
                        assert.match(RX_MONGODB_ID, partition.summaryId, assert.format(assert.messages.match.default, 'partition.summaryId', RX_MONGODB_ID));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.version, partition.language, partition.summaryId, id);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.versions.destroy',
                            data: { url: url }
                        });
                        return $.ajax({
                            headers: rapi.util.getHeaders({ security: true, trace: true }),
                            type: DELETE,
                            url: url
                        });
                    },

                    /**
                     * Get (formerly rapi.v1.content.getSummaryVersion)
                     * @param id
                     * @param query
                     */
                    get: function (id, query) {
                        assert.match(RX_MONGODB_ID, id, assert.format(assert.messages.match.default, 'id', RX_MONGODB_ID));
                        assert.isOptionalObject(query, assert.format(assert.messages.isOptionalObject.default, 'query'));
                        assert.match(RX_LANGUAGE, partition.language, assert.format(assert.messages.match.default, 'partition.language', RX_LANGUAGE));
                        assert.match(RX_MONGODB_ID, partition.summaryId, assert.format(assert.messages.match.default, 'partition.summaryId', RX_MONGODB_ID));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.version, partition.language, partition.summaryId, id);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.versions.get',
                            data: { url: url, q: query }
                        });
                        return $.ajax({
                            cache: false,
                            data: query,
                            headers: rapi.util.getHeaders({ trace: true }),
                            type: GET,
                            url: url
                        });
                    },

                    /**
                     * Read (formerly rapi.v1.content.findSummaryVersions)
                     * @param query
                     */
                    read: function (query) {
                        assert.isOptionalObject(query, assert.format(assert.messages.isOptionalObject.default, 'query'));
                        assert.match(RX_LANGUAGE, partition.language, assert.format(assert.messages.match.default, 'partition.language', RX_LANGUAGE));
                        assert.match(RX_MONGODB_ID, partition.summaryId, assert.format(assert.messages.match.default, 'partition.summaryId', RX_MONGODB_ID));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.versions, partition.language, partition.summaryId);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.versions.read',
                            data: { url: url, q:  query }
                        });
                        return $.ajax({
                            cache: false,
                            data: query,
                            headers: rapi.util.getHeaders({ trace: true }),
                            type: GET,
                            url: url
                        });
                    },

                    /**
                     * Update (formerly rapi.v1.content.updateSummaryVersion)
                     * @param id
                     * @param doc
                     */
                    update: function (id, doc) {
                        assert.match(RX_MONGODB_ID, id, assert.format(assert.messages.match.default, 'id', RX_MONGODB_ID));
                        assert.isPlainObject(doc, assert.format(assert.messages.isPlainObject.default, 'summary'));
                        assert.match(RX_LANGUAGE, partition.language, assert.format(assert.messages.match.default, 'partition.language', RX_LANGUAGE));
                        assert.match(RX_MONGODB_ID, partition.summaryId, assert.format(assert.messages.match.default, 'partition.summaryId', RX_MONGODB_ID));
                        var url = uris.rapi.root + rapi.util.format(uris.rapi.v1.version, partition.language, partition.summaryId, id);
                        logger.info({
                            message: '$.ajax',
                            method: 'v2.versions.update',
                            data: { url: url, doc: doc }
                        });
                        return $.ajax({
                            contentType: JSON_CONTENT_TYPE,
                            data: JSON.stringify(doc),
                            headers: rapi.util.getHeaders({ security: true, trace: true }),
                            type: PUT,
                            url: url
                        });
                    }

                };
            }
        };

        /**
         * proxy to third party web apis
         * @type {{search: Window.app.rapi.web.search}}
         */
        rapi.web = {

            /**
             * Web search
             * @param provider
             * @param querystring (q, language, type, page, pageSize)
             * @returns {*} items have mime, size and url
             */
            search: function (provider, querystring) {
                assert.type(STRING, provider, assert.format(assert.messages.type.default, 'provider'));
                assert.isOptionalObject(querystring, assert.format(assert.messages.isOptionalObject.default, 'querystring'));
                var url = rapi.util.format(uris.rapi.root + uris.rapi.web.search, provider);
                logger.info({
                    message: '$.ajax',
                    method: 'web.search',
                    data: { provider: provider, qs: querystring }
                });
                return $.ajax({
                    cache: true,
                    data: querystring,
                    headers: rapi.util.getHeaders({ security: true, trace: true }),
                    type: GET,
                    url: url
                });
            }

        };

        /**
         * When html page is loaded, detect and parse #access_token (see oAuth callback)
         * CAREFUL: getHeaders({ security: true, trace: true }) is therefore not available until the HTML page is fully loaded!
         */
        $(function () {
            // Do not execute in cordova and chrome apps
            // In cordova, we collect the token in InAppBrowser which does not load app.rapi
            // In chrome apps, this throws an error
            if ($.type(window.cordova) === UNDEFINED && !(chrome && $.isEmptyObject(chrome.app))) {
                rapi.util.parseToken(location.href);
                rapi.util.cleanHistory();
            }
            rapi.util.ensureToken();
        });

    }(window.jQuery));

    /* jshint +W071 */

    return app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

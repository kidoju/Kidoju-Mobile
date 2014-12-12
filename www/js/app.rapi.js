/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */

(function (window, $, undefined) {

    'use strict';

    var //fn = Function,
        //global = fn('return this')(),
        app = window.app = window.app || {},
        rapi = app.rapi = {}, //rapi stands for RESTful API
        VERSION = 'v0.0.1',
        STRING = 'string',
        OBJECT = 'object',
        FUNCTION = 'function',
        EQUALS = '=',
        HASH = '#',
        TOKEN = 'token',
        ACCESS_TOKEN = 'access_token',
        TOKEN_TYPE = 'token_type',
        EXPIRES_IN = 'expires_in',
        STATE = 'state',
        DELETE = 'DELETE',
        GET = 'GET',
        POST = 'POST',
        PUT = 'PUT',
        FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded',
        //TEXT_CONTENT_TYPE = 'text/plain',
        JSON_CONTENT_TYPE = 'application/json',
        ENGLISH = 'en',

        MODULE = 'app.rapi.js: ',
        DEBUG = true; //TODO use values from loader

    /**
     * Location of our RESTful server
     */
    if (DEBUG) {
        //rapi.root = 'http://www.sv-rndev-01.com:3000';
        rapi.root = 'http://localhost:3000';
    } else {
        rapi.root = 'http://www.kidoju.com'; //TODO too use values from loader
    }

    /**
     * Utility functions
     * @type {{log: log, error: error, getSecurityHeaders: getSecurityHeaders, getAccessTokenHashPos: getAccessTokenHashPos, parseToken: parseToken, setAccessToken: setAccessToken, getAccessToken: getAccessToken, clearAccessToken: clearAccessToken, cleanUrl: cleanUrl, cleanHistory: cleanHistory}}
     */
    rapi.util = {

        /**
         * Log a message
         * @param message
         */
        log: function (message) {
            if (DEBUG && window.console) {
                if ($.type(message) === STRING && $.type(window.console.log) === FUNCTION) {
                    window.console.log(MODULE + message);
                } else if ($.type(message) === OBJECT && $.type(window.console.dir) === FUNCTION) {
                    window.console.dir(message);
                }
            }
        },

        /**
         * Log an error message
         * @param message
         */
        error: function (message) {
            if (DEBUG && window.console) {
                if ($.type(window.console.error) === FUNCTION) {
                    window.console.error(MODULE + message);
                } else if ($.type(window.console.log) === FUNCTION) {
                    window.console.log(MODULE + message);
                }
            }
        },

        /**
         * Simple format function to replace {n} with the (n+1)th argument
         * @param message
         * @returns {*}
         */
        format: function(message) {
            var ret = message; //aka arguments[0]
            for (var i = 1; i < arguments.length; i++) {
                var rx = new RegExp('\\{'+ (i-1).toString() + '\\}', 'g');
                ret = ret.replace(rx, arguments[i].toString());
            }
            return ret;
        },

        /**
         * Get the position of the hash preceding the access_token
         * @param location
         * @returns {number}
         */
        getAccessTokenHashPos: function (location) {
            if ($.type(location) !== STRING) { return -1; }
            return Math.max(
                location.indexOf(HASH + ACCESS_TOKEN), //Facebook and Google return access_token first
                location.indexOf(HASH + TOKEN_TYPE), //Windows Live returns token_type first
                location.indexOf(HASH + EXPIRES_IN), //Others might have them in a different order
                location.indexOf(HASH + STATE)
            );
        },

        /**
         * Parse the access token into a Javascript object
         * @param url
         * @returns {{}}
         */
        parseToken: function (url) {
            var pos1 = rapi.util.getAccessTokenHashPos(url), data = {};
            if (pos1 >= 0) {
                //remove any trailing # and split along &
                var keyValues = url.substr(pos1 + 1).split('#')[0].split('&');
                //then iterate through key=value pairs
                $.each(keyValues, function (index, keyValue) {
                    var pos2 = keyValue.indexOf(EQUALS);
                    if (pos2 > 0 && pos2 < keyValue.length - EQUALS.length) {
                        //Parse strings for numbers
                        var str = decodeURIComponent(keyValue.substr(pos2 + EQUALS.length)),
                            val = parseInt(str);
                        data[keyValue.substr(0, pos2)] = (!isNaN(val) && (val.toString() === str)) ? val : str;
                    }
                });
                //Should we check state?
                //Should we convert expires_in into an expiry date?
                if ($.type(data.access_token) === STRING) {
                    rapi.util.setToken(data);
                }
            }
            return data;
        },

        /**
         * Saves a token in local storage
         * @param accessToken
         */
        setToken: function (token) {
            if(window.localStorage) {
                window.localStorage.setItem(TOKEN, JSON.stringify(token));
                rapi.util.log('token added to localStorage');
            }
        },

        /**
         * Read an access token from storage
         * @returns {*}
         */
        getAccessToken: function() {
            if(window.localStorage) {
                var token = JSON.parse(window.localStorage.getItem(TOKEN));
                if ((!token) || (token.ts && token.expires && token.ts + 1000* token.expires < Date.now())) {
                    if (token) {
                        window.localStorage.removeItem(TOKEN);
                        rapi.util.log('Access token has expired');
                    }
                    return null;
                }
                rapi.util.log('Access token read from localStorage');
                return token[ACCESS_TOKEN];
            } else {
                rapi.util.log('Without localStorage support in your browser, there is no way we can get you signed in.');
                return null;
            }
        },

        /**
         * Clear (delete) an access token from storage
         */
        clearToken: function () {
            if(window.localStorage) {
                window.localStorage.removeItem(TOKEN);
                rapi.util.log(MODULE + 'token removed from localStorage');
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
            var ret = url,
                pos = rapi.util.getAccessTokenHashPos(url);
            rapi.util.log('url before cleaning token info: ' + url);
            if (pos >= 0) {
                ret = ret.substring(0, pos);
            }
            if (ret.slice(-1) === HASH) { //remove trailing hash if any
                ret = ret.substring(0, ret.length - 1);
            }
            rapi.util.log('url after cleaning token info: ' + ret);
            return ret;
        },

        /**
         * Clean the history from token information
         */
        cleanHistory: function () {
            var pos = rapi.util.getAccessTokenHashPos(window.location.hash);
            if (pos >= 0) {
                if (history) {
                    history.replaceState({}, document.title, window.location.pathname + window.location.hash.substr(0, pos));
                } else {
                    window.location.hash = window.location.hash.substr(0, pos); // for older browsers, might leave a # behind
                }
            }
        },

        /**
         * Get a formatted security header for $.ajax calls
         * @returns {*}
         */
        getSecurityHeaders: function () {
            var accessToken = rapi.util.getAccessToken();
            if (accessToken) {
                return { 'Authorization': 'Bearer ' + accessToken };
            }
            return {};
        },

        /**
         * DOMready handler
         */
        onDocumentReady: function() {
            if (!(window.chrome && $.isEmptyObject(window.chrome.app))) { //avoids an error in chrome packaged apps
                rapi.util.log('access_token = ' + rapi.util.getAccessToken());
                rapi.util.parseToken(window.location.href);
                rapi.util.cleanHistory();
            }
        }
    };

    /**
     * Simple test functions
     * @type {{getVersion: getVersion, getHeartbeat: getHeartbeat}}
     */
    rapi.test = {

        /**
         * Test endPoints (use with root)
         */
        endPoints: {
            ping: '/ping'
        },

        /**
         * Returns the API version number
         * @returns {*}
         */
        version: function() {
            //See http://jqfundamentals.com/chapter/ajax-deferreds
            //See also http://joseoncode.com/2011/09/26/a-walkthrough-jquery-deferred-and-promise/
            rapi.util.log('calling version');
            var dfd = new $.Deferred();
            setTimeout(function() { dfd.resolve(VERSION); }, 0);
            return dfd.promise();
        },

        /**
         * Checks a ping
         * @returns {*}
         */
        ping: function () {
            rapi.util.log('calling ping');
            var dfd = new $.Deferred();
            $.ajax({
                url: rapi.root + rapi.test.endPoints.ping,
                type: GET,
                //cache: false,
                crossDomain: true //TODO: not sure this is necessary????
            }).done(function() {
                dfd.resolve(arguments[0].hasOwnProperty('ping') && arguments[0].ping === 'OK');
            }).fail(function() {
                dfd.resolve(false);
                //dfd.reject(arguments[0], arguments[1], arguments[2]);
            });
            return dfd.promise();
        },

        /**
         * Return a successful promise
         * Like $.noop(), used temporarily in development
         * @returns {*}
         */
        dummyResolvedDeferred: function() {
            var deferred = $.Deferred();
            setTimeout(function() {
                deferred.resolve({total: 0, data: []});
            }, 0);
            return deferred.promise();
        },

        /**
         * Return a failing promise
         * Like $.noop(), used temporarily in development
         * @returns {*}
         */
        dummyRejectedDeferred: function() {
            var deferred = $.Deferred();
            setTimeout(function() {
                deferred.reject(null, 0, 'Failed');
            }, 0);
            return deferred.promise();
        }

    };

    /**
     * oAuth 2.0 authentication
     */
    rapi.oauth = {

        /**
         * Test endPoints (use with root)
         */
        endPoints: {
            signIn:  '/auth/{0}/signin',
            signOut:  '/auth/signout'
        },

        /**
         * Returns the authentication provider URL to call for signing in
         * @param provider
         * @param returnUrl
         * @returns {*}
         */
        getSignInUrl: function (provider, returnUrl) {
            rapi.util.log('calling getSignInUrl for ' + provider);
            return $.ajax({
                url: rapi.root + rapi.oauth.endPoints.signIn.replace('{0}', provider),
                type: GET,
                cache: true,
                data: { returnUrl: rapi.util.cleanUrl(returnUrl) /*encodeURIComponent(returnUrl)*/ }
            });
        },

        /**
         * Sign out
         * @returns {*}
         */
        signOut: function () {
            rapi.util.log('calling signOut');
            return $.ajax({
                url: rapi.root + rapi.oauth.endPoints.signOut,
                type: POST,
                contentType: FORM_CONTENT_TYPE,
                //xhrFields: { withCredentials: true },
                headers: rapi.util.getSecurityHeaders()
            }).always(function () {
                rapi.util.clearToken();
            });
        }

    };

    /**
     * API v1
     */
    rapi.v1 = {

        /**
         * v1 endPoints (use with rapi.root)
         */
        endPoints: {
            user: '/api/v1/users/{0}',
            me: '/api/v1/users/me',
            mySummaries: '/api/v1/users/me/{0}/summaries',
            myActivities: '/api/v1/users/me/{0}/activities',
            myFavourites: '/api/v1/users/me/{0}/favourites',
            myFavourite: '/api/v1/users/me/{0}/favourites/{1}',
            allLanguages: '/api/v1/languages',
            language: '/api/v1/languages/{0}',
            categories: '/api/v1/languages/{0}/categories',
            summaries: '/api/v1/{0}/summaries',
            summary: '/api/v1/{0}/summaries/{1}',
            versions: '/api/v1/{0}/summaries/{1}/versions',
            version: '/api/v1/{0}/summaries/{1}/versions/{2}',
            activities: '/api/v1/{0}/summaries/{1}/activities',
            activity: '/api/v1/{0}/summaries/{1}/activities/{2}'
        },

        /**
         * User profile, summaries and activities
         */
        user: {

            /**
             * Get a public user profile
             * @param id
             * @returns {*}
             */
            getUser: function(id) {
                rapi.util.log('calling user.getUser');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.user, id),
                    type: GET,
                    //cache: false,
                    crossDomain: true
                });
            },

            /**
             * Get me (the authenticated user)
             * @param querystring
             * @returns {*}
             */
            getMe: function(querystring) {
                rapi.util.log('calling user.getMe');
                return $.ajax({
                    url: rapi.root + rapi.v1.endPoints.me,
                    type: GET,
                    data: querystring,
                    //cache: false,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Update me (the authenticated user)
             * @param user
             * @returns {*}
             */
            updateMe: function(user) {
                rapi.util.log('calling user.updateMe');
                return $.ajax({
                    url: rapi.root + rapi.v1.endPoints.me,
                    type: PUT,
                    contentType: JSON_CONTENT_TYPE,
                    data: $.type(user) === STRING ? user : JSON.stringify(user),
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Get current user's list of favourites
             * @param language
             * @returns {*}
             */
            getAllMyFavourites: function(language) {
                rapi.util.log('calling user.getMyFavourites');
                return $.ajax({
                    url: rapi.root  + rapi.util.format(rapi.v1.endPoints.myFavourites, language || ENGLISH),
                    type: GET,
                    //cache: false,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Create a new favourite
             * @param language
             * @param favourite ()
             */
            createMyFavourite: function(language, favourite) {
                rapi.util.log('calling user.createMyFavourite');
                return $.ajax({
                    url: rapi.root  + rapi.util.format(rapi.v1.endPoints.myFavourites, language || ENGLISH),
                    type: POST,
                    contentType: JSON_CONTENT_TYPE,
                    data: $.type(favourite) === STRING ? favourite : JSON.stringify(favourite),
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * delete a favourite
             * @param language
             * @param favouriteId
             */
            deleteMyFavourite: function(language, favouriteId) {
                rapi.util.log('calling user.deleteMyFavourite');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.myFavourite, language || ENGLISH, favouriteId),
                    type: DELETE,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },


            /**
             * Find the authenticated users' summaries
             * IMPORTANT: includes non-published drafts
             * @param language
             * @param querystring
             * @returns {*}
             */
            findMySummaries: function(language, querystring) {
                rapi.util.log('calling user.findMySummaries');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.mySummaries, language || ENGLISH),
                    type: GET,
                    data: querystring,
                    //cache: false,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Find the authenticated users' activities
             * @param language
             * @param querystring
             * @returns {*}
             */
            findMyActivities: function(language, querystring) {
                rapi.util.log('calling user.findMyActivities');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.myActivities, language || ENGLISH),
                    type: GET,
                    data: querystring,
                    //cache: false,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
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
            getAllLanguages: function() {
                rapi.util.log('calling taxonomy.getAllLanguages');
                return $.ajax({
                    url: rapi.root + rapi.v1.endPoints.allLanguages,
                    type: GET,
                    cache: true,
                    crossDomain: true
                });
            },

            /**
             * Get a language - not very useful except to check that a language has categories
             * @param language
             * @returns {*}
             */
            getLanguage: function(language) {
                rapi.util.log('calling taxonomy.getLanguage');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.language, language || ENGLISH),
                    type: GET,
                    cache: true,
                    crossDomain: true
                });
            },

            /**
             * Get all categories for a language designated by its isoCode
             * @param language
             * @returns {*}
             */
            getAllCategories: function(language) {
                rapi.util.log('calling taxonomy.getAllCategories');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.categories, language || ENGLISH),
                    type: GET,
                    cache: true,
                    crossDomain: true
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
            createSummary: function(language, summary) {
                rapi.util.log('calling content.createSummary');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.summaries, language || ENGLISH),
                    type: POST,
                    contentType: JSON_CONTENT_TYPE,
                    data: $.type(summary) === STRING ? summary : JSON.stringify(summary),
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Find summaries
             * @param language
             * @param querystring
             */
            findSummaries: function(language, querystring) {
                rapi.util.log('calling content.findSummaries');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.summaries, language || ENGLISH),
                    type: GET,
                    data: querystring,
                    //cache: false,
                    crossDomain: true
                });
            },

            /**
             * Get a summary by its id
             * @param language
             * @param id
             * @param querystring
             * @returns {*}
             */
            getSummary: function(language, id, querystring) {
                rapi.util.log('calling content.getSummary');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.summary, language || ENGLISH, id),
                    type: GET,
                    data: querystring,
                    //cache: false,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Update a summary by its id
             * @param language
             * @param id
             * @param summary
             * @returns {*}
             */
            updateSummary: function(language, id, summary) {
                rapi.util.log('calling content.updateSummary');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.summary, language || ENGLISH, id),
                    type: PUT,
                    contentType: JSON_CONTENT_TYPE,
                    data:  $.type(summary) === STRING ? summary : JSON.stringify(summary),
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Delete a summary by its id
             * @param language
             * @param id
             * @returns {*}
             */
            deleteSummary: function(language, id) {
                rapi.util.log('calling content.deleteSummary');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.summary, language || ENGLISH, id),
                    type: DELETE,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Execute a versioning command
             * @param language
             * @param summaryId
             * @param command
             * @returns {*}
             */
            executeCommand: function(language, summaryId, command) {
                rapi.util.log('calling content.executeCommand');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.versions, language || ENGLISH, summaryId),
                    type: POST,
                    contentType: JSON_CONTENT_TYPE,
                    data: $.type(command) === STRING ? command : JSON.stringify(command),
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Find summary versions
             * Note: careful when including streams!!!!
             * @param language
             * @param summaryId
             * @param querystring
             */
            findSummaryVersions: function(language, summaryId, querystring) {
                rapi.util.log('calling content.findSummaryVersions');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.versions, language || ENGLISH, summaryId),
                    type: GET,
                    data: querystring,
                    //cache: false,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Get a summary version (including stream)
             * @param language
             * @param summaryId
             * @param versionId
             * @param querystring
             */
            getSummaryVersion: function(language, summaryId, versionId, querystring) {
                rapi.util.log('calling content.getSummaryVersion');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.version, language || ENGLISH, summaryId, versionId),
                    type: GET,
                    data: querystring,
                    //cache: false,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Get the current (published) summary version
             * @param language
             * @param summaryId
             */
            getCurrentSummaryVersion: function(language, summaryId) {
                rapi.util.log('calling content.getCurrentSummaryVersion');

                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.version, language || ENGLISH, summaryId),
                    type: GET,
                    //data: querystring,
                    //cache: false,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
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
            updateSummaryVersion: function(language, summaryId, versionId, version) {
                rapi.util.log('calling content.updateSummaryVersion');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.version, language || ENGLISH, summaryId, versionId),
                    type: PUT,
                    contentType: JSON_CONTENT_TYPE,
                    data: $.type(version) === STRING ? version : JSON.stringify(version),
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Delete a summary version
             * @param language
             * @param summaryId
             * @param versionId
             * @returns {*}
             */
            deleteSummaryVersion: function(language, summaryId, versionId) {
                rapi.util.log('calling content.deleteSummaryVersion');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.version, language || ENGLISH, summaryId, versionId),
                    type: DELETE,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Create summary activity
             * @param language
             * @param summaryId
             * @param querystring
             */
            createSummaryActivity: function(language, summaryId, activity) {
                rapi.util.log('calling content.createSummaryActivity');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.activities, language || ENGLISH, summaryId),
                    type: POST,
                    contentType: JSON_CONTENT_TYPE,
                    data: $.type(activity) === STRING ? activity : JSON.stringify(activity),
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Find summary activities
             * @param language
             * @param summaryId
             * @param querystring
             */
            findSummaryActivities: function(language, summaryId, querystring) {
                rapi.util.log('calling content.findSummaryActivities');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.activities, language || ENGLISH, summaryId),
                    type: GET,
                    data: querystring,
                    //cache: false,
                    //TODO: headers? any restrictions
                    crossDomain: true
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
            getSummaryActivity: function(language, summaryId, activityId, querystring) {
                rapi.util.log('calling content.getSummaryActivity');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.activity, language || ENGLISH, summaryId, activityId),
                    type: GET,
                    data: querystring,
                    //cache: false,
                    //TODO: headers? any restrictions
                    crossDomain: true
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
            updateSummaryActivity: function(language, summaryId, activityId, activity) {
                rapi.util.log('calling content.updateSummaryActivity');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.activity, language || ENGLISH, summaryId, activityId),
                    type: PUT,
                    contentType: JSON_CONTENT_TYPE,
                    data: $.type(activity) === STRING ? activity : JSON.stringify(activity),
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Delete a summary activity
             * @param language
             * @param summaryId
             * @param activityId
             * @returns {*}
             */
            deleteSummaryActivity: function(language, summaryId, activityId) {
                rapi.util.log('calling content.deleteSummaryActivity');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.activity, language || ENGLISH, summaryId, activityId),
                    type: DELETE,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            }
        }
    };

    /**
     * When html page is loaded, detect and parse #access_token (see oAuth callback)
     * CAREFUL: getSecurityHeaders() is therefore not available until the HTML page is fully loaded!
     */
    $(document).ready(app.rapi.util.onDocumentReady);

}(this, jQuery));

/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */
/* global define */

(function (root, factory) {

    'use strict';

    /**
     * Compatibility with AMD and browser globals
     * Source: https://github.com/umdjs/umd/blob/master/amdWeb.js
     */
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else {
        // Browser globals
        root.app = root.app || {};
        root.app.rapi = factory(root.$);
    }

    /**
     * When html page is loaded, detect and parse #access_token (see oAuth callback)
     * CAREFUL: getSecurityHeaders() is therefore not available until the HTML page is fully loaded!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    root.$(document).ready(root.app.rapi.util.onDocumentReady);

}(this, function ($) {

    'use strict';

    var fn = Function,
        global = fn('return this')(),//Note: global = this does not work because this is #document not Window
        rapi = {}, //rapi stands for RESTful API
        VERSION = 'v0.0.1',
        STRING = 'string',
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

        MODULE = 'app.rapi.js: ',
        DEBUG = true; //IMPORTANT: Set DEBUG = false in production

    /**
     * Location of our RESTful server
     */
    if (DEBUG) {
        //rapi.root = 'http://www.sv-rndev-01.com:3000';
        rapi.root = 'http://localhost:3000';
    } else {
        rapi.root = 'http://www.kidoju.com';
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
            if (DEBUG && global.console && ($.type(global.console.log) === FUNCTION)) {
                global.console.log(message);
            }
        },

        /**
         * Log an error message
         * @param message
         */
        error: function (message) {
            if (DEBUG && global.console) {
                if ($.type(global.console.error) === FUNCTION) {
                    global.console.error(message);
                } else if ($.type(global.console.log) === FUNCTION) {
                    global.console.log(message);
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
            if(global.localStorage) {
                global.localStorage.setItem(TOKEN, JSON.stringify(token));
                rapi.util.log(MODULE + 'token added to localStorage');
            }
        },

        /**
         * Read an access token from storage
         * @returns {*}
         */
        getAccessToken: function() {
            var ret;
            if(global.localStorage) {
                try {
                    ret = JSON.parse(global.localStorage.getItem(TOKEN))[ACCESS_TOKEN];
                } catch(ex) {}
                rapi.util.log(MODULE + 'token read from localStorage');
            }
            return ret;
        },

        /**
         * Clear (delete) an access token from storage
         */
        clearToken: function () {
            if(global.localStorage) {
                global.localStorage.removeItem(TOKEN);
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
            rapi.util.log(MODULE + 'url before cleaning token info: ' + url);
            if (pos >= 0) {
                ret = ret.substring(0, pos);
            }
            if (ret.slice(-1) === HASH) { //remove trailing hash if any
                ret = ret.substring(0, ret.length - 1);
            }
            rapi.util.log(MODULE + 'url after cleaning token info: ' + ret);
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
            if (!(global.chrome && $.isEmptyObject(global.chrome.app))) { //avoids an error in chrome packaged apps
                rapi.util.log(MODULE + 'access_token = ' + rapi.util.getAccessToken());
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
            heartbeat: '/heartbeat'
        },

        /**
         * Returns the API version number
         * @returns {*}
         */
        getVersion: function() {
            //See http://jqfundamentals.com/chapter/ajax-deferreds
            //See also http://joseoncode.com/2011/09/26/a-walkthrough-jquery-deferred-and-promise/
            rapi.util.log(MODULE + 'calling getVersion');
            var dfd = new $.Deferred();
            setTimeout(function() { dfd.resolve(VERSION); }, 10);
            return dfd.promise();
        },

        /**
         * Checks a heartbeat
         * @returns {*}
         */
        getHeartbeat: function () {
            rapi.util.log(MODULE + 'calling getHeartbeat');
            var dfd = new $.Deferred();
            $.ajax({
                url: rapi.root + rapi.test.endPoints.heartbeat,
                type: GET,
                cache: false,
                crossDomain: true //TODO: not sure this is necessary????
            }).done(function() {
                dfd.resolve(arguments[0] === 'OK');
            }).fail(function() {
                dfd.resolve(false);
                //dfd.reject(arguments[0], arguments[1], arguments[2]);
            });
            return dfd.promise();
        }
    };

    /**
     * oAuth 2.0 authentication
     */
    rapi.oauth = {
        //TODO
    };


    /**
     * API v1
     */
    rapi.v1 = {

        /**
         * v1 endPoints (use with rapi.root)
         */
        endPoints: {
            userProfile: '/api/v1/users/me',
            userSummaries: '/api/v1/users/me/summaries',
            userActivities: '/api/v1/users/me/activities',
            allLanguages: '/api/v1/languages',
            language: '/api/v1/languages/{0}',
            categories: '/api/v1/languages/{0}/categories',
            summaries: '/api/v1/summaries',
            summary: '/api/v1/summaries/{0}',
            summaryActivities: '/api/v1/summaries/{0}/activities',
            summaryActivity: '/api/v1/summaries/{0}/activities/{1}'
        },

        /**
         * User profile, summaries and activities
         */
        user: {

            /**
             * Get signed-in user profile
             * @returns {*}
             */
            getProfile: function() {
                rapi.util.log(MODULE + 'calling getProfile');
                return $.ajax({
                    url: rapi.root + rapi.v1.endPoints.userProfile,
                    type: GET,
                    cache: false,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Find user summaries (including drafts)
             * @param query
             * @param fields
             * @param sort
             * @param skip
             * @param limit
             * @returns {*}
             */
            findSummaries: function(query, fields, sort, skip, limit) {
                rapi.util.log(MODULE + 'calling findSummaries');
                return $.ajax({
                    url: rapi.root + rapi.v1.endPoints.userSummaries,
                    type: GET,
                    cache: false,
                    headers: rapi.util.getSecurityHeaders(),
                    crossDomain: true
                });
            },

            /**
             * Find user activities
             * @param query
             * @param fields
             * @param sort
             * @param skip
             * @param limit
             * @returns {*}
             */
            findActivities: function(query, fields, sort, skip, limit) {
                rapi.util.log(MODULE + 'calling findActivities');
                return $.ajax({
                    url: rapi.root + rapi.v1.endPoints.userActivities,
                    type: GET,
                    cache: false,
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
                rapi.util.log(MODULE + 'calling getAllLanguages');
                return $.ajax({
                    url: rapi.root + rapi.v1.endPoints.allLanguages,
                    type: GET,
                    cache: false,
                    crossDomain: true
                });
            },

            /**
             * Get a language - not very useful except to check that a language has categories
             * @param isoCode
             * @returns {*}
             */
            getLanguage: function(isoCode) {
                rapi.util.log(MODULE + 'calling getLanguage');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.language, isoCode),
                    type: GET,
                    cache: false,
                    crossDomain: true
                });
            },

            /**
             * Get all categories for a language designated by its isoCode
             * @param isoCode
             * @returns {*}
             */
            getCategories: function(isoCode) {
                rapi.util.log(MODULE + 'calling getCategories');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.categories, isoCode),
                    type: GET,
                    cache: false,
                    crossDomain: true
                });
            }
        },

        /**
         * Summaries and activities
         */
        content: {

            /**
             * Find summaries
             * @param query
             * @param fields
             * @param sort
             * @param skip
             * @param limit
             */
            findSummaries: function(query, fields, sort, skip, limit) {
                rapi.util.log(MODULE + 'calling findSummaries');
                return $.ajax({
                    url: rapi.root + rapi.v1.endPoints.summaries,
                    type: GET,
                    cache: false,
                    crossDomain: true
                });
            },

            /**
             * Get a summary by its id
             * @param id
             * @returns {*}
             */
            getSummary: function(id) {
                rapi.util.log(MODULE + 'calling getSummary');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.summary, id),
                    type: GET,
                    cache: false,
                    crossDomain: true
                });
            },

            /**
             * Find summary activities
             * @param query object
             * @param fields array
             * @param sort object
             * @param skip number
             * @param limit number
             */
            findSummaryActivities: function(query, fields, sort, skip, limit) {
                rapi.util.log(MODULE + 'calling findSummaryActivities');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.summaryActivities, query.summary_id),
                    type: GET,
                    cache: false,
                    crossDomain: true
                });
            },

            /**
             * Get a summary activity
             * @param summary_id
             * @param activity_id
             * @returns {*}
             */
            getSummaryActivity: function(summary_id, activity_id) {
                rapi.util.log(MODULE + 'calling getSummaryActivity');
                return $.ajax({
                    url: rapi.root + rapi.util.format(rapi.v1.endPoints.summaryActivity, summary_id, activity_id),
                    type: GET,
                    cache: false,
                    crossDomain: true
                });
            }
        }
    };

    //return the rapi module being built
    return rapi;

}));
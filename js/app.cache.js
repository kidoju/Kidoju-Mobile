/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        './window.assert',
        './window.logger',
        './app.logger',
        './app.rapi'
    ], f);
})(function () {

    'use strict';

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        /* jshint maxstatements: 28 */

        var app = window.app;
        var localStorage = window.localStorage;
        var sessionStorage = window.sessionStorage;
        // var assert = new window.assert;
        var logger = new window.Logger('app.cache');
        var rapi = app.rapi;
        var cache = app.cache = app.cache || {};
        var LOCAL_EXPIRES = 24 * 60 * 60; // 1 day
        var SESSION_EXPIRES = 5 * 60; // 5 minutes
        var NOCACHE = app.NOCACHE || false; // cache by default
        var STRING = 'string';
        var NULL = null;
        var ME = cache.ME = 'me'; // Public because used in app.models.js
        var CATEGORIES = 'categories.';
        var FAVOURITES = 'favourites.';

        /**
         * Sets an item in browser local storage
         * @param name
         * @param value
         * @param expires (in seconds, 1 day by default)
         * @private
         */
        cache._setLocalItem = function (name, value, expires) {
            if (!NOCACHE && localStorage) {
                localStorage.setItem(name, JSON.stringify({
                    ts: Date.now(),
                    expires: expires || LOCAL_EXPIRES,
                    value: value
                }));
                logger.debug({
                    message: 'value set in localStorage',
                    method: 'app.cache._setLocalItem',
                    data: { name: name, value: value, expires: expires }
                });
            } else {
                logger.debug({
                    message: 'localStorage not supported or NOCACHE option set',
                    method: 'app.cache._setLocalItem'
                });
            }
        };

        /**
         * Gets an item from browser local storage
         * @param name
         * @returns {*}
         * @private
         */
        cache._getLocalItem = function (name) {
            if (!NOCACHE && localStorage) {
                var item = JSON.parse(localStorage.getItem(name));
                if ((!item) || (item.ts && item.expires && item.ts + 1000 * item.expires < Date.now())) {
                    if (item) {
                        localStorage.removeItem(name);
                        logger.debug({
                            message: 'value read from localStorage has expired',
                            method: 'app.cache._getLocalItem',
                            data: { name: name }
                        });
                    }
                    return NULL;
                }
                logger.debug({
                    message: 'value read from localStorage is still valid',
                    method: 'app.cache._getLocalItem',
                    data: { name: name }
                });
                return item.value;
            } else {
                logger.debug({
                    message: 'localStorage not supported or NOCACHE option set',
                    method: 'app.cache._getLocalItem'
                });
                return NULL;
            }
        };

        /**
         * Removes an item from browser local storage
         * @param regexp
         * @private
         */
        cache._removeLocalItem = function (regexp) {
            if (localStorage) {
                if (!(regexp instanceof RegExp)) {
                    regexp = new RegExp(regexp);
                }
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    if (regexp.test(key)) {
                        localStorage.removeItem(key);
                        logger.debug({
                            message: 'value removed from localStorage',
                            method: 'app.cache._removeLocalItem',
                            data: { rx: regexp, key: key }
                        });
                    }
                }
            }
        };

        /**
         * Sets an item in browser session storage
         * @param name
         * @param value
         * @param expires (in seconds, 5 min by default)
         * @private
         */
        cache._setSessionItem = function (name, value, expires) {
            if (!NOCACHE && sessionStorage) {
                sessionStorage.setItem(name, JSON.stringify({
                    ts: Date.now(),
                    expires: expires || SESSION_EXPIRES,
                    value: value
                }));
                logger.debug({
                    message: 'value set in sessionStorage',
                    method: 'app.cache._setSessionItem',
                    data: { name: name, value: value, expires: expires }
                });
            } else {
                logger.debug({
                    message: 'sessionStorage not supported or NOCACHE option set',
                    method: 'app.cache._setSessionItem'
                });
            }
        };

        /**
         * Gets an item from browser session storage
         * @param name
         * @returns {*}
         * @private
         */
        cache._getSessionItem = function (name) {
            if (!NOCACHE && sessionStorage) {
                var item = JSON.parse(sessionStorage.getItem(name));
                if ((!item) || (item.ts && item.expires && item.ts + 1000 * item.expires < Date.now())) {
                    if (item) {
                        sessionStorage.removeItem(name);
                        logger.debug({
                            message: 'value read from sessionStorage has expired',
                            method: 'app.cache._getSessionItem',
                            data: { name: name }
                        });
                    }
                    return NULL;
                }
                logger.debug({
                    message: 'value read from sessionStorage is still valid',
                    method: 'app.cache._getSessionItem',
                    data: { name: name }
                });
                return item.value;
            } else {
                logger.debug({
                    message: 'sessionStorage not supported or NOCACHE option set',
                    method: 'app.cache._getLocalItem'
                });
                return NULL;
            }
        };

        /**
         * Removes an item from browser session storage
         * @param regexp
         * @private
         */
        cache._removeSessionItem = function (regexp) {
            if (sessionStorage) {
                if (!(regexp instanceof RegExp)) {
                    regexp = new RegExp(regexp);
                }
                for (var i = 0; i < sessionStorage.length; i++) {
                    var key = sessionStorage.key(i);
                    if (regexp.test(key)) {
                        sessionStorage.removeItem(key);
                        logger.debug({
                            message: 'value removed from sessionStorage',
                            method: 'app.cache._removeSessionItem',
                            data: { rx: regexp, key: key }
                        });
                    }
                }
            }
        };

        /**
         * Get the (un)authenticated user
         */
        cache.getMe = function () {
            var dfd = $.Deferred();
            var me = cache._getSessionItem(ME);
            var token = rapi.util.getAccessToken();
            if ((token && me && me.id === NULL) || // remove unauthenticated me, since we have a valid token
                (!token && me && $.type(me.id) === STRING)) { // remove authenticated me since we do not have a valid token
                cache.removeMe();
                me = NULL;
            }
            if (me) {
                logger.debug({
                    message: 'me found in cache',
                    method: 'app.cache.getMe',
                    data: { me: me }
                });
                // setTimeout(function () {
                dfd.resolve(me);
                // }, 0);
            } else {
                rapi.v1.user.getMe({ fields: 'firstName lastName picture' })
                    .done(function (response) {
                        cache.removeMyFavourites();
                        cache._setSessionItem(ME, response);
                        dfd.resolve(response);
                    })
                    .fail(function (xhr, status, error) {
                        if (xhr.status === 401) { // Unauthorised = not authenticated
                            var response =  { id: NULL };
                            cache.removeMyFavourites();
                            rapi.util.clearToken(); // Token is necessarily invalid if user.getMe failed
                            cache._setSessionItem(ME, response);
                            dfd.resolve(response);
                        } else { // any other error
                            dfd.reject(xhr, status, error); // be consistent with $.ajax in case of error
                        }
                    });
            }
            return dfd.promise();
        };

        /**
         * Remove the authenticated user from cache
         * Also remove his favourites, but not his token
         */
        cache.removeMe = function () {
            cache._removeSessionItem('^' + ME);
            cache._removeSessionItem('^' + FAVOURITES);
        };

        /**
         * Get a list of categories
         * @param locale (ISO code)
         */
        cache.getAllCategories = function (locale) {
            var categories = cache._getLocalItem(CATEGORIES + locale);
            if ($.isArray(categories)) {
                logger.debug({
                    message: 'categories found in cache',
                    method: 'app.cache.getAllCategories',
                    data: { locale: locale }
                });
                var dfd = $.Deferred();
                // setTimeout(function () {
                dfd.resolve({ total: categories.length, data: categories });
                // }, 0);
                return dfd.promise();
            } else {
                return rapi.v1.taxonomy.getAllCategories(locale)
                    .done(function (response) {
                        cache._setLocalItem(CATEGORIES + locale, response.data); // response = { total: ..., data: [...] }
                    });
            }
        };

        /**
         * Get a hierarchy of categories
         * @param locale
         */
        cache.getCategoryHierarchy = function (locale) {
            var dfd = $.Deferred();
            cache.getAllCategories(locale)
                .done(function (response) {
                    var hash = {};
                    $.each(response.data, function (index, value) {
                        // See http://docs.telerik.com/kendo-ui/getting-started/web/treeview/overview#item-definition
                        // See http://docs.telerik.com/kendo-ui/getting-started/web/treeview/binding-to-flat-data#method-1-initial-pre-processing-of-all-data
                        var item = {
                                id: value.id,
                                name: value.name,
                                icon: value.icon,
                                type: 2
                            };
                        var id = value.id;
                        var parentId = value.parentId || 'root';
                        hash[id] = hash[id] || [];
                        hash[parentId] = hash[parentId] || [];
                        item.items = hash[id];
                        hash[parentId].push(item);
                    });
                    dfd.resolve(hash.root || []);
                })
                .fail(function (xhr, status, error) {
                    dfd.reject(xhr, status, error);
                });
            return dfd.promise();
        };

        /**
         * Get a flat hierarchy of categories with depth level, in the same order as the hierarchy
         * @param locale
         * @returns {*}
         */
        cache.getLeveledCategories = function (locale) {
            var dfd = $.Deferred();
            cache.getCategoryHierarchy(locale)
                .done(function (response) {
                    function Flatten(categories, parentId, depth) {
                        for (var i = 0, length = categories.length; i < length; i++) {
                            var category = categories[i];
                            flat.push({
                                id: category.id,
                                icon: category.icon,
                                depth: depth, // `level` seems to be reserved in kendo.ui.TreeView
                                name: category.name,
                                parentId: parentId,
                                type: category.type
                            });
                            if ($.isArray(category.items) && category.items.length) {
                                Flatten(category.items, category.id, depth + 1);
                            }
                        }
                    }
                    var flat = [];
                    Flatten(response, null, 0);
                    dfd.resolve({ total: flat.length, data: flat });
                })
                .fail(function (xhr, status, error) {
                    dfd.reject(xhr, status, error);
                });
            return dfd.promise();
        };

        /**
         * Get all my favourites
         * @param locale (ISO code)
         */
        cache.getAllMyFavourites = function (locale) {
            var dfd;
            var me = cache._getSessionItem(ME);
            var favourites = cache._getSessionItem(FAVOURITES + locale);
            if ($.isArray(favourites)) {
                logger.debug({
                    message: 'favourites found in cache',
                    method: 'app.cache.getAllMyFavourites',
                    data: { locale: locale }
                });
                dfd = $.Deferred();
                setTimeout(function () {
                    dfd.resolve({ total: favourites.length, data: favourites });
                }, 0);
                return dfd.promise();
            } else if (me && me.id === NULL) {
                dfd = $.Deferred();
                setTimeout(function () {
                    dfd.resolve({ total: 0, data: [] });
                }, 0);
                return dfd.promise();
            } else {
                return rapi.v1.user.getAllMyFavourites(locale).done(function (response) {
                    cache._setSessionItem(FAVOURITES + locale, response.data); // response = { total: ..., data: [...] }
                });
            }
        };

        /**
         * Returns a hierarchy of favourites
         * @param locale
         */
        cache.getFavouriteHierarchy = function (locale) {
            var dfd = $.Deferred();
            cache.getAllMyFavourites(locale)
                .done(function (response) {
                    var favourites = response.data;
                    $.each(favourites, function (index, favourite) {
                        delete favourite.language;
                        favourite.icon = 'star';
                        favourite.type = 3;
                        // We might consider subtypes in the future to organize favourites (searches, users, summaries, channels, ...)
                    });
                    dfd.resolve(favourites);
                })
                .fail(function (xhr, status, error) {
                    if (xhr && xhr.status === 401) {
                        dfd.resolve([]);
                    } else {
                        dfd.reject(xhr, status, error);
                    }
                });
            return dfd.promise();
        };

        /**
         * Remove favourites
         * @param locale (ISO code)
         */
        cache.removeMyFavourites = function (locale) {
            cache._removeSessionItem('^' + FAVOURITES + locale);
        };

    }(window.jQuery));

    /* jshint +W071 */

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

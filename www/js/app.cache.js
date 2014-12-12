/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */

(function (window, $, undefined) {

    'use strict';

    var app = window.app = window.app || {},
        cache = app.cache = app.cache || {},
        rapi = app.rapi,
        FUNCTION = 'function',
        LOCAL_EXPIRES = 24*60*60, //1 day
        SESSION_EXPIRES = 5*60, //5 minutes
        NULL = null,

        TOKEN = 'token',
        ME = 'me',
        CATEGORIES = 'categories.',
        FAVOURITES = 'favourites.',

        MODULE = 'app.cache.js: ',
        NOCACHE = app.NOCACHE,
        DEBUG = app.DEBUG;

    /**
     * Logs a message
     * @param message
     */
    function log(message) {
        if (DEBUG && window.console && (typeof window.console.log === FUNCTION)) {
            window.console.log(MODULE + message);
        }
    }

    /**
     * Sets an item in browser local storage
     * @param name
     * @param value
     * @param expires (in seconds, 1 day by default)
     * @private
     */
    cache._setLocalItem = function(name, value, expires) {
        if (!NOCACHE && window.localStorage) {
            window.localStorage.setItem(name, JSON.stringify({
                ts: Date.now(),
                expires: expires || LOCAL_EXPIRES,
                value: value
            }));
            log(name + ' set in localStorage');
        } else {
            log('localStorage not available or option NOCACHE set');
        }
    };

    /**
     * Gets an item from browser local storage
     * @param name
     * @returns {*}
     * @private
     */
    cache._getLocalItem = function(name) {
        if(!NOCACHE && window.localStorage) {
            var item = JSON.parse(window.localStorage.getItem(name));
            if ((!item) || (item.ts && item.expires && item.ts + 1000 * item.expires < Date.now())) {
                if (item) {
                    window.localStorage.removeItem(name);
                    log('cache has expired for ' + name);
                }
                return NULL;
            }
            log(name + ' retrieved from localStorage');
            return item.value;
        } else {
            log('localStorage not available or option NOCACHE set');
            return NULL;
        }
    };

    /**
     * Removes an item from browser local storage
     * @param regexp
     * @private
     */
    cache._removeLocalItem = function(regexp) {
        if(window.localStorage) {
            if (!(regexp instanceof RegExp)) {
                regexp = new RegExp(regexp);
            }
            for (var i = 0; i < window.localStorage.length; i++) {
                var key = window.localStorage.key(i);
                if (regexp.test(key)) {
                    window.localStorage.removeItem(key);
                    log(key + ' removed from localStorage');
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
    cache._setSessionItem = function(name, value, expires) {
        if (!NOCACHE && window.sessionStorage) {
            window.sessionStorage.setItem(name, JSON.stringify({
                ts: Date.now(),
                expires: expires || SESSION_EXPIRES,
                value: value
            }));
            log(name + ' set in sessionStorage');
        } else {
            log('sessionStorage not available or option NOCACHE set');
        }
    };

    /**
     * Gets an item from browser session storage
     * @param name
     * @returns {*}
     * @private
     */
    cache._getSessionItem = function(name) {
        if(!NOCACHE && window.sessionStorage) {
            var item = JSON.parse(window.sessionStorage.getItem(name));
            if ((!item) || (item.ts && item.expires && item.ts + 1000 * item.expires < Date.now())) {
                if (item) {
                    window.sessionStorage.removeItem(name);
                    log('cache has expired for ' + name);
                }
                return NULL;
            }
            log(name + ' retrieved from sessionStorage');
            return item.value;
        } else {
            log('sessionStorage not available or option NOCACHE set');
            return NULL;
        }
    };

    /**
     * Removes an item from browser session storage
     * @param regexp
     * @private
     */
    cache._removeSessionItem = function(regexp) {
        if(window.sessionStorage) {
            if (!(regexp instanceof RegExp)) {
                regexp = new RegExp(regexp);
            }
            for (var i = 0; i < window.sessionStorage.length; i++) {
                var key = window.sessionStorage.key(i);
                if (regexp.test(key)) {
                    window.sessionStorage.removeItem(key);
                    log(key + ' removed from sessionStorage');
                }
            }
        }
    };

    /**
     * Get the (un)authenticated user
     */
    cache.getMe = function() {
        var dfd = $.Deferred(),
            me = cache._getSessionItem(ME),
            token = rapi.util.getAccessToken();
        if (token && me && me.id === NULL) {
           //remove unauthenticated me, since we now have a valid token
            cache.removeMe();
            me = NULL;
        }
        if(me) {
            setTimeout(function() {
                dfd.resolve(me);
            }, 0);
        } else {
            rapi.v1.user.getMe({fields: 'firstName lastName picture'})
                .done(function(response) {
                    cache.removeMyFavourites();
                    cache._setSessionItem(ME, response);
                    dfd.resolve(response);
                })
                .fail(function(xhr, status, error) {
                    if (xhr.status === 401) { //Unauthorised = not authenticated
                        var response =  {id: NULL};
                        cache.removeMyFavourites();
                        rapi.util.clearToken(); //Token is necessarily invalid if user.getMe failed
                        cache._setSessionItem(ME, response);
                        dfd.resolve(response);
                    } else { //any other error
                        dfd.reject(xhr, status, error); //be consistent with $.ajax in case of error
                    }
                });
        }
        return dfd.promise();
    };

    /**
     * Remove the authenticated user from cache
     * Also remove his favourites, but not his token
     */
    cache.removeMe = function() {
        cache._removeSessionItem(ME);
        cache._removeSessionItem(FAVOURITES);
    };

    /**
     * Get a list of categories
     * @param locale (ISO code)
     */
    cache.getAllCategories = function(locale) {
        var categories = cache._getLocalItem(CATEGORIES + locale);
        if ($.isArray(categories)) {
            var dfd = $.Deferred();
            setTimeout(function() {
                dfd.resolve({ total: categories.length, data: categories });
            }, 0);
            return dfd.promise();
        } else {
            return rapi.v1.taxonomy.getAllCategories(locale).done(function(response) {
                cache._setLocalItem(CATEGORIES + locale, response.data); //response = { total: ..., data: [...] }
            });
        }
    };

    /**
     * Get a hierarchy of categories
     * @param locale
     */
    cache.getCategoryHierarchy = function(locale) {
        var dfd = $.Deferred();
        cache.getAllCategories(locale)
            .done(function(response){
                var hash = {};
                $.each(response.data, function (index, value) {
                    //See http://docs.telerik.com/kendo-ui/getting-started/web/treeview/overview#item-definition
                    //See http://docs.telerik.com/kendo-ui/getting-started/web/treeview/binding-to-flat-data#method-1-initial-pre-processing-of-all-data
                    var item = {
                            id: value.id,
                            name: value.name,
                            icon: value.icon,
                            type: 2
                        },
                        id = value.id,
                        parentId = value.parentId || 'root';
                    hash[id] = hash[id] || [];
                    hash[parentId] = hash[parentId] || [];
                    item.items = hash[id];
                    hash[parentId].push(item);
                });
                dfd.resolve(hash.root);
            })
            .fail(function(xhr, status, error){
                dfd.reject(xhr, status, error);
            });
        return dfd.promise();
    };

    /**
     * Get all my favourites
     * @param locale (ISO code)
     */
    cache.getAllMyFavourites = function(locale) {
        var dfd,
            me = cache._getSessionItem(ME),
            favourites = cache._getSessionItem(FAVOURITES + locale);
        if ($.isArray(favourites)) {
            dfd = $.Deferred();
            setTimeout(function () {
                dfd.resolve({total: favourites.length, data: favourites});
            }, 0);
            return dfd.promise();
        } else if (me && me.id === NULL) {
            dfd = $.Deferred();
            setTimeout(function () {
                dfd.resolve({total: 0, data: []});
            }, 0);
            return dfd.promise();
        } else {
            return rapi.v1.user.getAllMyFavourites(locale).done(function (response) {
                cache._setSessionItem(FAVOURITES + locale, response.data); //response = { total: ..., data: [...] }
            });
        }
    };

    /**
     * Returns a hierarchy of favourites
     * @param locale
     */
    cache.getFavouriteHierarchy = function(locale) {
        var dfd = $.Deferred();
        cache.getAllMyFavourites(locale)
            .done(function(response){
                var favourites = response.data;
                $.each(favourites, function(index, favourite) {
                    delete favourite.language;
                    favourite.icon = 'star';
                    favourite.type = 3;
                    //We might consider subtypes in the future to organize favourites (searches, users, summaries, channels, ...)
                });
                dfd.resolve(favourites);
            })
            .fail(function(xhr, status, error){
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
    cache.removeMyFavourites = function(locale) {
        cache._removeSessionItem(FAVOURITES + locale);
    };

}(this, jQuery));

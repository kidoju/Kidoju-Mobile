/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */


/**
 * app.cache caches in localStorage:
 * - categories
 * - most viewed content
 * - most recent content
 * - highest rated content
 * in a format that is ready to be displayed by kendo UI widgets
 * TODO: correct after reviewing http://www.html5rocks.com/en/mobile/workingoffthegrid/
 * especially to consider network connection state
 */

(function (win, $, undefined) {

    'use strict';

    var app = win.app = win.app || {},
        cache = app.cache = app.cache || {},
        rapi = app.rapi,
        FUNCTION = 'function',
        CATEGORIES = 'categories',
        NUMBER = 'number',

        MODULE = 'app.cache.js: ',
        NOCACHE = false,
        DEBUG = true; //IMPORTANT: Set DEBUG = false in production

    /**
     * Logs a message
     * @param message
     */
    function log(message) {
        if (DEBUG && win.console && (typeof win.console.log === FUNCTION)) {
            win.console.log(MODULE + message);
        }
    }

    /**
     * Get categories
     * @param isoCode
     */
    cache.getCategories = function(isoCode) {
        var dfd = $.Deferred(),
            cache = win.localStorage.getItem(CATEGORIES);
        if (cache) {
            cache = JSON.parse(cache);
        }
        if (!NOCACHE && cache && //There is a cache and caching is not deactivated
            ($.type(cache.ts) === NUMBER) && (Date.now() < cache.ts + 7*24*60*60*1000) && //It is less than 7 days old
            $.isArray(cache.data) && cache.language === isoCode ) { //It has data relevant to isoCode
            //TODO: also test network if device is phonegap
            log('recent categories found in cache for ' + isoCode);
            dfd.resolve(cache.data);
        } else {
            log('updating cache with categories for ' + isoCode);
            rapi.v1.taxonomy.getCategories(isoCode).done(function(categories) {
                var hash = {};
                $.each(categories, function (index, value) {
                    //See http://docs.telerik.com/kendo-ui/getting-started/web/treeview/overview#item-definition
                    //See http://docs.telerik.com/kendo-ui/getting-started/web/treeview/binding-to-flat-data#method-1-initial-pre-processing-of-all-data
                    var item = {
                            id: value._id,
                            text: value.name
                            // if specified, renders the item as a link. (<a href=""></a>)
                            // url: "/", //TODO
                            // renders a <img class="k-image" src="/images/icon.png" />
                            // imageUrl: "/images/icon.png", //TODO
                            // renders a <span class="k-sprite icon save" />
                            // spriteCssClass: "icon save",
                            // specifies whether the node text should be encoded or not
                            // encoded: false,
                            // specifies whether the item is initially expanded (subject to child nodes)
                            // expanded: true,
                            // specifies whether the item checkbox is initially checked (subject to checkbox template)
                            // checked: true,
                            // specifies whether the item is initially selected
                            // selected: true,
                            // indicates the sub-items of the item
                            // items: []
                        },
                        id = value._id,
                        parentId = value.parent_id || 'root';

                    hash[id] = hash[id] || [];
                    hash[parentId] = hash[parentId] || [];
                    item.items = hash[id];
                    hash[parentId].push(item);
                });
                cache = {ts:Date.now(), language: isoCode, data: hash.root};
                win.localStorage.setItem(CATEGORIES, JSON.stringify(cache));
                dfd.resolve(cache.data);
            }).fail(function(error) {
                dfd.reject(error);
            });
        }
        return dfd.promise();
    };

}(this, jQuery));
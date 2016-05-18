/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        '../vendor/kendo/cultures/kendo.culture.en-GB.js'
        // '../vendor/kendo/messages/kendo.messages.en-US.js',
        // '../messages/kidoju.messages.en.js'
    ], f);
})(function () {

    'use strict';

    (function () {
        var app = window.app = window.app || {};
        app.cultures = app.cultures || {};
        app.cultures.en = {
            // Drawer
            drawer: {
                categories: 'Explore',
                favourites: 'Favourites',
                scores: 'Scores',
                settings: 'Settings'
            },
            // Categories view
            // Summaries view
            // Settings view
            settings: {
                user: 'User',
                version: 'Version',
                language: 'Language',
                theme: 'Theme'
            }
        };
        window.kendo.culture('en-GB');
    }());

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

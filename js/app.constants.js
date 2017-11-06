/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */

(function (f, define) {
    'use strict';
    define([], f);
})(function () {

    'use strict';

    var app = window.app = window.app || {};

    (function () {

        var LANGUAGE = 'language';
        var THEME = 'theme';
        var UNDEFINED = 'undefined';
        var localStorage; // = window.localStorage;
        // An exception is catched when localStorage is explicitly disabled in browser settings (Safari Private Browsing)
        try { localStorage = window.localStorage; } catch (ex) {}


        // These constants lock the app to certain values
        app.constants = {
            appName: 'Kidoju',
            // The authorId to search summaries from (until we support organizationId)
            authorId: '',
            // The app language
            language: '',
            // The app theme
            theme: '',
            // The top categoryId
            topCategoryId: ''

            // TODO: We might also want the possibility to hide categories for museum apps

        };

        // Set locale
        if (typeof (app && app.i18n) !== UNDEFINED) {
            throw new Error('Load app.constants before app.i18n.');
        } else if (localStorage && app.constants.language) {
            localStorage.setItem(LANGUAGE, app.constants.language);
        }

        // Set theme
        if (typeof (app && app.theme) !== UNDEFINED) {
            throw new Error('Load app.constants before app.theme.');
        } else if (localStorage && app.constants.theme) {
            localStorage.setItem(THEME, app.constants.theme);
        }

    }());

    return app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

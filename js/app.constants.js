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

        // These constants lock the app to certain values

        app.constants = {
            // The authorId to search summaries from
            authorId: '',
            // The root categoryId
            categoryId: '',
            // The app language
            language: 'fr',
            // The organizationId to search summaries from
            // organizationId: '', // For future use
            // The app theme
            theme: ''
        }

    }());

    return app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

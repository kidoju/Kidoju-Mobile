/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */

(function (f, define) {
    'use strict';
    define([
        './window.assert'
    ], f);
})(function () {

    'use strict';

    var app = window.app = window.app || {};

    (function () {

        var assert = window.assert;
        var LANGUAGE = 'language';
        var THEME = 'theme';
        var UNDEFINED = 'undefined';
        // First 4 bytes define the language
        // Following 4 bytes define the selected top category
        var LEVEL_CHARS = 4;
        var TOP_LEVEL_CHARS = 2 * LEVEL_CHARS;
        var RX_TOP_LEVEL_MATCH = new RegExp('^[a-z0-9]{' + TOP_LEVEL_CHARS + '}0{' + (24 - TOP_LEVEL_CHARS) + '}$');
        var RX_LANGUAGE = /^[a-z]{2}$/;
        var RX_MONGODB_ID = /^[a-f0-9]{24}$/;
        var localStorage; // = window.localStorage;
        // An exception is catched when localStorage is explicitly disabled in browser settings (Safari Private Browsing)
        try { localStorage = window.localStorage; } catch (ex) {}

        // These constants lock the app to certain values
        app.constants = {
            appName: 'Kidoju',
            // The authorId to search summaries from (until we support organizationId)
            authorId: undefined, // '56d6ee31bc039c1a00062950',
            // The app language
            language: undefined, // 'fr',
            // TODO: logo to display in drawer...
            // The root categoryId
            rootCategoryId: {
                en: undefined,
                // en: '000100010000000000000000', // General Knowledge
                // en: '000100020000000000000000', // Reception
                // en: '000100030000000000000000', // Year 1
                fr: undefined
                // fr: '000200010000000000000000' // Culture Générale
                // fr: '000200030000000000000000' // Maternelle
                // fr: '000200040000000000000000' // CP
            },
            // The app theme
            theme: undefined // 'flat'
            // TODO: We might also want the possibility to hide categories for museum apps
        };

        // Assert values
        if ($.type(app.constants.authorId) !== UNDEFINED) {
            assert.match(RX_MONGODB_ID, app.constants.authorId, assert.format(assert.messages.match.equal, 'app.constants.authorId', RX_MONGODB_ID));
        }
        if ($.type(app.constants.language) !== UNDEFINED) {
            assert.match(RX_LANGUAGE, app.constants.language, assert.format(assert.messages.match.equal, 'app.constants.language', RX_LANGUAGE));
        }
        if ($.type(app.constants.rootCategoryId.en) !== UNDEFINED) {
            assert.match(RX_TOP_LEVEL_MATCH, app.constants.rootCategoryId.en, assert.format(assert.messages.match.equal, 'app.constants.rootCategoryId.en', RX_TOP_LEVEL_MATCH));
        }
        if ($.type(app.constants.rootCategoryId.fr) !== UNDEFINED) {
            assert.match(RX_TOP_LEVEL_MATCH, app.constants.rootCategoryId.fr, assert.format(assert.messages.match.equal, 'app.constants.rootCategoryId.fr', RX_TOP_LEVEL_MATCH));
        }

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

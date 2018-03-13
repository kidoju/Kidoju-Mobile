/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
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

    /* This function has too many statements. */
    /* jshint -W071 */

    /* This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

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

        /**
         * These constants allow specialized versions of the app
         * Note:  This replaces app.constants introduced by app.config.jsx
         * @type {}
         */
        app.constants = {
            // The mobile application id corresponding to the app scheme in mongoDB
            appId: '5aa7b81cb706873118ffb5b4',
            // The application name
            appName: 'Kidoju',
            // TODO: logo to display in drawer...
            // The application scheme
            appScheme: 'com.kidoju.mobile',
            // For app store ratings
            appStoreUrl: {
                // TODO: these are all for testing with the twitter app
                // ----------------------------------------------------------------------------------------
                // For iOS, see:
                // https://developer.apple.com/library/content/qa/qa1629/_index.html
                // https://developer.apple.com/library/content/qa/qa1633/_index.html
                // ios: 'itms-apps://itunes.apple.com/app/viewContentsUserReviews/id333903271?action=write-review',
                // ios: 'itms-apps://itunes.apple.com/app/id333903271?action=write-review',
                ios: 'itms-apps://itunes.apple.com/app/id1185442548?action=write-review',
                // ----------------------------------------------------------------------------------------
                // For Android, see:
                // https://developer.android.com/distribute/marketing-tools/linking-to-google-play.html
                // android: 'market://details?id=com.twitter.android',
                android: 'market://details?id=com.kidoju.mobile',
                // ----------------------------------------------------------------------------------------
                // For Fire OS, see:
                // https://developer.amazon.com/blogs/post/Tx3A1TVL67TB24B/Linking-To-the-Amazon-Appstore-for-Android.html
                // 'amazon-fireos': 'amzn://apps/android?p=com.twitter.android',
                'amazon-fireos': 'amzn://apps/android?p=com.kidoju.mobile',
                // ----------------------------------------------------------------------------------------
                // For windows (untested)
                windows: 'ms-windows-store://pdp/?ProductId=9wzdncrfj140'
            },
            // Google analytics
            gaTrackingId: 'UA-63281999-4',
            // Feedback url
            feedbackUrl: 'https://www.kidoju.com/support/{0}/contact?about={1}', // TODO use gitter?
            // Help system
            helpUrl: 'https://help.kidoju.com/', // TODO Add Mobile section
            // The authorId to search summaries from (until we support organizationId)
            authorId: undefined, // '56d6ee31bc039c1a00062950',
            // The app language
            language: undefined, // 'fr',
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
            assert.match(RX_MONGODB_ID, app.constants.authorId, assert.format(assert.messages.match.default, 'app.constants.authorId', RX_MONGODB_ID));
        }
        if ($.type(app.constants.language) !== UNDEFINED) {
            assert.match(RX_LANGUAGE, app.constants.language, assert.format(assert.messages.match.default, 'app.constants.language', RX_LANGUAGE));
        }
        if ($.type(app.constants.rootCategoryId.en) !== UNDEFINED) {
            assert.match(RX_TOP_LEVEL_MATCH, app.constants.rootCategoryId.en, assert.format(assert.messages.match.default, 'app.constants.rootCategoryId.en', RX_TOP_LEVEL_MATCH));
        }
        if ($.type(app.constants.rootCategoryId.fr) !== UNDEFINED) {
            assert.match(RX_TOP_LEVEL_MATCH, app.constants.rootCategoryId.fr, assert.format(assert.messages.match.default, 'app.constants.rootCategoryId.fr', RX_TOP_LEVEL_MATCH));
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

    /* jshint +W074 */
    /* jshint +W071 */

    return app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

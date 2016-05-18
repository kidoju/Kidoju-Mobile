/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */

if (typeof(require) === 'function') {

    // Load kendo CSS
    require('../styles/vendor/kendo/web/kendo.common.less');
    // require('../styles/vendor/kendo/web/kendo.rtl.less');
    require('../styles/vendor/kendo/web/kendo.default.less');
    require('../styles/vendor/kendo/mobile/kendo.mobile.all.less');

    // Load app CSS
    require('../styles/app.mobile.less');
}

(function (f, define) {
    'use strict';
    define([
        './vendor/kendo/kendo.core',
        './vendor/kendo/kendo.fx',
        './vendor/kendo/kendo.userevents',
        './vendor/kendo/kendo.draganddrop',
        './vendor/kendo/kendo.mobile.scroller',
        './vendor/kendo/kendo.data',
        './vendor/kendo/kendo.binder',
        './vendor/kendo/kendo.view',
        './vendor/kendo/kendo.mobile.view',
        './vendor/kendo/kendo.mobile.loader',
        './vendor/kendo/kendo.mobile.pane',
        './vendor/kendo/kendo.router',
        './vendor/kendo/kendo.mobile.application',
        './vendor/kendo/kendo.mobile.drawer',
        './vendor/kendo/kendo.mobile.button',
        './vendor/kendo/kendo.mobile.listview',
        './vendor/kendo/kendo.mobile.navbar',
        './vendor/kendo/kendo.mobile.switch',
        './vendor/kendo/kendo.touch',
        './window.assert',
        './window.logger',
        './app.logger',
        // './app.i18n',
        './app.rapi',
        './app.cache'
    ], f);
})(function () {

    'use strict';

    (function ($, undefined) {

        var kendo = window.kendo;
        var app = window.app = window.app || {};
        var mobile = app.mobile = app.mobile || {};
        var UNDEFINED = 'undefined';

        /*******************************************************************************************
         * viewModel
         *******************************************************************************************/

        mobile.viewModel = kendo.observable({

            /**
             * Categories
             */
            categories: [
                { name: 'Mathematics' },
                { name: 'Physics' },
                { name: 'English' }
            ],
            
            /**
             * Summaries
             */
            summaries: [
                { title: 'Test of Mathematics' },
                { title: 'Test of Physics' },
                { title: 'Test of English' },
                { title: 'Test of Geography' },
                { title: 'Test of History' }
            ],

            /**
             * Favourites
             */
            favourites: [
                { title: 'Test of Mathematics' },
                { title: 'Test of Physics' },
                { title: 'Test of English' },
                { title: 'Test of Geography' },
                { title: 'Test of History' }
            ],

            /**
             * Scores
             */
            scores: [
                { title: 'Test of Mathematics', score: 10 },
                { title: 'Test of Physics', score: 20 },
                { title: 'Test of English', score: 30 },
                { title: 'Test of Geography', score: 40 },
                { title: 'Test of History', score: 50 }
            ],

            /**
             * Languages
             */
            languages: [
                { value: 'en', text: 'English' },
                { value: 'fr', text: 'French' }
            ],

            /**
             * Themes
             */
            themes: [
                'flat',
                'nova'
            ],

            /**
             * User settings
             */
            settings: {
                picture: '',
                userName: 'Jacques L. Chereau',
                version: 'v0.0.10',
                language: 'en'
            }


        });

        /*******************************************************************************************
         * Event handler and utility methods
         *******************************************************************************************/

        /**
         * Event Handler trigger when the device is ready (this is a cordova event)
         * Loads the application
         */
        mobile.onDeviceReady = function() {
            mobile.application = new kendo.mobile.Application($('#phone'), { platform: 'android-dark', skin: 'nova' });
        };

        mobile._setNavBar = function (e) {
            var showDrawerButton = false;
            var showBackButton = false;
            var showSearchButton = false;
            var showSyncButton = false;
            var showSelectionButtons = false;
            switch (e.view.id) {
                case '/':
                case '#phone-categories':
                    showDrawerButton = true;
                    showBackButton = true;  // this depends whether category has parent id or not
                    showSearchButton = true;
                    break;
                case '#phone-summaries':
                    showDrawerButton = true;
                    showBackButton = true;
                    showSearchButton = true;
                    showSelectionButtons = true;
                    break;
                case '#phone-favourites':
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case '#phone-scores':
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case '#phone-settings':
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case '#phone-player':
                    showDrawerButton = true;
                    // Add playbar buttons + page numbers
                    break;
            }
            $('#phone-main-layout-drawer').css({ display: showDrawerButton ? 'inline-block': 'none' });
            $('#phone-main-layout-back').css({ display: showBackButton ? 'inline-block': 'none' });
            $('#phone-main-layout-search').css({ display: showSearchButton ? 'inline-block': 'none' });
            $('#phone-main-layout-sync').css({ display: showSyncButton ? 'inline-block': 'none' });
            $('#phone-main-layout-selection').css({ display: showSelectionButtons ? 'table' : 'none' });
        };

        /**
         * Event handler triggered when showing the Categories view
         * @param e
         */
        mobile.onCategoriesViewShow = function (e) {
            mobile._setNavBar(e);
        };

        /**
         * Event handler triggered when showing the Summaries view
         * @param e
         */
        mobile.onSummariesViewShow = function (e) {
            mobile._setNavBar(e);
        };

        /**
         * Event handler triggered when showing the Favourites view
         * @param e
         */
        mobile.onFavouritesViewShow = function (e) {
            mobile._setNavBar(e);
        };

        /**
         * Event handler triggered when showing the Settings view
         * @param e
         */
        mobile.onSettingsViewShow = function (e) {
            mobile._setNavBar(e);
        };

        /**
         * Event handler triggered when showing the Player view
         * @param e
         */
        mobile.onPlayerViewShow = function (e) {
            mobile._setNavBar(e);
        };

        /*******************************************************************************************
         * Application initialization
         *******************************************************************************************/

        $(document).ready(function() {
            if ($.type(window.device) !== UNDEFINED && $.type(window.device.cordova) !== UNDEFINED) {
                //Wait for Cordova to load
                document.addEventListener('deviceready', mobile.onDeviceReady, false);
            } else {
                //no need to wait when running/debugging on a PC
                mobile.onDeviceReady();
            }
        });


    }(window.jQuery));

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
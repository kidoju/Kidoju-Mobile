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

    // Load config
    require('./app.config.jsx?env=' + __NODE_ENV__);
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
        './vendor/kendo/kendo.popup',
        './vendor/kendo/kendo.list',
        './vendor/kendo/kendo.dropdownlist',
        './vendor/kendo/kendo.binder',
        './vendor/kendo/kendo.view',
        './vendor/kendo/kendo.mobile.view',
        './vendor/kendo/kendo.mobile.loader',
        './vendor/kendo/kendo.mobile.pane',
        './vendor/kendo/kendo.router',
        './vendor/kendo/kendo.mobile.application',
        './vendor/kendo/kendo.mobile.drawer',
        './vendor/kendo/kendo.mobile.button',
        './vendor/kendo/kendo.mobile.buttongroup',
        './vendor/kendo/kendo.mobile.listview',
        './vendor/kendo/kendo.mobile.navbar',
        './vendor/kendo/kendo.mobile.switch',
        './vendor/kendo/kendo.touch',
        './window.assert',
        './window.logger',
        './app.logger',
        './app.i18n',
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
        var STRING = 'string';
        var ARRAY = 'array';
        var CHANGE = 'change';
        var LOCALE = 'settings.language';
        var THEME = 'settings.theme';

        /*******************************************************************************************
         * viewModel
         *******************************************************************************************/

        mobile.viewModel = kendo.observable({

            /**
             * Categories
             * Note: this is only the list displayed, the whole hierarchy is stored in _categories
             */
            categories: [],

            /**
             * Selected category
             */
            category: undefined,
            
            /**
             * Summaries
             */
            summaries: [],

            /**
             * Favourites
             */
            favourites: [],

            /**
             * Selected summary
             */
            summary: undefined,

            // TODO : versions?

            /**
             * Selected version
             */
            version: undefined,

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
                { value: 'flat', text: 'Flat' },
                { value: 'nova', text: 'Nova' }
            ],

            /**
             * User settings
             */
            settings: {
                user: 'Jacques L. Chereau',
                version: 'v0.2.0',
                language: 'en',
                theme: 'nova'
            }

        });

        /**
         * Event handler for the viewModel change event
         */
        mobile.viewModel.bind(CHANGE, function (e) {
            if (e.field === LOCALE) {
               mobile._localize(e.sender.get(LOCALE));
            } else if (e.field === THEME) {
               mobile._theme(e.sender.get(THEME));
            }
        });

        /*******************************************************************************************
         * Utility methods (prefixed with underscore)
         *******************************************************************************************/

        /**
         * Localize the user interface
         * @param locale
         * @private
         */
        mobile._localize = function (locale) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, locale, kendo.format(assert.messages.enum.default, 'locale', app.locales));
            app.i18n.load(locale).then(function() {
                mobile._localizeDrawer(locale);
                mobile._localizeSettings(locale);
            });
        };

        /**
         * Localize the drawer
         * @param locale
         * @private
         */
        mobile._localizeDrawer = function (locale) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, locale, kendo.format(assert.messages.enum.default, 'locale', app.locales));
            var drawer = app.i18n.culture.drawer;
            var drawerElement = $('#phone-drawer');
            drawerElement.find('ul>li>a.km-listview-link:eq(0)').text(drawer.categories);
            drawerElement.find('ul>li>a.km-listview-link:eq(1)').text(drawer.favourites);
            drawerElement.find('ul>li>a.km-listview-link:eq(2)').text(drawer.scores);
            drawerElement.find('ul>li>a.km-listview-link:eq(3)').text(drawer.settings);
        };

        /**
         * Localize the settings view
         * @param locale
         * @private
         */
        mobile._localizeSettings = function (locale) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, locale, kendo.format(assert.messages.enum.default, 'locale', app.locales));
            var settings = app.i18n.culture.settings;
            var viewElement = $('#phone-settings');
            viewElement.find('ul>li>label>span:not(.k-widget):eq(0)').text(settings.user);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(1)').text(settings.version);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(2)').text(settings.language);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(3)').text(settings.theme);
        };

        /**
         * Theme the user interface
         * @param theme
         * @private
         */
        mobile._theme = function (theme) {
            // TODO
        };
        
        /**
         * Show/hide relevant navbar commands
         * @param e
         * @private
         */
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

        /**
         * Event handler triggered when initializing the Categories view (only occurs once)
         * @param e
         */
        mobile.onCategoriesViewInit = function (e) {
            app.cache.getCategoryHierarchy('en')
                .done(function (result) {
                    mobile.viewModel._categories = result;
                    mobile.viewModel.set('categories', mobile.viewModel._categories);
                })
                .fail(function (xhr, status, error) {
                    // TODO
                });
        };

        /**
         * Event handler triggered when tapping the Categories listview
         * @param e
         */
        mobile.onCategoriesListViewClick = function (e) {
            debugger;
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
         * Event handler triggered when changing the language in the Settings view
         * @param e
         */
        mobile.onSettingsLanguageChange = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.ui.DropDownList, e.sender, kendo.format(assert.messages.instanceof.default, 'e.sender', 'kendo.ui.DropDownList'));
            var locale = e.sender.value();
            mobile._localize(locale);
        };

        /**
         * Event handler triggered when changing the theme in the Settings view
         * @param e
         */
        mobile.onSettingsThemeChange = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.ui.DropDownList, e.sender, kendo.format(assert.messages.instanceof.default, 'e.sender', 'kendo.ui.DropDownList'));
            var theme = e.sender.value();
            mobile._theme(theme);
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
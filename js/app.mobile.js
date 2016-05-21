/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false, __NODE_ENV__: false */

if (typeof(require) === 'function') {

    // Load CSS
    require('../styles/vendor/kendo/web/kendo.common.less');
    require('../styles/vendor/kendo/web/kendo.nova.less');
    require('../styles/vendor/kendo/mobile/kendo.mobile.all.less');
    require('../styles/kidoju.widgets.mediaplayer.less');
    require('../styles/kidoju.widgets.messagebox.less');
    require('../styles/kidoju.widgets.multicheckbox.less');
    require('../styles/kidoju.widgets.playbar.less');
    require('../styles/kidoju.widgets.quiz.less');
    require('../styles/kidoju.widgets.rating.less');
    require('../styles/kidoju.widgets.stage.less');
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
        './kidoju.data',
        './kidoju.tools',
        // './kidoju.widgets.chargrid',
        './kidoju.widgets.connector',
        './kidoju.widgets.dropzone',
        './kidoju.widgets.markdown',
        './kidoju.widgets.mathexpression',
        './kidoju.widgets.mediaplayer',
        './kidoju.widgets.multicheckbox',
        './kidoju.widgets.playbar',
        './kidoju.widgets.quiz',
        './kidoju.widgets.rating',
        // './kidoju.widgets.social',
        './kidoju.widgets.stage',
        './app.logger',
        './app.i18n',
        './app.models'
    ], f);
})(function () {

    'use strict';

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        var kendo = window.kendo;
        var kidoju = window.kidoju;
        var assert = window.assert;
        var logger = new window.Logger('app.mobile');
        var support = kendo.support;
        var app = window.app = window.app || {};
        var mobile = app.mobile = app.mobile || {};
        var Page = kidoju.data.Page;
        var PageComponent = kidoju.data.PageComponent;
        var PageCollectionDataSource = kidoju.data.PageCollectionDataSource;
        var PageComponentCollectionDataSource = kidoju.data.PageComponentCollectionDataSource;
        var UNDEFINED = 'undefined';
        var STRING = 'string';
        var ARRAY = 'array';
        var CHANGE = 'change';
        var LOCALE = 'settings.language';
        var DEFAULT_LOCALE = 'en';
        var THEME = 'settings.theme';
        var DEFAULT_THEME = 'nova';
        var HASH = '#';
        var PHONE = 'phone';
        var TABLET = 'tablet';
        var DEVICE_SELECTOR = HASH + PHONE;
        // var DEVICE_SELECTOR = HASH + (support.mobileOS && support.mobileOS.tablet ? TABLET : PHONE)
        var LAYOUT = {
            MAIN: '-main-layout'
        };
        var VIEW = {
            ACTIVITIES: '-activities',
            CATEGORIES: '-categories',
            DRAWER: '-drawer',
            FAVOURITES: '-favourites',
            PLAYER: '-player',
            SETTINGS: '-settings',
            SUMMARIES: '-summaries'
        };
        var DISPLAY = {
            INLINE: 'inline-block',
            NONE: 'none',
            TABLE: 'table'
        };
        var CURRENT = 'current';
        var SELECTED_PAGE = 'selectedPage';
        var PAGES_COLLECTION = 'version.stream.pages';

        /*******************************************************************************************
         * Global error handler
         *******************************************************************************************/
        // TODO See app.logger

        /*******************************************************************************************
         * viewModel
         *******************************************************************************************/

        var viewModel = mobile.viewModel = kendo.observable({

            /**
             * Categories
             * Note: this is only the list displayed, the whole hierarchy is stored in _categories
             */
            categories: [],

            /**
             * Summaries
             */
            summaries: new app.models.LazySummaryDataSource(),

            /**
             * Favourites
             */
            favourites: [],

            /**
             * Versions
             */
            versions: new app.models.LazyVersionDataSource(),

            /**
             * Selected version
             */
            version: new app.models.Version(),

            /**
             * The selected page displayed in the player
             */
            selectedPage: undefined,

            /**
             * Current test
             */
            current: { test: undefined },

            /**
             * Activities (scores to start with)
             */
            activities: [
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
                { value: 'fiori', text: 'Fiori' },
                { value: 'flat', text: 'Flat' },
                { value: 'material', text: 'Material' },
                { value: '', text: 'Native' }, // TODO light and Dark themes?
                { value: 'nova', text: 'Nova' },
                { value: 'office365', text: 'Office 365' }
            ],

            /**
             * User settings
             */
            settings: {
                user: 'TODO',
                version: 'v0.2.0',
                language: DEFAULT_LOCALE,
                theme: DEFAULT_THEME
            },

            /**
             * Load categories
             */
            loadCategories: function () {
                return app.cache.getCategoryHierarchy('en')
                    .done(function (result) {
                        viewModel._categories = result;
                        viewModel.set('categories', viewModel._categories);
                    })
                    .fail(function (xhr, status, error) {
                        // TODO
                    });
            },

            /**
             * Load settings from local storage
             */
            loadSettings: function () {
                // TODO
            },

            /**
             * Load lazy summaries
             * @param query
             */
            loadLazySummaries: function (query) {
                return viewModel.summaries.query(query)
                    .done(function () {
                        // TODO
                    })
                    .fail(function (xhr, status, error) {
                        // app.notification.error(i18n.culture.player.notifications.versionLoadFailure);
                        logger.error({
                            message: 'error loading summaries',
                            method: 'viewModel.loadLazySummaries',
                            data: { query: query, status: status, error: error } // TODO xhr.responseText
                        });
                    });
            },

            /**
             * Load version (and stream pages)
             * Copied from app.player.js
             * @param summaryId
             * @param versionId
             * @returns {*}
             */
            loadVersion: function (summaryId, versionId) {

                function versionLoadFailure(xhr, status, error) {
                    dfd.reject(xhr, status, error);
                    // app.notification.error(i18n.culture.player.notifications.versionLoadFailure);
                    logger.error({
                        message: 'error loading version',
                        method: 'viewModel.loadVersion',
                        data: { summaryId: summaryId, versionId: versionId, status: status, error: error } // TODO xhr.responseText
                    });
                }

                var dfd = $.Deferred();

                // Load version and pages
                viewModel.version.load(summaryId, versionId)
                    .done(function () {
                        // Load stream
                        viewModel.version.stream.load()
                            .done(function () {
                                var promises = [];
                                var pageCollectionDataSource = viewModel.get(PAGES_COLLECTION);
                                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                                $.each(pageCollectionDataSource.data(), function (idx, page) {
                                    assert.instanceof(kidoju.data.Page, page, kendo.format(assert.messages.instanceof.default, 'page', 'kidoju.data.Page'));
                                    promises.push(page.load());
                                });
                                $.when(promises)
                                    .done(dfd.resolve)
                                    .fail(versionLoadFailure);
                            })
                            .fail(versionLoadFailure);
                    })
                    .fail(versionLoadFailure);

                return dfd.promise();
            },

            /**
             * Load lazy versions of a summary
             * @param summaryId
             */
            loadLazyVersions: function (summaryId) {
                return viewModel.versions.load({ summaryId: summaryId })
                    .done(function () {
                        // TODO
                    })
                    .fail(function (xhr, status, error) {
                        // app.notification.error(i18n.culture.finder.notifications.versionsLoadFailure);
                        logger.error({
                            message: 'error loading versions',
                            method: 'viewModel.loadLazyVersions',
                            data: { summaryId: summaryId, status: status, error: error } // TODO: xhr.responseText
                        });
                    });
            },

            /**
             * Save settings to local storage
             */
            saveSettings: function () {
                // TODO
            },

            /**
             * Set current test
             */
            setCurrent: function () {
                viewModel.set(CURRENT, {
                    test: viewModel.version.stream.pages.getTestFromProperties(),
                    version : {
                        summaryId: viewModel.get('version.summaryId'),
                        versionId: viewModel.get('version.id')
                    }
                });
            }

        });

        /**
         * Event handler for the viewModel change event
         */
        viewModel.bind(CHANGE, function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isOptionalObject.default, 'e'));
            assert.type(STRING, e.field, kendo.format(assert.messages.type.default, 'e.field', STRING));
            assert.instanceof(kendo.Observable, e.sender, kendo.format(assert.messages.instanceof.default, 'e.sender', 'kendo.Observable'));
            switch (e.field) {
                case LOCALE:
                    mobile._localize(e.sender.get(LOCALE));
                    break;
                case THEME:
                    mobile._theme(e.sender.get(THEME));
                    break;
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
            app.i18n.load(locale).then(function () {
                mobile._localizeDrawer(locale);
                mobile._localizeSettings(locale);
            });
        };

        /**
         * Set the navigation bar title
         * @param locale
         * @private
         */
        mobile._setNavBarTitle = function (view, title) {
            assert.instanceof(kendo.mobile.ui.View, view, kendo.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            assert.type(STRING, title, kendo.format(assert.messages.type.default, 'title', STRING));
            var navbarWidget = view.header.find('.km-navbar').data('kendoMobileNavBar');
            navbarWidget.title(title);
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
            var drawerElement = $(DEVICE_SELECTOR + VIEW.DRAWER);
            drawerElement.find('ul>li>a.km-listview-link:eq(0)').text(drawer.categories);
            drawerElement.find('ul>li>a.km-listview-link:eq(1)').text(drawer.favourites);
            drawerElement.find('ul>li>a.km-listview-link:eq(2)').text(drawer.activities);
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
            var viewElement = $(DEVICE_SELECTOR + VIEW.SETTINGS);
            viewElement.attr(kendo.attr('title'), settings.title);
            mobile._setNavBarTitle(viewElement.data('kendoMobileView'), settings.viewTitle);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(0)').text(settings.user);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(1)').text(settings.version);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(2)').text(settings.language);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(3)').text(settings.theme);
        };

        /**
         * Converts params into a kendo.data.DataSource filter
         * @param params
         * @private
         */
        mobile._getDataFilter = function (params) {
            // TODO If it gets more complicated, consider using $.deparam from app.utils.js in Kidoju.WebApp
            assert.isPlainObject(params, kendo.format(assert.messages.isPlainObject.default, 'params'));
            var field = params['filter[field]'];
            var operator = params['filter[operator]'];
            var value = params['filter[value]'];
            if ($.type(field) === STRING && $.type(operator) === STRING && $.type(value) === STRING) {
                return { field: field, operator: operator, value: value };
            }
        };

        /**
         * Resize player
         * @param view
         * @private
         */
        mobile._resizePlayer = function (view) {
            assert.instanceof(kendo.mobile.ui.View, view, kendo.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            var height = view.content.height();
            var width = view.content.width();
            var stageElement = view.content.find('.kj-stage');
            var stageWrapper = stageElement.parent();
            var markdownElement = view.content.find('.kj-markdown');
            var markdownWrapper = markdownElement.parent();
            if (height > width) {
                stageElement.css('transform', 'scale(' + width / 1024 + ')');
            } else {
                stageElement.css('transform', 'scale(' + height / 768 + ')');
            }
        };

        /* This function's cyclomatic complexity is too high. */
        /* jshint -W074 */

        /**
         * Show/hide relevant navbar commands
         * @param view
         * @private
         */
        mobile._setNavBar = function (view) {
            /* jshint maxcomplexity: 13 */
            assert.instanceof(kendo.mobile.ui.View, view, kendo.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            var showDrawerButton = false;
            var showBackButton = false;
            var showSearchButton = false;
            var showSyncButton = false;
            var showSelectionButtons = false;
            switch (view.id) {
                case DEVICE_SELECTOR + VIEW.ACTIVITIES:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case '/':
                case DEVICE_SELECTOR + VIEW.CATEGORIES:
                    showDrawerButton = true;
                    showSearchButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.SUMMARIES:
                    showDrawerButton = true;
                    showBackButton = true;
                    showSearchButton = true;
                    showSelectionButtons = true;
                    break;
                case DEVICE_SELECTOR + VIEW.FAVOURITES:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.PLAYER:
                    showDrawerButton = true;
                    // Add playbar buttons + page numbers
                    break;
                case DEVICE_SELECTOR + VIEW.SETTINGS:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
            }
            $(DEVICE_SELECTOR + LAYOUT.MAIN + '-drawer').css({ display: showDrawerButton ? DISPLAY.INLINE : DISPLAY.NONE });
            $(DEVICE_SELECTOR + LAYOUT.MAIN + '-back').css({ display: showBackButton ? DISPLAY.INLINE : DISPLAY.NONE });
            $(DEVICE_SELECTOR + LAYOUT.MAIN + '-search').css({ display: showSearchButton ? DISPLAY.INLINE : DISPLAY.NONE });
            $(DEVICE_SELECTOR + LAYOUT.MAIN + '-sync').css({ display: showSyncButton ? DISPLAY.INLINE : DISPLAY.NONE });
            $(DEVICE_SELECTOR + LAYOUT.MAIN + '-selection').css({ display: showSelectionButtons ? DISPLAY.TABLE : DISPLAY.NONE });
        };

        /* jshint +W074 */

        /**
         * Theme the user interface
         * @param theme
         * @private
         */
        mobile._theme = function (theme) {
            assert.type(STRING, theme, kendo.format(assert.messages.type.default, 'theme', STRING));
            mobile.application.skin(theme);
        };

        /*******************************************************************************************
         * Event handler and utility methods
         *******************************************************************************************/

        /**
         * Event Handler trigger when the device is ready (this is a cordova event)
         * Loads the application
         */
        mobile.onDeviceReady = function () {
            mobile.application = new kendo.mobile.Application($(DEVICE_SELECTOR), { skin: viewModel.get(THEME) }); // , statusBarStyle: 'black' });
        };

        /**
         * Event handler triggered when showing the Activities view
         * @param e
         */
        mobile.onActivitiesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when initializing the Categories view (only occurs once)
         */
        mobile.onCategoriesViewInit = function () {
            viewModel.loadCategories();
        };

        /**
         * Event handler triggered when showing the Categories view
         * @param e
         */
        mobile.onCategoriesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when showing the Favourites view
         * @param e
         */
        mobile.onFavouritesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when showing the Player view
         * @param e
         */
        mobile.onPlayerViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._setNavBar(e.view);
            mobile._resizePlayer(e.view);
            viewModel.loadLazyVersions(e.view.params.summaryId)
                .done(function () {
                    var version = viewModel.versions.at(0); // First is latest version
                    assert.instanceof(app.models.LazyVersion, version, kendo.format(assert.messages.instanceof.default, 'version', 'app.models.LazyVersion'));
                    viewModel.loadVersion(version.summaryId, version.id)
                        .done(function () {
                            viewModel.setCurrent();
                            viewModel.set(SELECTED_PAGE, viewModel.get(PAGES_COLLECTION).at(0));
                        });
                });
        };

        /**
         * Event handler triggered when showing the Settings view
         * @param e
         */
        mobile.onSettingsViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when showing the Summaries view
         * @param e
         */
        mobile.onSummariesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._setNavBar(e.view);
            /**
             if ($.type(query.q) === STRING) {
                        query.filter = { field: '$text', operator: 'eq', value: query.q };
                        delete query.q;
                    }
             */
            // Launch the query
            var query = {
                filter: mobile._getDataFilter(e.view.params)
                // page
                // pageSIze
            };
            viewModel.loadLazySummaries(query);
        };

        /*******************************************************************************************
         * Application initialization
         *******************************************************************************************/

        $(document).ready(function () {
            if ($.type(window.device) !== UNDEFINED && $.type(window.device.cordova) !== UNDEFINED) {
                // Wait for Cordova to load
                document.addEventListener('deviceready', mobile.onDeviceReady, false);
            } else {
                // No need to wait when running/debugging on a PC
                mobile.onDeviceReady();
            }
        });


    }(window.jQuery));

    /* jshint +W071 */

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

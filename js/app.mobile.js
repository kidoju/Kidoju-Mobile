/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false, __NODE_ENV__: false */

if (typeof(require) === 'function') {

    // Load other CSS
    require('../styles/kidoju.widgets.mediaplayer.less');
    require('../styles/kidoju.widgets.messagebox.less');
    require('../styles/kidoju.widgets.multicheckbox.less');
    // require('../styles/kidoju.widgets.playbar.less');
    require('../styles/kidoju.widgets.quiz.less');
    require('../styles/kidoju.widgets.rating.less');
    require('../styles/kidoju.widgets.stage.less');
    require('../styles/app.fonts.less');
    require('../styles/app.mobile.less');

    // Load config
    require('./app.config.jsx?env=' + __NODE_ENV__);
}

(function (f, define) {
    'use strict';
    define([
        './vendor/kendo/kendo.core',
        './vendor/kendo/kendo.data',
        './vendor/kendo/kendo.binder',
        './vendor/kendo/kendo.fx',
        './vendor/kendo/kendo.userevents',
        './vendor/kendo/kendo.draganddrop',
        './vendor/kendo/kendo.mobile.scroller',
        './vendor/kendo/kendo.popup',
        './vendor/kendo/kendo.list',
        './vendor/kendo/kendo.dropdownlist',
        './vendor/kendo/kendo.view',
        './vendor/kendo/kendo.mobile.view',
        './vendor/kendo/kendo.mobile.loader',
        './vendor/kendo/kendo.mobile.pane',
        './vendor/kendo/kendo.mobile.popover',
        './vendor/kendo/kendo.mobile.shim',
        './vendor/kendo/kendo.mobile.actionsheet',
        './vendor/kendo/kendo.router',
        './vendor/kendo/kendo.mobile.application',
        './vendor/kendo/kendo.mobile.button',
        './vendor/kendo/kendo.mobile.buttongroup',
        './vendor/kendo/kendo.mobile.drawer',
        './vendor/kendo/kendo.mobile.listview',
        './vendor/kendo/kendo.mobile.navbar',
        './vendor/kendo/kendo.mobile.switch',
        './vendor/kendo/kendo.touch',
        './window.assert',
        './window.logger',
        './kidoju.data',
        './kidoju.tools',
        './kidoju.widgets.chargrid',
        './kidoju.widgets.connector',
        './kidoju.widgets.dropzone',
        './kidoju.widgets.markdown',
        './kidoju.widgets.mathexpression',
        './kidoju.widgets.mediaplayer',
        './kidoju.widgets.multicheckbox',
        // './kidoju.widgets.playbar',
        './kidoju.widgets.quiz',
        './kidoju.widgets.rating',
        // './kidoju.widgets.social',
        './kidoju.widgets.stage',
        './app.constants',
        './app.logger',
        './app.i18n',
        './app.theme',
        './app.assets',
        './app.models',
        './app.secure'
        // './app.db'
    ], f);
})(function () {

    'use strict';

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        var kendo = window.kendo;
        var kidoju = window.kidoju;
        var assert = window.assert;
        var localStorage = window.localStorage;
        var logger = new window.Logger('app.mobile');
        var support = kendo.support;
        var app = window.app = window.app || {};
        var mobile = app.mobile = app.mobile || {};
        var i18n = app.i18n;
        var Page = kidoju.data.Page;
        // var PageComponent = kidoju.data.PageComponent;
        var PageCollectionDataSource = kidoju.data.PageCollectionDataSource;
        // var PageComponentCollectionDataSource = kidoju.data.PageComponentCollectionDataSource;
        var UNDEFINED = 'undefined';
        var NUMBER = 'number';
        var OBJECT = 'object';
        var STRING = 'string';
        var ARRAY = 'array';
        var CHANGE = 'change';
        var LOADED = 'i18n.loaded';
        var RX_MONGODB_ID = /^[0-9a-f]{24}$/;
        var VIRTUAL_PAGE_SIZE = 30; // Display 10 items * 3 DOM Element * 2
        var HASH = '#';
        var PHONE = 'phone';
        // var TABLET = 'tablet';
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
            SCORE: '-score',
            SETTINGS: '-settings',
            SUMMARIES: '-summaries'
        };
        var DEFAULT = {
            LANGUAGE: 'en',
            THEME: 'nova'
        };
        var DISPLAY = {
            INLINE: 'inline-block',
            NONE: 'none',
            TABLE: 'table'
        };
        var STORAGE = {
            LANGUAGE: 'language',
            THEME: 'theme'
        };
        var VIEWMODEL = {
            CURRENT: 'current',
            CURRENT_ID: 'current.id',
            LANGUAGE: 'settings.language',
            LANGUAGES: 'languages',
            PAGES_COLLECTION: 'version.stream.pages',
            SELECTED_PAGE: 'selectedPage',
            THEME: 'settings.theme',
            THEMES: 'themes',
            VERSION: 'version'
        };

        /*******************************************************************************************
         * Global handlers
         *******************************************************************************************/

        // TODO Global Event Handler - See app.logger
        window.onerror = function(msg, url, line, col, error) {
            alert(msg);
        };

        /**
         * Event handler triggered when calling a url with the kidoju:// scheme
         * @param url
         */
        window.handleOpenURL = function(url) {
            setTimeout(function() {
                // Try kidoju://hello?a=1&b=2
                // @see
                alert("received url: " + url);
            }, 100);
        };

        /*******************************************************************************************
         * viewModel
         *******************************************************************************************/

        var viewModel = mobile.viewModel = kendo.observable({

            /**
             * Categories
             */
            categories: new app.models.LazyCategoryDataSource(),

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
            languages: [],

            /**
             * Themes
             */
            themes: [],

            /**
             * User settings
             */
            settings: {
                user: 'TODO',
                version: app.version,
                language: DEFAULT.LANGUAGE,
                theme: DEFAULT.THEME
            },

            reset: function () {
                // this.activities.data([]);
                // this.categories.data([]);
                this.categories.read();
                // this.favourites.data([]);
                this.summaries.data([]);
                this.versions.data([]);
                this.set(VIEWMODEL.VERSION, new app.models.Version());
                this.set(VIEWMODEL.SELECTED_PAGE, undefined);
                this.set(VIEWMODEL.CURRENT, { test: undefined });
            },

            /**
             * Load settings from local storage
             */
            loadSettings: function () {
                try {
                    // Language
                    var language = localStorage.getItem(STORAGE.LANGUAGE);
                    this.set(VIEWMODEL.LANGUAGE, language || DEFAULT.LANGUAGE);
                    // Theme
                    // We need the same localStorage location as in Kidoju.Webapp to be able to use app.theme.js to load themes
                    var theme = localStorage.getItem(STORAGE.THEME);
                    this.set(VIEWMODEL.THEME, theme || DEFAULT.THEME);
                } catch (ex) {
                    // console.log(ex.message); // TODO
                }
            },

            /**
             * Load lazy summaries
             * @param query
             */
            loadLazySummaries: function (query) {
                return viewModel.summaries.query(query)
                    .fail(function (xhr, status, error) {
                        // TODO: app.notification.error(i18n.culture.player.notifications.versionLoadFailure);
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
                    // TODO: app.notification.error(i18n.culture.player.notifications.versionLoadFailure);
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
                                var pageCollectionDataSource = viewModel.get(VIEWMODEL.PAGES_COLLECTION);
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
             * Set current test
             */
            setCurrent: function () {
                viewModel.set(VIEWMODEL.CURRENT, {
                    test: viewModel.version.stream.pages.getTestFromProperties(),
                    version : {
                        summaryId: viewModel.get('version.summaryId'),
                        versionId: viewModel.get('version.id')
                    }
                });
            },

            /**
             * Get player view title
             */
            getPlayerViewTitle: function () {
                var page = this.get(VIEWMODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEWMODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                return kendo.format(i18n.culture.player.viewTitle, index + 1, pageCollectionDataSource.total());
            },

            /**
             * Check first page
             * @returns {boolean}
             */
            isFirstPage$: function () {
                var page = this.get(VIEWMODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEWMODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                return index === 0;
            },

            /**
             * Check last page
             * @returns {boolean}
             */
            isLastPage$: function () {
                var page = this.get(VIEWMODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEWMODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                return index === -1 || index === pageCollectionDataSource.total() - 1;
            },

            /**
             * Check whether this is the submit page
             */
            isSubmitPage$: function () {
                // It has to be the last page and the test should not have already been submitted/scored
                return this.isLastPage$() && $.type(this.get(VIEWMODEL.CURRENT_ID)) === UNDEFINED;
            },

            /**
             * Select the previous page from viewModel.version.stream.pages
             */
            previousPage: function () {
                var page = this.get(VIEWMODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEWMODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                if ($.type(index) === NUMBER && index > 0) {
                    this.set(VIEWMODEL.SELECTED_PAGE, pageCollectionDataSource.at(index - 1));
                }
            },

            /**
             * Select the next page from viewModel.version.stream.pages
             */
            nextPage: function () {
                var page = this.get(VIEWMODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEWMODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                if ($.type(index) === NUMBER && index < pageCollectionDataSource.total() - 1) {
                    this.set(VIEWMODEL.SELECTED_PAGE, pageCollectionDataSource.at(index + 1));
                }
            },

            /**
             * Select the last page from viewModel.version.stream.pages
             */
            lastPage: function () {
                var pageCollectionDataSource = this.get(VIEWMODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var lastPage = pageCollectionDataSource.total() - 1;
                this.set(VIEWMODEL.SELECTED_PAGE, pageCollectionDataSource.at(lastPage));
            },

            /**
             * Get the current theme
             * @param name
             */
            getTheme: function() {
                var name = this.get(VIEWMODEL.THEME);
                if (!this.get(VIEWMODEL.THEMES).length) {
                    this.set(VIEWMODEL.THEMES, i18n.culture.viewModel.themes);
                }
                // Get from localStorage (loaded in settings)
                var found = this.get(VIEWMODEL.THEMES).find(function (theme) {
                    return theme.name === name;
                });
                // Otherwise use OS default
                if (!found) {
                    found = this.get(VIEWMODEL.THEMES).find(function (theme) {
                        if (kendo.support.mobileOS.name === 'ios' && kendo.support.mobileOS.majorVersion < 7) {
                            return theme.platform === 'ios' && theme.majorVersion === 6;
                        } else if (kendo.support.mobileOS.name === 'ios' && kendo.support.mobileOS.majorVersion >= 7) {
                            return theme.platform === 'ios' && theme.majorVersion === 7;
                        } else {
                            return theme.platform === kendo.support.mobileOS.name;
                        }
                    });
                }
                // Otherwise use material (until we have a Kidoju style)
                if (!found) {
                    found = this.get(VIEWMODEL.THEMES).find(function (theme) {
                        return theme.name === 'material';
                    });
                }
                return found;
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
                case VIEWMODEL.LANGUAGE:
                    mobile._localize(e.sender.get(VIEWMODEL.LANGUAGE));
                    viewModel.reset();
                    break;
                case VIEWMODEL.THEME:
                    app.theme.name(e.sender.get(VIEWMODEL.THEME));
                    if (mobile && mobile.application instanceof kendo.mobile.Application) {
                        var theme = viewModel.getTheme();
                        // mobile.application.options.platform = theme.platform;
                        // mobile.application.options.majorVersion = theme.majorVersion;
                        mobile.application.skin(theme.skin || '');
                    }
                    // else onDeviceReady has not yet been called and mobile.application has not yet een initialized with theme
                    break;
                case VIEWMODEL.SELECTED_PAGE:
                    var playerViewElement = $(DEVICE_SELECTOR + VIEW.PLAYER);
                    var playerView = playerViewElement.data('kendoMobileView');
                    mobile._setNavBar(playerView);
                    mobile._setNavBarTitle(playerView, viewModel.getPlayerViewTitle());
                    var markdownScrollerElement = playerViewElement.find(kendo.roleSelector('scroller'));
                    var markdownScroller = markdownScrollerElement.data('kendoMobileScroller');
                    markdownScroller.reset();
                    markdownScroller.contentResized();
            }
        });

        /*******************************************************************************************
         * Utility methods (prefixed with underscore)
         *******************************************************************************************/

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
            var showHomeButton = false;
            var showPreviousButton = false;
            var showNextButton = false;
            var showLastButton = false;
            var showSubmitButton = false;
            var showSyncButton = false;
            var showSearchButton = false;
            var showSortButtons = false;
            switch (view.id) {
                case '/':
                case DEVICE_SELECTOR + VIEW.ACTIVITIES:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.CATEGORIES:
                    showDrawerButton = true;
                    showSearchButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.FAVOURITES:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.PLAYER:
                    showDrawerButton = true;
                    showPreviousButton = !viewModel.isFirstPage$();
                    showNextButton = !viewModel.isSubmitPage$();
                    showLastButton = !viewModel.isSubmitPage$();
                    showSubmitButton = viewModel.isSubmitPage$();
                    break;
                case DEVICE_SELECTOR + VIEW.SCORE:
                    showDrawerButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.SETTINGS:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.SUMMARIES:
                    showDrawerButton = true;
                    showHomeButton = true;
                    // showSearchButton = true;
                    // showSortButtons = true;
                    break;
            }
            // Note: each view has all buttons by default, so let's fix that
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-drawer').css({ display: showDrawerButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-home').css({ display: showHomeButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-previous').css({ display: showPreviousButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-next').css({ display: showNextButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-last').css({ display: showLastButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-submit').css({ display: showSubmitButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-sync').css({ display: showSyncButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-search').css({ display: showSearchButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-sort').css({ display: showSortButtons ? DISPLAY.INLINE : DISPLAY.NONE });
        };

        /* jshint +W074 */

        /**
         * Set the navigation bar title
         * @param locale
         * @private
         */
        mobile._setNavBarTitle = function (view, title) {
            assert.instanceof(kendo.mobile.ui.View, view, kendo.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            assert.type(STRING, title, kendo.format(assert.messages.type.default, 'title', STRING));
            var navbarElement = view.header.find('.km-navbar');
            var navbarWidget = navbarElement.data('kendoMobileNavBar');
            navbarWidget.title(title);
            // Fix km-no-title issue to align km-view-title properly within km-navbar
            navbarElement.find('.km-no-title').removeClass('km-no-title');
        };

        /**
         * Converts params into a kendo.data.DataSource filter
         * @param params
         * @private
         */
        mobile._getDataFilter = function (params) {
            // TODO If it gets more complicated, consider using $.deparam from app.utils.js in Kidoju.WebApp
            // assert.isPlainObject(params, kendo.format(assert.messages.isPlainObject.default, 'params'));
            assert.type(OBJECT, params, kendo.format(assert.messages.type.default, 'params', OBJECT));
            var field = params['filter[field]'];
            var operator = params['filter[operator]'];
            var value = params['filter[value]'];
            if ($.type(field) === STRING && $.type(operator) === STRING && $.type(value) === STRING) {
                return { field: field, operator: operator, value: value };
            }
        };

        /*******************************************************************************************
         * Localization
         * ===============
         * Localization is tricky because views are only initialized (kendo ui widgets initialized)
         * when first shown, so the view might not be available when the _localize function is called.
         *
         * It would make sense to localize views on the init event (in addition to a change of locale in the viewModel),
         * but the init event is not triggered on the initial view. Also the navbar is not available until the show event.
         *******************************************************************************************/

        /**
         * Localize the user interface
         * @param language
         * @private
         */
        mobile._localize = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'locale', app.locales));
            localStorage.setItem(STORAGE.LANGUAGE, language);
            i18n.load(language).then(function () {
                viewModel.set(VIEWMODEL.LANGUAGES, i18n.culture.viewModel.languages);
                viewModel.set(VIEWMODEL.THEMES, i18n.culture.viewModel.themes);
                mobile._localizeDrawerView(language);
                mobile._localizeActivitiesView(language);
                mobile._localizeCategoriesView(language);
                mobile._localizeFavouritesView(language);
                mobile._localizePlayerView(language);
                mobile._localizeSettingsView(language);
                mobile._localizeSummariesView(language);
            });
        };

        /**
         * Localize the drawer
         * @param language
         * @private
         */
        mobile._localizeDrawerView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var RX_REPLACE = /^(<[^<>\/]+>)(<\/[^<>\/]+>)([\s\S]+)$/i;
            var drawerCulture = i18n.culture.drawer;
            var drawerViewElement = $(DEVICE_SELECTOR + VIEW.DRAWER);
            // categoriesElement.html() === '<span class="km-icon km-home"></span>Explore' and we only want to replace the Explore title
            var categoriesElement = drawerViewElement.find('ul>li>a.km-listview-link:eq(0)');
            categoriesElement.html(categoriesElement.html().replace(RX_REPLACE, '$1$2' + drawerCulture.categories));
            var scanElement = drawerViewElement.find('ul>li>a.km-listview-link:eq(1)');
            scanElement.html(scanElement.html().replace(RX_REPLACE, '$1$2' + drawerCulture.scan));
            var favouritesElement = drawerViewElement.find('ul>li>a.km-listview-link:eq(2)');
            favouritesElement.html(favouritesElement.html().replace(RX_REPLACE, '$1$2' + drawerCulture.favourites));
            var activitiesElement = drawerViewElement.find('ul>li>a.km-listview-link:eq(3)');
            activitiesElement.html(activitiesElement.html().replace(RX_REPLACE, '$1$2' + drawerCulture.activities));
            var settingsElement = drawerViewElement.find('ul>li>a.km-listview-link:eq(4)');
            settingsElement.html(settingsElement.html().replace(RX_REPLACE, '$1$2' + drawerCulture.settings));
        };

        /**
         * Localize the activities view
         * @param language
         * @private
         */
        mobile._localizeActivitiesView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var activitiesCulture = i18n.culture.activities;
            var activitiesViewElement = $(DEVICE_SELECTOR + VIEW.ACTIVITIES);
            // Note: the view might not have been initialized yet
            var activitiesView = activitiesViewElement.data('kendoMobileView');
            if (activitiesView instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(activitiesView, activitiesCulture.viewTitle);
            }
        };

        /**
         * Localize the categories view
         * @param language
         * @private
         */
        mobile._localizeCategoriesView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var categoriesCulture = i18n.culture.categories;
            var categoriesViewElement = $(DEVICE_SELECTOR + VIEW.CATEGORIES);
            // Note: the view might not have been initialized yet
            var categoriesView = categoriesViewElement.data('kendoMobileView');
            if (categoriesView instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(categoriesView, categoriesCulture.viewTitle);
            }
        };

        /**
         * Localize the favourites view
         * @param language
         * @private
         */
        mobile._localizeFavouritesView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var favouritesCulture = i18n.culture.favourites;
            var favouritesViewElement = $(DEVICE_SELECTOR + VIEW.FAVOURITES);
            // The view may not have been intialized yet
            var favouritesView = favouritesViewElement.data('kendoMobileView');
            if (favouritesView instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(favouritesView, favouritesCulture.viewTitle);
            }
        };

        /**
         * Localize the player view
         * @param language
         * @private
         */
        mobile._localizePlayerView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var playerCulture = i18n.culture.player;
            var playersViewElement = $(DEVICE_SELECTOR + VIEW.PLAYER);
            // mobile._setNavBarTitle is called when selectedPage is changed in the viewModel
            playersViewElement.find('span.instructions').html(playerCulture.instructions);
            playersViewElement.find('span.explanations').html(playerCulture.explanations);
        };

        /**
         * Localize the settings view
         * @param language
         * @private
         */
        mobile._localizeSettingsView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var settingsCulture = i18n.culture.settings;
            var settingsViewElement = $(DEVICE_SELECTOR + VIEW.SETTINGS);
            // The view may not have been intialized yet
            var settingsView = settingsViewElement.data('kendoMobileView');
            if (settingsView instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(settingsView, settingsCulture.viewTitle);
            }
            // Localize field labels
            settingsViewElement.find('ul>li>label>span:not(.k-widget):eq(0)').text(settingsCulture.user);
            settingsViewElement.find('ul>li>label>span:not(.k-widget):eq(1)').text(settingsCulture.version);
            settingsViewElement.find('ul>li>label>span:not(.k-widget):eq(2)').text(settingsCulture.language);
            settingsViewElement.find('ul>li>label>span:not(.k-widget):eq(3)').text(settingsCulture.theme);
        };

        /**
         * Localize the summaries view
         * @param language
         * @private
         */
        mobile._localizeSummariesView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var summariesCulture = i18n.culture.summaries;
            var summariesViewElement = $(DEVICE_SELECTOR + VIEW.SUMMARIES);
            // The view may not have been intialized yet
            var summariesView = summariesViewElement.data('kendoMobileView');
            if (summariesView instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(summariesView, summariesCulture.viewTitle);
            }
            // TODO localize Go button or use icon

            // Localize actionsheet (it is not not within summariesViewElement)
            var summariesActionSheetElement = $(DEVICE_SELECTOR + VIEW.SUMMARIES + '-actionsheet');
            summariesActionSheetElement.find('li.km-actionsheet-cancel > a').text(summariesCulture.actionSheet.cancel);
            summariesActionSheetElement.find('li.km-actionsheet-play > a').text(summariesCulture.actionSheet.play);
            summariesActionSheetElement.find('li.km-actionsheet-share > a').text(summariesCulture.actionSheet.share);
        };

        /*******************************************************************************************
         * Resizing
         *******************************************************************************************/

        /**
         * Resize the UI
         * @private
         */
        mobile._resize = function () {
            mobile._resizePlayer();
        };

        /**
         * Resize player
         * @private
         */
        mobile._resizePlayer = function () {
            var content = $(DEVICE_SELECTOR + VIEW.PLAYER).find(kendo.roleSelector('content'));
            var stageElement = content.find(kendo.roleSelector('stage'));
            // If the stage widget has not yet been initialized, we won't get the correct stageWrapper
            if (stageElement.data('kendoStage') instanceof kendo.ui.Stage) {
                var height = content.height();
                var width = content.width();
                var stageWrapper = stageElement.parent();
                assert.ok(stageWrapper.hasClass('kj-stage'), 'Stage wrapper is expected to have class `kj-stage`');
                var stageContainer = stageWrapper.closest('.stretched-item');
                var markdownElement = content.find(kendo.roleSelector('markdown'));
                var markdownScrollerElement = markdownElement.closest(kendo.roleSelector('scroller'));
                var markdownScroller = markdownScrollerElement.data('kendoMobileScroller');
                var markdownContainer = markdownElement.closest('.stretched-item');
                var markdownHeading = markdownContainer.children('.heading');
                // Resize the stage
                var scale = (height > width) ? width / stageWrapper.outerWidth() : height / stageWrapper.outerHeight();
                stageWrapper.css('transform', 'scale(' + scale + ')');
                stageContainer.height(Math.floor(scale * stageWrapper.outerHeight()));
                stageContainer.width(Math.floor(scale * stageWrapper.outerWidth()));
                // Resize the markdown container and scroller for instructons/explanations
                markdownContainer.outerHeight((height > width) ? height - stageContainer.outerHeight() : height);
                markdownContainer.outerWidth((height > width) ? width : width - stageContainer.outerWidth());
                markdownScroller.destroy();
                markdownScrollerElement.outerHeight(markdownContainer.height() - markdownHeading.outerHeight() - parseInt(markdownContainer.css('padding-bottom'), 10));
                markdownScrollerElement.kendoMobileScroller();
            }
        };

        /*******************************************************************************************
         * Event handler and utility methods
         *******************************************************************************************/

        /**
         * Event Handler triggered when the device is ready (this is a cordova event)
         * Loads the application
         */
        mobile.onDeviceReady = function () {
            // Setup ajax with longer timeout on mobile devices
            $.ajaxSetup({ timeout: app.constants.ajaxTimeout });
            // Load settings including locale and theme
            viewModel.loadSettings();
            // Initialize pageSize for virtual scrolling
            viewModel.summaries.pageSize(VIRTUAL_PAGE_SIZE);
            // initialize secure storage
            window.secureStorage.init('myApp'); // ------------------------------------------------------------------------ TODO myApp

            // Wait for i18n resources to be loaded
            $(document).on(LOADED, function () {
                var theme = viewModel.getTheme();
                // Initialize application
                mobile.application = new kendo.mobile.Application($(DEVICE_SELECTOR), {
                    initial: DEVICE_SELECTOR + VIEW.CATEGORIES,
                    skin: theme.skin,
                    // http://docs.telerik.com/platform/appbuilder/troubleshooting/archive/ios7-status-bar
                    // http://www.telerik.com/blogs/everything-hybrid-web-apps-need-to-know-about-the-status-bar-in-ios7
                    // http://devgirl.org/2014/07/31/phonegap-developers-guid/
                    // statusBarStyle: (window.device && window.device.cordova) ? 'black-translucent' : undefined,
                    init: function (e) {
                        viewModel.set('languages', i18n.culture.viewModel.languages);
                        viewModel.set('themes', i18n.culture.viewModel.themes);
                    }
                });
            });
            // Handle resize event (especially when changing device orientation)
            $(window).resize(mobile._resize);
        };

        /**
         * Event handler triggered when initializing the Drawer view
         * Note: the init event is triggered the first time the view is requested
         * @param e
         */
        mobile.onDrawerViewInit = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._localizeDrawerView(viewModel.get(VIEWMODEL.LANGUAGE));
            // mobile._setNavBar(e.view);
        };

        /**
         * Event handler trigger when clicking an item in teh drawe menu
         * @see https://github.com/phonegap/phonegap-plugin-barcodescanner
         * @param e
         */
        mobile.onDrawerListViewClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.item, kendo.format(assert.messages.instanceof.default, 'e.item', 'jQuery'));
            if (e.item.is('li[data-icon=scan]')) {
                e.preventDefault();
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.barcodeScanner && $.isFunction(window.cordova.plugins.barcodeScanner.scan)) {
                    var QR_CODE = 'QR_CODE';
                    var RX_QR_CODE_MATCH = /^https?:\/\/[^\/]+\/([a-z]{2})\/s\/([a-z0-9]{24})$/i;
                    window.cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            if (!result.cancelled) {
                                assert.type(STRING, result.text, kendo.format(assert.messages.type.default, 'result.text', STRING));
                                assert.equal(QR_CODE, result.format, kendo.format(assert.messages.equal.default, 'result.format', QR_CODE));
                                var matches = result.text.match(RX_QR_CODE_MATCH);
                                if ($.isArray(matches) && matches.length > 2) {
                                    var language = matches[1];
                                     var summaryId = matches[2];
                                    if (viewModel.get(VIEWMODEL.LANGUAGE) === language) {
                                        // Find latest version (previous versions are not available in the mobile app)
                                        viewModel.loadLazyVersions(summaryId)
                                            .done(function () {
                                                var version = viewModel.versions.at(0); // First is latest version
                                                assert.instanceof(app.models.LazyVersion, version, kendo.format(assert.messages.instanceof.default, 'version', 'app.models.LazyVersion'));
                                                assert.match(RX_MONGODB_ID, version.id, kendo.format(assert.messages.match.default, 'version.id', RX_MONGODB_ID));
                                                mobile.application.navigate(DEVICE_SELECTOR + VIEW.PLAYER + '?summaryId=' + window.encodeURIComponent(summaryId) + '&versionId=' + window.encodeURIComponent(version.id));
                                            })
                                            .fail(function () {
                                                // TODO error should be in loadLazyVersions
                                                window.navigator.notification.alert('Error loading version', null, 'Error', 'OK');
                                            });
                                    } else {
                                        window.navigator.notification.alert('Change language settings to scan this code', null, 'Error', 'OK');
                                    }
                                } else {
                                    window.navigator.notification.alert('This QR code does not match', null, 'Error', 'OK');
                                }
                            }
                        },
                        function (error) {
                            window.navigator.notification.alert("Scanning failed: " + error);
                        },
                        {
                            preferFrontCamera: false, // iOS and Android
                            showFlipCameraButton: false, // iOS and Android
                            prompt: 'Place a barcode inside the scan area', // supported on Android only
                            formats: QR_CODE // default: all but PDF_417 and RSS_EXPANDED
                            // "orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
                        }
                    );
                } else {
                    window.navigator.notification.alert('no barcode scanner...', null, 'Error', 'OK');
                }
            }
        };

        /**
         * Event handler triggered when showing the Activities view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onActivitiesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            mobile._localizeActivitiesView(viewModel.get(VIEWMODEL.LANGUAGE));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when showing the Categories view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onCategoriesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            mobile._localizeCategoriesView(viewModel.get(VIEWMODEL.LANGUAGE));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when showing the Favourites view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onFavouritesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            mobile._localizeFavouritesView(viewModel.get(VIEWMODEL.LANGUAGE));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when initializing the Player view
         * Note: the init event is triggered the first time the view is requested
         * @param e
         */
        mobile.onPlayerViewInit = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            e.view.content.kendoTouch({
                enableSwipe: true,
                minXDelta: 150,
                maxDuration: 500,
                swipe: function (e) {
                    if (e.direction === 'left') {
                        viewModel.nextPage();
                    } else if (e.direction === 'right') {
                        viewModel.previousPage();
                    }
                }
            });
        };

        /**
         * Event handler triggered when showing the Player view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onPlayerViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            assert.isPlainObject(e.view.params, kendo.format(assert.messages.isPlainObject.default, 'e.view.params'));
            assert.match(RX_MONGODB_ID, e.view.params.summaryId, kendo.format(assert.messages.match.default, 'e.view.params.summaryId', RX_MONGODB_ID));
            assert.match(RX_MONGODB_ID, e.view.params.versionId, kendo.format(assert.messages.match.default, 'e.view.params.versionId', RX_MONGODB_ID));
            // Localize UI (cannot be done in init because it may have changed during the session)
            mobile._localizeSettingsView(viewModel.get(VIEWMODEL.LANGUAGE));
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // Load the viewModel with relevant version
            viewModel.loadVersion(e.view.params.summaryId, e.view.params.versionId)
                .done(function () {
                    mobile._resizePlayer(e.view);
                    viewModel.setCurrent();
                    viewModel.set(VIEWMODEL.SELECTED_PAGE, viewModel.get(VIEWMODEL.PAGES_COLLECTION).at(0));
                });
        };

        /**
         *
         * @param e
         */
        mobile.onScoreViewShow = function (e) {
            // TODO
        };

        /**
         * Event handler triggered when showing the Settings view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onSettingsViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._localizeSettingsView(viewModel.get(VIEWMODEL.LANGUAGE));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered before showing the Summaries view
         */
        mobile.onSummariesBeforeViewShow = function () {
            // Unfortunately, the following does not display the loader
            // if (mobile.application instanceof kendo.mobile.Application) {
            //    mobile.application.pane.loader.show();
            // }
            // Workaround
            // ------------
            // Clearing here the summaries data source avoids a "flickering" effect
            // where previous results are replaced by new results after the view is shown
            // Note that we have tried unsuccessfully to use the loader to hide the UI changes as explained at
            // http://www.telerik.com/forums/-bug-report-databound-event-not-firing-for-kendomobilelistview
            viewModel.summaries.data([]);
        };

        /**
         * Event handler triggered when showing the Summaries view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onSummariesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._localizeSummariesView(viewModel.get(VIEWMODEL.LANGUAGE));
            mobile._setNavBar(e.view);
            // Launch the query
            var query = {
                filter: mobile._getDataFilter(e.view.params),
                page: 1,
                pageSize: viewModel.summaries.pageSize()
            };
            viewModel.loadLazySummaries(query);
            // See comment for mobile.onSummariesBeforeViewShow
            // .always(function () {
            //    mobile.application.pane.loader.hide();
            // });
        };

        /**
         * Event handler for clicking the play option in the action sheet displayed from the GO button of summaries
         * @param e
         */
        mobile.onSummariesActionPlay = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.match(RX_MONGODB_ID, e.context, kendo.format(assert.messages.match.default, 'e.context', RX_MONGODB_ID));
            var summaryId = e.context;
            // Find latest version (previous versions are not available in the mobile app)
            viewModel.loadLazyVersions(summaryId)
                .done(function () {
                    var version = viewModel.versions.at(0); // First is latest version
                    assert.instanceof(app.models.LazyVersion, version, kendo.format(assert.messages.instanceof.default, 'version', 'app.models.LazyVersion'));
                    assert.match(RX_MONGODB_ID, version.id, kendo.format(assert.messages.match.default, 'version.id', RX_MONGODB_ID));
                    mobile.application.navigate(DEVICE_SELECTOR + VIEW.PLAYER + '?summaryId=' + window.encodeURIComponent(summaryId) + '&versionId=' + window.encodeURIComponent(version.id));
                });
        };

        /**
         * Event handler for clicking the share option in the action sheet displayed from the GO button of summaries
         * @see https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
         * @param e
         */
        mobile.onSummariesActionShare = function (e) {
            if (window && window.plugins && window.plugins.socialsharing && $.isFunction(window.plugins.socialsharing.shareWithOptions)) {
                window.plugins.socialsharing.shareWithOptions(
                    {
                        // this is the complete list of currently supported params on can pass to the social share plugin (all optional)
                        message: 'share this', // not supported on some apps (Facebook, Instagram)
                        subject: 'the subject', // fi. for email
                        files: ['', ''], // an array of filenames either locally or remotely
                        url: 'https://www.website.com/foo/#bar?a=b',
                        chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
                    },
                    function(result) {
                        console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                        console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                    },
                    function(msg) {
                        console.log("Sharing failed with message: " + msg);
                    }
                );
            } else {
                window.navigator.notification.alert('Something went wrong...', null, 'Error', 'OK');
            }
        };


        /**
         * Event handler for clicking the previous button in the navbar
         * @param e
         */
        mobile.onNavbarPreviousClick = function (e) {
            viewModel.previousPage();
        };

        /**
         * Event handler for clicking the next button in the navbar
         * @param e
         */
        mobile.onNavbarNextClick = function (e) {
            viewModel.nextPage();
        };

        /**
         * Event handler for clicking the last button in the navbar
         * @param e
         */
        mobile.onNavbarLastClick = function (e) {
            viewModel.lastPage();
        };

        /**
         * Event handler for clicking the submit button in the navbar
         * @param e
         */
        mobile.onNavbarSubmitClick = function (e) {
            if (window.device && window.device.cordova) {
                // https://github.com/apache/cordova-plugin-dialogs
                navigator.notification.confirm(
                    'You are the winner!', // message
                    mobile.onNavbarSubmitConfirm,       // callback to invoke with index of button pressed
                    'Confirm',             // title
                    ['Yes', 'No']           // buttonLabels
                );
            } else if (window.confirm('?')) {
                mobile.onNavbarSubmitConfirm(1);
            }
        };

        /**
         * Event handler for confirming after clicking the submit button in the navbar
         * @param buttonIndex
         */
        mobile.onNavbarSubmitConfirm = function (buttonIndex) {
            if (buttonIndex !== 1) {
                return;
            }

        };

        /**
         * Event handler for clicking the sync button in the navbar
         * @param e
         */
        mobile.onNavbarSyncClick = function (e) {
            $.noop(e); // TODO
        };

        /**
         * Event handler for clicking the search button in the navbar
         * @param e
         */
        mobile.onNavbarSearchClick = function (e) {
            mobile.application.navigate(DEVICE_SELECTOR + VIEW.SUMMARIES);
            // @see http://www.telerik.com/forums/hiding-filter-input-in-mobile-listview
            // var summaryView = $(DEVICE_SELECTOR + VIEW.SUMMARIES);
            // summaryView.find(kendo.roleSelector('listview')).getKendoMobileListView()._filter._clearFilter({ preventDefault: $.noop });
            // summaryView.find('.km-filter-form').show();
        };

        /*******************************************************************************************
         * Application initialization
         *******************************************************************************************/

        $(function () {
            // $(document).on(LOADED, function () {
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

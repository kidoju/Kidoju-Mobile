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
        // './kidoju.widgets.chargrid',
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
        var STRING = 'string';
        var ARRAY = 'array';
        var CHANGE = 'change';
        var LOADED = 'i18n.loaded';
        var DEFAULT_LANGUAGE = 'en';
        var DEFAULT_THEME = 'nova';
        var SETTINGS = {
            LANGUAGE: 'settings.language',
            THEME: 'settings.theme'
        };
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
            SETTINGS: '-settings',
            SUMMARIES: '-summaries'
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
        var CURRENT = 'current';
        var CURRENT_ID = 'current.id';
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
                language: DEFAULT_LANGUAGE,
                theme: DEFAULT_THEME
            },

            /**
             * Load settings from local storage
             */
            loadSettings: function () {
                try {
                    // Language
                    var language = localStorage.getItem(STORAGE.LANGUAGE);
                    this.set(SETTINGS.LANGUAGE, language || DEFAULT_LANGUAGE);
                    // Theme
                    // We need the same localStorage location as in Kidoju.Webapp to be able to use app.theme.js to load themes
                    var theme = localStorage.getItem(STORAGE.THEME);
                    this.set(SETTINGS.THEME, theme || DEFAULT_THEME);
                } catch (ex) {
                    console.log(ex.message); // TODO
                }
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
            },

            /**
             * Get player view title
             */
            getPlayerViewTitle: function () {
                var page = this.get(SELECTED_PAGE);
                var pageCollectionDataSource = this.get(PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                return kendo.format(i18n.culture.player.viewTitle, index + 1, pageCollectionDataSource.total());
            },

            /**
             * Check first page
             * @returns {boolean}
             */
            isFirstPage$: function () {
                var page = this.get(SELECTED_PAGE);
                var pageCollectionDataSource = this.get(PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                return index === 0;
            },

            /**
             * Check last page
             * @returns {boolean}
             */
            isLastPage$: function () {
                var page = this.get(SELECTED_PAGE);
                var pageCollectionDataSource = this.get(PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                return index === -1 || index === pageCollectionDataSource.total() - 1;
            },

            /**
             * Check whether this is the submit page
             */
            isSubmitPage$: function () {
                // It has to be the last page and the test should not have already been submitted/scored
                return this.isLastPage$() && $.type(this.get(CURRENT_ID)) === UNDEFINED;
            },

            /**
             * Select the previous page from viewModel.version.stream.pages
             */
            previousPage: function () {
                var page = this.get(SELECTED_PAGE);
                var pageCollectionDataSource = this.get(PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                if ($.type(index) === NUMBER && index > 0) {
                    this.set(SELECTED_PAGE, pageCollectionDataSource.at(index - 1));
                }
            },

            /**
             * Select the next page from viewModel.version.stream.pages
             */
            nextPage: function () {
                var page = this.get(SELECTED_PAGE);
                var pageCollectionDataSource = this.get(PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                if ($.type(index) === NUMBER && index < pageCollectionDataSource.total() - 1) {
                    this.set(SELECTED_PAGE, pageCollectionDataSource.at(index + 1));
                }
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
                case SETTINGS.LANGUAGE:
                    mobile._localize(e.sender.get(SETTINGS.LANGUAGE));
                    break;
                case SETTINGS.THEME:
                    app.theme.name(e.sender.get(SETTINGS.THEME));
                    break;
                case SELECTED_PAGE:
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
                case DEVICE_SELECTOR + VIEW.SUMMARIES:
                    showDrawerButton = true;
                    showHomeButton = true;
                    showSearchButton = true;
                    showSortButtons = true;
                    break;
                case DEVICE_SELECTOR + VIEW.FAVOURITES:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.PLAYER:
                    showDrawerButton = true;
                    showPreviousButton = !viewModel.isFirstPage$();
                    showNextButton = !viewModel.isSubmitPage$();
                    showSubmitButton = viewModel.isSubmitPage$();
                    break;
                case DEVICE_SELECTOR + VIEW.SETTINGS:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
            }
            // Note: each view has all buttons
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-drawer').css({ display: showDrawerButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-home').css({ display: showHomeButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-previous').css({ display: showPreviousButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-next').css({ display: showNextButton ? DISPLAY.INLINE : DISPLAY.NONE });
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
            var navbarWidget = view.header.find('.km-navbar').data('kendoMobileNavBar');
            navbarWidget.title(title);
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
                viewModel.set('languages', i18n.culture.viewModel.languages);
                viewModel.set('themes', i18n.culture.viewModel.themes);
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
            var drawerCulture = i18n.culture.drawer;
            var drawerViewElement = $(DEVICE_SELECTOR + VIEW.DRAWER);
            drawerViewElement.find('ul>li>a.km-listview-link:eq(0)').text(drawerCulture.categories);
            drawerViewElement.find('ul>li>a.km-listview-link:eq(1)').text(drawerCulture.favourites);
            drawerViewElement.find('ul>li>a.km-listview-link:eq(2)').text(drawerCulture.activities);
            drawerViewElement.find('ul>li>a.km-listview-link:eq(3)').text(drawerCulture.settings);
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
            console.log('deviceready');
            // Setup ajax with longer timeout on mobile devices
            $.ajaxSetup({ timeout: app.constants.ajaxTimeout });
            // Load settings including locale and theme
            viewModel.loadSettings();
            // Wait for i18n resources to be loaded
            $(document).on(LOADED, function() {
                console.log(LOADED);
                // Initialize application
                mobile.application = new kendo.mobile.Application($(DEVICE_SELECTOR), {
                    initial: DEVICE_SELECTOR + VIEW.CATEGORIES,
                    // platform: "ios7",
                    skin: viewModel.get(SETTINGS.THEME),
                    // http://www.telerik.com/blogs/everything-hybrid-web-apps-need-to-know-about-the-status-bar-in-ios7
                    statusBarStyle: (window.device && window.device.cordova) ? 'black-translucent' : undefined,
                    init: function (e) {
                        console.log('app.init');
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
            mobile._localizeDrawerView(viewModel.get(SETTINGS.LANGUAGE));
            // mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when showing the Activities view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onActivitiesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._localizeActivitiesView(viewModel.get(SETTINGS.LANGUAGE));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when showing the Categories view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onCategoriesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._localizeCategoriesView(viewModel.get(SETTINGS.LANGUAGE));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when showing the Favourites view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onFavouritesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._localizeFavouritesView(viewModel.get(SETTINGS.LANGUAGE));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when initializing the Player view
         * Note: the init event is triggered the first time the view is requested
         * @param e
         */
        mobile.onPlayerViewInit = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            e.view.content.kendoTouch({
                enableSwipe: true,
                minXDelta: 150,
                maxDuration: 500,
                swipe: function (e) {
                    if (e.direction === 'left') {
                        viewModel.nextPage();
                    } else if  (e.direction === 'right') {
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
            mobile._localizeSettingsView(viewModel.get(SETTINGS.LANGUAGE));
            mobile._setNavBar(e.view);
            viewModel.loadLazyVersions(e.view.params.summaryId)
                .done(function () {
                    var version = viewModel.versions.at(0); // First is latest version
                    assert.instanceof(app.models.LazyVersion, version, kendo.format(assert.messages.instanceof.default, 'version', 'app.models.LazyVersion'));
                    viewModel.loadVersion(version.summaryId, version.id)
                        .done(function () {
                            mobile._resizePlayer(e.view);
                            viewModel.setCurrent();
                            viewModel.set(SELECTED_PAGE, viewModel.get(PAGES_COLLECTION).at(0));
                        });
                });
        };

        /**
         * Event handler triggered when showing the Settings view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onSettingsViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            mobile._localizeSettingsView(viewModel.get(SETTINGS.LANGUAGE));
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered before showing the Summaries view
         */
        mobile.onSummariesBeforeViewShow = function () {
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
            mobile._localizeSummariesView(viewModel.get(SETTINGS.LANGUAGE));
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
         * Event handler for clicking the submit button in the navbar
         * @param e
         */
        mobile.onNavbarSubmitClick = function (e) {
            if (window.device && window.device.cordova) {
                // https://github.com/apache/cordova-plugin-dialogs
                navigator.notification.confirm(
                    'You are the winner!', // message
                    mobile.onSubmit,       // callback to invoke with index of button pressed
                    'Confirm',             // title
                    ['Yes', 'No']           // buttonLabels
                );
            } else if (window.confirm('?')) {
                mobile.onSubmit(1);
            }
        };

        mobile.onSubmit = function (buttonIndex) {
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

        /*******************************************************************************************
         * Application initialization
         *******************************************************************************************/

        console.log('init');

        $(document).ready(function() {
        // $(document).on(LOADED, function() {
            console.log('docready');
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

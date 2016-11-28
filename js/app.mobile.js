/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false, __NODE_ENV__: false */

if (typeof(require) === 'function') {

    // Load other CSS
    require('../styles/kidoju.widgets.markdown.less');
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
    // require('./app.support.js');
}

(function (f, define) {
    'use strict';
    define([
        './vendor/kendo/kendo.core',
        './vendor/kendo/kendo.data',
        './vendor/kendo/kendo.binder',
        './vendor/kendo/kendo.popup',
        './vendor/kendo/kendo.dialog',
        './vendor/kendo/kendo.list',
        './vendor/kendo/kendo.dropdownlist',
        './vendor/kendo/kendo.calendar',
        './vendor/kendo/kendo.datepicker',
        './vendor/kendo/kendo.userevents',
        './vendor/kendo/kendo.numerictextbox',
        './vendor/kendo/kendo.filtermenu',
        './vendor/kendo/kendo.selectable',
        './vendor/kendo/kendo.fx',
        './vendor/kendo/kendo.draganddrop',
        './vendor/kendo/kendo.mobile.scroller',
        './vendor/kendo/kendo.view',
        './vendor/kendo/kendo.mobile.view',
        './vendor/kendo/kendo.mobile.loader',
        './vendor/kendo/kendo.mobile.pane',
        './vendor/kendo/kendo.mobile.popover',
        './vendor/kendo/kendo.mobile.shim',
        './vendor/kendo/kendo.mobile.actionsheet',
        './vendor/kendo/kendo.columnsorter',
        './vendor/kendo/kendo.grid',
        './vendor/kendo/kendo.notification',
        './vendor/kendo/kendo.color',
        './vendor/kendo/kendo.drawing',
        // './vendor/kendo/kendo.dataviz.core',
        // './vendor/kendo/kendo.dataviz.themes',
        // './vendor/kendo/kendo.dataviz.chart',
        './vendor/kendo/kendo.router',
        './vendor/kendo/kendo.mobile.application',
        './vendor/kendo/kendo.mobile.button',
        './vendor/kendo/kendo.mobile.buttongroup',
        // './vendor/kendo/kendo.mobile.collapsible',
        './vendor/kendo/kendo.mobile.drawer',
        './vendor/kendo/kendo.mobile.listview',
        // './vendor/kendo/kendo.mobile.modalview',
        './vendor/kendo/kendo.mobile.navbar',
        './vendor/kendo/kendo.mobile.scrollview',
        // './vendor/kendo/kendo.mobile.splitview',
        './vendor/kendo/kendo.mobile.switch',
        // './vendor/kendo/kendo.mobile.tabstrip',
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
        './kidoju.widgets.messagebox',
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
        './app.utils',
        './app.assets', // TODO <---------------- really used?
        './app.models',
        './app.mobile.models'
    ], f);
})(function () {

    'use strict';

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        var app = window.app = window.app || {};
        var mobile = app.mobile = app.mobile || {};
        var kendo = window.kendo;
        var kidoju = window.kidoju;
        var localStorage = window.localStorage;
        var assert = window.assert;
        var logger = new window.Logger('app.mobile');
        var models = app.models;
        var i18n = app.i18n;
        var rapi = app.rapi;
        var Page = kidoju.data.Page;
        // var PageComponent = kidoju.data.PageComponent;
        var PageCollectionDataSource = kidoju.data.PageCollectionDataSource;
        // var PageComponentCollectionDataSource = kidoju.data.PageComponentCollectionDataSource;
        var UNDEFINED = 'undefined';
        var FUNCTION = 'function';
        var NUMBER = 'number';
        // var OBJECT = 'object';
        var STRING = 'string';
        var ARRAY = 'array';
        var CHANGE = 'change';
        var LOADED = 'i18n.loaded';
        var RX_LANGUAGE = /^[a-z]{2}$/;
        var RX_MONGODB_ID = /^[0-9a-f]{24}$/;
        var RX_PIN = /^[\d]{4}$/;
        var VIRTUAL_PAGE_SIZE = 30; // Display 10 items * 3 DOM Element * 2
        var HASH = '#';
        var PHONE = 'phone';
        var DEVICE_SELECTOR = HASH + PHONE;
        // var TABLET = 'tablet';
        // var DEVICE_SELECTOR = HASH + TABLET;
        // var DEVICE_SELECTOR = HASH + (support.mobileOS && support.mobileOS.tablet ? TABLET : PHONE)
        var LAYOUT = {
            MAIN: '-main-layout'
        };
        var VIEW = {
            ACTIVITIES: '-activities',
            CATEGORIES: '-categories',
            CORRECTION: '-correction',
            DRAWER: '-drawer',
            FAVOURITES: '-favourites',
            FINDER: '-finder',
            PLAYER: '-player',
            SCORE: '-score',
            SETTINGS: '-settings',
            SUMMARY: '-summary',
            SIGNIN: '-signin',
            SYNC: '-sync',
            USER: '-user'
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
        var VIEW_MODEL = {
            ACTIVITIES: 'activities',
            CATEGORIES: 'categories',
            CURRENT: {
                $: 'current',
                ID: 'current.id',
                SCORE: 'current.score',
                TEST: 'current.test',
                UPDATED: 'current.updated'
            },
            LANGUAGES: 'languages',
            PAGES_COLLECTION: 'version.stream.pages', // TODO
            SELECTED_PAGE: 'selectedPage',
            SETTINGS: {
                $: 'settings',
                LANGUAGE: 'settings.language',
                THEME: 'settings.theme'
            },
            SUMMARY: {
                $: 'summary',
                ID: 'summary.id',
                LANGUAGE: 'summary.language',
                TITLE: 'summary.title'
            },
            SUMMARIES: 'summaries',
            THEMES: 'themes',
            USER: {
                $: 'user',
                FIRST_NAME: 'user.firstName',
                LAST_NAME: 'user.lastName',
                SID: 'user.sid'
            },
            USERS: 'users',
            VERSION: {
                $: 'version',
                ID: 'version.id',
                LANGUAGE: 'version.language',
                SUMMARY_ID: 'version.summaryId'
            },
            VERSIONS: 'versions'
        };
        var SELECTORS = {
            PIN: '.pin'
        };

        /*******************************************************************************************
         * Global handlers
         *******************************************************************************************/

        // TODO Global Event Handler - See app.logger
        window.onerror = function (message, source, lineno, colno, error) {
            window.alert(message);
        };

        /**
         * Event handler triggered when calling a url with the kidoju:// scheme
         * @param url
         */
        window.handleOpenURL = function (url) {
            setTimeout(function () {
                // Try kidoju://hello?a=1&b=2
                // ----------------------------------------------------------------------------------------------------------------------- TODO
                mobile.notification.info('received url: ' + url);
            }, 100);
        };

        /**
         * Generic FileError handler to display app.notification
         * @see https://www.html5rocks.com/en/tutorials/file/filesystem/
         * @param e
         * // TODO
         */
        /*
        function onFileError(err) {
            var msg = 'Default message';
            // TODO: FileSystem.FileTransferErrorCode
            if (err instanceof window.FileError) {
                switch (err.code) {
                    case FileSystem.FileErrorCode.QUOTA_EXCEEDED_ERR:
                        msg = 'TODO';
                        break;
                    case FileSystem.FileErrorCode.NOT_FOUND_ERR:
                        msg = 'TODO';
                        break;
                    case FileSystem.FileErrorCode.SECURITY_ERR:
                        msg = 'TODO';
                        break;
                    case FileSystem.FileErrorCode.INVALID_MODIFICATION_ERR:
                        msg = 'TODO';
                        break;
                    case FileSystem.FileErrorCode.INVALID_STATE_ERR:
                        msg = 'TODO';
                        break;
                    default:
                        break;
                };
            } else if (err instanceof FileTransferError) {
                switch (err.code) {
                };
            }
            app.notification.error(msg);
            logger.error({
                message: msg
            });
        }
        */


        /*******************************************************************************************
         * Shortcuts
         *******************************************************************************************/

        /**
         * These shortcuts can only be set in onDeviceReady when all cordova plugins are loaded
         * This is also structured so as to work in a browser independently from `phonegap serve`
         */
        function setShortcuts () {
            mobile.support = {
                alert: window.navigator && window.navigator.notification && $.isFunction(window.navigator.notification.alert) && $.isFunction(window.navigator.notification.beep),
                barcodeScanner: window.cordova && window.cordova.plugins && window.cordova.plugins.barcodeScanner && $.isFunction(window.cordova.plugins.barcodeScanner.scan),
                cordova: $.type(window.cordova) !== UNDEFINED,
                ga: window.ga && $.isFunction(window.ga.startTrackerWithId),
                // Note: InAppBrowser uses iFrame on browser platform which is incompatible with oAuth flow
                inAppBrowser: window.cordova && window.device && window.device.platform !== 'browser' && window.cordova.InAppBrowser && $.isFunction(window.cordova.InAppBrowser.open),
                socialsharing: window && window.plugins && window.plugins.socialsharing && $.isFunction(window.plugins.socialsharing.shareWithOptions),
                splashscreen: window.navigator && window.navigator.splashscreen && $.isFunction(window.navigator.splashscreen.hide)
            };
            // barcodeScanner requires phonegap-plugin-barcodescanner
            if (mobile.support.barcodeScanner) {
                mobile.barcodeScanner = window.cordova.plugins.barcodeScanner;
            }
            // device requires cordova-plugin-device
            if ($.type(window.device) !== UNDEFINED) {
                mobile.device = window.device;
            }
            // ga requires cordova-plugin-google-analytics
            if (mobile.support.ga) {
                mobile.ga = window.ga;
            }
            // InAppBrowser requires cordova-plugin-inappbrowser
            if (mobile.support.inAppBrowser) {
                mobile.InAppBrowser = window.cordova.InAppBrowser;
            }
            // notification requires cordova-plugin-dialogs
            // TODO: remove????
            mobile.notification = {
                info: function (message, callback) {
                    if (mobile.support.alert) {
                        window.navigator.notification.alert(message, callback, i18n.culture.notification.info, i18n.culture.notification.ok);
                    } else {
                        window.alert(message);
                    }
                },
                error: function (message, callback) {
                    if (mobile.support.alert) {
                        window.navigator.notification.beep(1);
                        window.navigator.notification.alert(message, callback, i18n.culture.notification.error, i18n.culture.notification.ok);
                    } else {
                        window.alert(message);
                    }
                },
                success: function (message, callback) {
                    if (mobile.support.alert) {
                        window.navigator.notification.alert(message, callback, i18n.culture.notification.success, i18n.culture.notification.ok);
                    } else {
                        window.alert(message);
                    }
                },
                warning: function (message, callback) {
                    if (mobile.support.alert) {
                        window.navigator.notification.alert(message, callback, i18n.culture.notification.warning, i18n.culture.notification.ok);
                    } else {
                        window.alert(message);
                    }
                }
            };
            // secureStorage requires cordova-plugin-x-socialsharing
            if (mobile.support.socialsharing) {
                mobile.socialsharing = window.plugins.socialsharing;
            }
            // socialSharing requires cordova-plugin-secure-storage
            // mobile.secureStorage = window.secureStorage;
            // splashscreen requires cordova-plugin-splashscreen
            if (mobile.support.splashscreen) {
                mobile.splashscreen = window.navigator.splashscreen;
            }
        }

        /*******************************************************************************************
         * Google Analytics setup
         *******************************************************************************************/

        /**
         * @see https://github.com/danwilson/google-analytics-plugin
         */
        function setAnalytics () {
            if (mobile.support.ga) {
                var ga = mobile.ga;
                ga.startTrackerWithId(app.constants.gaTrackingId);
                // ga.setUserId('my-user-id'); // TODO
                // ga.setAppVersion('1.33.7'); // TODO
                // ga.debugMode();
            }

            /**
             In your 'deviceready' handler, set up your Analytics tracker:

             window.ga.startTrackerWithId('UA-XXXX-YY') where UA-XXXX-YY is your Google Analytics Mobile App property
             To track a Screen (PageView):

             window.ga.trackView('Screen Title')
             To track a Screen (PageView) w/ campaign details:

             window.ga.trackView('Screen Title', 'my-scheme://content/1111?utm_source=google&utm_campaign=my-campaign')
             To track a Screen (PageView) and create a new session:

             window.ga.trackView('Screen Title', '', true)
             To track an Event:

             window.ga.trackEvent('Category', 'Action', 'Label', Value) Label and Value are optional, Value is numeric
             To track custom metrics:

             window.ga.trackMetric('key', Value) Value is optional
             To track an Exception:

             window.ga.trackException('Description', Fatal) where Fatal is boolean
             To track User Timing (App Speed):

             window.ga.trackTiming('Category', IntervalInMilliseconds, 'Variable', 'Label') where IntervalInMilliseconds is numeric
             To add a Transaction (Ecommerce)

             window.ga.addTransaction('ID', 'Affiliation', Revenue, Tax, Shipping, 'Currency Code') where Revenue, Tax, and Shipping are numeric
             To add a Transaction Item (Ecommerce)

             window.ga.addTransactionItem('ID', 'Name', 'SKU', 'Category', Price, Quantity, 'Currency Code') where Price and Quantity are numeric
             To add a Custom Dimension

             window.ga.addCustomDimension('Key', 'Value', success, error)
             Key should be integer index of the dimension i.e. send 1 instead of dimension1 for the first custom dimension you are tracking.
             e.g. window.ga.addCustomDimension(1, 'Value', success, error)
             To set a UserId:

             window.ga.setUserId('my-user-id')
             To set a specific app version:

             window.ga.setAppVersion('1.33.7')
             To set a anonymize Ip address:

             window.ga.setAnonymizeIp(true)
             To set Opt-out:

             window.ga.setOptOut(true)
             To enabling Advertising Features in Google Analytics allows you to take advantage of Remarketing, Demographics & Interests reports, and more:

             window.ga.setAllowIDFACollection(true)
             To enable verbose logging:

             window.ga.debugMode()
             To enable/disable automatic reporting of uncaught exceptions

             window.ga.enableUncaughtExceptionReporting(Enable, success, error) where Enable is boolean
             */
        }

        /*******************************************************************************************
         * viewModel
         *******************************************************************************************/

        // Setup ajax with longer timeout on mobile devices
        $.ajaxSetup({ timeout: app.constants.ajaxTimeout });

        // The one and only viewModel
        var viewModel = mobile.viewModel = kendo.observable({

            /**
             * Activities (scores to start with)
             */
            activities: new models.MobileActivityDataSource(),

            /**
             * Categories
             */
            categories: new models.LazyCategoryDataSource(),

            /**
             * Current test
             */
            current: { test: undefined },

            /**
             * Favourites
             */
            // favourites: [],

            /**
             * Languages
             */
            languages: [],


            /**
             * The selected page displayed in the player
             */
            selectedPage: undefined,

            /**
             * User settings
             */
            settings: {
                user: null,
                version: app.version,
                language: DEFAULT.LANGUAGE,
                theme: DEFAULT.THEME
            },

            /**
             * Summaries
             */
            summaries: new models.LazySummaryDataSource(),

            /**
             * Selected summary
             */
            summary: new models.Summary(),

            /**
             * Themes
             */
            themes: [],

            /**
             * Signed-in user
             */
            user: new models.MobileUser(),

            /**
             * Mobile device users
             */
            users: new models.MobileUserDataSource(),

            /**
             * Selected version
             */
            version: new models.Version(),

            /**
             * Versions
             */
            versions: new models.LazyVersionDataSource(),

            /**
             * Barcode scanner feature detection (remove drawer menu options)
             * @returns {*}
             */
            hasBarCodeScanner$: function () {
                return mobile.support.barcodeScanner;
            },

            /**
             * Current user set (and saved)
             */
            isSavedUser$: function () {
                var user = viewModel.get(VIEW_MODEL.USER.$);
                return user instanceof models.MobileUser && !user.isNew() && viewModel.users.indexOf(user) > -1;
            },

            /**
             * Social Sharing feature detection (remove actionsheet menu option)
             * @returns {protocol|*|SocialSharing}
             */
            hasSocialSharing$: function () {
                return mobile.support.socialsharing;
            },

            /**
             * Return current page
             * @returns {*}
             */
            page$: function () {
                var page = this.get(VIEW_MODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                return pageCollectionDataSource.indexOf(page) + 1;
            },

            /**
             * Return total number of pages
             */
            totalPages$: function () {
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                return pageCollectionDataSource.total();
            },

            /**
             * Resets all data when switching language or users
             * Important: this cannot be a promise so loading has to occur elsewhere
             */
            reset: function () {

                // List of activities
                this.set(VIEW_MODEL.ACTIVITIES, new models.MobileActivityDataSource({
                    // TODO: language: this.get(VIEW_MODEL.SETTINGS.LANGUAGE),
                    userId: this.get(VIEW_MODEL.USER.SID)
                }));

                // List of categories
                this.set(VIEW_MODEL.CATEGORIES, new models.LazyCategoryDataSource({
                    // TODO Language
                }));

                // Current score/test
                this.set(VIEW_MODEL.CURRENT.$, new models.MobileActivity());

                // Favorites are not yet implemented
                // this.set('favourites', []);

                // Supported languages are not supposed to change
                // this.set('languages', []);

                // Selected player page
                this.set(VIEW_MODEL.SELECTED_PAGE, undefined);

                // TODO: Settings
                // this.set(VIEW_MODEL.SETTINGS, {});

                // Search (per category or full text)
                this.set(VIEW_MODEL.SUMMARIES, new models.LazySummaryDataSource({
                    // TODO: Language
                    // Category
                    // Author/owner
                }));

                // Summary being played
                this.set(VIEW_MODEL.SUMMARY.$, new models.Summary());

                // Themes are not supposed to change
                // this.set(VIEW_MODEL.THEMES, []);

                // Do not change the user as a change of language or user has brought us here
                // this.set(VIEW_MODEL.USER.$, new models.MobileUser());
                // this.set(VIEW_MODEL.USERS, new models.MobileUserDataSource());

                // Version being played
                this.set(VIEW_MODEL.VERSION.$, new models.Version());

                // Other versions in the same summary (only used to play the latest)
                this.set(VIEW_MODEL.VERSIONS, new models.LazyVersionDataSource());

            },

            /**
             * Load user activities
             * @param options
             */
            loadActivities: function (options) {
                return this.activities.load(options)
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.activitiesQueryFailure);
                        logger.error({
                            message: 'error loading summaries',
                            method: 'viewModel.loadLazySummaries',
                            data: { status: status, error: error } // TODO xhr.responseText
                        });
                    });
            },

            /**
             * Load settings from local storage
             */
            loadSettings: function () {
                // Language
                var language = localStorage.getItem(STORAGE.LANGUAGE);
                this.set(VIEW_MODEL.SETTINGS.LANGUAGE, language || DEFAULT.LANGUAGE);
                // Theme - We need the same localStorage location as in Kidoju.Webapp to be able to use app.theme.js to load themes
                var theme = localStorage.getItem(STORAGE.THEME);
                this.set(VIEW_MODEL.SETTINGS.THEME, theme || DEFAULT.THEME);
            },

            /**
             * Load lazy summaries
             * @param query
             */
            loadLazySummaries: function (query) {
                // TODO: assert query
                return viewModel.summaries.query(query)
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.summariesQueryFailure);
                        logger.error({
                            message: 'error loading summaries',
                            method: 'viewModel.loadLazySummaries',
                            data: { query: query, status: status, error: error } // TODO xhr.responseText
                        });
                    });
            },

            /**
             * Load summary from remote servers
             * @param options
             */
            loadSummary: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.match(RX_LANGUAGE, options.language, kendo.format(assert.messages.match.default, 'options.language', RX_LANGUAGE));
                assert.match(RX_MONGODB_ID, options.id, kendo.format(assert.messages.match.default, 'options.id', RX_MONGODB_ID));
                // TODO viewModel.summary.load(options)
                viewModel.summary.load(options.id)
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.summaryLoadFailure);
                        logger.error({
                            message: 'error loading summary',
                            method: 'viewModel.loadSummary',
                            data: { status: status, error: error } // TODO xhr.responseText
                        });
                    });
            },

            /**
             * Load user from remote server
             * @returns {*}
             */
            loadUser: function () {
                // Set a new user since the existing user might be in the database and we do not want to change its properties
                viewModel.set(VIEW_MODEL.USER.$, new models.MobileUser());
                return viewModel.user.load()
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.userLoadFailure);
                        logger.error({
                            message: 'error loading user',
                            method: 'viewModel.loadUser',
                            data:  { status: status, error: error, response: xhr.responseText } // TODO xhr.responseText
                        });
                    });
            },

            /**
             * Load users
             * @returns {*}
             */
            loadUsers: function () {
                return viewModel.users.query({ sort: { field: 'lastUse', dir: 'desc' } })
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.usersQueryFailure);
                        logger.error({
                            message: 'error loading users',
                            method: 'viewModel.loadUsers',
                            data:  { status: status, error: error, response: xhr.responseText } // TODO xhr.responseText
                        });
                    });
            },

            /**
             * Load version (and stream pages)
             * Copied from app.player.js
             * @param options
             * @returns {*}
             */
            loadVersion: function (options) {

                function versionLoadFailure(xhr, status, error) {
                    dfd.reject(xhr, status, error);
                    app.notification.error(i18n.culture.notifications.versionLoadFailure);
                    logger.error({
                        message: 'error loading version',
                        method: 'viewModel.loadVersion',
                        data: { language: options.language, summaryId: options.summaryId, versionId: options.versionId, status: status, error: error } // TODO xhr.responseText
                    });
                }

                var dfd = $.Deferred();

                // Load version and pages
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.match(RX_LANGUAGE, options.language, assert.messages.match.default, 'options.language', RX_LANGUAGE);
                assert.match(RX_MONGODB_ID, options.summaryId, assert.messages.match.default, 'options.summaryId', RX_MONGODB_ID);
                assert.match(RX_MONGODB_ID, options.versionId, assert.messages.match.default, 'options.versionId', RX_MONGODB_ID);

                // TODO viewModel.version.load(options)
                viewModel.version.load(options.summaryId, options.versionId)
                    .done(function () {
                        // Load stream
                        viewModel.version.stream.load()
                            .done(function () {
                                var promises = [];
                                var pageCollectionDataSource = viewModel.get(VIEW_MODEL.PAGES_COLLECTION);
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
             * @param options
             */
            loadLazyVersions: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.match(RX_LANGUAGE, options.language, assert.messages.match.default, 'options.language', RX_LANGUAGE);
                assert.match(RX_MONGODB_ID, options.summaryId, assert.messages.match.default, 'options.summaryId', RX_MONGODB_ID);

                return viewModel.versions.load(options)
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.versionsLoadFailure);
                        logger.error({
                            message: 'error loading versions',
                            method: 'viewModel.loadLazyVersions',
                            data: { language: options.language, summaryId: options.summaryId, status: status, error: error } // TODO: xhr.responseText
                        });
                    });
            },

            /**
             * Check first user
             */
            isFirstUser$: function () {
                var user = this.get(VIEW_MODEL.USER.$);
                var userDataSource = this.get(VIEW_MODEL.USERS);
                assert.instanceof(models.MobileUserDataSource, userDataSource, kendo.format(assert.messages.instanceof.default, 'userDataSource', 'app.models.MobileUserDataSource'));
                var index = userDataSource.indexOf(user);
                return !user.isNew() && index === 0;
            },

            /**
             * Check last user
             * @returns {boolean}
             */
            isLastUser$: function () {
                var user = this.get(VIEW_MODEL.USER.$);
                var userDataSource = this.get(VIEW_MODEL.USERS);
                assert.instanceof(models.MobileUserDataSource, userDataSource, kendo.format(assert.messages.instanceof.default, 'userDataSource', 'app.models.MobileUserDataSource'));
                var index = userDataSource.indexOf(user);
                return !user.isNew() && index === userDataSource.total() - 1;
            },

            /**
             * Select the previous page from viewModel.version.stream.pages
             */
            previousUser: function () {
                var user = this.get(VIEW_MODEL.USER.$);
                var userDataSource = this.get(VIEW_MODEL.USERS);
                assert.instanceof(models.MobileUserDataSource, userDataSource, kendo.format(assert.messages.instanceof.default, 'userDataSource', 'app.models.MobileUserDataSource'));
                var index = userDataSource.indexOf(user);
                if ($.type(index) === NUMBER && index > 0) {
                    this.set(VIEW_MODEL.USER.$, userDataSource.at(index - 1));
                }
            },

            /**
             * Select the next page from viewModel.version.stream.pages
             */
            nextUser: function () {
                var user = this.get(VIEW_MODEL.USER.$);
                var userDataSource = this.get(VIEW_MODEL.USERS);
                assert.instanceof(models.MobileUserDataSource, userDataSource, kendo.format(assert.messages.instanceof.default, 'userDataSource', 'app.models.MobileUserDataSource'));
                var index = userDataSource.indexOf(user);
                if ($.type(index) === NUMBER && index < userDataSource.total() - 1) {
                    this.set(VIEW_MODEL.USER.$, userDataSource.at(index + 1));
                }
            },

            /**
             * Check first page
             * @returns {boolean}
             */
            isFirstPage$: function () {
                var page = this.get(VIEW_MODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                return index === 0;
            },

            /**
             * Check last page
             * @returns {boolean}
             */
            isLastPage$: function () {
                var page = this.get(VIEW_MODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                return index === -1 || index === pageCollectionDataSource.total() - 1;
            },

            /**
             * Select the previous page from viewModel.version.stream.pages
             */
            firstPage: function () {
                var page = this.get(VIEW_MODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(0));
            },

            /**
             * Select the previous page from viewModel.version.stream.pages
             */
            previousPage: function () {
                var page = this.get(VIEW_MODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                if ($.type(index) === NUMBER && index > 0) {
                    this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(index - 1));
                }
            },

            /**
             * Select the next page from viewModel.version.stream.pages
             */
            nextPage: function () {
                var page = this.get(VIEW_MODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                if ($.type(index) === NUMBER && index < pageCollectionDataSource.total() - 1) {
                    this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(index + 1));
                }
            },

            /**
             * Select the last page from viewModel.version.stream.pages
             */
            lastPage: function () {
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var lastPage = pageCollectionDataSource.total() - 1;
                this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(lastPage));
            },

            /**
             * Get the current theme
             * @param name
             */
            getTheme: function () {
                var name = this.get(VIEW_MODEL.SETTINGS.THEME);
                if (!this.get(VIEW_MODEL.THEMES).length) {
                    this.set(VIEW_MODEL.THEMES, i18n.culture.viewModel.themes);
                }
                // Get from localStorage (loaded in settings)
                var found = this.get(VIEW_MODEL.THEMES).find(function (theme) {
                    return theme.name === name;
                });
                // Otherwise use OS default
                if (!found) {
                    found = this.get(VIEW_MODEL.THEMES).find(function (theme) {
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
                    found = this.get(VIEW_MODEL.THEMES).find(function (theme) {
                        return theme.name === 'material';
                    });
                }
                return found;
            },

            /**
             * Reset current test
             */
            resetCurrent: function () {
                var that = this;
                // Assert ids
                var userId = that.get(VIEW_MODEL.USER.SID); // Foreign keys use sids (server ids)
                assert.match(RX_MONGODB_ID, userId, kendo.format(assert.messages.match.default, 'userId', RX_MONGODB_ID));
                var language = i18n.locale();
                assert.equal(language, that.get(VIEW_MODEL.SUMMARY.LANGUAGE), kendo.format(assert.messages.equal.default, 'this.get(\'summary.language\')', language));
                assert.equal(language, that.get(VIEW_MODEL.VERSION.LANGUAGE), kendo.format(assert.messages.equal.default, 'this.get(\'version.language\')', language));
                var summaryId = that.get(VIEW_MODEL.VERSION.SUMMARY_ID);
                assert.match(RX_MONGODB_ID, summaryId, kendo.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                assert.equal(summaryId, this.get(VIEW_MODEL.SUMMARY.ID), kendo.format(assert.messages.equal.default, 'this.get(\'summary.id\')', summaryId));
                var versionId = that.get(VIEW_MODEL.VERSION.ID);
                assert.match(RX_MONGODB_ID, versionId, kendo.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));
                // Set viewModel field
                // IMPORTANT: viewModel.current is not a models.MobileActivity - For more information, see saveCurrent
                // viewModel.set(VIEW_MODEL.CURRENT.$, new models.MobileActivity({
                viewModel.set(VIEW_MODEL.CURRENT.$, {
                    actor: {
                        firstName: that.get(VIEW_MODEL.USER.FIRST_NAME),
                        lastName: that.get(VIEW_MODEL.USER.LAST_NAME),
                        userId: userId // Foreign keys use sids (server ids)
                    },
                    // test initialized for player data binding
                    test: viewModel.version.stream.pages.getTestFromProperties(),
                    type: 'score',
                    version : {
                        language: language,
                        // TODO categories for better statistics
                        summaryId: summaryId,
                        title: that.get(VIEW_MODEL.SUMMARY.TITLE),
                        versionId: versionId
                    }
                });
            },

            /**
             * Calculate test results
             * @returns {*}
             */
            calculate: function () {
                var pageCollectionDataSource = viewModel.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, kendo.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                return pageCollectionDataSource.validateTestFromProperties(viewModel.get(VIEW_MODEL.CURRENT.TEST))
                    .done(function (result) {
                        // Note: result has methods including percent and getScoreArray
                        assert.isPlainObject(result, kendo.format(assert.messages.isPlainObject.default, 'result'));
                        assert.type(FUNCTION, result.percent, kendo.format(assert.messages.type.default, 'result.percent', FUNCTION));
                        assert.type(FUNCTION, result.getScoreArray, kendo.format(assert.messages.type.default, 'result.getScoreArray', FUNCTION));
                        viewModel.set(VIEW_MODEL.CURRENT.TEST, result);
                    })
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.scoreCalculationFailure);
                        var serverError;
                        try { serverError = JSON.parse(xhr.responseText); } catch (ex) {} // TODO
                        logger.error({
                            message: 'Failed to calculate user score',
                            method: 'viewModel.calculate',
                            data: { status: status, error: error, serverError: serverError } // TODO
                        });
                    });
            },

            /**
             * Save the score activity
             * @returns {*}
             */
            saveCurrent: function () {
                // Get current
                var current = this.get(VIEW_MODEL.CURRENT.$);
                // assert.instanceof(models.MobileActivity, current, kendo.format(assert.messages.instanceof.default, 'current', 'app.models.MobileActivity'));
                assert.type(UNDEFINED, current.id, kendo.format(assert.messages.type.default, 'current.id', UNDEFINED));
                assert.type(FUNCTION, current.test.percent, kendo.format(assert.messages.type.default, 'current.test.percent', FUNCTION));
                assert.type(FUNCTION, current.test.getScoreArray, kendo.format(assert.messages.type.default, 'current.test.getScoreArray', FUNCTION));
                // Update current
                viewModel.set(VIEW_MODEL.CURRENT.SCORE, current.test.percent());
                viewModel.set(VIEW_MODEL.CURRENT.UPDATED, new Date());
                // Add to datasource and sync
                var activities = this.activities;
                assert.instanceof(models.MobileActivityDataSource, activities, kendo.format(assert.messages.instanceof.default, 'activities', 'app.models.MobileActivityDataSource'));
                var activity = new models.MobileActivity(current);
                activities.add(activity);
                return activities.sync()
                    .done(function () {
                        // current is not a models.MobileActivity because since percent and getScoreArray are not model methods,
                        // There are lost at this stage. We would need to make a model with percent and getScoreArray methods
                        var activityId = activity.get('id');
                        assert.match(RX_MONGODB_ID, activityId, kendo.format(assert.messages.match.default, 'activityId', RX_MONGODB_ID));
                        viewModel.set(VIEW_MODEL.CURRENT.ID, activityId);
                        app.notification.success(i18n.culture.notifications.scoreSaveSuccess);
                        // TODO: server sync here or in DataSource???
                    })
                    .fail(function (xhr, status, error) {
                        // dfd.reject(xhr, status, error);
                        app.notification.error(i18n.culture.notifications.scoreSaveFailure);
                        // Log error
                        logger.error({
                            message: 'error saving score current',
                            method: 'viewModel.saveCurrent',
                            data: { status: status, error: error } // TODO xhr.responseText
                        });
                    });
            }

        });

        /* This function's cyclomatic complexity is too high. */
        /* jshint -W074 */

        /**
         * Event handler for the viewModel change event
         */
        viewModel.bind(CHANGE, function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isOptionalObject.default, 'e'));
            assert.type(STRING, e.field, kendo.format(assert.messages.type.default, 'e.field', STRING));
            assert.instanceof(kendo.Observable, e.sender, kendo.format(assert.messages.instanceof.default, 'e.sender', 'kendo.Observable'));
            switch (e.field) {
                case VIEW_MODEL.SETTINGS.LANGUAGE:
                    if ($.isPlainObject(i18n.culture) && mobile.application instanceof kendo.mobile.Application) {
                        mobile.localize(e.sender.get(VIEW_MODEL.SETTINGS.LANGUAGE));
                    }
                    viewModel.reset();
                    break;
                case VIEW_MODEL.SETTINGS.THEME:
                    app.theme.name(e.sender.get(VIEW_MODEL.SETTINGS.THEME));
                    if (mobile && mobile.application instanceof kendo.mobile.Application) {
                        var theme = viewModel.getTheme();
                        // mobile.application.options.platform = theme.platform;
                        // mobile.application.options.majorVersion = theme.majorVersion;
                        mobile.application.skin(theme.skin || '');
                    }
                    // else onDeviceReady has not yet been called and mobile.application has not yet een initialized with theme
                    break;
                case VIEW_MODEL.SELECTED_PAGE:
                    // Reset NavBar buttons and title
                    mobile._localizeCorrectionView();
                    mobile._localizePlayerView();
                    break;
                case VIEW_MODEL.USER.$:
                    viewModel.reset();
                    break;
            }
        });

        /* jshint +W074 */

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
            var showBackButton = false;
            var showDrawerButton = false;
            var showHomeButton = false;
            // We do not show the first page button to leave room for the drawer button
            // var showFirstPageButton = false;
            var showPreviousPageButton = false;
            var showPreviousUserButton = false;
            var showNextUserButton = false;
            var showNextPageButton = false;
            var showLastPageButton = false;
            var showSubmitButton = false;
            var showScoreButton = false;
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
                case DEVICE_SELECTOR + VIEW.CORRECTION:
                    showDrawerButton = true;
                    showPreviousPageButton = !viewModel.isFirstPage$();
                    showNextPageButton = !viewModel.isLastPage$();
                    showLastPageButton = !viewModel.isLastPage$();
                    showScoreButton = viewModel.isLastPage$();
                    break;
                case DEVICE_SELECTOR + VIEW.FAVOURITES:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.FINDER:
                    showDrawerButton = true;
                    showHomeButton = true;
                    // showSearchButton = true;
                    // showSortButtons = true;
                    break;
                case DEVICE_SELECTOR + VIEW.PLAYER:
                    showDrawerButton = true;
                    showPreviousPageButton = !viewModel.isFirstPage$();
                    showNextPageButton = !viewModel.isLastPage$();
                    showLastPageButton = !viewModel.isLastPage$();
                    showSubmitButton = viewModel.isLastPage$();
                    break;
                case DEVICE_SELECTOR + VIEW.SCORE:
                    showDrawerButton = true;
                    // TODO showCorrectionButton: true;
                    break;
                case DEVICE_SELECTOR + VIEW.SETTINGS:
                    showDrawerButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.SIGNIN:
                    showBackButton = viewModel.isSavedUser$();
                    break;
                case DEVICE_SELECTOR + VIEW.SUMMARY:
                    showDrawerButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.SYNC:
                    break;
                case DEVICE_SELECTOR + VIEW.USER:
                    showPreviousUserButton = viewModel.isSavedUser$() && !viewModel.isFirstUser$();
                    showNextUserButton = viewModel.isSavedUser$() && !viewModel.isLastUser$();
                    break;
            }
            // Note: each view has no button by default, so let's fix that
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-back').css({ display: showBackButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-drawer').css({ display: showDrawerButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-home').css({ display: showHomeButton ? DISPLAY.INLINE : DISPLAY.NONE });
            // view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-first-page').css({ display: showFirstPageButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-previous-page').css({ display: showPreviousPageButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-previous-user').css({ display: showPreviousUserButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-next-user').css({ display: showNextUserButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-next-page').css({ display: showNextPageButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-last-page').css({ display: showLastPageButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-submit').css({ display: showSubmitButton ? DISPLAY.INLINE : DISPLAY.NONE });
            view.element.find(DEVICE_SELECTOR + LAYOUT.MAIN + '-score').css({ display: showScoreButton ? DISPLAY.INLINE : DISPLAY.NONE });
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
         * Init the notification widget
         * @private
         */
        mobile._initNotification = function () {
            var notification = $('#notification');
            assert.hasLength(notification, kendo.format(assert.messages.hasLength.default, '#notification'));
            if (app && app.notification instanceof kendo.ui.Notification) {
                // Do not leave pending notifications
                var notifications = app.notification.getNotifications();
                notifications.each(function () {
                    $(this).parent().remove();
                });
                // Destroy before re-creating
                app.notification.destroy();
            }
            // Note: the navbar is not available for notifications occurring before kendo.mobile.Application is initialized,
            // in other words notifications while displaying the splash screen, especially for loadSettings and loadUsers.
            var navbar = $('.km-navbar');
            app.notification = notification.kendoNotification({
                button: true,
                position: {
                    left: 0,
                    top: navbar.length ? navbar.height() + 1 : 0 // navbar or splashscreen
                },
                stacking: 'down',
                width: $(window).width() - 2 // - 2 is for borders as box-sizing on .k-notification-wrap does not help
            }).data('kendoNotification');
            assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
            // Modify default TEMPLATE (see kendo.notification.js) to wrap text properly
            // var TEMPLATE = '<div class="k-notification-wrap">' + '<span class="k-icon k-i-#=typeIcon#">#=typeIcon#</span>' + '#=content#' + '<span class="k-icon k-i-close">Hide</span>' + '</div>';
            var TEMPLATE = '<div class="k-notification-wrap">' + '<span class="k-icon k-i-#=typeIcon#">#=typeIcon#</span><span class="k-text">' + '#=content#' + '</span><span class="k-icon k-i-close">Hide</span>' + '</div>';
            app.notification._defaultCompiled = kendo.template(TEMPLATE);
            app.notification._safeCompiled = kendo.template(TEMPLATE.replace('#=content#', '#:content#'));
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
        mobile.localize = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'locale', app.locales));
            localStorage.setItem(STORAGE.LANGUAGE, language);
            i18n.load(language).then(function () {
                viewModel.set(VIEW_MODEL.LANGUAGES, i18n.culture.viewModel.languages);
                viewModel.set(VIEW_MODEL.THEMES, i18n.culture.viewModel.themes);
                mobile._localizeMainLayout();
                mobile._localizeActivitiesView();
                mobile._localizeCategoriesView();
                mobile._localizeCorrectionView();
                mobile._localizeDrawerView();
                // mobile._localizeFavouritesView();
                mobile._localizeFinderView();
                mobile._localizePlayerView();
                mobile._localizeScoreView();
                mobile._localizeSettingsView();
                mobile._localizeSigninView();
                mobile._localizeSummaryView();
                mobile._localizeSyncView();
                mobile._localizeUserView();
            });
        };

        /**
         * Localize the main layout, especially the navbar
         * @private
         */
        mobile._localizeMainLayout = function () {
            var culture = i18n.culture.layout;
            $(DEVICE_SELECTOR + LAYOUT.MAIN + '-back').text(culture.back);
        };

        /**
         * Localize the activities view
         * @private
         */
        mobile._localizeActivitiesView = function () {
            var culture = i18n.culture.activities;
            var viewElement = $(DEVICE_SELECTOR + VIEW.ACTIVITIES);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
            // Grid is localized in the onActivityViewShow event handler
        };

        /**
         * Localize the categories view
         * @private
         */
        mobile._localizeCategoriesView = function () {
            var culture = i18n.culture.categories;
            var viewElement = $(DEVICE_SELECTOR + VIEW.CATEGORIES);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
        };

        /**
         * Localize the correction view
         * @private
         */
        mobile._localizeCorrectionView = function () {
            var culture = i18n.culture.correction;
            var viewElement = $(DEVICE_SELECTOR + VIEW.CORRECTION);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBar(viewWidget);
                mobile._setNavBarTitle(viewWidget, kendo.format(culture.viewTitle, viewModel.page$(), viewModel.totalPages$()));
                var markdownScrollerElement = viewElement.find(kendo.roleSelector('scroller'));
                var markdownScroller = markdownScrollerElement.data('kendoMobileScroller');
                markdownScroller.reset();
                // markdownScroller.contentResized();
            }
            viewElement.find('span.explanations').html(culture.explanations);
        };

        /**
         * Localize the drawer
         * @private
         */
        mobile._localizeDrawerView = function () {
            var RX_REPLACE = /^(<[^<>\/]+>)(<\/[^<>\/]+>)([\s\S]+)$/i;
            var culture = i18n.culture.drawer;
            var viewElement = $(DEVICE_SELECTOR + VIEW.DRAWER);
            // categoriesElement.html() === '<span class="km-icon km-home"></span>Explore' and we only want to replace the Explore title
            var categoriesElement = viewElement.find('ul>li>a.km-listview-link:eq(0)');
            categoriesElement.html(categoriesElement.html().replace(RX_REPLACE, '$1$2' + culture.categories));
            var scanElement = viewElement.find('ul>li>a.km-listview-link:eq(1)');
            scanElement.html(scanElement.html().replace(RX_REPLACE, '$1$2' + culture.scan));
            // var favouritesElement = drawerViewElement.find('ul>li>a.km-listview-link:eq(2)');
            // favouritesElement.html(favouritesElement.html().replace(RX_REPLACE, '$1$2' + drawerCulture.favourites));
            var activitiesElement = viewElement.find('ul>li>a.km-listview-link:eq(2)');
            activitiesElement.html(activitiesElement.html().replace(RX_REPLACE, '$1$2' + culture.activities));
            var settingsElement = viewElement.find('ul>li>a.km-listview-link:eq(3)');
            settingsElement.html(settingsElement.html().replace(RX_REPLACE, '$1$2' + culture.settings));
        };

        /**
         * Localize the favourites view
         * @private
         */
        /*
        mobile._localizeFavouritesView = function () {
            var culture = i18n.culture.favourites;
            var viewElement = $(DEVICE_SELECTOR + VIEW.FAVOURITES);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
        };
        */

        /**
         * Localize the summaries view
         * @private
         */
        mobile._localizeFinderView = function () {
            var culture = i18n.culture.finder;
            var viewElement = $(DEVICE_SELECTOR + VIEW.FINDER);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
            // TODO localize Go button or use icon

            // Localize actionsheet (it is not not within summariesViewElement)
            var finderActionSheetElement = $(DEVICE_SELECTOR + VIEW.FINDER + '-actionsheet');
            finderActionSheetElement.find('li.km-actionsheet-cancel > a').text(culture.actionSheet.cancel);
            finderActionSheetElement.find('li.km-actionsheet-play > a').text(culture.actionSheet.play);
            finderActionSheetElement.find('li.km-actionsheet-share > a').text(culture.actionSheet.share);
        };

        /**
         * Localize the player view
         * @private
         */
        mobile._localizePlayerView = function () {
            var culture = i18n.culture.player;
            var viewElement = $(DEVICE_SELECTOR + VIEW.PLAYER);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBar(viewWidget);
                mobile._setNavBarTitle(viewWidget, kendo.format(culture.viewTitle, viewModel.page$(), viewModel.totalPages$()));
                var markdownScrollerElement = viewElement.find(kendo.roleSelector('scroller'));
                var markdownScroller = markdownScrollerElement.data('kendoMobileScroller');
                markdownScroller.reset();
                // markdownScroller.contentResized();
            }
            viewElement.find('span.instructions').html(culture.instructions);
        };

        /**
         * Localize the sync view
         * @private
         */
        mobile._localizeSyncView = function () {
            var culture = i18n.culture.sync;
            var viewElement = $(DEVICE_SELECTOR + VIEW.SYNC);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
        };

        /**
         * Localize the score view
         * @private
         */
        mobile._localizeScoreView = function () {
            var culture = i18n.culture.score;
            var viewElement = $(DEVICE_SELECTOR + VIEW.SCORE);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, kendo.format(culture.viewTitle, viewModel.get(VIEW_MODEL.CURRENT.SCORE) / 100));
            }
            // Grid is localized in the onScoreViewShow event handler
        };

        /**
         * Localize the settings view
         * @private
         */
        mobile._localizeSettingsView = function () {
            var culture = i18n.culture.settings;
            var viewElement = $(DEVICE_SELECTOR + VIEW.SETTINGS);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
            // Localize field labels
            viewElement.find('ul>li>label>span:not(.k-widget):eq(0)').text(culture.user);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(1)').text(culture.version);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(2)').text(culture.language);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(3)').text(culture.theme);
            // Localize buttons
            viewElement.find('.buttons>.km-button>span.km-text:eq(0)').text(culture.switch);
        };

        /**
         * Localize the sign-in view
         * @private
         */
        mobile._localizeSigninView = function () {
            var culture = i18n.culture.signin;
            var viewElement = $(DEVICE_SELECTOR + VIEW.SIGNIN);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
            // Welcome notification
            viewElement.find('.k-notification-wrap>span.k-text').text(culture.welcome);
        };

        /**
         * Localize the summary view
         * @private
         */
        mobile._localizeSummaryView = function () {
            var culture = i18n.culture.summary;
            var viewElement = $(DEVICE_SELECTOR + VIEW.SUMMARY);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
            // Localize field labels
            viewElement.find('ul>li>label>span:not(.k-widget):eq(0)').text(culture.title);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(1)').text(culture.categories);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(2)').text(culture.tags);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(3)').text(culture.description);
            // Localize buttons
            viewElement.find('.buttons>.km-button>span.km-text:eq(0)').text(culture.go);
        };

        /**
         * Localize the user view
         * @private
         */
        mobile._localizeUserView = function () {
            var culture = i18n.culture.user;
            var viewElement = $(DEVICE_SELECTOR + VIEW.USER);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: the view might not have been initialized yet
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
            // Localize field labels
            viewElement.find('ul>li>label>span:not(.k-widget):eq(0)').text(culture.firstName);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(1)').text(culture.lastName);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(2)').text(culture.lastUse);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(3)').text(culture.pin);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(4)').text(culture.confirm);
            // Localize buttons
            viewElement.find('.buttons>.km-button>span.km-text:eq(0)').text(culture.save);
            viewElement.find('.buttons>.km-button>span.km-text:eq(1)').text(culture.signIn);
            viewElement.find('.buttons>.km-button>span.km-text:eq(2)').text(culture.newUser);
        };

        /*******************************************************************************************
         * Resizing
         *******************************************************************************************/

        /**
         * Resize player/correction stage and instructions/explanations markdown
         * @param view
         * @private
         */
        mobile._resizeStage = function (view) {
            assert.instanceof(kendo.mobile.ui.View, view, kendo.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            var content = view.element.find(kendo.roleSelector('content'));
            var stageElement = content.find(kendo.roleSelector('stage'));
            var stageWidget = stageElement.data('kendoStage');
            // If the stage widget has not yet been initialized, we won't get the correct stageWrapper
            if (kendo.ui.Stage && stageWidget instanceof kendo.ui.Stage) {
                /**
                 * ATTENTION jQuery 3 breaking change
                 * There is a breaking change in jQuery 3 regarding height and width
                 * jQuery 2 reports the actual CSS value (clientHeight, clientWidth)
                 * jQuery 3 reports the scaled value
                 * See https://github.com/jquery/jquery/issues/3193
                 */
                var HEIGHT = stageElement.outerHeight();
                assert.equal(HEIGHT, 768, kendo.format(assert.messages.equal.default, 'HEIGHT', '768'));
                var WIDTH = stageElement.outerWidth();
                assert.equal(WIDTH, 1024, kendo.format(assert.messages.equal.default, 'WIDTH', '1024'));
                var height = content.height();  // The screen height minus layout header and footer
                var width = content.width();    // The screen width minus layout header and footer
                var scale = (height > width) ? width / WIDTH : height / HEIGHT;
                // Resize the stage
                stageWidget.scale(scale);
                var stageWrapper = stageElement.parent();
                assert.ok(stageWrapper.hasClass('kj-stage'), 'Stage wrapper is expected to have class `kj-stage`');
                var stageContainer = stageWrapper.closest('.stretched-item');
                stageContainer.height(Math.floor(scale * HEIGHT));
                stageContainer.width(Math.floor(scale * WIDTH));
                // Resize the markdown container and scroller for instructions/explanations
                var markdownElement = content.find(kendo.roleSelector('markdown'));
                var markdownScrollerElement = markdownElement.closest(kendo.roleSelector('scroller'));
                var markdownScroller = markdownScrollerElement.data('kendoMobileScroller');
                assert.instanceof(kendo.mobile.ui.Scroller, markdownScroller, kendo.format(assert.messages.instanceof.default, 'markdownScroller', 'kendo.mobile.ui.Scroller'));
                var markdownContainer = markdownElement.closest('.stretched-item');
                var markdownHeading = markdownContainer.children('.heading');
                markdownContainer.outerHeight((height > width) ? height - stageContainer.outerHeight() : height);
                markdownContainer.outerWidth((height > width) ? width : width - stageContainer.outerWidth());
                markdownScroller.destroy();
                markdownScrollerElement.outerHeight(markdownContainer.height() - markdownHeading.outerHeight() - parseInt(markdownContainer.css('padding-bottom'), 10));
                markdownScrollerElement.kendoMobileScroller();
            }
        };

        /**
         * Event handler for resizing the UI (especially when changing device orientation)
         * @private
         */
        mobile.onResize = function () {
            var view = mobile.application.view();
            mobile._initNotification();
            mobile._resizeStage(view);
            // mobile._initActivitiesGrid(view); // <-- not necessary because we do not need to recalculate the height
            mobile._initScoreGrid(view);
        };

        /*******************************************************************************************
         * Event handler and utility methods
         *******************************************************************************************/

        /**
         * Event Handler triggered when the device is ready (this is a cordova event)
         * Loads the application, especially initialize plugins (which where not available until now)
         */
        mobile.onDeviceReady = function () {
            // Set feature shortcuts
            setShortcuts();
            // Set google analytics
            setAnalytics();
            // Initialize notifications for loadSettings and loadUsers
            mobile._initNotification();
            // Load settings including locale and theme
            viewModel.loadSettings();
            // Initialize pageSize for virtual scrolling
            viewModel.summaries.pageSize(VIRTUAL_PAGE_SIZE);
            // initialize secure storage
            // mobile.secureStorage.init(app.constants.kidoju);
            // initialize the user interface
            $(document).one(LOADED, mobile.oni18nLoaded);
            // Wire the resize event handler for changes of device orientation
            $(window).resize(mobile.onResize);
            // Release the execution of jQuery's ready event (hold in index.html)
            // @see https://api.jquery.com/jquery.holdready/
            // Otherwise the ready event handler in app.i18n is not called
            // (in phonegap developer app, in packaged apps, but not in a browser served by phonegap)
            // and oni18nLoaded does not execute (strange but true)
            // ATTENTION: https://github.com/jquery/jquery/issues/3288
            $.holdReady(false);
        };

        /**
         * Event handler for the LOADED (i18n.loaded) event
         * Initialize the user interface now that cordova plugins and i18n resources are loaded
         */
        mobile.oni18nLoaded = function () {
            assert.isPlainObject(i18n.culture, kendo.format(assert.messages.isPlainObject.default, 'i18n.culture'));
            var theme = viewModel.getTheme();
            // Load viewModel with languages and themes
            viewModel.set('languages', i18n.culture.viewModel.languages);
            viewModel.set('themes', i18n.culture.viewModel.themes);
            // Load mobile users from localForage
            viewModel.loadUsers()
                .done(function () {
                    // Set user to most recent user
                    if (viewModel.users.total() > 0) {
                        viewModel.set(VIEW_MODEL.USER.$, viewModel.users.at(0));
                    }
                    // Initialize event threshold as discussed at http://www.telerik.com/forums/click-event-does-not-fire-reliably
                    // kendo.UserEvents.defaultThreshold(kendo.support.mobileOS.device === 'android' ? 0 : 20);
                    // Considering potential adverse effects with drag and drop, we are using http://docs.telerik.com/kendo-ui/api/javascript/mobile/ui/button#configuration-clickOn
                    // Initialize application
                    mobile.application = new kendo.mobile.Application($(DEVICE_SELECTOR), {
                        initial: DEVICE_SELECTOR + (viewModel.isSavedUser$() ? VIEW.USER : VIEW.SIGNIN),
                        skin: theme.skin,
                        // http://docs.telerik.com/kendo-ui/controls/hybrid/application#hide-status-bar-in-ios-and-cordova
                        // http://docs.telerik.com/platform/appbuilder/troubleshooting/archive/ios7-status-bar
                        // http://www.telerik.com/blogs/everything-hybrid-web-apps-need-to-know-about-the-status-bar-in-ios7
                        // http://devgirl.org/2014/07/31/phonegap-developers-guid/
                        // statusBarStyle: mobile.support.cordova ? 'black-translucent' : undefined,
                        statusBarStyle: 'hidden',
                        init: function (e) {
                            // Localise the application
                            mobile.localize(viewModel.get(VIEW_MODEL.SETTINGS.LANGUAGE));
                            // Reinitialize notifications now that we know the size of .km-header
                            mobile._initNotification();
                            // hide the splash screen
                            setTimeout(function () {
                                if (mobile.support.splashscreen) {
                                    mobile.splashscreen.hide();
                                }
                            }, 500); // + 500 default fadeOut time
                        }
                    });
                });
        };

        /**
         * Scan a QR Code
         * @see https://github.com/phonegap/phonegap-plugin-barcodescanner
         * @private
         */
        mobile._scanQRCode = function () {
            if (mobile.support.barcodeScanner) {
                var QR_CODE = 'QR_CODE';
                var RX_QR_CODE_MATCH = /^https?:\/\/[^\/]+\/([a-z]{2})\/s\/([a-f0-9]{24})$/i;
                mobile.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            assert.type(STRING, result.text, kendo.format(assert.messages.type.default, 'result.text', STRING));
                            assert.equal(QR_CODE, result.format, kendo.format(assert.messages.equal.default, 'result.format', QR_CODE));
                            var matches = result.text.match(RX_QR_CODE_MATCH);
                            if ($.isArray(matches) && matches.length > 2) {
                                var language = matches[1];
                                var summaryId = matches[2];
                                if (viewModel.get(VIEW_MODEL.SETTINGS.LANGUAGE) === language) {
                                    mobile.application.navigate(DEVICE_SELECTOR + VIEW.SUMMARY +
                                        '?summaryId=' + window.encodeURIComponent(summaryId));
                                } else {
                                    mobile.notification.alert('Change language settings to scan this code'); // TODO
                                }
                            } else {
                                mobile.notification.alert('This QR code does not match'); // TODO
                            }
                        }
                    },
                    function (error) {
                        mobile.notification.alert('Scanning failed: ' + error); // TODO
                    },
                    {
                        preferFrontCamera: false, // iOS and Android
                        showFlipCameraButton: false, // iOS and Android
                        prompt: 'Place a barcode inside the scan area', // TODO supported on Android only
                        formats: QR_CODE // default: all but PDF_417 and RSS_EXPANDED
                        // "orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
                    }
                );
            }
        };

        /**
         * Event handler trigger when clicking an item in the drawer menu
         * @param e
         */
        mobile.onDrawerListViewClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.item, kendo.format(assert.messages.instanceof.default, 'e.item', 'jQuery'));
            if (e.item.is('li[data-icon=scan]')) {
                e.preventDefault();
                mobile._scanQRCode();
            }
        };

        /**
         * Initialize the activities grid
         * @param view
         * @private
         */
        mobile._initActivitiesGrid = function (view) {
            assert.instanceof(kendo.mobile.ui.View, view, kendo.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            // Find and destroy the grid as it needs to be rebuilt if locale changes
            // Note: if the grid is set as <div data-role="grid"></div> in index.html then .km-pane-wrapper does not exist, so we need an id
            // var gridElement = view.element.find(kendo.roleSelector('grid'));
            var gridElement = view.element.find(DEVICE_SELECTOR + VIEW.ACTIVITIES + '-grid');
            if (gridElement.length) {
                var gridWidget = gridElement.data('kendoGrid');
                if (gridWidget instanceof kendo.ui.Grid) {
                    // Destroying the adaptive grid is explained at
                    // http://docs.telerik.com/kendo-ui/controls/data-management/grid/adaptive#destroy-the-adaptive-grid
                    var paneElement = gridElement.closest('.km-pane-wrapper');
                    var parentElement = paneElement.parent();
                    kendo.destroy(paneElement);
                    paneElement.remove();
                    // gridElement = $('<div data-role="grid"></div>');
                    gridElement = $('<div id="' + DEVICE_SELECTOR.substr(1) + VIEW.ACTIVITIES + '-grid"></div>')
                        .appendTo(parentElement);
                }
                var culture = i18n.culture.activities;
                // Set the grid - @see http://docs.telerik.com/kendo-ui/controls/data-management/grid/adaptive
                gridWidget = gridElement.kendoGrid({
                    change: function (e) {
                        assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
                        assert.instanceof(kendo.ui.Grid, e.sender, kendo.format(assert.messages.instanceof.default, 'e.sender', 'kendo.ui.Grid'));
                        var selectedRows = e.sender.select();
                        assert.instanceof($, selectedRows, kendo.format(assert.messages.instanceof.default, 'selectedRows', 'jQuery'));
                        assert.hasLength(selectedRows, kendo.format(assert.messages.hasLength.default, 'selectedRows'));
                        var dataItem = this.dataItem(selectedRows[0]);
                        assert.instanceof(models.MobileActivity, dataItem, kendo.format(assert.messages.instanceof.default, 'dataItem', 'app.models.MobileActivity'));
                        mobile.application.navigate(DEVICE_SELECTOR + VIEW.SCORE +
                            // '?language=' + window.encodeURIComponent(dataItem.get('version.language')) +
                            // '&summaryId=' + window.encodeURIComponent(dataItem.get('version.summaryId')) +
                            // '&versionId=' + window.encodeURIComponent(dataItem.get('version.versionId')) +
                            '?activityId=' + window.encodeURIComponent(dataItem.get('id')) // Note: this is a local id, not a sid
                        );
                    },
                    columnMenu: true,
                    columns: [
                        {
                            field: 'updated',
                            format: '{0:MMM d}', // See http://docs.telerik.com/kendo-ui/framework/globalization/dateformatting
                            title: culture.grid.columns.date,
                            width: '70px'
                        },
                        {
                            field: 'version.title',
                            template: '#: title$() #',
                            title: culture.grid.columns.title
                        },
                        {
                            field: 'score',
                            template: '#: kendo.toString( score / 100, "p0") #', // See http://docs.telerik.com/kendo-ui/framework/globalization/numberformatting
                            title: culture.grid.columns.score,
                            width: '50px'
                        }
                        // TODO show sync status with icon ????
                    ],
                    dataSource: viewModel.activities, // TODO filter current user + sort by date desc
                    filterable: true,
                    // This is not properly documented but without height: 'auto', the adaptive grid is not scrollable
                    height: 'auto',
                    mobile: 'phone', // http://docs.telerik.com/kendo-ui/api/javascript/ui/grid#configuration-mobile
                    noRecords: {template: culture.grid.noRecords},
                    resizable: true,
                    scrollable: true,
                    selectable: 'row',
                    sortable: true
                    // TODO: save state (column resizing and filters)
                });
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
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeActivitiesView();
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // if (viewModel.activities instanceof models.MobileActivityDataSource && viewModel.activities.total() > 0) {
                // Already loaded
                mobile._initActivitiesGrid(e.view);
            // } else {
                // Does not hurt to reload if there are no activities
                // TODO
            // }
        };

        /**
         * Event handler triggered when showing the Categories view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onCategoriesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeCategoriesView();
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when initializing the Correction view
         * Note: the init event is triggered the first time the view is requested
         * @param e
         */
        mobile.onCorrectionViewInit = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            e.view.content.kendoTouch({
                enableSwipe: true,
                minXDelta: 200,
                maxDuration: 500,
                swipe: function (e) {
                    // Is there a way to test this has not been initiated by one of our draggables?
                    if (e.direction === 'left') {
                        viewModel.nextPage();
                    } else if (e.direction === 'right') {
                        viewModel.previousPage();
                    }
                }
            });
        };

        /**
         * Event handler triggered when showing the Correction view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onCorrectionViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            assert.isPlainObject(e.view.params, kendo.format(assert.messages.isPlainObject.default, 'e.view.params'));
            // var language = i18n.locale(); // viewModel.get(VIEW_MODEL.SETTINGS.LANGUAGE)
            // var summaryId = e.view.params.summaryId;
            // var versionId = e.view.params.versionId;
            var activityId = e.view.params.activityId;
            var page = e.view.params.page || 1;
            // assert.match(RX_MONGODB_ID, activityId, kendo.format(assert.messages.match.default, 'activityId', RX_MONGODB_ID));
            // assert.match(RX_MONGODB_ID, activityId, kendo.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeCorrectionView();
            // version is already loaded - viewModel.loadVersion({ language: language, summaryId: summaryId, versionId: versionId }),
            // activities are already loaded - viewModel.loadActivities({ language: language, userId: viewModel.get(VIEW_MODEL.USER.SID) })
            mobile._resizeStage(e.view);
            viewModel.set(VIEW_MODEL.SELECTED_PAGE, viewModel.get(VIEW_MODEL.PAGES_COLLECTION).at(page - 1));
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when showing the Favourites view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        /*
        mobile.onFavouritesViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeFavouritesView();
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
        };
        */

        /**
         * Event handler triggered before showing the Summaries view
         */
        mobile.onFinderBeforeViewShow = function () {
            // The application loader is transparent by default and covers the entire layout
            // if (mobile.application instanceof kendo.mobile.Application) {
            //     mobile.application.showLoading();
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
        mobile.onFinderViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeFinderView();
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // Launch the query
            // Kendo UI is not good at building the e.view.params object from query string params
            // Here we would typically get e.view.params like:
            // {
            //  'filter[field]': 'categories',
            //  'filter[operator]': 'eq',
            //  'filter[value]': '000100010002000000000000'
            // }
            // instead of
            // {
            //   filter: {
            //    field: 'categories',
            //    operator: 'eq',
            //    value: '000100010002000000000000'
            //   }
            // }
            var query = $.extend(true, { page: 1, pageSize: viewModel.summaries.pageSize() }, $.deparam($.param(e.view.params)));
            viewModel.loadLazySummaries(query);
            // See comment for mobile.onSummariesBeforeViewShow
            // .always(function () {
            //     mobile.application.hideLoading();
            // });
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
                minXDelta: 200,
                maxDuration: 500,
                swipe: function (e) {
                    // Is there a way to test this has not been initiated by one of our draggables?
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
            var language = i18n.locale(); // viewModel.get(VIEW_MODEL.SETTINGS.LANGUAGE)
            var summaryId = e.view.params.summaryId;
            var versionId = e.view.params.versionId;
            assert.match(RX_MONGODB_ID, summaryId, kendo.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
            assert.match(RX_MONGODB_ID, versionId, kendo.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizePlayerView();
            $.when(
                // load version to display quiz content in the player
                viewModel.loadVersion({ language: language, summaryId: summaryId, versionId: versionId }),
                // Load activities to save score in datasource
                viewModel.loadActivities({ language: language, userId: viewModel.get(VIEW_MODEL.USER.SID) })
            )
                .done(function () {
                    mobile._resizeStage(e.view);
                    viewModel.resetCurrent();
                    viewModel.set(VIEW_MODEL.SELECTED_PAGE, viewModel.get(VIEW_MODEL.PAGES_COLLECTION).at(0));
                    // Set the navigation bar buttons
                    mobile._setNavBar(e.view);
                });
        };

        /**
         * Initialize score grid
         * @param view
         * @private
         */
        mobile._initScoreGrid = function (view) {
            assert.instanceof(kendo.mobile.ui.View, view, kendo.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            var contentElement = view.element.find(kendo.roleSelector('content'));
            // Find and destroy the grid as it needs to be rebuilt if locale changes
            // Note: if the grid is set as <div data-role="grid"></div> in index.html then .km-pane-wrapper does not exist, so we need an id
            // var gridElement = view.element.find(kendo.roleSelector('grid'));
            var gridElement = contentElement.find(DEVICE_SELECTOR + VIEW.SCORE + '-grid');
            if (gridElement.length) {
                var summaryElement = contentElement.find('summary');
                var gridWidget = gridElement.data('kendoGrid');
                if (gridWidget instanceof kendo.ui.Grid) {
                    // Destroying the adaptive grid is explained at
                    // http://docs.telerik.com/kendo-ui/controls/data-management/grid/adaptive#destroy-the-adaptive-grid
                    var paneElement = gridElement.closest('.km-pane-wrapper');
                    var parentElement = paneElement.parent();
                    kendo.destroy(paneElement);
                    paneElement.remove();
                    // gridElement = $('<div data-role="grid"></div>');
                    gridElement = $('<div id="' + DEVICE_SELECTOR.substr(1) + VIEW.SCORE + '-grid"></div>')
                        .appendTo(parentElement);
                }
                var culture = i18n.culture.score;
                // Set the grid - @see http://docs.telerik.com/kendo-ui/controls/data-management/grid/adaptive
                gridWidget = gridElement.kendoGrid({
                    change: function (e) {
                        assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
                        assert.instanceof(kendo.ui.Grid, e.sender, kendo.format(assert.messages.instanceof.default, 'e.sender', 'kendo.ui.Grid'));
                        var selectedRows = e.sender.select();
                        assert.instanceof($, selectedRows, kendo.format(assert.messages.instanceof.default, 'selectedRows', 'jQuery'));
                        assert.hasLength(selectedRows, kendo.format(assert.messages.hasLength.default, 'selectedRows'));
                        var dataItem = this.dataItem(selectedRows[0]);
                        assert.instanceof(kendo.data.ObservableObject, dataItem, kendo.format(assert.messages.instanceof.default, 'dataItem', 'kendo.data.ObservableObject'));
                        var currentId = viewModel.get(VIEW_MODEL.CURRENT.ID);
                        var page = dataItem.page + 1;
                        mobile.application.navigate(DEVICE_SELECTOR + VIEW.CORRECTION +
                            // '?language=' + window.encodeURIComponent(dataItem.get('version.language')) +
                            // '&summaryId=' + window.encodeURIComponent(dataItem.get('version.summaryId')) +
                            // '&versionId=' + window.encodeURIComponent(dataItem.get('version.versionId')) +
                            '?activityId=' + window.encodeURIComponent(dataItem.get('id')) + // Note: this is a local id, not a sid
                            '&page=' + window.encodeURIComponent(page)
                        );
                    },
                    columnMenu: true,
                    columns: [
                        {
                            field: 'page',
                            template: '#: page + 1 #',
                            title: culture.grid.columns.page,
                            width: '50px'
                        },
                        // { field: 'name' },
                        {
                            field: 'description',
                            title: culture.grid.columns.description
                        },
                        // { field: 'value' },
                        // { field: 'solution' },
                        // { field: 'omit' },
                        // { field: 'failure' },
                        // { field: 'success' },
                        // { field: 'score' },
                        {
                            field: 'result',
                            title: culture.grid.columns.result,
                            template: '# var src = result ? "ok" : "error"; # <img alt="#= src #" src="#= kendo.format(app.uris.cdn.icons, src) #" class="icon">',
                            width: '50px'
                        }
                    ],
                    dataSource: {
                        // aggregate: [
                        //     { field: 'score', aggregate: 'sum' }
                        // ],
                        data: viewModel.get(VIEW_MODEL.CURRENT.TEST).getScoreArray()
                    },
                    filterable: true,
                    // This is not properly documented but without height, the adaptive grid is not scrollable
                    height: contentElement.height() - summaryElement.outerHeight(),
                    mobile: 'phone', // http://docs.telerik.com/kendo-ui/api/javascript/ui/grid#configuration-mobile
                    resizable: true,
                    scrollable: true,
                    selectable: 'row',
                    sortable: true
                    // The following displays the summary title at the top of the grid
                    // toolbar: [{ template: '<div>' + viewModel.get(VIEW_MODEL.SUMMARY.TITLE) + '</div>' }]
                    // TODO: save state (column resizing and filters)
                });
            }
        };

        /**
         * Event handler triggered when showing the score view after submitting a score
         * @param e
         */
        mobile.onScoreViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeScoreView();
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // Get the activity id from params
            var activityId = e.view.params.activityId; // Note: activityId is a local id (not a sid)
            if (RX_MONGODB_ID.test(activityId)) {
                // TODO: reload activities ???
                // If we have an activityId, replace the current test to display score and correction
                var activity = viewModel.activities.get(activityId);
                assert.instanceof(models.MobileActivity, activity, kendo.format(assert.messages.instanceof.default, 'activity', 'app.models.MobileActivity'));
                assert.equal('score', activity.type, kendo.format(assert.messages.instanceof.default, 'activity.type', 'score'));
                $.when(
                    viewModel.loadSummary({ language: i18n.locale(), id: activity.get('version.summaryId') }),
                    viewModel.loadVersion({ language: i18n.locale(), summaryId: activity.get('version.summaryId'), versionId: activity.get('version.versionId') })
                )
                    .done(function () {
                        viewModel.set(VIEW_MODEL.CURRENT.$, activity);
                        viewModel.calculate()
                            .done(function () {
                                mobile._initScoreGrid(e.view);
                            });
                    });
            } else {
                // Otherwise, use the current test
                // TODO assert current state (percent function?)
                mobile._initScoreGrid(e.view);
            }
        };

        /**
         * Event handler triggered when showing the Settings view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onSettingsViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeSettingsView();
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when clicking the Switch button of the Settings view
         * @param e
         */
        mobile.onSettingsSwitchClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, kendo.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            // Navigate to the user view
            mobile.application.navigate(DEVICE_SELECTOR + VIEW.USER);
        };

        /**
         * Event handler triggered when clicking the Reset button of the SignIn view
         * @param e
         */
        mobile.onSignInResetClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, kendo.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

            // TODO: review and add activities

            if (viewModel.users.total() === 0) {
                return app.notification.warning('Database already cleared.');
            }
            viewModel.users.data().forEach(function (user) {
                viewModel.users.remove(user);
            });

            viewModel.users.sync()
                .done(function () {
                    app.notification.success('Database cleared.');
                })
                .fail(function () {
                    app.notification.error('Error clearing database.');
                });
        };

        /**
         * Parse token and load user
         * @param url
         * @param callback
         * @private
         */
        mobile._parseTokenAndLoadUser = function (url, callback) {
            // parseToken sets the token in localStorage
            var token = rapi.util.parseToken(url);
            // No need to clean the history when opening in InAppBrowser
            if (!mobile.support.inAppBrowser) {
                rapi.util.cleanHistory();
            }
            if (token && token.error) {
                app.notification.error(i18n.culture.notifications.oAuthTokenFailure);
                logger.error({
                    message: token.error,
                    method: 'mobile._parseTokenAndLoadUser',
                    data: { url: url }
                });
                if ($.isFunction(callback)) {
                    callback();
                }
                /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
            } else if (token && token.access_token) {
                /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
                // Load the remote mobile user (me) using the oAuth token
                viewModel.loadUser()
                    .done(function () {
                        // Yield time for transition effects to complete, especially when testing in the browser
                        // Otherwise we get an exception on that.effect.stop in kendo.mobile.ViewContainer.show
                        setTimeout(function () {
                            mobile.application.navigate(DEVICE_SELECTOR + VIEW.USER);
                        }, 0);
                    })
                    .always(function () {
                        if ($.isFunction(callback)) {
                            callback();
                        }
                    });
            }
        };

        /**
         * Event handler triggered when showing the signin view
         * @param e
         */
        mobile.onSigninViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeSigninView();
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // Parse the token and load the new user when we redirect signin without InAppBrowser
            if (!mobile.support.inAppBrowser) {
                mobile._parseTokenAndLoadUser(window.location.href);
            }
        };

        /**
         * Event handler triggered when clicking a button on the sign-in view
         * @param e
         */
        mobile.onSigninButtonClick = function (e) {
            mobile.enableSigninButtons(false);
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, kendo.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            var provider = e.button.attr(kendo.attr('provider'));
            // In Phonegap, windows.location.href = "x-wmapp0:www/index.html" and Kidoju-Server cannot redirect the InAppBrowser to such location
            // The oAuth recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob" which sets the authorization code in the browser's title, however, we can't access the title of the InAppBrowser in Phonegap.
            // Several oAuth authentication providers do not support "http://localhost" (or preferably "kidoju://localhost") as a redirection url.
            // Several oAuth authentication providers require the creation and management of one application per web site root in addition to https://www.kidoju.com
            // The trick is to use a blank returnUrl at https://www.kidoju.com/api/blank with a CSP that does not allow the execution of any code
            // We can then access this returnUrl in the loadstart and loadstop events of the InAppBrowser.
            // So if we bind the loadstart event, we can find the access_token code and close the InAppBrowser after the user has granted access to their data.
            var returnUrl = mobile.support.inAppBrowser ? app.uris.rapi.blank : window.location.protocol + '//' + window.location.host + '/' + DEVICE_SELECTOR + VIEW.SIGNIN;
            // When running in a browser via phonegap serve, the InAppBrowser turns into an iframe but authentication providers prevent running in an iframe by setting 'X-Frame-Options' to 'SAMEORIGIN'
            // So if the device platform is a browser, we need to keep the sameflow as Kidoju-WebApp with a redirectUrl that targets the user view
            rapi.oauth.getSignInUrl(provider, returnUrl)
                .done(function (signInUrl) {
                    logger.debug({
                        message: 'getSignInUrl',
                        method: 'mobile.onSigninButtonClick',
                        data: { provider: provider, returnUrl: returnUrl, signInUrl: signInUrl }
                    });
                    if (mobile.support.inAppBrowser) {
                        // running in Phonegap -> open InAppBrowser
                        var close = function () {
                            browser.removeEventListener('loadstart', loadStart);
                            // browser.removeEventListener('loadstop', loadStop);
                            browser.removeEventListener('loaderror', loadError);
                            browser.close();
                            browser = undefined;
                            logger.debug({
                                message: 'closed InAppBrowser',
                                method: 'mobile.onSigninButtonClick'
                            });
                        };
                        var loadStart = function (e) {
                            // There is an incompatibility between InAppBrowser and WkWebView that prevents
                            // the loadstart event to be triggered in an oAuth flow if cordova-plugin-wkwebview-engine is installed
                            // See https://issues.apache.org/jira/browse/CB-10698
                            // See https://issues.apache.org/jira/browse/CB-11136
                            // Seems to have been fixed in https://github.com/apache/cordova-plugin-inappbrowser/pull/187
                            // Has yet to be released - https://github.com/kidoju/Kidoju-Mobile/issues/34
                            logger.debug({
                                message: 'loadstart event of InAppBrowser',
                                method: 'mobile.onSigninButtonClick',
                                data: { provider: provider, url: e.url }
                            });
                            if (e.url.startsWith(returnUrl)) {
                                mobile._parseTokenAndLoadUser(e.url, close);
                            }
                        };
                        var loadError = function (error) {
                            window.alert(JSON.stringify($.extend({}, error))); // TODO
                            logger.error({
                                message: 'loaderror event of InAppBrowser',
                                method: 'mobile.onSigninButtonClick',
                                error: error,
                                data: { url: error.url }
                            });
                            close();
                        };
                        var browser = mobile.InAppBrowser.open(signInUrl, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        // browser.addEventListener('exit', exit);
                        browser.addEventListener('loadstart', loadStart);
                        // browser.addEventListener('loadstop', loadStop);
                        browser.addEventListener('loaderror', loadError);
                        logger.debug({
                            message: 'opening InAppBrowser',
                            method: 'mobile.onSigninButtonClick'
                        });

                    } else {
                        // this is a browser --> simply redirect to login url
                        window.location.assign(signInUrl);
                    }
                })
                .fail(function (xhr, status, error) {
                    app.notification.error(i18n.culture.notifications.signinUrlFailure);
                    logger.error({
                        message: 'error obtaining a signin url',
                        method: 'mobile.onSigninButtonClick',
                        data: { provider: provider, status: status, error: error, response: xhr.responseText } // TODO xhr.responseText
                    });
                })
                .always(function () {
                    mobile.enableSigninButtons(true);
                });
        };

        /**
         * Enable/disable signin buttons (to prevent double-clicks)
         * @param enable
         */
        mobile.enableSigninButtons = function (enable) {
            $(DEVICE_SELECTOR + VIEW.SIGNIN).find(kendo.roleSelector('button')).each(function () {
                var buttonWidget = $(this).data('kendoMobileButton');
                if (buttonWidget instanceof kendo.mobile.ui.Button) {
                    buttonWidget.enable(enable);
                }
            });
        };

        /**
         * Event handler triggered when showing the summary view
         * @param e
         */
        mobile.onSummaryViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeSummaryView();
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // Scroll to the top
            e.view.scroller.reset();
            // load the summary
            var language = i18n.locale(); // viewModel.get(VIEW_MODEL.SETTINGS.LANGUAGE);
            var summaryId = e.view.params.summaryId;
            viewModel.loadSummary({ language: language, id: summaryId });
        };

        /**
         * Event handler triggered when clicking the play option in the action sheet displayed from the GO button of summaries
         */
        mobile.onSummaryActionPlay = function () {
            // assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            var language = viewModel.get(VIEW_MODEL.SUMMARY.LANGUAGE);
            assert.equal(language, i18n.locale(), language, kendo.format(assert.messages.equal.default, 'i18n.locale()', language));
            var summaryId = viewModel.get(VIEW_MODEL.SUMMARY.ID);

            // Find latest version (version history is not available in the mobile app)
            viewModel.loadLazyVersions({ language: language, summaryId: summaryId })
                .done(function () {
                    var version = viewModel.versions.at(0); // First is latest version
                    assert.instanceof(models.LazyVersion, version, kendo.format(assert.messages.instanceof.default, 'version', 'models.LazyVersion'));
                    assert.match(RX_MONGODB_ID, version.get('id'), kendo.format(assert.messages.match.default, 'version.get(\'id\')', RX_MONGODB_ID));
                    // assert.equal(language, version.get('language'), kendo.format(assert.messages.equal.default, 'version.get(\'language\')', language));
                    assert.equal(summaryId, version.get('summaryId'), kendo.format(assert.messages.equal.default, 'version.get(\'summaryId\')', summaryId));
                    mobile.application.navigate(DEVICE_SELECTOR + VIEW.PLAYER +
                        // '?language=' + window.encodeURIComponent(language) +
                        '?summaryId=' + window.encodeURIComponent(summaryId) +
                        '&versionId=' + window.encodeURIComponent(version.get('id'))
                    );
                });
        };

        /**
         * Event handler triggered when clicking the share option in the action sheet displayed from the GO button of summaries
         * @see https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
         */
        mobile.onSummaryActionShare = function () {
            // TODO: finalize mobile sharing
            if (mobile.support.socialsharing) {
                mobile.socialsharing.shareWithOptions(
                    {
                        // this is the complete list of currently supported params on can pass to the social share plugin (all optional)
                        message: 'share this', // not supported on some apps (Facebook, Instagram)
                        subject: 'the subject', // fi. for email
                        files: ['', ''], // an array of filenames either locally or remotely
                        url: 'https://www.website.com/foo/#bar?a=b',
                        chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
                    },
                    function (result) {
                        mobile.notification.info('Share completed? ' + result.completed + '/' + result.app);
                        // On Android apps mostly return result.completed=false even while it's true
                        // On Android result.app (the app shared to) is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                    },
                    function (msg) {
                        mobile.notification.error('Sharing failed: ' + msg);
                    }
                );
            }
        };

        /**
         * Event handler triggered when showing the sync view
         * @param e
         */
        mobile.onSyncViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeSyncView();
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // TODO ----------------------------------------------------------------------------------------------------------
        };

        /**
         * Event handler triggered when initializing the user view
         * @param e
         */
        mobile.onUserViewInit = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Init pin textboxes if not already initialized
            // We have removed kendo.ui.MaskedTextBox because the experience was not great
            // especially because it always displays 4 password dots making the number of characters actually typed unclear
            e.view.element.find(SELECTORS.PIN)
                .off('focus keypress')
                .on('focus', function (e) {
                    assert.instanceof($.Event, e, kendo.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                    assert.ok($(e.target).is(SELECTORS.PIN), '`e.target` should be a pin textbox');
                    $(e.target).val('');
                })
                .on('keypress', function (e) {
                    assert.instanceof($.Event, e, kendo.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                    assert.ok($(e.target).is(SELECTORS.PIN), '`e.target` should be a pin textbox');
                    // Special characters including backspace, delete, end, home and arrows do not trigger the keypress event (they trigger keydown though)
                    if (e.which < 48 || e.which > 57 || $(e.target).val().length > 3) {
                        e.preventDefault();
                    }
                });
        };

        /**
         * Event handler triggered when showing the user view
         * @param e
         */
        mobile.onUserViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeUserView();
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // Scroll to the top
            e.view.scroller.reset();
            // Display a notification
            if (viewModel.isSavedUser$()) {
                app.notification.info(i18n.culture.notifications.pinValidationInfo);
            } else {
                app.notification.info(i18n.culture.notifications.pinSaveInfo);
            }
            // Focus on PIN
            e.view.element.find(SELECTORS.PIN).val('').first().focus();
        };

        /**
         * Event handler when clicking the save button of the user view
         * @param e
         */
        mobile.onUserSaveClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, kendo.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

            // Do we have matching pins?
            var view = e.button.closest(kendo.roleSelector('view'));
            var pinElements = view.find(SELECTORS.PIN);
            assert.equal(2, pinElements.length, kendo.format(assert.messages.equal.default, 'pinElements.length', '2'));
            var pinValue = pinElements.first().val();
            var confirmValue = pinElements.last().val();

            if (RX_PIN.test(pinValue) && confirmValue === pinValue) {
                // Does the user already exist in database?
                var sid = viewModel.get(VIEW_MODEL.USER.SID);
                var found = viewModel.users.data().find(function (user) {
                    return user.get('sid') === sid;
                });
                if (!(found instanceof models.MobileUser)) {
                    // Add user
                    found = viewModel.get(VIEW_MODEL.USER.$);
                    viewModel.users.add(found);
                }
                // Set properties
                found.addPin(pinValue); // Note a good test to trigger an error is to comment this line
                found.set('lastUse', new Date());
                // Synchronize
                viewModel.users.sync()
                    .done(function () {
                        viewModel.set(VIEW_MODEL.USER.$, found);
                        // Trigger a change event to update user + settings view data bindings
                        viewModel.trigger(CHANGE, { field: VIEW_MODEL.USER.$ });
                        app.notification.success(kendo.format(i18n.culture.notifications.userSaveSuccess));
                        app.notification.success(kendo.format(i18n.culture.notifications.userSignInSuccess, viewModel.user.fullName$()));
                        mobile.application.navigate(DEVICE_SELECTOR + VIEW.CATEGORIES);
                    })
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.userSaveFailure);
                        logger.error({
                            message: 'error saving user',
                            method: 'mobile.onUserSaveClick',
                            data:  { status: status, error: error, response: xhr && (xhr.responseText || xhr.message) } // TODO xhr.responseText
                        });
                    });

            } else {
                app.notification.warning(i18n.culture.notifications.pinSaveFailure);
            }
        };

        /**
         * Event handler triggered when clicking the signin button of the user view
         * @param e
         */
        mobile.onUserSignInClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, kendo.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

            // Check the correct pin
            var view = e.button.closest(kendo.roleSelector('view'));
            var pinElement = view.find(SELECTORS.PIN + ':visible');
            assert.equal(1, pinElement.length, kendo.format(assert.messages.equal.default, 'pinElement.length', '1'));
            var pinValue = pinElement.val();

            if (viewModel.user.verifyPin(pinValue)) {
                app.notification.success(kendo.format(i18n.culture.notifications.userSignInSuccess, viewModel.user.fullName$()));
                mobile.application.navigate(DEVICE_SELECTOR + VIEW.CATEGORIES);
            } else {
                app.notification.warning(i18n.culture.notifications.pinValidationFailure);
            }
        };

        /**
         * Event handler triggered when clicking the new user button of the user view
         * @param e
         */
        mobile.onUserNewClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, kendo.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            mobile.application.navigate(DEVICE_SELECTOR + VIEW.SIGNIN);
        };

        /**
         * Event handler triggered when clicking the previous user button in the navbar
         * @param e
         */
        mobile.onNavBarPreviousUserClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, kendo.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            var viewElement = e.button.closest('.km-view');
            assert.hasLength(viewElement, kendo.format(assert.messages.hasLength.default, 'viewElement'));
            var viewWidget = viewElement.data('kendoMobileView');
            assert.instanceof(kendo.mobile.ui.View, viewWidget, kendo.format(assert.messages.instanceof.default, 'viewWidget', 'kendo.mobile.ui.View'));
            viewModel.previousUser();
            mobile._setNavBar(viewWidget);
        };

        /**
         * Event handler triggered when clicking the next user button in the navbar
         * @param e
         */
        mobile.onNavBarNextUserClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, kendo.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            var viewElement = e.button.closest('.km-view');
            assert.hasLength(viewElement, kendo.format(assert.messages.hasLength.default, 'viewElement'));
            var viewWidget = viewElement.data('kendoMobileView');
            assert.instanceof(kendo.mobile.ui.View, viewWidget, kendo.format(assert.messages.instanceof.default, 'viewWidget', 'kendo.mobile.ui.View'));
            viewModel.nextUser();
            mobile._setNavBar(viewWidget);
        };

        /**
         * Event handler triggered when clicking the first page button in the navbar
         * @param e
         */
        mobile.onNavBarFirstPageClick = function (e) {
            viewModel.firstPage();
        };

        /**
         * Event handler triggered when clicking the previous page button in the navbar
         * @param e
         */
        mobile.onNavBarPreviousPageClick = function (e) {
            viewModel.previousPage();
        };

        /**
         * Event handler triggered when clicking the next page button in the navbar
         * @param e
         */
        mobile.onNavBarNextPageClick = function (e) {
            viewModel.nextPage();
        };

        /**
         * Event handler triggered when clicking the last page button in the navbar
         * @param e
         */
        mobile.onNavBarLastPageClick = function (e) {
            viewModel.lastPage();
        };

        /**
         * Submit answers to calculate score
         * @private
         */
        mobile._submit = function () {
            viewModel.calculate()
                .done(function () { // Note: failure is already taken care of
                    viewModel.saveCurrent()
                        .done(function () {
                            mobile.application.navigate(DEVICE_SELECTOR + VIEW.SCORE);
                        });
                });
        };

        /**
         * Event handler triggered when clicking the score button in the navbar
         * @param e
         */
        mobile.onNavBarScoreClick = function (e) {
            mobile.application.navigate(DEVICE_SELECTOR + VIEW.SCORE
                // '?language=' +
                // '&summaryId=' +
                // '&versionId=' +
                // '&activityId=' +
            );
        };

        /**
         * Event handler triggered when clicking the submit button in the navbar
         * @param e
         */
        mobile.onNavBarSubmitClick = function (e) {
            kendo.alertEx({
                type: 'info',
                title: 'Error',
                message: 'Hey Houston, we\'ve got a problem!', // TODO ----------------------------------------------------------------------------------------------
                buttonLayout: 'stretched',
                actions: [
                    { action: 'yes', text: 'Yes', primary: true, imageUrl: 'https://cdn.kidoju.com/images/o_collection/svg/office/ok.svg' }, // TODO
                    { action: 'no', text: 'No', imageUrl: 'https://cdn.kidoju.com/images/o_collection/svg/office/close.svg' } // TODO
                ]
            })
                .done(function (result) {
                    if (result.action === 'yes') {
                        mobile._submit();
                    }
                });
        };

        /**
         * Event handler triggered when clicking the sync button in the navbar
         * @param e
         */
        mobile.onNavBarSyncClick = function (e) {
            $.noop(e); // TODO
        };

        /**
         * Event handler triggered when clicking the search button in the navbar
         * @param e
         */
        mobile.onNavBarSearchClick = function (e) {
            mobile.application.navigate(DEVICE_SELECTOR + VIEW.FINDER);
            // @see http://www.telerik.com/forums/hiding-filter-input-in-mobile-listview
            // var summaryView = $(DEVICE_SELECTOR + VIEW.FINDER);
            // summaryView.find(kendo.roleSelector('listview')).getKendoMobileListView()._filter._clearFilter({ preventDefault: $.noop });
            // summaryView.find('.km-filter-form').show();
        };

        /*******************************************************************************************
         * Application initialization
         *******************************************************************************************/

        if ($.type(window.cordova) === UNDEFINED) {
            // No need to wait
            mobile.onDeviceReady;
        } else {
            // Wait for Cordova to load
            document.addEventListener('deviceready', mobile.onDeviceReady, false);
        }

    }(window.jQuery));

    /* jshint +W071 */

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

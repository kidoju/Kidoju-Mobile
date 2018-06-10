/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false, __NODE_ENV__: false */

if (typeof(require) === 'function') {

    // Load other CSS
    require('../styles/vendor/khan/katex.less');
    require('../styles/kidoju.widgets.floating.less');
    require('../styles/kidoju.widgets.highlighter.less');
    require('../styles/kidoju.widgets.markdown.less');
    require('../styles/kidoju.widgets.mathexpression.less');
    require('../styles/kidoju.widgets.mathinput.less');
    require('../styles/kidoju.widgets.mediaplayer.less');
    require('../styles/kidoju.widgets.multiquiz.less');
    // require('../styles/kidoju.widgets.playbar.less');
    require('../styles/kidoju.widgets.quiz.less');
    require('../styles/kidoju.widgets.rating.less');
    require('../styles/kidoju.widgets.stage.less');
    require('../styles/kidoju.widgets.table.less');
    require('../styles/kidoju.widgets.textgaps.less');
    require('../styles/dialogs/kidoju.widgets.basedialog.less');
    require('../styles/app.fonts.less');
    require('../styles/app.mobile.less');

    // Load config
    require('./app.config.jsx?env=' + __NODE_ENV__);
    // require('./app.support.js');
}

// Hold the execution of jQuery's ready event until theme and i18n are loaded
// @see https://api.jquery.com/jquery.holdready/
window.jQuery.holdReady(true);

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
        './vendor/kendo/kendo.dataviz.core',
        './vendor/kendo/kendo.dataviz.themes',
        './vendor/kendo/kendo.dataviz.chart',
        // './vendor/kendo/kendo.dataviz.chart.polar',
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
        './common/window.assert.es6',
        './common/window.logger.es6',
        './common/window.tts.es6',
        './kidoju.data',
        './kidoju.tools',
        './kidoju.widgets.chargrid',
        './kidoju.widgets.connector',
        './kidoju.widgets.dropzone',
        './kidoju.widgets.floating',
        './kidoju.widgets.highlighter',
        './kidoju.widgets.imageset',
        './kidoju.widgets.markdown',
        './kidoju.widgets.mathexpression',
        './kidoju.widgets.mathinput',
        './kidoju.widgets.mediaplayer',
        './kidoju.widgets.multiquiz',
        // './kidoju.widgets.playbar',
        './kidoju.widgets.quiz',
        './kidoju.widgets.rating',
        './kidoju.widgets.selector',
        // './kidoju.widgets.social',
        './kidoju.widgets.stage',
        './kidoju.widgets.table',
        './kidoju.widgets.textgaps',
        './dialogs/dialogs.alert.es6',
        './app.constants',
        './app.logger',
        './app.i18n',
        './app.theme',
        './app.utils',
        './app.assets',
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
        var BACK = 'back';
        var CHANGE = 'change';
        var CLICK = 'click';
        var FOCUS = 'focus';
        var TAP = 'tap';
        var INPUT = 'input';
        var KEYDOWN = 'keydown';
        var KEYPRESS = 'keypress';
        var APPINIT = 'app.init';
        var LOADED = 'i18n.loaded';
        var RX_LANGUAGE = /^[a-z]{2}$/;
        var RX_MONGODB_ID = /^[0-9a-f]{24}$/;
        var RX_PIN = /^[\d]{4}$/;
        var VIRTUAL_PAGE_SIZE = 30; // Display 10 items * 3 DOM Element * 2
        // First 4 bytes define the language
        // Following 4 bytes define the selected top category
        var LEVEL_CHARS = 4;
        var TOP_LEVEL_CHARS = 2 * LEVEL_CHARS;
        var RX_TOP_LEVEL_MATCH = new RegExp('^[a-z0-9]{' + TOP_LEVEL_CHARS + '}0{' + (24 - TOP_LEVEL_CHARS) + '}$');
        var SIGNIN_PAGE = 3; // Last page of walkthrough tour
        var HASH = '#';
        var LAYOUT = {
            MAIN: 'main-layout'
        };
        var VIEW = {
            ACTIVITIES: 'activities',
            CATEGORIES: 'categories',
            CORRECTION: 'correction',
            DEFAULT: 'activities', // <---------- url is '/'
            DRAWER: 'drawer',
            // FAVOURITES: 'favourites',
            FINDER: 'finder',
            NETWORK: 'network',
            PLAYER: 'player',
            SCORE: 'score',
            SETTINGS: 'settings',
            SUMMARY: 'summary',
            SIGNIN: 'signin',
            SYNC: 'sync',
            USER: 'user'
        };
        var RX_OFFLINE_PAGES = new RegExp('^(' + [VIEW.ACTIVITIES, VIEW.CATEGORIES, VIEW.CORRECTION, VIEW.FINDER, VIEW.NETWORK, VIEW.PLAYER, VIEW.SCORE, VIEW.SETTINGS, VIEW.SUMMARY, VIEW.USER].join('|') + ')', 'i');
        var DISPLAY = {
            INLINE: 'inline-block',
            NONE: 'none',
            TABLE: 'table'
        };
        var VIEW_MODEL = {
            ACTIVITIES: 'activities',
            CATEGORIES: 'categories',
            CURRENT: {
                $: 'current',
                ID: 'current.id',
                SCORE: 'current.score',
                TEST: 'current.test',
                UPDATED: 'current.updated',
                VERSION: {
                    LANGUAGE: 'current.version.language',
                    SUMMARY_ID: 'current.version.summaryId',
                    VERSION_ID: 'current.version.versionId'
                }
            },
            LANGUAGE: 'language',
            LANGUAGES: 'languages',
            PAGES_COLLECTION: 'version.stream.pages',
            SELECTED_PAGE: 'selectedPage',
            SUMMARY: {
                $: 'summary',
                CATEGORY_ID: 'summary.categoryId',
                DESCRIPTION: 'summary.description',
                ID: 'summary.id',
                LANGUAGE: 'summary.language',
                TITLE: 'summary.title'
            },
            SUMMARIES: 'summaries',
            THEME: 'theme',
            THEMES: 'themes',
            USER: {
                $: 'user',
                ROOT_CATEGORY_ID: 'user.rootCategoryId',
                FIRST_NAME: 'user.firstName',
                ID: 'user.id',
                // LANGUAGE: 'user.language',
                LAST_NAME: 'user.lastName',
                LAST_SYNC: 'user.lastSync',
                LAST_USE: 'user.lastUse',
                PROVIDER: 'user.provider',
                REVIEW_STATE: 'user.reviewState',
                SID: 'user.sid'
                // THEME: 'user.theme'
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
        var RX_APP_SCHEME = new RegExp('^' + app.constants.appScheme + '://([a-z]{2})/(e|s|x)/([0-9a-f]{24})($|/|\\?|#)');
        var RX_HELP_URL = new RegExp('^' + app.constants.helpUrl);
        var RX_REVIEW_SCHEMES = /^(itms-apps|market|ms-windows-store):\/\//;
        var DEFAULT = {
            ROOT_CATEGORY_ID: {
                en: app.constants.rootCategoryId.en || '000100010000000000000000',
                fr: app.constants.rootCategoryId.fr || '000200010000000000000000'
            }
        };
        var ANALYTICS = {
            CATEGORY: {
                ACTIVITY: 'Activity',
                GENERAL: 'General',
                SUMMARY: 'Summary',
                USER: 'User'
            },
            ACTION: {
                APP_REVIEW: 'App Review',
                FEEDBACK: 'Feedback',
                HELP: 'Help',
                INIT: 'Init',
                PLAY: 'Play',
                SAVE: 'Save',
                SCORE: 'Score',
                SHARE: 'Share w/',
                SIGNIN: 'Signin'
            }
        };

        /*******************************************************************************************
         * Global handlers
         *******************************************************************************************/

        /**
         * Global error event handler
         * @param message
         * @param source
         * @param lineno
         * @param colno
         * @param error
         */
        window.onerror = function (message, source, lineno, colno, error) {
            // setTimeout is for SafariViewController and InAppBrowser
            setTimeout(function () {
                // Show error notification
                if (i18n.culture && app.notification && $.isFunction(app.notification.error)) {
                    app.notification.error(i18n.culture.notifications.unknownError);
                }
                // Log
                if (logger && $.isFunction(logger.crit)) {
                    logger.crit({
                        message: message,
                        method: 'window.onerror',
                        error: error,
                        data: { source: source, lineno: lineno, colno: colno }
                    });
                }
                // Notify google analytics
                if (mobile.support.ga) {
                    mobile.ga.trackException(message, true);
                }
                // Display alert when debugging
                if (app.DEBUG) {
                    window.alert(message);
                }
                // Hide loading
                if (mobile.application instanceof kendo.mobile.Application) {
                    mobile.application.hideLoading();
                }
            }, 0);
        };

        /**
         * By default jQuery has no timeout (0), but let's time out any $.ajax request at 20sec on mobile devices
         */
        $.ajaxSetup({
            timeout: 20000 // Timeout in milliseconds
        });

        /**
         * Function to handle open Url
         * @param url
         */
        function handleOpenURL(url) {
            if (url.startsWith(app.constants.appScheme + '://oauth')) {
                // The whole oAuth flow is documented at
                // https://medium.com/@jlchereau/stop-using-inappbrowser-for-your-cordova-phonegap-oauth-flow-a806b61a2dc5
                mobile._parseTokenAndLoadUser(url);
            } else if (RX_APP_SCHEME.test(url)) {
                var matches = RX_APP_SCHEME.exec(url);
                // Note: we have already tested the url, so we know there is a match
                var language = matches[1];
                var summaryId = matches[3];
                if (language === i18n.locale()) {
                    mobile.application.navigate(HASH + VIEW.SUMMARY + '?language=' + encodeURIComponent(language) + '&summaryId=' +
                        encodeURIComponent(summaryId));
                } else {
                    app.notification.warning(i18n.culture.notifications.openUrlLanguage);
                }
            } else if (RX_HELP_URL.test(url) || RX_REVIEW_SCHEMES.test(url)) {
                // For whatever reason, calling help in mobile._openHelp triggers handleOpenUrl on iOS (but not on Android)
                // For whatever reason, calling review schemes in mobile._requestAppStoreReview triggers handleOpenUrl on iOS (but not on Android)
                $.noop();
            } else {
                logger.warn({
                    message: 'App scheme called with unknown url',
                    method: 'window.handleOpenURL',
                    data: { url: url }
                });
                app.notification.warning(i18n.culture.notifications.openUrlUnknown);
            }
            // Trying to accelerate the hiding of the splash screen does not help
            // if (mobile.support.splashscreen) { mobile.splashscreen.hide(); }
        }

        /**
         * Event handler triggered when calling a url with the com.kidoju.mobile:// scheme
         * @param url
         */
        window.handleOpenURL = function (url) {

            // Hide the SafariViewController in all circumstances
            // This has to be done before the setTimeout otherwise the SafariViewController does not close in iOS
            // mobile.support.safariViewController is iOS only until https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller/issues/51
            if (mobile.support.safariViewController) {
                try {
                    mobile.SafariViewController.hide();
                } catch (ex) {
                    // They say mobile.SafariViewController.hide is not implemented on Android
                    // https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller/issues/62
                }
            }

            if (mobile.application instanceof kendo.mobile.Application && $.isPlainObject(i18n.culture)) {
                // iOS goes through this branch
                // browser apps use a simple redirection which does not require a custom url scheme
                setTimeout(function () { handleOpenURL(url); }, 0);
            } else {
                // Android creates a new intent to perform the task, triggering onDeviceReady and actually reloading the app
                // So we have added an APPINIT event which is triggered form the init event handler of kendo.mobile.Application
                // At this stage mobile.application and i18n.culture are available for any statement in handleOpenURL
                // TODO: Check that this is still going on since launchMode singleTask
                $(document).one(APPINIT, function () { handleOpenURL(url); });
            }
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
         * Helpers
         *******************************************************************************************/

        /**
         * JSON parse wrapped in a try/catch
         * @param xhr
         */
        function parseResponse(xhr) {
            try {
                return JSON.parse(xhr.responseText);
            } catch (ex) {}
        }

        /* This function's cyclomatic complexity is too high. */
        /* jshint -W074 */

        /**
         * These shortcuts can only be set in onDeviceReady when all cordova plugins are loaded
         * This is also structured so as to work in a browser independently from `phonegap serve`
         */
        function setShortcuts () {
            /* jshint maxcomplexity: 9 */
            mobile.support = {
                barcodeScanner: window.cordova && window.cordova.plugins && !!window.cordova.plugins.barcodeScanner && $.isFunction(window.cordova.plugins.barcodeScanner.scan),
                cordova: $.type(window.cordova) !== UNDEFINED,
                dialogs: window.navigator && !!window.navigator.notification && $.isFunction(window.navigator.notification.alert) && $.isFunction(window.navigator.notification.confirm),
                ga: !!window.ga && $.isFunction(window.ga.startTrackerWithId),
                // Note: InAppBrowser uses iFrame on browser platform which is incompatible with oAuth flow
                inAppBrowser: window.cordova && window.device && window.device.platform !== 'browser' && !!window.cordova.InAppBrowser && $.isFunction(window.cordova.InAppBrowser.open),
                // Note: it will have to be changed once the following is fixed - https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller/issues/51
                safariViewController: window.cordova && window.device && window.device.platform !== 'browser' && !!window.SafariViewController && $.isFunction(window.SafariViewController.show),
                // safariViewController: window.cordova && window.device && window.device.platform === 'iOS' && window.SafariViewController && $.isFunction(window.SafariViewController.show),
                socialsharing: window.plugins && !!window.plugins.socialsharing && $.isFunction(window.plugins.socialsharing.shareWithOptions),
                splashscreen: window.navigator && !!window.navigator.splashscreen && $.isFunction(window.navigator.splashscreen.hide)
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
            // SafariViewController requires cordova-plugin-safariviewcontroller
            if (mobile.support.safariViewController) {
                mobile.SafariViewController = window.SafariViewController;
            }
            // notification requires cordova-plugin-dialogs
            mobile.dialogs = {
                confirm: function (message, callback, title, buttons) {
                    if (mobile.support.dialogs) {
                        window.navigator.notification.confirm(message, callback, title || i18n.culture.dialogs.confirm, Array.isArray(buttons) ? buttons : [i18n.culture.dialogs.buttons.ok.text, i18n.culture.dialogs.buttons.cancel.text]);
                    } else {
                        kidoju.dialogs.openAlert({
                            type: 'info',
                            title: title || i18n.culture.dialogs.confirm,
                            message: message,
                            buttonLayout: 'stretched',
                            actions: [
                                {
                                    action: 'ok',
                                    text: (Array.isArray(buttons) && buttons.length > 1 ? buttons[0] : i18n.culture.dialogs.buttons.ok.text),
                                    primary: true,
                                    imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.ok.icon)
                                },
                                {
                                    action: 'cancel',
                                    text: (Array.isArray(buttons) && buttons.length > 1 ? buttons[1] : i18n.culture.dialogs.buttons.cancel.text),
                                    imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.cancel.icon)
                                }
                            ]
                        })
                            .done(function (result) {
                                if (result.action === 'ok') {
                                    callback(1);
                                } else {
                                    callback(2);
                                }
                            });
                    }
                },
                error: function (message, callback) {
                    if (mobile.support.dialogs) {
                        // window.navigator.notification.beep(1);
                        window.navigator.notification.alert(message, callback, i18n.culture.dialogs.error, i18n.culture.dialogs.buttons.ok.text);
                    } else {
                        kidoju.dialogs.openAlert({
                            type: 'error',
                            title: i18n.culture.dialogs.error,
                            message: message,
                            buttonLayout: 'stretched',
                            actions: [{
                                action: 'ok',
                                text: i18n.culture.dialogs.buttons.ok.text,
                                primary: true,
                                imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.ok.icon)
                            }]
                        }).done(callback);
                    }
                },
                info: function (message, callback) {
                    if (mobile.support.dialogs) {
                        window.navigator.notification.alert(message, callback, i18n.culture.dialogs.info, i18n.culture.dialogs.buttons.ok.text);
                    } else {
                        kidoju.dialogs.openAlert({
                            type: 'info',
                            title: i18n.culture.dialogs.info,
                            message: message,
                            buttonLayout: 'stretched',
                            actions: [{
                                action: 'ok',
                                text: i18n.culture.dialogs.buttons.ok.text,
                                primary: true,
                                imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.ok.icon)
                            }]
                        }).done(callback);
                    }
                },
                success: function (message, callback) {
                    if (mobile.support.dialogs) {
                        window.navigator.notification.alert(message, callback, i18n.culture.dialogs.success, i18n.culture.dialogs.buttons.ok.text);
                    } else {
                        kidoju.dialogs.openAlert({
                            type: 'success',
                            title: i18n.culture.dialogs.success,
                            message: message,
                            buttonLayout: 'stretched',
                            actions: [{
                                action: 'ok',
                                text: i18n.culture.dialogs.buttons.ok.text,
                                primary: true,
                                imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.ok.icon)
                            }]
                        }).done(callback);
                    }
                },
                warning: function (message, callback) {
                    if (mobile.support.dialogs) {
                        window.navigator.notification.alert(message, callback, i18n.culture.dialogs.warning, i18n.culture.dialogs.buttons.ok.text);
                    } else {
                        kidoju.dialogs.openAlert({
                            type: 'warning',
                            title: i18n.culture.dialogs.warning,
                            message: message,
                            buttonLayout: 'stretched',
                            actions: [{
                                action: 'ok',
                                text: i18n.culture.dialogs.buttons.ok.text,
                                primary: true,
                                imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.ok.icon)
                            }]
                        }).done(callback);
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

        /* jshint +W074 */

        /*******************************************************************************************
         * Google Analytics setup
         *******************************************************************************************/

        /**
         * Setup analytics
         * @see https://github.com/danwilson/google-analytics-plugin
         */
        function setAnalytics () {
            if (mobile.support.ga) {

                // Set up analytics tracker
                mobile.ga.startTrackerWithId(app.constants.gaTrackingId);

                // Set a specific app version:
                mobile.ga.setAppVersion(app.version);

                // Add custom dimensions
                // window.ga.addCustomDimension(Key, 'Value', success, error)
                mobile.ga.addCustomDimension(1, app.constants.appScheme);

                // Enable automatic reporting of uncaught exceptions
                // mobile.ga.enableUncaughtExceptionReporting(true, success, error);
                // success/error callbacks are triggered to confirm the setting not when an error occurs
                mobile.ga.enableUncaughtExceptionReporting(true);

                if (app.DEBUG || (window.device && window.device.platform === 'browser')) {
                    // Enable verbose logging
                    mobile.ga.debugMode();
                }

                // Application launch
                mobile.ga.trackEvent(
                    ANALYTICS.CATEGORY.GENERAL,
                    ANALYTICS.ACTION.INIT
                );

            }
        }

        /*******************************************************************************************
         * viewModel
         *******************************************************************************************/

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
             * Language
             * Note: we do not define a user language because we need to load cultures before any user is actually signed in and changing language afterwards is a bit awkward
             */
            language: i18n.locale(),

            /**
             * Languages
             */
            languages: [],

            /**
             * The selected page displayed in the player
             */
            selectedPage: undefined,

            /**
             * Summaries
             */
            summaries: new models.LazySummaryDataSource({ pageSize: VIRTUAL_PAGE_SIZE }),

            /**
             * Selected summary
             */
            summary: new models.Summary(),

            /**
             * Theme
             * Note: we do not define a user theme because we need a theme before any user is actually signed in and changing theme afterwards is a bit awkward
             */
            theme: app.theme.name(),

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
             * Whether the app has a constant author id
             */
            hasConstantAuthorId$: function () {
                return !!app.constants.authorId;
            },

            /**
             * Whether the app has a constant language
             */
            hasConstantLanguage$: function () {
                return !!app.constants.language;
            },

            /**
             * Whether the app has a constant theme
             */
            hasConstantTheme$: function () {
                return !!app.constants.theme;
            },

            /**
             * Whether the app has a constant top category id
             */
            hasConstantRootCategoryId$: function () {
                return !!app.constants.rootCategoryId[i18n.locale()];
            },

            /**
             * Social Sharing feature detection (remove actionsheet menu option)
             * @returns {protocol|*|SocialSharing}
             */
            hasSocialSharing$: function () {
                return !!mobile.support.socialsharing && !app.constants.appleKidSafety;
            },

            /**
             * Allow browsing the internet
             * Dissabled only help
             * @returns {boolean}
             */
            hasInternetBrowsing$: function () {
                return !app.constants.appleKidSafety;
            },

            /**
             * Check first user
             */
            isFirstUser$: function () {
                var user = this.get(VIEW_MODEL.USER.$);
                var userDataSource = this.get(VIEW_MODEL.USERS);
                assert.instanceof(models.MobileUserDataSource, userDataSource, assert.format(assert.messages.instanceof.default, 'userDataSource', 'app.models.MobileUserDataSource'));
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
                assert.instanceof(models.MobileUserDataSource, userDataSource, assert.format(assert.messages.instanceof.default, 'userDataSource', 'app.models.MobileUserDataSource'));
                var index = userDataSource.indexOf(user);
                return !user.isNew() && index === userDataSource.total() - 1;
            },

            /**
             * Current user is set and new
             */
            isNewUser$: function () {
                var user = viewModel.get(VIEW_MODEL.USER.$);
                return (user instanceof models.MobileUser) && user.isNew() && (viewModel.users.indexOf(user) > -1);
            },

            /**
             * Current user set (and saved)
             */
            isSavedUser$: function () {
                var user = viewModel.get(VIEW_MODEL.USER.$);
                // The following ensures thet #user button bindings are refreshed when pressing "Change PIN" following mobile.onUserChangePin
                viewModel.get(VIEW_MODEL.USER.LAST_USE);
                return (user instanceof models.MobileUser) && !user.isNew() && !user.dirty && (viewModel.users.indexOf(user) > -1);
            },

            /**
             * Current user saved and synced in the last 30 days
             */
            isSyncedUser$: function () {
                var user = viewModel.get(VIEW_MODEL.USER.$);
                return (user instanceof models.MobileUser) && !user.isNew() && (viewModel.users.indexOf(user) > -1) && (Date.now() <= user.lastSync.getTime() + 30 * 24 * 60 * 60 * 1000);
            },

            /**
             * Check first page
             * @returns {boolean}
             */
            isFirstPage$: function () {
                var page = this.get(VIEW_MODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
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
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                return index === -1 || index === pageCollectionDataSource.total() - 1;
            },

            /**
             * Language name from selected value
             */
            language$: function () {
                var value = this.get(VIEW_MODEL.LANGUAGE);
                var found = this.get(VIEW_MODEL.LANGUAGES).filter(function (language) {
                    return language.value === value;
                });
                return found[0] && found[0].text;
            },

            /**
             * Return current page
             * @returns {*}
             */
            page$: function () {
                var page = this.get(VIEW_MODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                return pageCollectionDataSource.indexOf(page) + 1;
            },

            /**
             * The users's root category id
             */
            rootCategoryId$: function () {
                var id = this.get(VIEW_MODEL.USER.ROOT_CATEGORY_ID);
                var found = this.get(VIEW_MODEL.CATEGORIES).get(id);
                return found && found.name;
            },

            /**
             * Summary category
             */
            summaryCategory$: function () {
                var ret = '';
                var categoryId = this.get(VIEW_MODEL.SUMMARY.CATEGORY_ID);
                var category = this.get(VIEW_MODEL.CATEGORIES).get(categoryId);
                if (category instanceof models.LazyCategory && $.isFunction(category.path.map) && category.path.length) {
                    var path = category.path.map(function (item) {
                        return item.name;
                    });
                    ret = '<span>' + path.join('</span><span class="k-icon k-i-arrow-60-right"></span><span>') + '</span>';
                }
                return ret;
            },

            /**
             * Theme name form selected value
             */
            theme$: function () {
                var value = this.get(VIEW_MODEL.THEME);
                var found = this.get(VIEW_MODEL.THEMES).filter(function (theme) {
                    return theme.value === value;
                });
                return found[0] && found[0].text;
            },

            /**
             * Return total number of pages
             */
            totalPages$: function () {
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                return pageCollectionDataSource.total();
            },

            /**
             * Return an array of top-level categories (ordered by id)
             */
            topCategories$: function () {
                var categories = this.get(VIEW_MODEL.CATEGORIES);
                return categories.data()
                    .filter(function (category) {
                        return (RX_TOP_LEVEL_MATCH).test(category.id);
                    })
                    .sort(function (category1, category2) {
                        if (category1.id < category2.id) {
                            return -1;
                        } else if (category1.id > category2.id) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
            },

            /**
             * Application version
             */
            version$: function () {
                return app.version;
            },

            /**
             * Resets all data when switching language or users
             * Important: this cannot be a promise so loading has to occur elsewhere
             */
            reset: function () {
                // i18n.culture must be loaded
                assert.isPlainObject(i18n.culture, assert.format(assert.messages.isPlainObject.default, 'app.i18n.culture'));
                var language = i18n.locale();
                // Note: we are  assigning app._userId so that app.models.Summary.fields['userScore'].parse can find the userId
                var userId = app._userId = this.get(VIEW_MODEL.USER.SID);
                var rootCategoryId = this.get(VIEW_MODEL.USER.ROOT_CATEGORY_ID) || DEFAULT.ROOT_CATEGORY_ID[language];

                // List of activities
                var activities = this.get(VIEW_MODEL.ACTIVITIES);
                assert.instanceof(models.MobileActivityDataSource, activities, assert.format(assert.messages.instanceof.default, 'activities', 'app.models.MobileActivityDataSource'));
                activities.transport.partition({
                    'actor.userId': userId,
                    // Note: Until we introduce bundles, synchronization remains limited to score activities with the same scheme
                    scheme: app.constants.appScheme,
                    type: 'Score',
                    'version.language': language
                });

                // List of categories
                this.get(VIEW_MODEL.CATEGORIES).filter({ field: 'id', operator: 'startsWith', value: rootCategoryId.substr(0, TOP_LEVEL_CHARS) });

                // Current score/test
                this.set(VIEW_MODEL.CURRENT.$, { test: undefined });

                // Favorites are not yet implemented
                // this.set('favourites', []);

                // Languages
                // this.set(VIEW_MODEL.LANGUAGE, language);
                this.set(VIEW_MODEL.LANGUAGES, i18n.culture.viewModel.languages);

                // Selected player page
                this.set(VIEW_MODEL.SELECTED_PAGE, undefined);

                // Search (per category or full text)
                var summaries = this.get(VIEW_MODEL.SUMMARIES);
                assert.instanceof(models.LazySummaryDataSource, summaries, assert.format(assert.messages.instanceof.default, 'summaries', 'app.models.LazySummaryDataSource'));
                summaries.setUserId(userId);
                summaries.transport.partition({
                    'author.userId': app.constants.authorId,
                    language: language,
                    type: 'Test'
                });

                // Summary being played
                this.set(VIEW_MODEL.SUMMARY.$, new models.Summary());

                // Themes
                // this.set(VIEW_MODEL.THEME, app.theme.name());
                this.set(VIEW_MODEL.THEMES, i18n.culture.viewModel.themes);

                // Do not change the user as a change of language or user has brought us here
                // otherwise viewModel.bind(CHANGE, ...) will create an infinite loop and a stack overflow

                // Version being played
                this.set(VIEW_MODEL.VERSION.$, new models.Version());

                // Other versions in the same summary (only used to play the latest)
                var versions = this.get(VIEW_MODEL.VERSIONS);
                assert.instanceof(models.LazyVersionDataSource, versions, assert.format(assert.messages.instanceof.default, 'versions', 'app.models.LazyVersionDataSource'));
                versions.transport.partition({
                    language: language,
                    summaryId: '000000000000000000000000'
                }); // resets partition

                // Google analytics
                if (mobile.support.ga) {
                    mobile.ga.setUserId(userId);
                    // mobile.ga.addCustomDimension(1, app.constants.appScheme);
                    mobile.ga.addCustomDimension(2, language);
                    mobile.ga.addCustomDimension(3, rootCategoryId);
                }
            },

            /**
             * Load viewModel when starting the app or changing language
             */
            load: function () {
                // Load mobile users from localForage
                return viewModel.loadUsers()
                    .done(function () {
                        // Set user to most recent user
                        if (viewModel.users.total() > 0) {
                            // because of the change event is bound, the following will call the reset function above
                            viewModel.set(VIEW_MODEL.USER.$, viewModel.users.at(0));
                        }
                    });
            },

            /**
             * Load user activities
             * @param options
             */
            loadActivities: function (options) {
                assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
                assert.match(RX_LANGUAGE, options.language, assert.format(assert.messages.match.default, 'options.language', RX_LANGUAGE));
                assert.match(RX_MONGODB_ID, options.userId, assert.format(assert.messages.match.default, 'options.userId', RX_MONGODB_ID));
                var activities = this.get(VIEW_MODEL.ACTIVITIES);
                var partition = activities.transport.partition();
                var dfd = $.Deferred();
                if (partition['version.language'] === options.language &&
                    partition['actor.userId'] === options.userId &&
                    activities.total() > 0 &&
                    activities.at(0).version.language === options.language &&
                    activities.at(0).actor.id === options.userId
                ) {
                    dfd.resolve();
                } else {
                    activities.transport.partition({
                        'actor.userId': options.userId,
                        // Note: Until we introduce bundles, synchronization remains limited to score activities with the same scheme
                        scheme: app.constants.appScheme,
                        type: 'Score',
                        'version.language': options.language
                    });
                    activities._filter = undefined;
                    activities.read()
                        .done(dfd.resolve)
                        .fail(function (xhr, status, error) {
                            dfd.reject(xhr, status, error);
                            app.notification.error(i18n.culture.notifications.activitiesQueryFailure);
                            logger.error({
                                message: 'error loading activities',
                                method: 'viewModel.loadActivities',
                                data: { status: status, error: error, response: parseResponse(xhr) }
                            });
                        });
                }
                return dfd.promise();
            },

            /**
             * Load lazy summaries
             * @param options
             */
            loadLazySummaries: function (options) {
                assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.partition, assert.format(assert.messages.isPlainObject.default, 'options.partition'));
                assert.match(RX_LANGUAGE, options.partition.language, assert.format(assert.messages.match.default, 'options.partition.language', RX_LANGUAGE));
                return viewModel.summaries.load(options)
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.summariesQueryFailure);
                        logger.error({
                            message: 'error loading summaries',
                            method: 'viewModel.loadLazySummaries',
                            data: { options: options, status: status, error: error, response: parseResponse(xhr) }
                        });
                    });
            },

            /**
             * Load summary from remote servers
             * @param options
             */
            loadSummary: function (options) {
                assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
                assert.match(RX_LANGUAGE, options.language, assert.format(assert.messages.match.default, 'options.language', RX_LANGUAGE));
                assert.match(RX_MONGODB_ID, options.id, assert.format(assert.messages.match.default, 'options.id', RX_MONGODB_ID));
                return viewModel.summary.load(options)
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.summaryLoadFailure);
                        logger.error({
                            message: 'error loading summary',
                            method: 'viewModel.loadSummary',
                            data: { status: status, error: error, response: parseResponse(xhr) }
                        });
                    });
            },

            /**
             * Load me from remote server
             * @returns {*}
             */
            loadUser: function () {
                var dfd = $.Deferred();
                // Search me in viewModel.users or create new viewModel.user and add it to viewModel.users
                app.cache.removeMe();
                app.cache.getMe()
                    .done(function (me) {
                        assert.isPlainObject(me, assert.format(assert.messages.isPlainObject.default, 'me'));
                        assert.match(RX_MONGODB_ID, me.id, assert.format(assert.messages.match.default, 'me.id', RX_MONGODB_ID));
                        // Search for me in the users data source
                        var user = viewModel.users.data().find(function (data) {
                            return data.get('sid') === me.id;
                        });
                        if (user instanceof models.MobileUser) {
                            // Update user picture (firstName and lastName are currently not editable)
                            // user.set('firstName', me.firstName);
                            // user.set('lastName', me.lastName);
                            user.set('picture', me.picture);
                        } else {
                            // If not found, create a new user
                            user = new models.MobileUser({
                                // id: user.defaults.id, // Without default id, 'isNew' and 'sync' won't work
                                sid: me.id,
                                firstName: me.firstName,
                                lastName: me.lastName,
                                // lastSync: user.defaults.lastSync,
                                // lastUse: user.defaults.lastUse(),
                                // md5pin: user.defaults.md5pin,
                                picture: me.picture,
                                provider: localStorage.getItem('provider') // Set in mobile.onSigninButtonClick // TODO Manage localStorage errors
                                // rootCategoryId: user.defaults.rootCategoryId()
                            });
                            viewModel.users.add(user);
                        }
                        // Set default user
                        viewModel.set(VIEW_MODEL.USER.$, user);
                        // Remove provider from local storage
                        localStorage.removeItem('provider'); // TODO: Manage localStorage errors
                        // Note: At this stage user is not saved in database
                        dfd.resolve(user);
                    })
                    .fail(function (xhr, status, error) {
                        dfd.reject(xhr, status, error);
                        app.notification.error(i18n.culture.notifications.userLoadFailure);
                        logger.error({
                            message: 'error loading user',
                            method: 'viewModel.loadUser',
                            data: { status: status, error: error, response: parseResponse(xhr) }
                        });
                    });
                return dfd.promise();
            },

            /**
             * Load users
             * @returns {*}
             */
            loadUsers: function () {
                var dfd = $.Deferred();
                if (viewModel.users.total() > 0) {
                    dfd.resolve();
                } else {
                    viewModel.users.query({ sort: { field: 'lastUse', dir: 'desc' } })
                        .done(dfd.resolve)
                        .fail(function (xhr, status, error) {
                            dfd.reject(xhr, status, error);
                            app.notification.error(i18n.culture.notifications.usersQueryFailure);
                            logger.error({
                                message: 'error loading users',
                                method: 'viewModel.loadUsers',
                                data: { status: status, error: error, response: parseResponse(xhr) }
                            });
                        });
                }
                return dfd.promise();
            },

            /**
             * Synchronize users
             * @param showSuccessMessage (true by default)
             * @returns {*}
             */
            syncUsers: function (showSuccessMessage) {
                // Synchronize
                return viewModel.users.sync()
                    .done(function () {
                        if (showSuccessMessage !== false) {
                            // Yield some time for #settings dropdown boxes to close
                            setTimeout(function () {
                                app.notification.success(kendo.format(i18n.culture.notifications.userSaveSuccess));
                            }, 10);
                        }
                    })
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.userSaveFailure);
                        logger.error({
                            message: 'error syncing users',
                            method: 'viewModel.syncUsers',
                            // Note: status and error are undefined because of deferred.reject(response) in _promise method
                            // at https://github.com/telerik/kendo-ui-core/blob/master/src/kendo.data.js#L3195
                            data: { status: status, error: error, response: parseResponse(xhr) }
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
                    app.notification.error(i18n.culture.notifications.versionLoadFailure);
                    logger.error({
                        message: 'error loading version',
                        method: 'viewModel.loadVersion',
                        data: { language: options.language, summaryId: options.summaryId, versionId: options.versionId, response: parseResponse(xhr) }
                    });
                }

                // Load version and pages
                assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
                assert.match(RX_LANGUAGE, options.language, assert.messages.match.default, 'options.language', RX_LANGUAGE);
                assert.match(RX_MONGODB_ID, options.summaryId, assert.messages.match.default, 'options.summaryId', RX_MONGODB_ID);
                assert.match(RX_MONGODB_ID, options.id, assert.messages.match.default, 'options.id', RX_MONGODB_ID);
                return viewModel.version.load(options)
                    .done(function () {
                        // Load stream
                        viewModel.version.stream.load()
                            .done(function () {
                                var promises = [];
                                var pageCollectionDataSource = viewModel.get(VIEW_MODEL.PAGES_COLLECTION);
                                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                                $.each(pageCollectionDataSource.data(), function (idx, page) {
                                    assert.instanceof(Page, page, assert.format(assert.messages.instanceof.default, 'page', 'kidoju.data.Page'));
                                    promises.push(page.load());
                                });
                                $.when.apply($, promises).fail(versionLoadFailure);
                            })
                            .fail(versionLoadFailure);
                    })
                    .fail(versionLoadFailure);

            },

            /**
             * Load lazy versions of a summary
             * @param options
             */
            loadLazyVersions: function (options) {
                assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.partition, assert.format(assert.messages.isPlainObject.default, 'options.partition'));
                assert.match(RX_LANGUAGE, options.partition.language, assert.messages.match.default, 'options.partition.language', RX_LANGUAGE);
                assert.match(RX_MONGODB_ID, options.partition.summaryId, assert.messages.match.default, 'options.partition.summaryId', RX_MONGODB_ID);
                return viewModel.versions.load(options)
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.versionsLoadFailure);
                        logger.error({
                            message: 'error loading versions',
                            method: 'viewModel.loadLazyVersions',
                            data: {
                                options: options,
                                status: status,
                                error: error,
                                response: parseResponse(xhr)
                            }
                        });
                    });
            },

            /**
             * Select the previous page from viewModel.version.stream.pages
             */
            previousUser: function () {
                var user = this.get(VIEW_MODEL.USER.$);
                var userDataSource = this.get(VIEW_MODEL.USERS);
                assert.instanceof(models.MobileUserDataSource, userDataSource, assert.format(assert.messages.instanceof.default, 'userDataSource', 'app.models.MobileUserDataSource'));
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
                assert.instanceof(models.MobileUserDataSource, userDataSource, assert.format(assert.messages.instanceof.default, 'userDataSource', 'app.models.MobileUserDataSource'));
                var index = userDataSource.indexOf(user);
                if ($.type(index) === NUMBER && index < userDataSource.total() - 1) {
                    this.set(VIEW_MODEL.USER.$, userDataSource.at(index + 1));
                }
            },

            /**
             * Select the previous page from viewModel.version.stream.pages
             */
            firstPage: function () {
                logger.debug({ method: 'viewModel.firstPage', message: 'Show first page' });
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(0));
                app.tts.cancelSpeak();
            },

            /**
             * Select the previous page from viewModel.version.stream.pages
             */
            previousPage: function () {
                logger.debug({ method: 'viewModel.previousPage', message: 'Show previous page' });
                var page = this.get(VIEW_MODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                if ($.type(index) === NUMBER && index > 0) {
                    this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(index - 1));
                    app.tts.cancelSpeak();
                }
            },

            /**
             * Select the next page from viewModel.version.stream.pages
             */
            nextPage: function () {
                logger.debug({ method: 'viewModel.nextPage', message: 'Show next page' });
                var page = this.get(VIEW_MODEL.SELECTED_PAGE);
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var index = pageCollectionDataSource.indexOf(page);
                if ($.type(index) === NUMBER && index < pageCollectionDataSource.total() - 1) {
                    this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(index + 1));
                    app.tts.cancelSpeak();
                }
            },

            /**
             * Select the last page from viewModel.version.stream.pages
             */
            lastPage: function () {
                logger.debug({ method: 'viewModel.lastPage', message: 'Show last page' });
                var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                var lastPage = pageCollectionDataSource.total() - 1;
                this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(lastPage));
                app.tts.cancelSpeak();
            },

            /**
             * Reset current test
             */
            resetCurrent: function () {
                var that = this;
                // Assert ids
                var userId = that.get(VIEW_MODEL.USER.SID); // Foreign keys use sids (server ids)
                assert.match(RX_MONGODB_ID, userId, assert.format(assert.messages.match.default, 'userId', RX_MONGODB_ID));
                var language = i18n.locale();
                assert.equal(language, that.get(VIEW_MODEL.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("language")', language));
                assert.equal(language, that.get(VIEW_MODEL.SUMMARY.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("summary.language")', language));
                assert.equal(language, that.get(VIEW_MODEL.VERSION.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("version.language")', language));
                var summaryId = that.get(VIEW_MODEL.SUMMARY.ID);
                assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
                assert.equal(summaryId, this.get(VIEW_MODEL.VERSION.SUMMARY_ID), assert.format(assert.messages.equal.default, 'viewModel.get("version.summaryId")', summaryId));
                var versionId = that.get(VIEW_MODEL.VERSION.ID);
                assert.match(RX_MONGODB_ID, versionId, assert.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));
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
                    type: 'Score',
                    version : {
                        language: language,
                        // TODO Add categoryId for better statistics
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
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                return pageCollectionDataSource.validateTestFromProperties(viewModel.get(VIEW_MODEL.CURRENT.TEST))
                    .done(function (result) {
                        // Note: result has methods including percent and getScoreArray
                        assert.isPlainObject(result, assert.format(assert.messages.isPlainObject.default, 'result'));
                        assert.type(FUNCTION, result.percent, assert.format(assert.messages.type.default, 'result.percent', FUNCTION));
                        assert.type(FUNCTION, result.getScoreArray, assert.format(assert.messages.type.default, 'result.getScoreArray', FUNCTION));
                        viewModel.set(VIEW_MODEL.CURRENT.TEST, result);
                    })
                    .fail(function (xhr, status, error) {
                        app.notification.error(i18n.culture.notifications.scoreCalculationFailure);
                        logger.error({
                            message: 'Failed to calculate user score',
                            method: 'viewModel.calculate',
                            data: { status: status, error: error, response: parseResponse(xhr) }
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
                // assert.instanceof(models.MobileActivity, current, assert.format(assert.messages.instanceof.default, 'current', 'app.models.MobileActivity'));
                assert.type(UNDEFINED, current.id, assert.format(assert.messages.type.default, 'current.id', UNDEFINED));
                assert.type(FUNCTION, current.test.percent, assert.format(assert.messages.type.default, 'current.test.percent', FUNCTION));
                assert.type(FUNCTION, current.test.getScoreArray, assert.format(assert.messages.type.default, 'current.test.getScoreArray', FUNCTION));
                // Update current
                viewModel.set(VIEW_MODEL.CURRENT.SCORE, current.test.percent());
                viewModel.set(VIEW_MODEL.CURRENT.UPDATED, new Date());
                // Add to datasource and sync
                var activities = this.get(VIEW_MODEL.ACTIVITIES);
                assert.instanceof(models.MobileActivityDataSource, activities, assert.format(assert.messages.instanceof.default, 'activities', 'app.models.MobileActivityDataSource'));
                var activity = new models.MobileActivity(current);
                activities.add(activity);
                return activities.sync()
                    .done(function () {
                        // current is not a models.MobileActivity because since percent and getScoreArray are not model methods,
                        // There are lost at this stage. We would need to make a model with percent and getScoreArray methods
                        var activityId = activity.get('id');
                        assert.match(RX_MONGODB_ID, activityId, assert.format(assert.messages.match.default, 'activityId', RX_MONGODB_ID));
                        viewModel.set(VIEW_MODEL.CURRENT.ID, activityId);
                        app.notification.success(i18n.culture.notifications.scoreSaveSuccess);
                    })
                    .fail(function (xhr, status, error) {
                        activities.remove(activity);
                        app.notification.error(i18n.culture.notifications.scoreSaveFailure);
                        logger.error({
                            message: 'error saving current score',
                            method: 'viewModel.saveCurrent',
                            data: { status: status, error: error, response: parseResponse(xhr) }
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
            assert.isPlainObject(e, assert.format(assert.messages.isOptionalObject.default, 'e'));
            assert.type(STRING, e.field, assert.format(assert.messages.type.default, 'e.field', STRING));
            assert.instanceof(kendo.Observable, e.sender, assert.format(assert.messages.instanceof.default, 'e.sender', 'kendo.Observable'));
            switch (e.field) {
                case VIEW_MODEL.SELECTED_PAGE:
                    var view = mobile.application.view();
                    if (view.id === HASH + VIEW.CORRECTION) {
                        // Reset NavBar buttons and title
                        mobile._setNavBar(view);
                        mobile._setNavBarTitle(view, kendo.format(i18n.culture.correction.viewTitle, viewModel.page$(), viewModel.totalPages$()));
                        if (viewModel.isLastPage$() && !view.element.prop(kendo.attr('showScoreInfo'))) {
                            // Let's remember that we have already displayed this notification for this test
                            view.element.prop(kendo.attr('showScoreInfo'), true);
                            app.notification.info(i18n.culture.notifications.showScoreInfo);
                        }
                    } else if (view.id === HASH + VIEW.PLAYER) {
                        // Reset NavBar buttons and title
                        mobile._setNavBar(view);
                        mobile._setNavBarTitle(view, kendo.format(i18n.culture.player.viewTitle, viewModel.page$(), viewModel.totalPages$()));
                        if (viewModel.isLastPage$() && !view.element.prop(kendo.attr('clickSubmitInfo'))) {
                            // Let's remember that we have already displayed this notification for this test
                            view.element.prop(kendo.attr('clickSubmitInfo'), true);
                            app.notification.info(i18n.culture.notifications.clickSubmitInfo);
                        }
                    }
                    break;
                case VIEW_MODEL.USER.$:
                    viewModel.reset();
                    break;
                case VIEW_MODEL.USER.ROOT_CATEGORY_ID:
                    viewModel.syncUsers();
                    // .done(function () {
                    //     viewModel.reset();
                    // });
                    break;
                case VIEW_MODEL.LANGUAGE:
                    // Do not trigger before the kendo mobile application is loaded
                    if (mobile.application instanceof kendo.mobile.Application && $.isPlainObject(i18n.culture)) {
                        var language = e.sender.get(VIEW_MODEL.LANGUAGE);
                        i18n.load(language)
                            .done(function () {
                                mobile.localize(language);
                                // Reset categories
                                viewModel.set(VIEW_MODEL.CATEGORIES, new models.LazyCategoryDataSource()); // This is necessary because it loads for i18n.locale()
                                // Reset the root category
                                // Note this triggers a change that executes `case VIEW_MODEL.USER.ROOT_CATEGORY_ID` here above
                                viewModel.set(VIEW_MODEL.USER.ROOT_CATEGORY_ID, DEFAULT.ROOT_CATEGORY_ID[language]);
                                logger.debug({
                                    method: 'viewModel.bind',
                                    message: 'Language changed to ' + language
                                });
                            });
                    }
                    break;
                case VIEW_MODEL.THEME:
                    // Do not trigger before the kendo mobile application is loaded
                    if (mobile.application instanceof kendo.mobile.Application) {
                        var theme = e.sender.get(VIEW_MODEL.THEME);
                        // app.theme.load stores the theme in localStorage
                        app.theme.load(theme).done(function () {
                            mobile.application.skin(theme);
                            mobile._fixThemeVariant(theme);
                            logger.debug({
                                method: 'viewModel.bind',
                                message: 'Theme changed to ' + theme
                            });
                        });
                    }
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
            assert.instanceof(kendo.mobile.ui.View, view, assert.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            var viewElement = view.element;
            var showDrawerButton = false;
            var showHomeButton = false;
            var showUserButton = false;
            // We do not show the first page button to leave room for the drawer button
            // var showFirstPageButton = false;
            var showPreviousPageButton = false;
            var showPreviousUserButton = false;
            var showNextUserButton = false;
            var showNextPageButton = false;
            var showLastPageButton = false;
            var showSubmitButton = false;
            var showScoreButton = false;
            var showSummaryButton = false;
            var showSyncButton = false;
            var showSearchButton = false;
            switch (view.id) {
                case '/':
                case HASH + VIEW.ACTIVITIES:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case HASH + VIEW.CATEGORIES:
                    showDrawerButton = true;
                    showSearchButton = true;
                    break;
                case HASH + VIEW.CORRECTION:
                    showDrawerButton = true;
                    showPreviousPageButton = !viewModel.isFirstPage$();
                    showNextPageButton = !viewModel.isLastPage$();
                    showLastPageButton = !viewModel.isLastPage$();
                    showScoreButton = viewModel.isLastPage$();
                    break;
                /*
                case HASH + VIEW.FAVOURITES:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                */
                case HASH + VIEW.FINDER:
                    showDrawerButton = true;
                    showHomeButton = true;
                    // showSearchButton = true;
                    break;
                case HASH + VIEW.NETWORK:
                    showDrawerButton = true;
                    break;
                case HASH + VIEW.PLAYER:
                    showDrawerButton = true;
                    showPreviousPageButton = !viewModel.isFirstPage$();
                    showNextPageButton = !viewModel.isLastPage$();
                    showLastPageButton = !viewModel.isLastPage$();
                    showSubmitButton = viewModel.isLastPage$();
                    break;
                case HASH + VIEW.SCORE:
                    showDrawerButton = true;
                    showSummaryButton = true;
                    break;
                case HASH + VIEW.SETTINGS:
                    showDrawerButton = true;
                    break;
                case HASH + VIEW.SIGNIN:
                    showUserButton = viewModel.isSavedUser$();
                    break;
                case HASH + VIEW.SUMMARY:
                    showDrawerButton = true;
                    showHomeButton = true;
                    break;
                case HASH + VIEW.SYNC:
                    break;
                case HASH + VIEW.USER:
                    showPreviousUserButton = viewModel.isSavedUser$() && !viewModel.isFirstUser$();
                    showNextUserButton = viewModel.isSavedUser$() && !viewModel.isLastUser$();
                    break;
            }
            // Note: each view has no button by default, so let's fix that
            viewElement.find(HASH + LAYOUT.MAIN + '-drawer').css({ display: showDrawerButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-home').css({ display: showHomeButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-user').css({ display: showUserButton ? DISPLAY.INLINE : DISPLAY.NONE });
            // viewElement.find(HASH + LAYOUT.MAIN + '-first-page').css({ display: showFirstPageButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-previous-page').css({ display: showPreviousPageButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-previous-user').css({ display: showPreviousUserButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-next-user').css({ display: showNextUserButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-next-page').css({ display: showNextPageButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-last-page').css({ display: showLastPageButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-submit').css({ display: showSubmitButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-score').css({ display: showScoreButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-summary').css({ display: showSummaryButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-sync').css({ display: showSyncButton ? DISPLAY.INLINE : DISPLAY.NONE });
            viewElement.find(HASH + LAYOUT.MAIN + '-search').css({ display: showSearchButton ? DISPLAY.INLINE : DISPLAY.NONE });
        };

        /* jshint +W074 */

        /**
         * Set the navigation bar title
         * @param view
         * @param text
         * @private
         */
        mobile._setNavBarTitle = function (view, text) {
            assert.instanceof(kendo.mobile.ui.View, view, assert.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            var navbarElement = view.header.find('.km-navbar');
            var navbarWidget = navbarElement.data('kendoMobileNavBar');
            if ($.type(text) === UNDEFINED) {
                var id = view.id === '/' ? VIEW.DEFAULT : view.id.substr(1); // Removes #
                var culture = i18n.culture[id]; // Note: this supposes culture properties match view id names
                navbarWidget.title(culture.viewTitle);
            } else {
                navbarWidget.title(text);
            }
            // Fix km-no-title issue to align km-view-title properly within km-navbar
            view.header.find('.km-view-title').removeClass('km-no-title'); // Does not work here so it is repeated in mobile.onGenericViewShow, where it works
        };

        /**
         * Init the notification widget
         * @private
         */
        mobile._initToastNotifications = function () {
            var notification = $('#notification');
            assert.hasLength(notification, assert.format(assert.messages.hasLength.default, '#notification'));
            if (app && app.notification instanceof kendo.ui.Notification) {
                // Do not leave pending notifications
                var notifications = app.notification.getNotifications();
                notifications.each(function () {
                    $(this).parent().remove();
                });
                // Destroy before re-creating
                app.notification.destroy();
            }
            // Note: the navbar is not available for notifications occurring before kendo.mobile.Application is initialized
            var navbar = $('.km-navbar');
            app.notification = notification.kendoNotification({
                // button: true, // only works with built-in templates
                position: {
                    left: 0,
                    // bottom: 2 // to allow for border
                    top: navbar.length ? navbar.outerHeight() : 0 // navbar or splashscreen
                },
                stacking: 'down', // 'up',
                width: $(window).width() - 2 // - 2 is for borders as box-sizing on .k-notification-wrap does not help
            }).data('kendoNotification');
            assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
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
            assert.type(ARRAY, app.locales, assert.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, assert.format(assert.messages.enum.default, 'locale', app.locales));

            var viewElement;
            var culture = i18n.culture;

            // Localize Main Layout
            $(HASH + LAYOUT.MAIN + '-back').text(culture.layout.back);

            // #drawer
            var RX_REPLACE = /^(<[^<>\/]+>)(<\/[^<>\/]+>)([\s\S]+)$/i;
            viewElement = $(HASH + VIEW.DRAWER);
            // categoriesElement.html() === '<span class="km-icon km-home"></span>Explore' and we only want to replace the Explore title
            var categoriesElement = viewElement.find('ul>li>a.km-listview-link:eq(0)');
            categoriesElement.html(categoriesElement.html().replace(RX_REPLACE, '$1$2' + culture.drawer.categories));
            var scanElement = viewElement.find('ul>li>a.km-listview-link:eq(1)');
            scanElement.html(scanElement.html().replace(RX_REPLACE, '$1$2' + culture.drawer.scan));
            // var favouritesElement = drawerViewElement.find('ul>li>a.km-listview-link:eq(2)');
            // favouritesElement.html(favouritesElement.html().replace(RX_REPLACE, '$1$2' + drawerCulture.favourites));
            var activitiesElement = viewElement.find('ul>li>a.km-listview-link:eq(2)');
            activitiesElement.html(activitiesElement.html().replace(RX_REPLACE, '$1$2' + culture.drawer.activities));
            var settingsElement = viewElement.find('ul>li>a.km-listview-link:eq(3)');
            settingsElement.html(settingsElement.html().replace(RX_REPLACE, '$1$2' + culture.drawer.settings));

            // #activities
            viewElement = $(HASH + VIEW.ACTIVITIES);
            viewElement.find('ul[data-role="buttongroup"]>li:eq(0)').html(culture.activities.buttonGroup.list);
            viewElement.find('ul[data-role="buttongroup"]>li:eq(1)').html(culture.activities.buttonGroup.chart);

            // #categories
            // viewElement = $(HASH + VIEW.CATEGORIES);

            // #correction
            viewElement = $(HASH + VIEW.CORRECTION);
            viewElement.find('span.explanations').html(culture.correction.explanations);

            // #favourites
            // viewElement = $(HASH + VIEW.FAVOURITES);

            // #finder
            // viewElement = $(HASH + VIEW.FINDER);

            // #network
            viewElement = $(HASH + VIEW.NETWORK);
            var viewWidget = viewElement.data('kendoMobileView');
            // Note: we could also localize image alt attribute
            viewElement.find('h2.title').html(culture.network.title);

            // #player
            viewElement = $(HASH + VIEW.PLAYER);
            viewElement.find('span.instructions').html(culture.player.instructions);

            // #score
            // viewElement = $(HASH + VIEW.SCORE);

            // #settings
            viewElement = $(HASH + VIEW.SETTINGS);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(0)').text(culture.settings.user);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(1)').text(culture.settings.version);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(2)').text(culture.settings.theme);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(3)').text(culture.settings.language);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(4)').text(culture.settings.category);
            viewElement.find('.buttons>[data-role="button"]:not(.km-button):eq(0)').text(culture.settings.switch); // button before view is initialized
            viewElement.find('.buttons>.km-button>span.km-text:eq(0)').text(culture.settings.switch);              // button after view is initialized
            viewElement.find('.buttons>[data-role="button"]:not(.km-button):eq(1)').text(culture.settings.tour);  // button before view is initialized
            viewElement.find('.buttons>.km-button>span.km-text:eq(1)').text(culture.settings.tour);                // button after view is initialized

            // #signin
            viewElement = $(HASH + VIEW.SIGNIN);
            viewElement.find('div[data-role="page"]:eq(0) div.text>p').text(culture.signin.page0);
            viewElement.find('div[data-role="page"]:eq(1) div.text>p').text(culture.signin.page1);
            viewElement.find('div[data-role="page"]:eq(2) div.text>p').text(culture.signin.page2);
            viewElement.find('div[data-role="page"]:eq(3) .k-notification-wrap>span.k-text').text(culture.signin.welcome);

            // #summary
            viewElement = $(HASH + VIEW.SUMMARY);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(0)').text(culture.summary.title);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(1)').text(culture.summary.metrics);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(2)').text(culture.summary.category);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(3)').text(culture.summary.tags);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(4)').text(culture.summary.description);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(5)').text(culture.summary.author);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(6)').text(culture.summary.published);
            viewElement.find('.buttons>[data-role="button"]:not(.km-button):eq(0)').text(culture.summary.go);       // button before view is initialized
            viewElement.find('.buttons>.km-button>span.km-text:eq(0)').text(culture.summary.go);                    // button after view is initialized
            var summaryActionSheetElement = $(HASH + VIEW.SUMMARY + '-actionsheet');
            summaryActionSheetElement.find('li.km-actionsheet-play > a').text(culture.summary.actionSheet.play);
            summaryActionSheetElement.find('li.km-actionsheet-share > a').text(culture.summary.actionSheet.share);
            summaryActionSheetElement.find('li.km-actionsheet-feedback > a').text(culture.summary.actionSheet.feedback);
            summaryActionSheetElement.find('li.km-actionsheet-cancel > a').text(culture.summary.actionSheet.cancel);

            // #sync
            viewElement = $(HASH + VIEW.SYNC);
            // Note: we could also localize image alt attribute
            viewElement.find('h2.title').html(culture.sync.title);
            // viewElement.find('p.message').html(culture.sync.message);
            viewElement.find(kendo.roleSelector('button')).text(culture.sync.buttons.continue);

            // #user
            viewElement = $(HASH + VIEW.USER);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(0)').text(culture.user.firstName);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(1)').text(culture.user.lastName);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(2)').text(culture.user.lastUse);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(3)').text(culture.user.pin);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(4)').text(culture.user.newPIN);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(5)').text(culture.user.confirm);
            viewElement.find('.buttons>[data-role="button"]:not(.km-button):eq(0)').text(culture.user.save);        // button before view is initialized
            viewElement.find('.buttons>.km-button>span.km-text:eq(0)').text(culture.user.save);                     // button after view is initialized
            viewElement.find('.buttons>[data-role="button"]:not(.km-button):eq(1)').text(culture.user.signIn);      // button before view is initialized
            viewElement.find('.buttons>.km-button>span.km-text:eq(1)').text(culture.user.signIn);                   // button after view is initialized
            viewElement.find('.buttons>[data-role="button"]:not(.km-button):eq(2)').text(culture.user.newUser);     // button before view is initialized
            viewElement.find('.buttons>.km-button>span.km-text:eq(2)').text(culture.user.newUser);                  // button after view is initialized
            viewElement.find('.buttons>[data-role="button"]:not(.km-button):eq(3)').text(culture.user.changePIN);     // button before view is initialized
            viewElement.find('.buttons>.km-button>span.km-text:eq(3)').text(culture.user.changePIN);                  // button after view is initialized

            // Reset navbar title
            if (mobile.application instanceof kendo.mobile.Application && mobile.application.pane instanceof kendo.mobile.ui.Pane) {
                mobile._setNavBarTitle(mobile.application.view());
            }
        };

        /*******************************************************************************************
         * Resizing
         *******************************************************************************************/

        /**
         * Resize finder listview
         * @param view
         * @private
         */
        mobile._resizeListView = function (view) {
            assert.instanceof(kendo.mobile.ui.View, view, assert.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            if (view.id === HASH + VIEW.FINDER) {
                // Refreshing list views only works in data bound mode
                // It removes the html markup especially with forms
                var listViewElements = view.content.find(kendo.roleSelector('listview'));
                listViewElements.each(function (index, element) {
                    var listViewWidget = $(element).data('kendoMobileListView');
                    if (listViewWidget instanceof kendo.mobile.ui.ListView) {
                        listViewWidget.refresh();
                    }
                });
            }
        };

        /**
         * Resize signin page scrollview
         * @param view
         * @private
         */
        mobile._resizeScrollView = function (view) {
            assert.instanceof(kendo.mobile.ui.View, view, assert.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            var scrollViewElements = view.content.find(kendo.roleSelector('scrollview'));
            scrollViewElements.each(function (index, element) {
                var scrollViewWidget = $(element).data('kendoMobileScrollView');
                if (scrollViewWidget instanceof kendo.mobile.ui.ScrollView) {
                    scrollViewWidget.refresh();
                }
            });
        };

        /* This function's cyclomatic complexity is too high. */
        /* jshint -W074 */

        /**
         * Resize player/correction stage and instructions/explanations markdown
         * @param view
         * @private
         */
        mobile._resizeStage = function (view) {
            assert.instanceof(kendo.mobile.ui.View, view, assert.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            var content = view.content;
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
                assert.equal(HEIGHT, 768, assert.format(assert.messages.equal.default, 'HEIGHT', '768'));
                var WIDTH = stageElement.outerWidth();
                assert.equal(WIDTH, 1024, assert.format(assert.messages.equal.default, 'WIDTH', '1024'));
                var height = content.height();  // The screen height minus layout header and footer
                var width = content.width();    // The screen width minus layout header and footer
                var scale;
                var infoHeight = 0;
                var infoWidth = 0;
                var proportion = 1;
                if (width > height) { // landsacpe mode
                    // Note: we want the info panel to be between 25% and 33% of the screen real estate and at least 200px wide
                    infoWidth = Math.min(0.33 * width, Math.max(200, 0.25 * width, width - height * WIDTH  / HEIGHT));
                    // now look at the proportion of what is left for our stage
                    if ((width - infoWidth) / height > WIDTH / HEIGHT) {
                        // There is room to set the stage full height and increase our info panel
                        scale = height / HEIGHT;
                        infoWidth = width - scale * WIDTH;
                    } else {
                        // There is no room to set the stage full height, so let's set a proportion to add a border
                        scale = (width - infoWidth) / WIDTH;
                        proportion = 0.95;
                    }
                } else { // portrait mode
                    // Note: we want the info panel to be between 25% and 33% of the screen real estate and at least 100px high
                    infoHeight = Math.min(0.33 * height, Math.max(180, 0.25 * height, height - width * HEIGHT / WIDTH));
                    // now look at the proportion of what is left for our stage
                    if ((height - infoHeight) / width > HEIGHT / WIDTH) {
                        // There is room to set the stage full width and increase our info panel
                        scale = width / WIDTH;
                        infoHeight = height - scale * HEIGHT;
                    } else {
                        // There is no room to set the stage full width, so let's set a proportion to add a border
                        scale = (height - infoHeight) / HEIGHT;
                        proportion = 0.95;
                    }
                }
                // Resize the stage
                stageWidget.scale(proportion * scale);
                var stageWrapper = stageElement.parent();
                assert.ok(stageWrapper.hasClass('kj-stage'), 'Stage wrapper is expected to have class `kj-stage`');
                var stageContainer = stageWrapper.closest('.stretched-item');
                stageContainer
                    .outerWidth(width - Math.ceil(infoWidth)) // We use Math.ceil instead of Math.floor here to get the leeway required by Microsoft Edge in embedded mode
                    .outerHeight(height - Math.ceil(infoHeight))
                    .css('position', 'relative');
                stageContainer.children('.centered')
                    .width(proportion * scale * WIDTH)
                    .height(proportion * scale * HEIGHT)
                    .css({
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginLeft: -proportion * scale * WIDTH / 2,
                        marginTop: -proportion * scale * HEIGHT / 2
                    });
                stageContainer.find('.kj-stage')
                    .css({ borderWidth: proportion === 1 ? 0 : 1 });
                // Resize the markdown container and scroller for instructions/explanations
                var markdownElement = content.find(kendo.roleSelector('markdown'));
                var markdownScrollerElement = markdownElement.closest(kendo.roleSelector('scroller'));
                var markdownScroller = markdownScrollerElement.data('kendoMobileScroller');
                assert.instanceof(kendo.mobile.ui.Scroller, markdownScroller, assert.format(assert.messages.instanceof.default, 'markdownScroller', 'kendo.mobile.ui.Scroller'));
                var markdownContainer = markdownElement.closest('.stretched-item');
                var markdownHeading = markdownContainer.children('.heading');
                markdownContainer
                    .outerWidth(Math.floor(infoWidth) || width)
                    .outerHeight(Math.floor(infoHeight) || height)
                    .css({
                        borderTopWidth: infoHeight ? 1 : 0,
                        borderRightWidth: 0,
                        borderBottomWidth: 0,
                        borderLeftWidth: infoWidth ? 1 : 0
                    });
                markdownScroller.destroy();
                markdownScrollerElement.outerHeight(markdownContainer.height() - markdownHeading.outerHeight() - parseInt(markdownContainer.css('padding-bottom'), 10));
                var markdownScrollerWidget = markdownScrollerElement.kendoMobileScroller().data('kendoMobileScroller');
                markdownScrollerWidget.reset();
            }
        };

        /* jshint +W074 */

        /**
         * Resize activities chart
         * @param view
         * @private
         */
        mobile._resizeChart = function (view) {
            assert.instanceof(kendo.mobile.ui.View, view, assert.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            if (view.id === '/' || view.id === HASH + VIEW.ACTIVITIES) {
                // This would only work on the activities view anyway
                var content = view.content;
                var chart = content.find(kendo.roleSelector('chart'));
                var chartWidget = chart.data('kendoChart');
                if (chartWidget instanceof kendo.dataviz.ui.Chart) {
                    var buttonGroup = content.find(kendo.roleSelector('buttongroup'));
                    chart.outerHeight(content.height() - buttonGroup.outerHeight(true));
                    chart.outerWidth(content.width());
                    chartWidget.resize();
                }
            }
        };

        /**
         * Event handler for resizing the UI (especially when changing device orientation)
         * @private
         */
        mobile.onResize = function () {
            // In Android and iOS, onResize might be triggered before kendo.mobile.Application is instantiated
            // and/or before mobile.application as a pane which would trigger an error in mobile.application.view()
            // which is a shortcut for mobile.application.pane.view()
            if (mobile.application instanceof kendo.mobile.Application &&
                mobile.application.pane instanceof kendo.mobile.ui.Pane) {
                var view = mobile.application.view();
                mobile._initToastNotifications();
                mobile._resizeListView(view);
                mobile._resizeScrollView(view);
                mobile._resizeStage(view);
                mobile._resizeChart(view);
            }
        };

        /*******************************************************************************************
         * Event handler and utility methods
         *******************************************************************************************/

        /**
         * Event Handler triggered when the device is ready (this is a cordova event)
         * Loads the application, especially initialize plugins (which where not available until now)
         */
        mobile.onDeviceReady = function () {
            // window.alert('onDeviceReady!');
            logger.debug({
                message: 'Device is ready',
                method: 'mobile.onDeviceReady'
            });
            // Set feature shortcuts (like Modernizr)
            setShortcuts();
            logger.debug({
                message: 'Shortcuts set',
                method: 'mobile.onDeviceReady'
            });
            // Set google analytics
            setAnalytics();
            logger.debug({
                message: 'Analytics set',
                method: 'mobile.onDeviceReady'
            });
            // initialize the user interface after loading i18n resources
            $(document).one(LOADED, mobile.oni18nLoaded);
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
            assert.isPlainObject(i18n.culture, assert.format(assert.messages.isPlainObject.default, 'i18n.culture'));
            logger.debug({
                message: 'i18n culture is loaded',
                method: 'mobile.oni18nLoaded'
            });
            // Schedule OS notifications
            mobile._scheduleSystemNotifications();
            // Initialize toast notifications
            mobile._initToastNotifications();
            // Initialize battery events
            mobile._initBatteryEvents();
            // Initialize network events
            mobile._initNetworkEvents();
            // Wire the resize event handler for changes of device orientation
            $(window).resize(mobile.onResize);
            // Check server version
            rapi.test.ping()
                .always(function (ping) {
                    if (ping.compatible && window.pongodb.util.compareVersions(app.version, ping.compatible) < 0) {
                        // This is an old version, so request an upgrade
                        mobile.dialogs.error(i18n.culture.notifications.appVersionFailure, function () {
                            // TODO open the app store
                            if (window.navigator.app && $.isFunction (window.navigator.app.exitApp)) {
                                window.navigator.app.exitApp();
                            }
                        });
                    } else {
                        // This is a current version, so upgrade the database
                        app.db.upgrade.execute()
                            .done(function () {
                                // Load viewModel, then initialize kendo application
                                viewModel.load().done(mobile._initKendoApplication);
                            })
                            .fail(function (err) {
                                app.notification.error(i18n.culture.notifications.dbMigrationFailure);
                                if (err instanceof Error) {
                                    // setTimeout ensures we call the global error handler
                                    // @see https://stackoverflow.com/questions/39376805/how-can-i-trigger-global-onerror-handler-via-native-promise-when-runtime-error-o
                                    setTimeout(function () { throw err; }, 0);
                                }
                            });
                    }
                });
        };

        /**
         * Initialize Kendo Application
         */
        mobile._initKendoApplication = function () {
            logger.debug({
                message: 'Initialize kendo application',
                method: 'mobile.initKendoApplication'
            });
            // Initialize event threshold as discussed at http://www.telerik.com/forums/click-event-does-not-fire-reliably
            kendo.UserEvents.defaultThreshold(kendo.support.mobileOS.name === 'android' ? 0 : 20);
            // Considering potential adverse effects with drag and drop, we are using http://docs.telerik.com/kendo-ui/api/javascript/mobile/ui/button#configuration-clickOn
            // Initial page
            var initial = HASH;
            if (viewModel.isSyncedUser$()) {
                // The viewModel user has been recently synced, show the user view
                initial += VIEW.USER;
            } else if (viewModel.isSavedUser$()) {
                // The viewModel user has not been synced for a while, suggest to signin to sync
                initial += VIEW.SIGNIN + '?page=' + encodeURIComponent(SIGNIN_PAGE) + '&userId=' + encodeURIComponent(viewModel.get(VIEW_MODEL.USER.ID));
            } else {
                // The viewModel user is new, show walkthrough before signing in
                initial += VIEW.SIGNIN;
            }
            // Initialize application
            mobile.application = new kendo.mobile.Application(document.body, {
                initial: initial,
                skin: app.theme.name(),
                // http://docs.telerik.com/kendo-ui/controls/hybrid/application#hide-status-bar-in-ios-and-cordova
                // http://docs.telerik.com/platform/appbuilder/troubleshooting/archive/ios7-status-bar
                // http://www.telerik.com/blogs/everything-hybrid-web-apps-need-to-know-about-the-status-bar-in-ios7
                // http://devgirl.org/2014/07/31/phonegap-developers-guid/
                // statusBarStyle: mobile.support.cordova ? 'black-translucent' : undefined,
                statusBarStyle: 'hidden',
                init: function (e) {
                    logger.debug({
                        message: 'Kendo mobile app is initialized',
                        method: 'mobile.oni18nLoaded'
                    });
                    // Fix skin variant
                    mobile._fixThemeVariant(e.sender.options.skin);
                    // Localize the application
                    mobile.localize(viewModel.get(VIEW_MODEL.LANGUAGE));
                    // Fix signin page when initial page
                    mobile._fixSigninViewLocalization();
                    // Reinitialize notifications now that we know the size of .km-header
                    mobile._initToastNotifications();
                    // Bind the router change event to the onRouterChange handler
                    mobile.application.router.bind(BACK, mobile.onRouterBack);
                    mobile.application.router.bind(CHANGE, mobile.onRouterChange);
                    // Trigger application init event for handleOpenURL event handler (custom url scheme)
                    $(document).trigger(APPINIT);
                    // hide the splash screen
                    setTimeout(function () {
                        if (mobile.support.splashscreen) {
                            mobile.splashscreen.hide();
                        }
                    }, 500); // + 500 for default fadeOut time
                }
            });
        };

        /**
         * Fix skin variant
         * @param theme
         */
        mobile._fixThemeVariant = function (theme) {
            assert.type(STRING, theme, assert.format(assert.messages.type.default, 'theme', STRING));
            var skin = theme.split('-');
            if (Array.isArray(skin) && skin.length > 1) {
                $(document.body).addClass('km-' + theme);
            }
        };

        /**
         * Check that the application is still online
         * and possibly redirect to the No-Network view
         * @param e
         */
        mobile.checkNetwork = function (e) {
            /*
            window.alert(
                'platform: ' + window.device.platform +
                '\nonLine: ' + window.navigator.onLine +
                '\ntype: ' + window.navigator.connection.type +
                // Note: there used to be window.navigator.network.isReachable function - @see https://www.neotericdesign.com/articles/2011/3/checking-the-online-status-with-phonegap-jquery
                // '\nreachable: ' + ($.isFunction(window.navigator.network.isReachable) ? window.navigator.network.isReachable() : 'N/A') +
                // '\neffective: ' + window.navigator.connection.effectiveType +
                '\nOffline test: ' + (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) || (window.device && window.device.platform === 'browser' && !window.navigator.onLine))
            );
            */

            // TODO Review when there is no user: the only page to restore in this case is the #signin page

            if (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) ||
                (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
                if (!RX_OFFLINE_PAGES.test(e.url)) { // Note: e.url might be ''
                    e.preventDefault();
                    var view = mobile.application.view();
                    if (view.id !== HASH + VIEW.NETWORK) {
                        var url = window.encodeURIComponent((view.id.substr(1) || VIEW.DEFAULT) + '?' + window.decodeURIComponent($.param(view.params)));
                        mobile.application.navigate(HASH + VIEW.NETWORK + '?url=' + url);
                    } else {
                        // No redirection if we are already on the #network view
                        var drawerWidget = $(kendo.roleSelector('drawer')).data('kendoMobileDrawer');
                        if (drawerWidget instanceof kendo.mobile.ui.Drawer) {
                            drawerWidget.hide();
                        }
                        mobile.application.hideLoading();
                    }
                    return false;
                }
            }
            return true;
        };

        /**
         * Init network events
         * @see https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-network-information/
         */
        mobile._initNetworkEvents = function () {

            // The online event is triggered when swithcing from wifi to cell networks
            // although the connection never really went offline, so we need to keep track of the connection state
            var online = true;

            // online
            document.addEventListener(
                'online',
                function () {
                    if (!online && mobile.application instanceof kendo.mobile.Application &&
                        mobile.application.pane instanceof kendo.mobile.ui.Pane) {
                        online = true;
                        app.notification.warning(i18n.culture.notifications.networkOnline);
                        var view = mobile.application.view();
                        if (view.id === HASH + VIEW.NETWORK) {
                            mobile.application.navigate(window.decodeURIComponent(view.params.url));
                        }
                    }
                },
                false
            );

            // offline
            document.addEventListener(
                'offline',
                function () {
                    online = false;
                    if (mobile.application instanceof kendo.mobile.Application &&
                        mobile.application.pane instanceof kendo.mobile.ui.Pane) {
                        app.notification.warning(i18n.culture.notifications.networkOffline);
                        var view = mobile.application.view();
                        // Close opened action sheets
                        // view.element.find(kendo.roleSelector('actionsheet')).each(function (index, actionSheet) {
                        $(document).find(kendo.roleSelector('actionsheet')).each(function (index, actionSheet) {
                            var actionSheetWidget = $(actionSheet).data('kendoMobileActionSheet');
                            if (actionSheetWidget instanceof kendo.mobile.ui.ActionSheet) {
                                actionSheetWidget.close();
                            }
                        });
                        // Close opened drop down lists
                        view.element.find(kendo.roleSelector('dropdownlist')).each(function (index, dropDownList) {
                            var dropDownListWidget = $(dropDownList).data('kendoDropDownList');
                            if (dropDownListWidget instanceof kendo.ui.DropDownList) {
                                dropDownListWidget.close();
                            }
                        });
                        // Check network to redirect to #network view
                        var url = (view.id.substr(1) || VIEW.DEFAULT) + '?' + window.decodeURIComponent($.param(view.params));
                        mobile.checkNetwork({ preventDefault: $.noop, url: url });
                    }
                },
                false
            );
        };

        /**
         * Init battery events
         * @see https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-battery-status/
         * @private
         */
        mobile._initBatteryEvents = function () {

            // app.battery = app.battery || { status: {} };

            // batterylow
            window.addEventListener(
                'batterylow',
                function (status) { // status is en Event
                    // app.battery.status.isPlugged = status.isPlugged;
                    // app.battery.status.level = status.level;
                    app.notification.warning(i18n.culture.notifications.batteryLow);
                },
                false
            );

            // batterycritical
            window.addEventListener(
                'batterycritical',
                function (status) { // status is en Event
                    // app.battery.status.isPlugged = status.isPlugged;
                    // app.battery.status.level = status.level;
                    app.notification.warning(i18n.culture.notifications.batteryCritical);
                },
                false
            );

            // Warning: the Android and Fire OS implementations are greedy and prolonged use will drain the device's battery.
            // @see https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-battery-status/#quirks-android-&-amazon-fire-os

            // batterystatus
            /*
            window.addEventListener(
                'batterystatus',
                function (status) { // status is en Event
                    app.battery.status.isPlugged = status.isPlugged;
                    app.battery.status.level = status.level;
                },
                false
            );
            */

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
                        // result.canceled is 0 or 1 - 1 is when pressing the cancel button
                        // result also has properties text which contains our url and format which should be `QR_CODE`
                        if (!result.cancelled) {
                            assert.type(STRING, result.text, assert.format(assert.messages.type.default, 'result.text', STRING));
                            assert.equal(QR_CODE, result.format, assert.format(assert.messages.equal.default, 'result.format', QR_CODE));
                            var matches = result.text.match(RX_QR_CODE_MATCH);
                            if ($.isArray(matches) && matches.length > 2) {
                                var language = matches[1];
                                var summaryId = matches[2];
                                if (viewModel.get(VIEW_MODEL.LANGUAGE) === language) {
                                    mobile.application.navigate(HASH + VIEW.SUMMARY +
                                        '?language=' + window.encodeURIComponent(language) +
                                        '&summaryId=' + window.encodeURIComponent(summaryId));
                                } else {
                                    app.notification.warning(i18n.culture.notifications.scanLanguageWarning);
                                }
                            } else {
                                app.notification.warning(i18n.culture.notifications.scanMatchWarning);
                            }
                        }
                    },
                    function (error) {
                        mobile.dialogs.error(i18n.culture.notifications.scanFailure);
                        logger.error({
                            message: 'Scan failure',
                            method: 'mobile._scanQRCode',
                            error: error
                        });
                    },
                    {
                        preferFrontCamera: false, // iOS and Android
                        showFlipCameraButton: false, // iOS and Android
                        prompt: i18n.culture.notifications.scanPrompt, // supported on Android only
                        formats: QR_CODE // default: all but PDF_417 and RSS_EXPANDED
                        // "orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
                    }
                );
            }
        };

        /**
         * Open help
         * @private
         */
        mobile._openHelp = function () {
            assert.type(STRING, app.constants && app.constants.helpUrl, assert.format(assert.messages.type.default, 'app.constants.helpUrl', STRING));
            logger.debug({
                message: 'Opening the help content',
                method: 'mobile._openHelp',
                data: { url: app.constants.helpUrl }
            });
            if (mobile.support.inAppBrowser) {
                // We are simply opening a custom url scheme and we do not need SafariViewController for that
                // Note that this does not work in the Android Emulator because the play store app is missing
                mobile.InAppBrowser.open(app.constants.helpUrl, '_system');
            } else {
                window.open(app.constants.helpUrl, '_system');
            }
            if (mobile.support.ga) {
                mobile.ga.trackEvent(
                    ANALYTICS.CATEGORY.GENERAL,
                    ANALYTICS.ACTION.HELP,
                    app.constants.helpUrl
                );
            }
        };

        /**
         * Event handler triggered when clicking back (on platforms android and browser)
         * @param e
         */
        mobile.onRouterBack = function (e) {
            if (e.to === '') {
                // This prevents an error when clicking the back button on android devices and in the browser
                // when reaching the splash screen, which actually trigger a navigation to the default view (/)
                // which is the activities view and which requires e.view.params
                // Fixes https://github.com/kidoju/Kidoju-Mobile/issues/181
                e.preventDefault();
                if (window.navigator.app && $.isFunction(window.navigator.app.exitApp)) {
                    window.navigator.app.exitApp();
                }
            }
        };

        /**
         * Event handler triggered when changing views
         * This is triggered before any view is shown (except the first one)
         * Note: mobile.application.view() returns the old view where as e.url points to the new view
         * @param e
         */
        mobile.onRouterChange = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.type(STRING, e.url, assert.format(assert.messages.type.default, 'e.url', STRING));
            // if (mobile.application instanceof kendo.mobile.Application) {
            mobile.application.showLoading();
            // }
            // Check that we are online
            if (mobile.checkNetwork(e)) {
                // Track in analytics
                if (mobile.support.ga) {
                    var pos = e.url.indexOf('?');
                    var view = pos > 0 ? e.url.substr(0, pos) : e.url;
                    mobile.ga.trackView(view, e.url);
                }
            }
        };

        /**
         * Event handler triggered when showing a new view based on layout
         * Events occur in this order: 1.onRouterChange 2.onLayoutViewShow 3.onXXXXXXViewShow
         * @param e
         */
        mobile.onLayoutViewShow = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Reset view scroller
            if (e.view.scroller instanceof kendo.mobile.ui.Scroller) {
                // Stretched view like #correction and #player do not have a scroller
                e.view.scroller.reset();
            }
            // Reset other scrollers including markdown scrollers
            e.view.element.find(kendo.roleSelector('scroller')).each(function (index, scroller) {
                var scrollerWidget = $(scroller).data('kendoMobileScroller');
                if (scrollerWidget instanceof kendo.mobile.ui.Scroller) {
                    scrollerWidget.reset();
                }
            });
        };

        /**
         * Event handler trigger when clicking an item in the drawer menu
         * @param e
         */
        mobile.onDrawerListViewClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.item, assert.format(assert.messages.instanceof.default, 'e.item', 'jQuery'));
            e.preventDefault();
            var command = e.item.attr(kendo.attr('command'));
            var language = i18n.locale(); // viewModel.get(VIEW_MODEL.LANGUAGE);
            var userId = viewModel.get(VIEW_MODEL.USER.SID);
            switch (command) {
                case 'categories':
                    mobile.application.navigate(HASH + VIEW.CATEGORIES + '?language=' + encodeURIComponent(language));
                    break;
                case 'scan':
                    mobile._scanQRCode();
                    break;
                case 'activities':
                    mobile.application.navigate(HASH + VIEW.ACTIVITIES + '?language=' + encodeURIComponent(language) + '&userId=' + encodeURIComponent(userId));
                    break;
                case 'settings':
                    mobile.application.navigate(HASH + VIEW.SETTINGS + '?userId=' + encodeURIComponent(userId));
                    break;
                case 'help':
                    mobile._openHelp();
                    break;
            }
        };

        /**
         * A generic event handler triggered when showing a view
         * @param e
         */
        mobile.onGenericViewShow = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            var view = e.view;
            var id = view.id === '/' ? VIEW.DEFAULT : view.id.substr(1); // Remove #
            var viewTitle = i18n.culture[id].viewTitle; // Note: this supposes culture names match view id names
            if (id === VIEW.SCORE) {
                viewTitle = kendo.format(viewTitle, viewModel.get((VIEW_MODEL.CURRENT.SCORE) || 0) / 100);
            } else if (id === VIEW.CORRECTION || id === VIEW.PLAYER) {
                viewTitle = kendo.format(viewTitle, viewModel.page$(), viewModel.totalPages$());
            }
            mobile._setNavBar(view);
            mobile._setNavBarTitle(view, viewTitle);
            if (mobile.application instanceof kendo.mobile.Application) {
                // mobile.application is not available on first view shown
                mobile.application.hideLoading();
            }
        };

        /**
         * Event handler triggered when showing the Activities view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onActivitiesViewShow = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // If e.view.params is empty, so we most probably clicked the back button to the default view (/)
            // Note that this is now fixed in mobile.onRouterBack - https://github.com/kidoju/Kidoju-Mobile/issues/181
            // if (!$.isEmptyObject(e.view.params)) {
            assert.isPlainObject(e.view.params, assert.format(assert.messages.isPlainObject.default, 'e.view.params'));
            var language = e.view.params.language;
            assert.equal(language, i18n.locale(), assert.format(assert.messages.equal.default, 'i18n.locale()', language));
            assert.equal(language, viewModel.get(VIEW_MODEL.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("language")', language));
            var userId = e.view.params.userId;
            assert.equal(userId, viewModel.get(VIEW_MODEL.USER.SID), assert.format(assert.messages.equal.default, 'viewModel.get("user.sid")', userId));

            // Always reload
            viewModel.loadActivities({ language: language, userId: userId }).always(function () {
                mobile.onGenericViewShow(e);
            });
            // }
        };

        /**
         * Event handler triggered when selecting a button for the button group on the activities view
         * @param e
         */
        mobile.onActivitiesButtonGroupSelect = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.type(NUMBER, e.index, assert.format(assert.messages.type.default, 'e.index', NUMBER));
            var view = app.mobile.application.view();
            if (!e.index) { // ListView
                view.content.find(kendo.roleSelector('listview')).show();
                view.content.find(kendo.roleSelector('chart')).hide();
            } else { // Chart
                view.content.find(kendo.roleSelector('listview')).hide();
                view.content.find(kendo.roleSelector('chart')).show();
                mobile._resizeChart(view);
            }
        };

        /**
         * Event handler triggered when showing the Categories view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onCategoriesViewShow = mobile.onGenericViewShow;

        /**
         * Event handler triggered when initializing the Correction view
         * Note: the init event is triggered the first time the view is requested
         * @param e
         */
        mobile.onCorrectionViewInit = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            var contentElement = e.view.content;

            // Destroy the stage - see mobile.onCorrectionViewHide
            kendo.destroy(e.view.content.find(kendo.roleSelector('stage')));

            // The play TTS button is a bit small, so let's use the entire heading
            contentElement.find('div.heading h2')
                .off()
                .on(CLICK + ' ' + TAP, function (e) {
                    var buttonElement = $(e.currentTarget).find('a[data-role="button"][data-icon="ear"]');
                    var buttonWidget = buttonElement.data('kendoMobileButton');
                    if (buttonWidget instanceof kendo.mobile.ui.Button) {
                        buttonElement.addClass('km-state-active');
                        buttonWidget.trigger(CLICK, { button: buttonElement });
                        setTimeout(function () {
                            buttonElement.removeClass('km-state-active');
                        }, 250);
                    }
                });
        };

        /**
         * Event handler triggered when showing the Correction view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onCorrectionViewShow = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            assert.isPlainObject(e.view.params, assert.format(assert.messages.isPlainObject.default, 'e.view.params'));

            // Scan params
            var language = e.view.params.language;
            var summaryId = e.view.params.summaryId;
            var versionId = e.view.params.versionId;
            var activityId = e.view.params.activityId;
            var page = parseInt(e.view.params.page, 10) || 1;

            assert.equal(viewModel.get(VIEW_MODEL.LANGUAGE), language, assert.format(assert.messages.equal.default, 'language', 'viewModel.get("language")'));
            assert.equal(i18n.locale(), language, assert.format(assert.messages.equal.default, 'language', 'i18n.locale()'));
            assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'activityId', RX_MONGODB_ID));
            assert.match(RX_MONGODB_ID, versionId, assert.format(assert.messages.match.default, 'activityId', RX_MONGODB_ID));
            assert.match(RX_MONGODB_ID, activityId, assert.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));

            // Let's remove the showScoreInfo attr (see viewModel.bind(CHANGE))
            e.view.element.removeProp(kendo.attr('showScoreInfo'));

            // Rebuild stage and bind viewModel
            kendo.bind(e.view.content.find(kendo.roleSelector('stage')), app.mobile.viewModel, kendo.ui, kendo.dataviz.ui, kendo.mobile.ui);
            mobile._resizeStage(e.view);

            /*
            // TODO We are dependant on the data loaded in mobile.onScoreViewShow, so this page cannot be refreshed in dev
            // We might want to reload the data after reviewing activities not to have to recalculate scores
            // Load data
            $.when(
                // load version to display quiz content in the player
                viewModel.loadVersion({ language: language, summaryId: summaryId, id: versionId }),
                // Load activities
                viewModel.loadActivities({ language: language, userId: viewModel.get(VIEW_MODEL.USER.SID) })
            )
            .done(function () {
                // Set activity, but we do not want to recalculate score
                viewModel.set(VIEW_MODEL.SELECTED_PAGE, viewModel.get(VIEW_MODEL.PAGES_COLLECTION).at(page - 1));
            })
            .always(function () {
                mobile.onGenericViewShow(e);
                app.notification.info(i18n.culture.notifications.pageNavigationInfo);
            });
            */

            // version is already loaded - viewModel.loadVersion({ language: language, summaryId: summaryId, id: versionId }),
            // activities are already loaded - viewModel.loadActivities({ language: language, userId: viewModel.get(VIEW_MODEL.USER.SID) })
            viewModel.set(VIEW_MODEL.SELECTED_PAGE, viewModel.get(VIEW_MODEL.PAGES_COLLECTION).at(page - 1));

            mobile.onGenericViewShow(e);
            app.notification.info(i18n.culture.notifications.pageNavigationInfo);
        };

        /**
         * Event handler triggered when hiding the Correction view
         * Note: the view event is triggered each time the view is discarded
         * @param e
         */
        mobile.onCorrectionViewHide = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));

            // Destroy the stage (necessary to hide the floating toolbar and avoid initializing widgets simultaneously in correction and player modes)
            kendo.destroy(e.view.content.find(kendo.roleSelector('stage')));

            // Cancel any utterance spoken
            app.tts.cancelSpeak();
        };

        /**
         * Event handler triggered when showing the Favourites view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        // mobile.onFavouritesViewShow = mobile.onGenericViewShow;

        /**
         * Event handler triggered before showing the Summaries view
         */
        mobile.onFinderBeforeViewShow = function (e) {
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
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            assert.isPlainObject(e.view.params, assert.format(assert.messages.isPlainObject.default, 'e.view.params'));
            // var language = i18n.locale(); // viewModel.get(VIEW_MODEL.LANGUAGE)
            var language = e.view.params.language;
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
            // So we really need $.deparam($.param(...))
            viewModel.loadLazySummaries($.extend(true, {
                // TODO: fields could be found in models.LazySummary (use the from property not the field name) - @see https://github.com/kidoju/Kidoju-Widgets/issues/218
                fields: 'author,icon,metrics.comments.count,language,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,type,updated',
                page: 1,
                pageSize: viewModel.summaries.pageSize(),
                partition: { language: language, type: 'Test', 'author.userId': app.constants.authorId },
                sort: { field: 'updated', dir: 'desc' }
            }, $.deparam($.param(e.view.params))))
                // See comment for mobile.onSummariesBeforeViewShow
                .always(function () {
                    mobile.onGenericViewShow(e);
                });
        };

        /**
         * Event handler triggered when showing the Network view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onNetworkViewShow = mobile.onGenericViewShow;

        /**
         * Event handler triggered when initializing the Player view
         * Note: the init event is triggered the first time the view is requested
         * @param e
         */
        mobile.onPlayerViewInit = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            var contentElement = e.view.content;

            // Destroy the stage - see mobile.onPlayerViewHide
            kendo.destroy(e.view.content.find(kendo.roleSelector('stage')));

            // The play TTS button is a bit small, so let's use the entire heading
            contentElement.find('div.heading')
                .off()
                .on(CLICK + ' ' + TAP, function (e) {
                    e.preventDefault(); // So that a tap does not trigger a click, resulting in this code being executed twice thus cancelling TTS
                    var buttonElement = $(e.currentTarget).find('a[data-role="button"][data-icon="ear"]');
                    var buttonWidget = buttonElement.data('kendoMobileButton');
                    if (buttonWidget instanceof kendo.mobile.ui.Button) {
                        buttonElement.addClass('km-state-active');
                        buttonWidget.trigger(CLICK, { button: buttonElement });
                        setTimeout(function () {
                            buttonElement.removeClass('km-state-active');
                        }, 250);
                    }
                });
        };

        /**
         * Event handler triggered when showing the Player view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onPlayerViewShow = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            assert.isPlainObject(e.view.params, assert.format(assert.messages.isPlainObject.default, 'e.view.params'));

            // Scan params
            var language = e.view.params.language;
            var summaryId = e.view.params.summaryId;
            var versionId = e.view.params.versionId;

            assert.equal(viewModel.get(VIEW_MODEL.LANGUAGE), language, assert.format(assert.messages.equal.default, 'language', 'viewModel.get("language")'));
            assert.equal(i18n.locale(), language, assert.format(assert.messages.equal.default, 'language', 'i18n.locale()'));
            assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
            assert.match(RX_MONGODB_ID, versionId, assert.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));

            // Let's remove the clickSubmitInfo attr used to track and limit toast notifications (see viewModel.bind(CHANGE))
            e.view.element.removeProp(kendo.attr('clickSubmitInfo'));

            // Rebuild stage and bind viewModel
            kendo.bind(e.view.content.find(kendo.roleSelector('stage')), app.mobile.viewModel, kendo.ui, kendo.dataviz.ui, kendo.mobile.ui);
            mobile._resizeStage(e.view);

            // load data
            $.when(
                // load version to display quiz content in the player
                viewModel.loadVersion({ language: language, summaryId: summaryId, id: versionId }),
                // Load activities to save score in datasource
                viewModel.loadActivities({ language: language, userId: viewModel.get(VIEW_MODEL.USER.SID) })
            )
                .done(function () {
                    viewModel.resetCurrent();
                    viewModel.set(VIEW_MODEL.SELECTED_PAGE, viewModel.get(VIEW_MODEL.PAGES_COLLECTION).at(0));
                })
                .always(function () {
                    mobile.onGenericViewShow(e);
                    app.notification.info(i18n.culture.notifications.pageNavigationInfo);
                    if (mobile.support.ga) {
                        mobile.ga.trackEvent(
                            ANALYTICS.CATEGORY.SUMMARY,
                            ANALYTICS.ACTION.PLAY,
                            summaryId
                        );
                    }
                });
        };

        /**
         * Event handler triggered when hiding the Player view
         * @param e
         */
        mobile.onPlayerViewHide = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));

            // Destroy the stage (necessary to hide the floating toolbar and avoid initializing widgets simultaneously in correction and player modes)
            kendo.destroy(e.view.content.find(kendo.roleSelector('stage')));

            // Cancel any utterance spoken
            app.tts.cancelSpeak();
        };

        /**
         * Initialize score listview
         * @param view
         * @private
         */
        mobile._initScoreListView = function (view) {
            assert.instanceof(kendo.mobile.ui.View, view, assert.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
            var language = view.params.language;
            var summaryId = view.params.summaryId;
            var versionId = view.params.versionId;
            var activityId = view.params.activityId;
            var contentElement = view.content;
            // Find and destroy the listview as it needs to be rebuilt if locale changes
            // Note: if the grid is set as <div data-role="listview"></div> in index.html then .km-pane-wrapper does not exist, so we need an id
            // var listViewElement = view.element.find(kendo.roleSelector('listview'));
            var listViewElement = contentElement.find(HASH + VIEW.SCORE + '-listview');
            if (listViewElement.length) {
                var listViewWidget = listViewElement.data('kendoMobileListView');
                if (listViewWidget instanceof kendo.mobile.ui.ListView) {
                    kendo.destroy(listViewElement);
                }
                // TODO We should be able to view scores without reloading the summary and recalculating everything
                // TODO check we do not get disabled values
                // TODO check we are using value$() and solution$() which display correctly with all tools
                listViewWidget = listViewElement.kendoMobileListView({
                    click: function (e) {
                        e.preventDefault();
                        mobile.application.navigate(HASH + VIEW.CORRECTION +
                            '?language=' + window.encodeURIComponent(language) +
                            '&summaryId=' + window.encodeURIComponent(summaryId) +
                            '&versionId=' + window.encodeURIComponent(versionId) +
                            '&activityId=' + window.encodeURIComponent(activityId) + // Note: this is a local id, not a sid
                            '&page=' + window.encodeURIComponent(e.dataItem.page + 1)
                        );
                    },
                    dataSource: {
                        data: viewModel.get(VIEW_MODEL.CURRENT.TEST).getScoreArray(),
                        group: { field: 'page' }
                    },
                    filterable: false,
                    fixedHeaders: true,
                    headerTemplate: contentElement.find('#score-header-template').html().trim(),
                    template: contentElement.find('#score-template').html().trim(),
                    type: 'group'
                });
            }
        };

        /**
         * Event handler triggered when showing the score view after submitting a score
         * @param e
         */
        mobile.onScoreViewShow = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Get the activity id from params
            var activityId = e.view.params.activityId; // Note: activityId is a local id (not a sid)
            if (RX_MONGODB_ID.test(activityId)) {
                // If we have an activityId, replace the current test to display score and correction
                var activity = viewModel.activities.get(activityId);
                // TODO Load activities if necessary to make the view idempotent, otherwise the following assert will fail
                assert.instanceof(models.MobileActivity, activity, assert.format(assert.messages.instanceof.default, 'activity', 'app.models.MobileActivity'));
                assert.equal('Score', activity.type, assert.format(assert.messages.equal.default, 'activity.type', 'Score'));
                $.when(
                    viewModel.loadSummary({ language: i18n.locale(), id: activity.get('version.summaryId') }),
                    viewModel.loadVersion({ language: i18n.locale(), summaryId: activity.get('version.summaryId'), id: activity.get('version.versionId') })
                )
                    .done(function () {
                        // Note: We cannot assign the activity, otherwise calculate will make changes that will make it dirty in MobileActivityDataSource
                        viewModel.set(VIEW_MODEL.CURRENT.$, activity.toJSON());
                        viewModel.calculate() // TODO: We should not have to recalculate what is already calculated
                            .done(function () {
                                mobile._setNavBarTitle(e.view, kendo.format(i18n.culture.score.viewTitle, viewModel.get((VIEW_MODEL.CURRENT.SCORE) || 0) / 100));
                                mobile._initScoreListView(e.view);
                            });
                    })
                    .always(function () {
                        mobile.onGenericViewShow(e);
                    });
            } else {
                // Otherwise, use the current test
                // TODO assert current state (percent function?)
                mobile._initScoreListView(e.view);
                mobile.onGenericViewShow(e);
            }
        };

        /**
         * Event handler triggered when showing the Settings view
         * Note: the view event is triggered each time the view is requested
         * @param e
         */
        mobile.onSettingsViewShow = mobile.onGenericViewShow;

        /**
         * Event handler triggered when clicking the Switch button of the Settings view
         * @param e
         */
        mobile.onSettingsSwitchClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            // Navigate to the user view
            mobile.application.navigate(HASH + VIEW.USER);
        };

        /**
         * Parse token and load user
         * @param url
         * @private
         */
        mobile._parseTokenAndLoadUser = function (url) {
            var dfd = $.Deferred();
            // parseToken sets the token in localStorage
            var token = rapi.util.parseToken(url);
            // No need to clean the history when opening in InAppBrowser or SafariViewController
            if (!mobile.support.safariViewController && !mobile.support.inAppBrowser) {
                rapi.util.cleanHistory();
            }
            if (token && token.error) {
                app.notification.error(i18n.culture.notifications.oAuthTokenFailure);
                logger.error({
                    message: token.error,
                    method: 'mobile._parseTokenAndLoadUser',
                    data: { url: url }
                });
                dfd.reject(new Error(token.error)); // TODO Make it an XHRError to match viewModel.loadUser
                /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
            } else if (token && token.access_token) {
                /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
                // Load the remote mobile user (me) using the oAuth token
                // We cannot navigate to a page here because the initial page is defined in the constructor of kendo.mobile.Application
                viewModel.loadUser()
                    .done(function () {
                        // Yield time for transition effects to complete, especially when testing in the browser
                        // Otherwise we get an exception on that.effect.stop in kendo.mobile.ViewContainer.show
                        // app.mobile.application.view().one('transitionEnd', function () {
                        setTimeout(function () {
                            if (viewModel.isNewUser$()) {
                                // Save new user first
                                mobile.application.navigate(HASH + VIEW.USER);
                            } else {
                                // Sync user data since we have a recent token
                                mobile.application.navigate(HASH + VIEW.SYNC);
                            }
                            dfd.resolve();
                        }, 0);
                    })
                    .fail(dfd.reject);
            }
            return dfd.promise();
        };

        /**
         * Event handler triggered when initializing the signin view
         * @param e
         */
        mobile.onSigninViewInit = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            var view = e.view;
            var scrollViewElement = view.content.find(kendo.roleSelector('scrollview'));
            var scrollViewWidget = scrollViewElement.data('kendoMobileScrollView');
            if (scrollViewWidget instanceof kendo.mobile.ui.ScrollView) {
                // Note: the change event occurs a little bit late to coordinate scrolling with titles and styles
                scrollViewWidget.bind('changing', function (e) {
                    // Note: The user needs to scroll through pages for this event to be triggered
                    // Especially, it is not triggered when showing the initial page, so page 0 has default values
                    assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
                    assert.type(NUMBER, e.nextPage, assert.format(assert.messages.type.default, 'e.nextPage', NUMBER));
                    if (e.nextPage === SIGNIN_PAGE) {
                        mobile._setNavBarTitle(view, i18n.culture.signin.viewTitle2);
                        view.content.find('ol.k-pages.km-pages').addClass('no-background');
                    } else {
                        mobile._setNavBarTitle(view);
                        view.content.find('ol.k-pages.km-pages').removeClass('no-background');
                    }
                });
            }
        };

        /**
         * Event handler triggered when showing the signin view
         * @param e
         */
        mobile.onSigninViewShow = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));

            // Parse token (in browser)
            if (!mobile.support.inAppBrowser && !mobile.support.safariViewController) {
                e.preventDefault();
                mobile._parseTokenAndLoadUser(window.location.href);
            }

            // Set Navbar
            var view = e.view;
            mobile._setNavBar(view);

            // Enable buttons according to provider
            var provider = (view.params.userId === viewModel.get(VIEW_MODEL.USER.ID) ? viewModel.get(VIEW_MODEL.USER.PROVIDER) : '');
            mobile.enableSigninButtons(provider || true);

            // Scroll to page if designated in e.view.params to set the view title
            var scrollViewElement = view.content.find(kendo.roleSelector('scrollview'));
            var scrollViewWidget = scrollViewElement.data('kendoMobileScrollView');
            // Scroll to page 0 unless there is a page in params
            if (scrollViewWidget instanceof kendo.mobile.ui.ScrollView) {
                var page = parseInt(view.params.page, 10) || 0;
                scrollViewWidget.trigger('changing', { nextPage: page });
                scrollViewWidget.scrollTo(page, true);
            }

            // mobile.onGenericViewShow(e);
            if (mobile.application instanceof kendo.mobile.Application) {
                // mobile.application is not available on first view shown
                mobile.application.hideLoading();
            }
        };

        /**
         * Fix title and notification on #signin view
         * Note: We need this because mobile.localize(...) is executed after onSigninViewShow, when signin is the initial page
         * @private
         */
        mobile._fixSigninViewLocalization = function () {
            if (mobile.application instanceof kendo.mobile.Application && mobile.application.pane instanceof kendo.mobile.ui.Pane) {
                var view = mobile.application.view();
                var culture = i18n.culture;
                if (parseInt(view.params.page, 10) === SIGNIN_PAGE) {
                    mobile._setNavBarTitle(view, culture.signin.viewTitle2);
                }
                var provider = (view.params.userId === viewModel.get(VIEW_MODEL.USER.ID) ? viewModel.get(VIEW_MODEL.USER.PROVIDER) : '');
                if (provider) {
                    view.content.find('div[data-role="page"]:eq(3) .k-notification-wrap>span.k-text').html(kendo.format(culture.signin.welcome2, viewModel.get(VIEW_MODEL.USER.FIRST_NAME), provider));
                }
            }
        };

        /**
         * Sign in with SFSafariViewController
         * requires https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller
         * also requires https://github.com/EddyVerbruggen/Custom-URL-scheme
         *
         * Note: Parsing the token is done by mobile._parseTokenAndLoadUser in handleOpenURL (see custom url scheme)
         *
         * Now that Google has deprecated oAuth flows from web views, this is the preferred way to sign in
         * although this is only compatible with iOS 9 and above
         * See: https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html
         * There is also a huge benefit: social accounts are remembered and users do not have to re-enter their MFA codes each time they signin
         *
         * @param signInUrl
         * @private
         */
        mobile._signinWithSafariViewController = function (signInUrl) {
            logger.debug({
                message: 'opening signInUrl in SafariViewController',
                method: 'mobile._signinWithSafariViewController',
                data: { signInUrl: signInUrl }
            });
            mobile.SafariViewController.isAvailable(function (available) {
                if (available) {
                    mobile.SafariViewController.show({
                            url: signInUrl
                            // hidden: false,
                            // animated: false, // default true, note that 'hide' will reuse this preference (the 'Done' button will always animate though)
                            // transition: 'curl', // (this only works in iOS 9.1/9.2 and lower) unless animated is false you can choose from: curl, flip, fade, slide (default)
                            // enterReaderModeIfAvailable: readerMode, // default false
                            // tintColor: "#00ffff", // default is ios blue
                            // barColor: "#0000ff", // on iOS 10+ you can change the background color as well
                            // controlTintColor: "#ffffff" // on iOS 10+ you can override the default tintColor
                        },
                        // this success handler will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
                        function (result) {
                            // result has only one property, event which can take any value among 'opened', 'loaded' and 'closed'
                            logger.debug({
                                message: 'safari/chrome successfully opened',
                                method: 'mobile._signinWithSafariViewController',
                                data: { event: result.event }
                            });
                        },
                        function (msg) {
                            logger.error({
                                message: 'safari/chrome failed to opened',
                                method: 'mobile._signinWithSafariViewController',
                                error: new Error(msg)
                            });
                        });
                } // else { use InAppBrowser or app.notification ? }
            });
        };

        /**
         * Sign in with InAppBrowser
         * Requires https://github.com/apache/cordova-plugin-inappbrowser
         *
         * Note: Parsing the token is done here by mobile._parseTokenAndLoadUser
         *
         * This is the old way applicable to iOS8 and prior versions
         * This way has several limitations:
         * - InAppBrowser uses UIWebView, not WKWebView on iOS
         * - The oAuth flow is incompatible with WKWebView which has to be disabled to work - see https://github.com/kidoju/Kidoju-Mobile/issues/34
         * - Google has announced that as of April 2007 the oAuth flow with web views won't be supported - see https://github.com/kidoju/Kidoju-Mobile/issues/33
         *
         * @param signInUrl
         * @param returnUrl
         * @private
         */
        mobile._signinWithInAppBrowser = function (signInUrl, returnUrl) {
            var close = function () {
                if (browser) { // Makes it idempotent in case it has already been called
                    browser.removeEventListener('loadstart', loadStart);
                    // browser.removeEventListener('loadstop', loadStop);
                    browser.removeEventListener('loaderror', loadError);
                    browser.close();
                    browser = undefined;
                    logger.debug({
                        message: 'closed InAppBrowser',
                        method: 'mobile._signinWithInAppBrowser'
                    });
                }
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
                    method: 'mobile._signinWithInAppBrowser',
                    data: { url: e.url }
                });
                // Once https://github.com/apache/cordova-plugin-inappbrowser/pull/99 is fixed
                // we should be able to have the same flow as in SafariViewController
                if (e.url.startsWith(returnUrl)) {
                    mobile._parseTokenAndLoadUser(e.url).always(close);
                }
            };
            var loadError = function (error) {
                // We have an issue with the InAppBrowser which raises an error when opening custom url schemes, e.g. com.kidoju.mobile://oauth
                // See https://github.com/apache/cordova-plugin-inappbrowser/pull/99
                // window.alert(JSON.stringify($.extend({}, error)));
                logger.error({
                    message: 'loaderror event of InAppBrowser',
                    method: 'mobile._signinWithInAppBrowser',
                    error: error,
                    data: { url: error.url }
                });
                // Close may have already been called in loadStart
                close();
            };
            var browser = mobile.InAppBrowser.open(signInUrl, '_blank', 'location=yes,clearsessioncache=yes,clearcache=yes');
            // browser.addEventListener('exit', exit);
            browser.addEventListener('loadstart', loadStart);
            // browser.addEventListener('loadstop', loadStop);
            browser.addEventListener('loaderror', loadError);
            logger.debug({
                message: 'opening signInUrl in InAppBrowser',
                method: 'mobile._signinWithInAppBrowser',
                data: { signInUrl: signInUrl }
            });
        };

        /**
         * Sign in within the same browser as the application
         *
         * Note: Parsing the token is done by app.rapi.js
         *
         * @param signInUrl
         * @private
         */
        mobile._signinWithinBrowser = function (signInUrl) {
            logger.debug({
                message: 'opening signInUrl in browser',
                method: 'mobile._signinWithinBrowser',
                data: { signInUrl: signInUrl }
            });
            // Simply assign url and let the authentication provider redirect to the registered callback
            window.location.assign(signInUrl);
        };

        /**
         * Event handler triggered when clicking a button on the sign-in view
         * @param e
         */
        mobile.onSigninButtonClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

            // Disable buttons to avoid double clicks
            mobile.enableSigninButtons(false);

            var provider = e.button.attr(kendo.attr('provider'));
            // In Phonegap, windows.location.href = "x-wmapp0:www/index.html" and Kidoju-Server cannot redirect the InAppBrowser to such location
            // The oAuth recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob" which sets the authorization code in the browser's title, however, we can't access the title of the InAppBrowser in Phonegap.
            // Several oAuth authentication providers do not support "http://localhost" (or preferably "kidoju://localhost") as a redirection url.
            // Several oAuth authentication providers require the creation and management of one application per web site root in addition to https://www.kidoju.com
            // The trick is to use a blank returnUrl at https://www.kidoju.com/api/blank with a CSP that does not allow the execution of any code
            // We can then access this returnUrl in the loadstart and loadstop events of the InAppBrowser.
            // So if we bind the loadstart event, we can find the access_token code and close the InAppBrowser after the user has granted access to their data.
            var returnUrl = (mobile.support.safariViewController || mobile.support.inAppBrowser) ?
                kendo.format(app.uris.rapi.root + app.uris.rapi.oauth.application, app.constants.appId) :
                window.location.protocol + '//' + window.location.host + '/' + HASH + VIEW.SIGNIN;
            // When running in a browser via phonegap serve, the InAppBrowser turns into an iframe but authentication providers prevent running in an iframe by setting 'X-Frame-Options' to 'SAMEORIGIN'
            // So if the device platform is a browser, we need to keep the sameflow as Kidoju-WebApp with a redirectUrl that targets the user view
            rapi.oauth.getSignInUrl(provider, returnUrl)
                .done(function (signInUrl) {
                    // Save provider to read in viewModel.loadUser
                    localStorage.setItem('provider', provider); // TODO Manage errors
                    logger.debug({
                        message: 'getSignInUrl',
                        method: 'mobile.onSigninButtonClick',
                        data: { provider: provider, returnUrl: returnUrl, signInUrl: signInUrl }
                    });
                    // window.alert(mobile.support.safariViewController ? 'Yep' : 'Nope');
                    if (mobile.support.safariViewController) {
                        // running in Phonegap, using SFSafariViewController
                        // requires https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller
                        // also requires https://github.com/EddyVerbruggen/Custom-URL-scheme
                        mobile._signinWithSafariViewController(signInUrl);
                    } else if (mobile.support.inAppBrowser) {
                        // running in Phonegap, using InAppBrowser
                        // requires https://github.com/apache/cordova-plugin-inappbrowser
                        mobile._signinWithInAppBrowser(signInUrl, returnUrl);
                    } else {
                        // Running in a browser, simply redirect to signInUrl
                        mobile._signinWithinBrowser(signInUrl);
                    }
                })
                .fail(function (xhr, status, error) {
                    app.notification.error(i18n.culture.notifications.signinUrlFailure);
                    logger.error({
                        message: 'error obtaining a signin url',
                        method: 'mobile.onSigninButtonClick',
                        data: { provider: provider, status: status, error: error, response: parseResponse(xhr) }
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
            // enable is either a boolean or a provider
            // If it is a provider, only enable the button corresponding to this provider
            var provider = $.type(enable) === STRING ? enable : '';
            enable = provider.length ? false : enable;

            $(HASH + VIEW.SIGNIN).children(kendo.roleSelector('content')).find(kendo.roleSelector('button')).each(function () {
                var buttonElement = $(this);
                var buttonProvider = buttonElement.attr(kendo.attr('provider'));
                var buttonWidget = $(this).data('kendoMobileButton');
                if (buttonWidget instanceof kendo.mobile.ui.Button) {
                    buttonWidget.enable(enable || (buttonProvider === provider));
                }
            });
        };

        /**
         * Event handler triggered when showing the summary view
         * @param e
         */
        mobile.onSummaryViewShow = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            var view = e.view;
            // load the summary
            var language = i18n.locale();
            assert.equal(language, viewModel.get(VIEW_MODEL.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("language")', language));
            var summaryId = e.view.params.summaryId;
            viewModel.loadSummary({ language: language, id: summaryId })
                .always(function () {
                    mobile.onGenericViewShow(e);
                    // Set the background color
                    // This cannot be done via bindings because the view and vien.content cannot be bound
                    var summary = viewModel.get(VIEW_MODEL.SUMMARY.$);
                    view.content
                        .toggleClass('error', summary.isError$())
                        .toggleClass('success', summary.isSuccess$())
                        .toggleClass('warning', summary.isWarning$());
                    app.notification.info(i18n.culture.notifications.summaryViewInfo);
                });
        };

        /**
         * Event handler triggered when clicking the play option in the action sheet displayed from the GO button of summaries
         */
        mobile.onSummaryActionPlay = function () {
            // assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            var language = i18n.locale();
            assert.equal(language, viewModel.get(VIEW_MODEL.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("language")', language));
            assert.equal(language, viewModel.get(VIEW_MODEL.SUMMARY.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("summary.language")', language));
            var summaryId = viewModel.get(VIEW_MODEL.SUMMARY.ID);

            // Find latest version (version history is not available in the mobile app)
            viewModel.loadLazyVersions({
                // TODO: fields could be found in models.LazyVersion (use the from property not the field name) - @see https://github.com/kidoju/Kidoju-Widgets/issues/218
                fields: 'id,state,summaryId', // Note for whatever reason we also receive the type in the response payload
                filter: { field: 'state', operator: 'eq', value: 5 },
                partition: { language: language, summaryId: summaryId },
                sort: { field: 'id', dir: 'desc' }
            })
                .done(function () {
                    var version = viewModel.versions.at(0); // First is latest version
                    assert.instanceof(models.LazyVersion, version, assert.format(assert.messages.instanceof.default, 'version', 'models.LazyVersion'));
                    assert.match(RX_MONGODB_ID, version.get('id'), assert.format(assert.messages.match.default, 'version.get(\'id")', RX_MONGODB_ID));
                    // version has no language - we therfore assume same langauge
                    // assert.equal(language, version.get('language'), assert.format(assert.messages.equal.default, 'version.get(\'language")', language));
                    assert.equal(summaryId, version.get('summaryId'), assert.format(assert.messages.equal.default, 'version.get(\'summaryId")', summaryId));
                    mobile.application.navigate(HASH + VIEW.PLAYER +
                        '?language=' + window.encodeURIComponent(language) +
                        '&summaryId=' + window.encodeURIComponent(summaryId) +
                        '&versionId=' + window.encodeURIComponent(version.get('id'))
                    );
                });
        };

        /**
         * Event handler triggered when clicking the share option in the action sheet displayed from the GO button of summaries
         * @see https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
         */
        mobile.onSummaryActionShare = function () {
            if (mobile.support.socialsharing) {
                var culture = i18n.culture.summary.socialSharing;
                mobile.socialsharing.shareWithOptions(
                    {
                        message: kendo.format(culture.message, // not supported on some apps (Facebook, Instagram)
                            viewModel.get(VIEW_MODEL.SUMMARY.TITLE),
                            // viewModel.summary.summaryUri$(),
                            viewModel.get(VIEW_MODEL.SUMMARY.DESCRIPTION)),
                        subject: kendo.format(culture.subject, // for email
                            viewModel.get(VIEW_MODEL.SUMMARY.TITLE)),
                        // TODO Add files - https://github.com/kidoju/Kidoju-Mobile/issues/178
                        // files: ['www/icon.png'], // an array of filenames either locally or remotely
                        // here, www/icon.png is included in email and prevents facebook from using the file linked in the web page via og:image meta tag
                        url: viewModel.summary.summaryUri$(),
                        chooserTitle: culture.chooserTitle // Android only, you can override the default share sheet title
                    },
                    function (result) {
                        app.notification.success(i18n.culture.notifications.sharingSuccess);
                        // mobile.dialogs.info('Share completed? ' + result.completed + '/' + result.app);
                        // On Android apps mostly return result.completed=false even while it's true
                        // On Android result.app (the app shared to) is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                        // Track with Google Analytics
                        if (mobile.support.ga) {
                            mobile.ga.trackEvent(
                                ANALYTICS.CATEGORY.SUMMARY,
                                ANALYTICS.ACTION.SHARE + result.app,
                                viewModel.get(VIEW_MODEL.SUMMARY.ID)
                            );
                        }
                    },
                    function (msg) {
                        // mobile.dialogs.error('Sharing failed: ' + msg);
                        app.notification.error(i18n.culture.notifications.sharingFailure);
                        logger.error({
                            message: 'Error sharing',
                            method: 'mobile.onSummaryActionShare',
                            error: new Error(msg)
                        });

                    }
                );
            }
        };

        /**
         * Event handler triggered when clicking the feedback option in the action sheet displayed from the GO button of summaries
         */
        mobile.onSummaryActionFeedback = function () {
            var url = kendo.format(app.constants.feedbackUrl, i18n.locale(), encodeURIComponent(viewModel.summary.summaryUri$()));
            // targeting _system should open the web browser instead of the InApp browser (target = _blank)
            if (mobile.support.inAppBrowser) {
                mobile.InAppBrowser.open(url, '_system');
            } else {
                window.open(url, '_system');
            }
            if (mobile.support.ga) {
                mobile.ga.trackEvent(
                    ANALYTICS.CATEGORY.GENERAL,
                    ANALYTICS.ACTION.FEEDBACK
                );
            }
        };

        /**
         * Event handler triggered when showing the sync view
         * @param e
         */
        mobile.onSyncViewShow = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));

            var language = i18n.locale();
            assert.equal(language, viewModel.get(VIEW_MODEL.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("language")', language));

            var culture = i18n.culture.sync;
            var message = e.view.content.find('p.message');
            var passProgressBar = e.view.content.find('#sync-pass').data('kendoProgressBar');
            var percentProgressBar = e.view.content.find('#sync-percent').data('kendoProgressBar');

            // Update navigation bar
            mobile.onGenericViewShow(e);

            // Reset progress bars
            // passProgressBar.value(0);
            // percentProgressBar.value(0);

            // Display custom status
            passProgressBar.unbind('change');
            passProgressBar.bind('change', function (e) {
                e.sender.progressStatus.text(status.pass < 2 ? culture.pass.remote : culture.pass.local);
            });

            // Disable single continue button
            var continueButton = e.view.content.find(kendo.roleSelector('button')).data('kendoMobileButton');
            continueButton.unbind('click');
            continueButton.enable(false);

            // Check network
            if ((window.device && !window.device.isVirtual && window.device.platform !== 'browser' && 'Connection' in window &&
                    window.navigator.connection.type !== window.Connection.ETHERNET && window.navigator.connection.type !== window.Connection.WIFI) ||
                (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
                // !window.device.isVirtual ensures emulators do sync whatever the connection
                app.notification.warning(i18n.culture.notifications.syncBandwidthLow);
                return mobile.application.navigate(HASH + VIEW.CATEGORIES + '?language=' + encodeURIComponent(language));
            }

            // Check batteries
            // Commented because there is no way to ensure a battery event to set app.battery.status before syncing
            /*
            if ((!app.battery.status.isPlugged) && ($.type(app.battery.status.level) !== NUMBER || app.battery.status.level < 20)) {
                return app.notification.warning(i18n.culture.notifications.syncBatteryLow);
            }
            */

            // Synchronize activities
            viewModel.activities.setLastSync(viewModel.get(VIEW_MODEL.USER.LAST_SYNC));
            viewModel.activities.remoteSync()
                .progress(function (status) {
                    message.text(culture.message[status.collection]);
                    passProgressBar.value(status.pass);
                    percentProgressBar.value(100 * (status.index + 1) / status.total);
                })
                .done(function () {
                    passProgressBar.value(2);
                    percentProgressBar.value(100);

                    // Update user
                    var now = new Date();
                    viewModel.set(VIEW_MODEL.USER.LAST_USE, now);
                    viewModel.set(VIEW_MODEL.USER.LAST_SYNC, now);
                    viewModel.users.sync()
                        .done(function () {
                            message.text(culture.message.complete);
                            app.notification.success(i18n.culture.notifications.syncSuccess);
                            if (mobile.support.ga) {
                                mobile.ga.trackEvent(
                                    ANALYTICS.CATEGORY.ACTIVITY,
                                    ANALYTICS.ACTION.SYNC
                                    // Note: It would be nice to report the total number of activities synced
                                );
                            }
                        })
                        .fail(function (xhr, status, error) {
                            app.notification.error(i18n.culture.notifications.userSaveFailure);
                            logger.error({
                                message: 'Error updating user after synchronization',
                                method: 'mobile.onSyncViewShow',
                                data: { error: error, status: status, response: parseResponse(xhr) }
                            });
                        });
                })
                .fail(function (xhr, status, error) {
                    if (xhr.status === 401) {
                        app.notification.error(i18n.culture.notifications.syncUnauthorized);
                    } else {
                        app.notification.error(i18n.culture.notifications.syncFailure);
                        logger.error({
                            message: 'Error Synchronizing',
                            method: 'mobile.onSyncViewShow',
                            data: { error: error, status: status, response: parseResponse(xhr) }
                        });
                    }
                })
                .always(function () {
                    // Enable continue button
                    continueButton.bind('click', function (e) {
                        e.preventDefault();
                        mobile.application.navigate(HASH + VIEW.CATEGORIES + '?language=' + encodeURIComponent(language));
                    });
                    continueButton.enable(true);
                });
        };

        /**
         * Event handler triggered when hiding the sync view
         * @param e
         */
        mobile.onSyncViewHide = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            var message = e.view.content.find('p.message');
            var passProgressBar = e.view.content.find('#sync-pass').data('kendoProgressBar');
            var percentProgressBar = e.view.content.find('#sync-percent').data('kendoProgressBar');

            // Reset message
            message.text('');

            // Reset progress bars
            passProgressBar.value(0);
            percentProgressBar.value(0);
        };

        /**
         * Event handler triggered when initializing the user view
         * @param e
         */
        mobile.onUserViewInit = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Init pin textboxes if not already initialized
            // We have removed kendo.ui.MaskedTextBox because the experience was not great
            // especially because it always displays 4 password dots making the number of characters actually typed unclear
            e.view.element
                .off(FOCUS + ' ' + INPUT + ' ' + KEYDOWN + ' ' + KEYPRESS, SELECTORS.PIN)
                .on(FOCUS, SELECTORS.PIN, function (e) {
                    assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                    assert.ok($(e.target).is(SELECTORS.PIN), '`e.target` should be a pin textbox');
                    // Empty the pin input on focus
                    $(e.target).val('');
                })
                .on(INPUT, SELECTORS.PIN, function (e) {
                    assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                    assert.ok($(e.target).is(SELECTORS.PIN), '`e.target` should be a pin textbox');
                    // Note: android does not trigger the keypress event, so we need the input event
                    // Only keep the first 4 digits
                    $(e.target).val($(e.target).val().replace(/\D+/g, '').substr(0, 4));
                })
                .on(KEYDOWN, SELECTORS.PIN, function (e) {
                    assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                    assert.ok($(e.target).is(SELECTORS.PIN), '`e.target` should be a pin textbox');
                    if (e.which === 13) {
                        // This is a carriage return, so trigger the primary button
                        var viewElement = $(e.target).closest(kendo.roleSelector('view'));
                        var buttonElement = viewElement.find(kendo.roleSelector('button') + '.km-primary:visible');
                        assert.equal(1, buttonElement.length, assert.format(assert.messages.equal.default, 'buttonElement.length', '1'));
                        var buttonWidget = buttonElement.data('kendoMobileButton');
                        assert.instanceof(kendo.mobile.ui.Button, buttonWidget, assert.format(assert.messages.instanceof.default, 'buttonWidget', 'kendo.mobile.ui.Button'));
                        buttonWidget.trigger(CLICK, { button: buttonElement });
                    }
                })
                .on(KEYPRESS, SELECTORS.PIN, function (e) {
                    assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                    assert.ok($(e.target).is(SELECTORS.PIN), '`e.target` should be a pin textbox');
                    // Special characters including backspace, delete, end, home and arrows do not trigger the keypress event (they trigger keydown though)
                    if (e.which < 48 || e.which > 57 || $(e.target).val().length > 3) {
                        e.preventDefault();
                    }
                });

            /*
            // This was used for debugging user pictures
            e.view.element.find('img').on(CLICK, function (e) {
                window.alert($(e.target).attr('src'));
            });
            */
        };

        /**
         * Event handler triggered when showing the user view
         * BEWARE: Because #user is the initial view designated in the constructor of kendo.mobile.Application
         * this necessarily executes when loading the application
         * @param e
         */
        mobile.onUserViewShow = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            mobile.onGenericViewShow(e);
            // Display a notification
            if (viewModel.isSavedUser$()) {
                app.notification.info(i18n.culture.notifications.pinValidationInfo);
            } else {
                app.notification.info(i18n.culture.notifications.pinSaveInfo);
            }
            // Focus on PIN
            mobile.enableUserButtons(true);
            e.view.element.find(SELECTORS.PIN).val('').first().focus();
        };

        /**
         * Event handler when clicking the save button of the user view
         * @param e
         */
        mobile.onUserSaveClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

            // Disable buttons to avoid double clicks
            mobile.enableUserButtons(false);

            // Get user from viewModel
            var user = viewModel.get(VIEW_MODEL.USER.$);
            assert.instanceof(models.MobileUser, user, assert.format(assert.messages.instanceof.default, 'user', 'models.MobileUser'));
            var isNewUser = user.isNew();

            // Read pin values
            var view = e.button.closest(kendo.roleSelector('view'));
            var pinElements = view.find(SELECTORS.PIN);
            assert.equal(3, pinElements.length, assert.format(assert.messages.equal.default, 'pinElements.length', '3'));
            var pinValue = pinElements.eq(0).val();
            var newPinValue = pinElements.eq(1).val();
            var confirmValue = pinElements.eq(2).val();
            var isNew = user.isNew();
            if ((isNew && RX_PIN.test(newPinValue) && confirmValue === newPinValue) ||
                (!isNew && RX_PIN.test(newPinValue) && confirmValue === newPinValue && user.verifyPin(pinValue))) {

                // Update user with new pin
                user.addPin(newPinValue);
                viewModel.set(VIEW_MODEL.USER.LAST_USE, new Date());

                // Synchronize changes
                viewModel.syncUsers()
                    .done(function () {
                        app.notification.success(kendo.format(i18n.culture.notifications.userSignInSuccess, viewModel.user.fullName$()));
                        if (isNewUser) {
                            mobile.application.navigate(HASH + VIEW.SYNC);
                        } else {
                            var language = i18n.locale();
                            assert.equal(language, viewModel.get(VIEW_MODEL.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("language")', language));
                            mobile.application.navigate(HASH + VIEW.CATEGORIES + '?language=' + encodeURIComponent(language));
                        }
                    })
                    .always(function () {
                        mobile.enableUserButtons(true);
                        if (mobile.support.ga && isNew) {
                            mobile.ga.trackEvent(
                                ANALYTICS.CATEGORY.USER,
                                ANALYTICS.ACTION.SAVE,
                                viewModel.get(VIEW_MODEL.USER.PROVIDER)
                            );
                        }
                    });

            } else if (!isNew && RX_PIN.test(newPinValue) && confirmValue === newPinValue && !user.verifyPin(pinValue)) {

                app.notification.warning(i18n.culture.notifications.pinValidationFailure);
                mobile.enableUserButtons(true);

            } else {

                app.notification.warning(i18n.culture.notifications.pinSaveFailure);
                mobile.enableUserButtons(true);

            }
        };

        /**
         * Event handler triggered when clicking the signin button of the user view
         * @param e
         */
        mobile.onUserSignInClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

            // Disable buttons to avoid double clicks
            mobile.enableUserButtons(false);

            // Check the correct pin
            var view = e.button.closest(kendo.roleSelector('view'));
            var pinElement = view.find(SELECTORS.PIN + ':visible');
            assert.equal(1, pinElement.length, assert.format(assert.messages.equal.default, 'pinElement.length', '1'));
            var pinValue = pinElement.val();

            if (viewModel.user.verifyPin(pinValue)) {
                // Note: the following changes the value of viewModel.isSavedUser$, which changes UI layout
                viewModel.set(VIEW_MODEL.USER.LAST_USE, new Date());
                viewModel.syncUsers(false)
                    .done(function () {
                        app.notification.success(kendo.format(i18n.culture.notifications.userSignInSuccess, viewModel.user.fullName$()));
                        mobile.application.navigate(HASH + VIEW.CATEGORIES + '?language=' + encodeURIComponent(i18n.locale()));
                        // Request an app store review
                        mobile._requestAppStoreReview();
                    })
                    .always(function () {
                        mobile.enableUserButtons(true);
                        if (mobile.support.ga) {
                            mobile.ga.trackEvent(
                                ANALYTICS.CATEGORY.USER,
                                ANALYTICS.ACTION.SIGNIN,
                                viewModel.get(VIEW_MODEL.USER.PROVIDER)
                            );
                        }
                    });

            } else {
                app.notification.warning(i18n.culture.notifications.pinValidationFailure);
                mobile.enableUserButtons(true);
            }
        };

        /**
         * Event handler triggered when clicking the new user button of the user view
         * @param e
         */
        mobile.onUserNewClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            mobile.application.navigate(HASH + VIEW.SIGNIN + '?page=' + encodeURIComponent(SIGNIN_PAGE));
        };

        /**
         * Event handler triggered when clicking the change pin button of the user view
         * @param e
         */
        mobile.onUserChangePin = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            // Simply change a property to show the Save button considering declarative bindings based on viewModel.isSavedUser$()
            viewModel.set(VIEW_MODEL.USER.LAST_USE, new Date());
        };

        /**
         * Enable/disable user buttons and pin inputs (to prevent double-clicks)
         * @param enable
         */
        mobile.enableUserButtons = function (enable) {
            $(HASH + VIEW.USER).find('li:has(' + SELECTORS.PIN + ')').css('visibility', enable ? '' : 'hidden');
            $(HASH + VIEW.USER).children(kendo.roleSelector('content')).find(kendo.roleSelector('button')).each(function () {
                var buttonWidget = $(this).data('kendoMobileButton');
                if (buttonWidget instanceof kendo.mobile.ui.Button) {
                    buttonWidget.enable(enable);
                }
            });
        };

        /**
         * Event handler triggered when clicking the previous user button in the navbar
         * @param e
         */
        mobile.onNavBarPreviousUserClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            var viewElement = e.button.closest('.km-view');
            assert.hasLength(viewElement, assert.format(assert.messages.hasLength.default, 'viewElement'));
            var viewWidget = viewElement.data('kendoMobileView');
            assert.instanceof(kendo.mobile.ui.View, viewWidget, assert.format(assert.messages.instanceof.default, 'viewWidget', 'kendo.mobile.ui.View'));
            viewModel.previousUser();
            mobile._setNavBar(viewWidget);
        };

        /**
         * Event handler triggered when clicking the next user button in the navbar
         * @param e
         */
        mobile.onNavBarNextUserClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            var viewElement = e.button.closest('.km-view');
            assert.hasLength(viewElement, assert.format(assert.messages.hasLength.default, 'viewElement'));
            var viewWidget = viewElement.data('kendoMobileView');
            assert.instanceof(kendo.mobile.ui.View, viewWidget, assert.format(assert.messages.instanceof.default, 'viewWidget', 'kendo.mobile.ui.View'));
            viewModel.nextUser();
            mobile._setNavBar(viewWidget);
        };

        /**
         * Event handler triggered when clicking the first page button in the navbar
         */
        mobile.onNavBarFirstPageClick = function () {
            viewModel.firstPage();
        };

        /**
         * Event handler triggered when clicking the previous page button in the navbar
         */
        mobile.onNavBarPreviousPageClick = function () {
            viewModel.previousPage();
        };

        /**
         * Event handler triggered when clicking the next page button in the navbar
         */
        mobile.onNavBarNextPageClick = function () {
            viewModel.nextPage();
        };

        /**
         * Event handler triggered when clicking the last page button in the navbar
         */
        mobile.onNavBarLastPageClick = function () {
            viewModel.lastPage();
        };

        /**
         * Event handler triggered when clicking the score button in the navbar
         * @param e
         */
        mobile.onNavBarScoreClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            var language = viewModel.get(VIEW_MODEL.CURRENT.VERSION.LANGUAGE);
            assert.match(RX_LANGUAGE, language, assert.format(assert.messages.match.default, 'language', RX_LANGUAGE));
            var summaryId = viewModel.get(VIEW_MODEL.CURRENT.VERSION.SUMMARY_ID);
            assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
            var versionId = viewModel.get(VIEW_MODEL.CURRENT.VERSION.VERSION_ID);
            assert.match(RX_MONGODB_ID, versionId, assert.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));
            var activityId = viewModel.get(VIEW_MODEL.CURRENT.ID);
            assert.match(RX_MONGODB_ID, activityId, assert.format(assert.messages.match.default, 'activityId', RX_MONGODB_ID));
            mobile.application.navigate(HASH + VIEW.SCORE +
                '?language=' + encodeURIComponent(language) +
                '&summaryId=' + encodeURIComponent(summaryId) +
                '&versionId=' + encodeURIComponent(versionId) +
                '&activityId=' + encodeURIComponent(activityId) // This is not a sid
            );
        };

        /**
         * Event handler triggered when clicking the submit button in the navbar
         * @param e
         */
        mobile.onNavBarSubmitClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            mobile.dialogs.confirm(
                i18n.culture.notifications.confirmSubmit,
                function (buttonIndex) {
                    if (buttonIndex === 1) {
                        viewModel.calculate()
                            .done(function () { // Note: failure is already taken care of
                                viewModel.saveCurrent()
                                    .done(function () {
                                        mobile.onNavBarScoreClick(e);
                                        if (mobile.support.ga) {
                                            mobile.ga.trackEvent(
                                                ANALYTICS.CATEGORY.ACTIVITY,
                                                ANALYTICS.ACTION.SCORE,
                                                viewModel.get(VIEW_MODEL.CURRENT.VERSION.SUMMARY_ID),
                                                parseInt(viewModel.get(VIEW_MODEL.CURRENT.SCORE), 10)
                                            );
                                        }
                                    });
                            });
                    }
                }
            );
        };

        /**
         * Event handler triggered when clicking the summary button in the navbar
         * @param e
         */
        mobile.onNavBarSummaryClick = function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
            var language = i18n.locale();
            assert.equal(language, viewModel.get(VIEW_MODEL.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("language")', language));
            assert.equal(language, viewModel.get(VIEW_MODEL.SUMMARY.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("summary.language")', language));
            assert.equal(language, viewModel.get(VIEW_MODEL.VERSION.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("version.language")', language));
            var summaryId = viewModel.get(VIEW_MODEL.SUMMARY.ID);
            assert.equal(summaryId, viewModel.get(VIEW_MODEL.VERSION.SUMMARY_ID), assert.format(assert.messages.equal.default, 'viewModel.get("version.summaryId")', summaryId));
            mobile.application.navigate(HASH + VIEW.SUMMARY +
                '?language=' + encodeURIComponent(language) +
                '&summaryId=' + encodeURIComponent(summaryId)
            );
        };

        /**
         * Event handler triggered when clicking the sync button in the navbar
         * @param e
         */
        mobile.onNavBarSyncClick = function (e) {
            // mobile.application.navigate(HASH + VIEW.SYNC);
            mobile.application.navigate(HASH + VIEW.SIGNIN + '?page=' + encodeURIComponent(SIGNIN_PAGE) + '&userId=' + encodeURIComponent(viewModel.get(VIEW_MODEL.USER.ID)));
        };

        /**
         * Event handler triggered when clicking the search button in the navbar
         */
        mobile.onNavBarSearchClick = function () {
            var language = i18n.locale(); // viewModel.get(VIEW_MODEL.LANGUAGE);
            mobile.application.navigate(HASH + VIEW.FINDER + '?language=' + encodeURIComponent(language));
            // @see http://www.telerik.com/forums/hiding-filter-input-in-mobile-listview
            // var summaryView = $(HASH + VIEW.FINDER);
            // summaryView.find(kendo.roleSelector('listview')).getKendoMobileListView()._filter._clearFilter({ preventDefault: $.noop });
            // summaryView.find('.km-filter-form').show();
        };

        /**
         * Event handler for swiping over #player instructions and #correction explanations
         * @param e
         */
        mobile.onPageSwipe =  function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            $(document.activeElement).blur(); // Make sure we update the viewModel with current input
            if (e.direction === 'left') {
                viewModel.nextPage();
            } else if (e.direction === 'right') {
                viewModel.previousPage();
            }
        };

        /**
         * Event handler for swiping over #user
         * @param e
         */
        mobile.onUserSwipe =  function (e) {
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            $(document.activeElement).blur(); // Make sure we update the viewModel with current input
            if (e.direction === 'left') {
                viewModel.nextUser();
            } else if (e.direction === 'right') {
                viewModel.previousUser();
            }
        };

        /**
         * Play text-to-speach synthesis
         * @see https://github.com/vilic/cordova-plugin-tts
         * @param e
         */
        mobile.onTTSClick = function (e) {
            var SPEAKING = 'speaking';
            assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

            // IMPORTANT: prevent bubbling considering parent element might have triggered the click
            e.preventDefault();

            // Record the speaking state on the button
            var speaking = e.button.attr(kendo.attr(SPEAKING));
            if (!speaking) {
                e.button.attr(kendo.attr(SPEAKING), 'true');
                var field = e.button.attr(kendo.attr('tts'));
                var text = viewModel.get(field) || '';
                // Speak
                app.tts.doSpeak(text, i18n.locale(), true)
                    .always(function () {
                        e.button.removeAttr(kendo.attr(SPEAKING));
                    });
            } else {
                // Cancel
                app.tts.cancelSpeak()
                    .always(function () {
                        e.button.removeAttr(kendo.attr(SPEAKING));
                    });
            }
        };

        /**
         * Schedule system notifications
         * Uses https://github.com/katzer/cordova-plugin-local-notifications
         * @private
         */
        mobile._scheduleSystemNotifications = function () {
            var local = window.cordova && window.cordova.plugins && window.cordova.plugins.notification && window.cordova.plugins.notification.local;
            if (local && $.isFunction(local.cancelAll) && $.isFunction(local.schedule)) {
                // var firstAt = new Date();
                // firstAt.setHours(firstAt.getHours() + 1);
                // firstAt.setDate(firstAt.getDate() + 7);
                // Cancel all notifications before creating new ones
                local.cancelAll(function () {
                    // Setup a reminder to use the application every week
                    local.schedule({
                        title: i18n.culture.osNotifications.title,
                        text: kendo.format(i18n.culture.osNotifications.text, app.constants.appName),
                        // Icon paths explained at https://github.com/katzer/cordova-plugin-local-notifications/issues/1266#issuecomment-293508925
                        // See also https://github.com/katzer/cordova-plugin-local-notifications/wiki/10.-URIs
                        icon: 'file://img/notifications/icon.png',
                        // smallIcon: - @see https://documentation.onesignal.com/v3.0/docs/customize-notification-icons#section-small-icon
                        // Triggers explained at https://github.com/katzer/cordova-plugin-local-notifications/issues/1412
                        // With version 0.8.5 - https://github.com/katzer/cordova-plugin-local-notifications/blob/64a6e557fd10dcd66a13b22b6aa0ed50163bcd91/README.md
                        // every: 'week',
                        // firstAt: firstAt
                        // With version 0.9 - https://github.com/katzer/cordova-plugin-local-notifications
                        // trigger: { every: { weekday: 1, hour: 16, minute: 0 } },
                        // trigger: { every: 'hour', count: 1 },
                        trigger: { every: 'week' },
                        foreground: true
                    });
                });
            }
        };

        /**
         * Request App Store rating
         * Note: https://github.com/pushandplay/cordova-plugin-apprate is a confirm dialog opening an InAppBrowser, so we can do that without a plugin
         * There is also another plugin at https://github.com/xmartlabs/cordova-plugin-market
         * There are several reasons for doing it this way:
         * - URLs change from time to time and plugins lag behind (
         * - Plugins do not surpport FireOS
         *
         * @see https://github.com/pushandplay/cordova-plugin-apprate/blob/master/www/AppRate.js
         * @see https://joshuawinn.com/adding-rate-button-to-cordova-based-mobile-app-android-ios-etc/
         * @private
         */
        mobile._requestAppStoreReview = function () {

            var platform = window.device && window.device.platform && window.device.platform.toLowerCase();
            var appStoreUrl = app.constants.appStoreUrl[platform];

            if (app.DEBUG && platform === 'browser') {
                // Note: browser platform has no appStoreUrl unless we give one here for testing
                appStoreUrl = 'http://www.kidoju.com';
            }

            if (appStoreUrl) {

                var dfd = $.Deferred();
                var reviewState = viewModel.get(VIEW_MODEL.USER.REVIEW_STATE);
                reviewState = reviewState || { counter: 0 };

                /*
                window.alert(
                    'platform: ' + platform + '\n' +
                    'inAppBrowser: ' + mobile.support.inAppBrowser + '\n' +
                    'version: ' + reviewState.version + '\n' +
                    'counter: ' + reviewState.counter
                );
                */

                // Never rate the same version twice + only ask every 5 times (this is called after signing in with a PIN, before redirecting to the categories tree)
                if ((reviewState.version !== app.version) && ((reviewState.counter + 1) % 5 === 0)) {

                    var culture = i18n.culture.appStoreReview;

                    logger.debug({
                        message: 'Requesting an app store review',
                        method: 'mobile._requestAppStoreReview',
                        data: { platform: platform }
                    });

                    mobile.dialogs.confirm(
                        kendo.format(culture.message, app.constants.appName),
                        function (buttonIndex) {
                            if (buttonIndex === 1) { // OK
                                logger.debug({
                                    message: 'Opening the app store for review',
                                    method: 'mobile._requestAppStoreReview',
                                    data: { platform: platform }
                                });
                                // We are simply opening a custom url scheme and we do not need SafariViewController for that
                                // Note that this does not work in the Android Emulator because the play store app is missing
                                if (mobile.support.inAppBrowser) {
                                    mobile.InAppBrowser.open(appStoreUrl, '_system');
                                } else {
                                    window.open(appStoreUrl, '_system');
                                }
                                if (mobile.support.ga) {
                                    mobile.ga.trackEvent(
                                        ANALYTICS.CATEGORY.GENERAL,
                                        ANALYTICS.ACTION.APP_REVIEW,
                                        platform
                                    );
                                }
                                // In truth we do not really know whether the app has been reviewed or not, we just know that the browser has been opened to the app store
                                reviewState.version = app.version;
                                reviewState.counter = 0;
                            } else { // Cancel
                                reviewState.counter++;
                            }
                            dfd.resolve(reviewState);
                        },
                        kendo.format(culture.title, app.constants.appName),
                        [culture.buttons.ok.text, culture.buttons.cancel.text]
                    );

                } else {
                    reviewState.counter++;
                    dfd.resolve(reviewState);
                }

                dfd.promise().done(function (reviewState) {
                    // Update reviewState and save without notification
                    // viewModel.set(VIEW_MODEL.USER.REVIEW_STATE, reviewState); // This won't set the dirty field to sync
                    viewModel.get(VIEW_MODEL.USER.$).set('reviewSteate', reviewState);
                    viewModel.users.sync(false); // false hides notifications
                });
            }

        };

        /*******************************************************************************************
         * Application initialization
         *******************************************************************************************/

        if ($.type(window.cordova) === UNDEFINED) {
            // No need to wait
            mobile.onDeviceReady();
        } else {
            // Wait for Cordova to load
            document.addEventListener('deviceready', mobile.onDeviceReady, false);
        }

    }(window.jQuery));

    /* jshint +W071 */

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

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
    // require('./app.support.js');
}

(function (f, define) {
    'use strict';
    define([
        './vendor/kendo/kendo.core',
        './vendor/kendo/kendo.data',
        './vendor/kendo/kendo.binder',
        './vendor/kendo/kendo.color',
        './vendor/kendo/kendo.popup',
        './vendor/kendo/kendo.drawing',
        './vendor/kendo/kendo.list',
        './vendor/kendo/kendo.dropdownlist',
        './vendor/kendo/kendo.maskedtextbox',
        './vendor/kendo/kendo.notification',
        './vendor/kendo/kendo.fx',
        './vendor/kendo/kendo.userevents',
        './vendor/kendo/kendo.draganddrop',
        './vendor/kendo/kendo.mobile.scroller',
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
        './vendor/kendo/kendo.mobile.scrollview',
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
        var assert = window.assert;
        var localStorage = window.localStorage;
        var logger = new window.Logger('app.mobile');
        var models = app.models;
        var i18n = app.i18n;
        var rapi = app.rapi;
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
            DRAWER: '-drawer',
            FAVOURITES: '-favourites',
            FINDER: '-finder',
            PLAYER: '-player',
            PROGRESS: '-progress',
            SCORE: '-score',
            SETTINGS: '-settings',
            SUMMARY: '-summary',
            SIGNIN: '-signin',
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
        var VIEWMODEL = {
            CURRENT: 'current',
            CURRENT_ID: 'current.id',
            LANGUAGES: 'languages',
            PAGES_COLLECTION: 'version.stream.pages',
            SELECTED_PAGE: 'selectedPage',
            SETTINGS: {
                LANGUAGE: 'settings.language',
                THEME: 'settings.theme'
            },
            SUMMARY: 'summary',
            THEMES: 'themes',
            USER: 'user',
            VERSION: 'version'
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
                inAppBrowser: window.cordova && window.cordova.InAppBrowser && $.isFunction(window.cordova.InAppBrowser.open),
                socialsharing: window && window.plugins && window.plugins.socialsharing && $.isFunction(window.plugins.socialsharing.shareWithOptions),
                splashscreen: window.navigator && window.navigator.splashscreen && $.isFunction(window.navigator.splashscreen.hide)
            };
            // barcodeScanner requires phonegap-plugin-barcodescanner
            if (mobile.support.barcodeScanner) {
                mobile.barcodeScanner = window.cordova.plugins.barcodeScanner;
            }
            // device requires cordova-plugin-device
            if (mobile.support.cordova) {
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
            hasMobileUser$: function () {
                var user = viewModel.get('user');
                return user instanceof models.MobileUser && !user.isNew() &&
                    viewModel.users.total() > 0 && user === viewModel.users.at(0);
            },

            /**
             * Social Sharing feature detection (remove actionsheet menu option)
             * @returns {protocol|*|SocialSharing}
             */
            hasSocialSharing$: function () {
                return mobile.support.socialsharing;
            },

            /**
             * Resets all data when switching users
             */
            reset: function () {
                // this.activities.data([]);
                // this.categories.data([]);
                this.categories.read();
                // this.favourites.data([]);
                this.summaries.data([]);
                this.versions.data([]);
                this.set(VIEWMODEL.VERSION, new models.Version());
                this.set(VIEWMODEL.SELECTED_PAGE, undefined);
                this.set(VIEWMODEL.CURRENT, { test: undefined });
            },

            /**
             * Load settings from local storage
             */
            loadSettings: function () {
                // Language
                var language = localStorage.getItem(STORAGE.LANGUAGE);
                this.set(VIEWMODEL.SETTINGS.LANGUAGE, language || DEFAULT.LANGUAGE);
                // Theme - We need the same localStorage location as in Kidoju.Webapp to be able to use app.theme.js to load themes
                var theme = localStorage.getItem(STORAGE.THEME);
                this.set(VIEWMODEL.SETTINGS.THEME, theme || DEFAULT.THEME);
            },

            /**
             * Load lazy summaries
             * @param query
             */
            loadLazySummaries: function (query) {
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
             * Load user from remote server
             * @returns {*}
             */
            loadUser: function () {
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
                        // TODO: not sure app.notification is available yet
                        app.notification.error(i18n.culture.notifications.userLoadFailure);
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
             * @param summaryId
             * @param versionId
             * @returns {*}
             */
            loadVersion: function (summaryId, versionId) {

                function versionLoadFailure(xhr, status, error) {
                    dfd.reject(xhr, status, error);
                    app.notification.error(i18n.culture.notifications.versionLoadFailure);
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
                        app.notification.error(i18n.culture.notifications.versionsLoadFailure);
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
            getTheme: function () {
                var name = this.get(VIEWMODEL.SETTINGS.THEME);
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
                case VIEWMODEL.SETTINGS.LANGUAGE:
                    if ($.isPlainObject(i18n.culture) && mobile.application instanceof kendo.mobile.Application) {
                        mobile.localize(e.sender.get(VIEWMODEL.SETTINGS.LANGUAGE));
                        viewModel.reset();
                    }
                    break;
                case VIEWMODEL.SETTINGS.THEME:
                    app.theme.name(e.sender.get(VIEWMODEL.SETTINGS.THEME));
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
                case DEVICE_SELECTOR + VIEW.FINDER:
                    showDrawerButton = true;
                    showHomeButton = true;
                    // showSearchButton = true;
                    // showSortButtons = true;
                    break;
                case DEVICE_SELECTOR + VIEW.PLAYER:
                    showDrawerButton = true;
                    showPreviousButton = !viewModel.isFirstPage$();
                    showNextButton = !viewModel.isSubmitPage$();
                    showLastButton = !viewModel.isSubmitPage$();
                    showSubmitButton = viewModel.isSubmitPage$();
                    break;
                case DEVICE_SELECTOR + VIEW.PROGRESS:
                    break;
                case DEVICE_SELECTOR + VIEW.SCORE:
                    showDrawerButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.SETTINGS:
                    showDrawerButton = true;
                    showSyncButton = true;
                    break;
                case DEVICE_SELECTOR + VIEW.SIGNIN:
                    break;
                case DEVICE_SELECTOR + VIEW.SUMMARY:
                    break;
                case DEVICE_SELECTOR + VIEW.USER:
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
         * Init the notification widget
         * @private
         */
        mobile._initNotification = function () {
            var notification = $("#notification");
            assert.hasLength(notification, kendo.format(assert.messages.hasLength.default, '#notification'));
            if (app && app.notification instanceof kendo.ui.Notification) {
                // Do not leave pending notifications
                var notifications = app.notification.getNotifications();
                notifications.each(function(){
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
                viewModel.set(VIEWMODEL.LANGUAGES, i18n.culture.viewModel.languages);
                viewModel.set(VIEWMODEL.THEMES, i18n.culture.viewModel.themes);
                mobile._localizeActivitiesView(language);
                mobile._localizeCategoriesView(language);
                mobile._localizeDrawerView(language);
                mobile._localizeFavouritesView(language);
                mobile._localizeFinderView(language);
                mobile._localizePlayerView(language);
                mobile._localizeProgressView(language);
                mobile._localizeScoreView(language);
                mobile._localizeSettingsView(language);
                mobile._localizeSigninView(language);
                mobile._localizeSummaryView(language);
                mobile._localizeUserView(language);
            });
        };

        /**
         * Localize the activities view
         * @param language
         * @private
         */
        mobile._localizeActivitiesView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var culture = i18n.culture.activities;
            var viewElement = $(DEVICE_SELECTOR + VIEW.ACTIVITIES);
            // Note: the view might not have been initialized yet
            var viewWidget = viewElement.data('kendoMobileView');
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
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
            var culture = i18n.culture.categories;
            var viewElement = $(DEVICE_SELECTOR + VIEW.CATEGORIES);
            // Note: the view might not have been initialized yet
            var viewWidget = viewElement.data('kendoMobileView');
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
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
         * @param language
         * @private
         */
        mobile._localizeFavouritesView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var culture = i18n.culture.favourites;
            var viewElement = $(DEVICE_SELECTOR + VIEW.FAVOURITES);
            // The view may not have been intialized yet
            var viewWidget = viewElement.data('kendoMobileView');
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
        };

        /**
         * Localize the summaries view
         * @param language
         * @private
         */
        mobile._localizeFinderView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var culture = i18n.culture.finder;
            var viewElement = $(DEVICE_SELECTOR + VIEW.FINDER);
            // The view may not have been intialized yet
            var viewWidget = viewElement.data('kendoMobileView');
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
         * @param language
         * @private
         */
        mobile._localizePlayerView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var culture = i18n.culture.player;
            var viewElement = $(DEVICE_SELECTOR + VIEW.PLAYER);
            // mobile._setNavBarTitle is called when selectedPage is changed in the viewModel
            // var viewWidget = viewElement.data('kendoMobileView');
            // if (viewWidget instanceof kendo.mobile.ui.View) {
            //     mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            // }
            viewElement.find('span.instructions').html(culture.instructions);
            viewElement.find('span.explanations').html(culture.explanations);
        };

        /**
         * Localize the progress view
         * @param language
         * @private
         */
        mobile._localizeProgressView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var culture = i18n.culture.progress;
            var viewElement = $(DEVICE_SELECTOR + VIEW.PROGRESS);
            // The view may not have been intialized yet
            var viewWidget = viewElement.data('kendoMobileView');
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
        };

        /**
         * Localize the score view
         * @param language
         * @private
         */
        mobile._localizeScoreView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var culture = i18n.culture.score;
            var viewElement = $(DEVICE_SELECTOR + VIEW.SCORE);
            // The view may not have been intialized yet
            var viewWidget = viewElement.data('kendoMobileView');
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
        };

        /**
         * Localize the settings view
         * @param language
         * @private
         */
        mobile._localizeSettingsView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var culture = i18n.culture.settings;
            var viewElement = $(DEVICE_SELECTOR + VIEW.SETTINGS);
            // The view may not have been intialized yet
            var viewWidget = viewElement.data('kendoMobileView');
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
            // Localize field labels
            viewElement.find('ul>li>label>span:not(.k-widget):eq(0)').text(culture.user);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(1)').text(culture.version);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(2)').text(culture.language);
            viewElement.find('ul>li>label>span:not(.k-widget):eq(3)').text(culture.theme);
        };

        /**
         * Localize the sign-in view
         * @param language
         * @private
         */
        mobile._localizeSigninView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var culture = i18n.culture.signin;
            var viewElement = $(DEVICE_SELECTOR + VIEW.SIGNIN);
            // The view may not have been intialized yet
            var viewWidget = viewElement.data('kendoMobileView');
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
            // TODO localize the group title
        };

        /**
         * Localize the summary view
         * @param language
         * @private
         */
        mobile._localizeSummaryView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var culture = i18n.culture.summary;
            var viewElement = $(DEVICE_SELECTOR + VIEW.SUMMARY);
            // The view may not have been initialized yet
            var viewWidget = viewElement.data('kendoMobileView');
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
        };

        /**
         * Localize the user view
         * @param language
         * @private
         */
        mobile._localizeUserView = function (language) {
            assert.type(ARRAY, app.locales, kendo.format(assert.messages.type.default, 'app.locales', ARRAY));
            assert.enum(app.locales, language, kendo.format(assert.messages.enum.default, 'language', app.locales));
            var culture = i18n.culture.user;
            var viewElement = $(DEVICE_SELECTOR + VIEW.USER);
            // The view may not have been initialized yet
            var viewWidget = viewElement.data('kendoMobileView');
            if (viewWidget instanceof kendo.mobile.ui.View) {
                mobile._setNavBarTitle(viewWidget, culture.viewTitle);
            }
        };

        /*******************************************************************************************
         * Resizing
         *******************************************************************************************/

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

        /**
         * Event handler for resizing the UI (especially when changing device orientation)
         * @private
         */
        mobile.onResize = function () {
            mobile._initNotification();
            mobile._resizePlayer();
            // Anything else to resize?
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
                        viewModel.set('user', viewModel.users.at(0));
                    }
                    // Initialize application
                    mobile.application = new kendo.mobile.Application($(DEVICE_SELECTOR), {
                        initial: DEVICE_SELECTOR + (viewModel.hasMobileUser$() ? VIEW.USER : VIEW.SIGNIN),
                        skin: theme.skin,
                        // http://docs.telerik.com/kendo-ui/controls/hybrid/application#hide-status-bar-in-ios-and-cordova
                        // http://docs.telerik.com/platform/appbuilder/troubleshooting/archive/ios7-status-bar
                        // http://www.telerik.com/blogs/everything-hybrid-web-apps-need-to-know-about-the-status-bar-in-ios7
                        // http://devgirl.org/2014/07/31/phonegap-developers-guid/
                        // statusBarStyle: mobile.support.cordova ? 'black-translucent' : undefined,
                        statusBarStyle: 'hidden',
                        init: function (e) {
                            // Localise the application
                            mobile.localize(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
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
         * Event handler trigger when clicking an item in teh drawe menu
         * @see https://github.com/phonegap/phonegap-plugin-barcodescanner
         * @param e
         */
        mobile.onDrawerListViewClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.item, kendo.format(assert.messages.instanceof.default, 'e.item', 'jQuery'));
            if (e.item.is('li[data-icon=scan]') && mobile.support.barcodeScanner) {
                var QR_CODE = 'QR_CODE';
                var RX_QR_CODE_MATCH = /^https?:\/\/[^\/]+\/([a-z]{2})\/s\/([a-f0-9]{24})$/i;
                e.preventDefault();
                mobile.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            assert.type(STRING, result.text, kendo.format(assert.messages.type.default, 'result.text', STRING));
                            assert.equal(QR_CODE, result.format, kendo.format(assert.messages.equal.default, 'result.format', QR_CODE));
                            var matches = result.text.match(RX_QR_CODE_MATCH);
                            if ($.isArray(matches) && matches.length > 2) {
                                var language = matches[1];
                                var summaryId = matches[2];
                                if (viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE) === language) {
                                    // Find latest version (previous versions are not available in the mobile app)
                                    viewModel.loadLazyVersions(summaryId)
                                        .done(function () {
                                            var version = viewModel.versions.at(0); // First is latest version
                                            assert.instanceof(models.LazyVersion, version, kendo.format(assert.messages.instanceof.default, 'version', 'models.LazyVersion'));
                                            assert.match(RX_MONGODB_ID, version.id, kendo.format(assert.messages.match.default, 'version.id', RX_MONGODB_ID));
                                            mobile.application.navigate(DEVICE_SELECTOR + VIEW.PLAYER + '?summaryId=' + window.encodeURIComponent(summaryId) + '&versionId=' + window.encodeURIComponent(version.id));
                                        });
                                } else {
                                    mobile.notification.alert('Change language settings to scan this code');
                                }
                            } else {
                                mobile.notification.alert('This QR code does not match');
                            }
                        }
                    },
                    function (error) {
                        mobile.notification.alert('Scanning failed: ' + error);
                    },
                    {
                        preferFrontCamera: false, // iOS and Android
                        showFlipCameraButton: false, // iOS and Android
                        prompt: 'Place a barcode inside the scan area', // supported on Android only
                        formats: QR_CODE // default: all but PDF_417 and RSS_EXPANDED
                        // "orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
                    }
                );
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
            mobile._localizeActivitiesView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
            // Set the navigation bar buttons
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
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeCategoriesView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
            // Set the navigation bar buttons
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
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeFavouritesView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered before showing the Summaries view
         */
        mobile.onFinderBeforeViewShow = function () {
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
        mobile.onFinderViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeFinderView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
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
            //    mobile.application.pane.loader.hide();
            // });
        };

        /**
         * Event handler for clicking the play option in the action sheet displayed from the GO button of summaries
         * @param e
         */
        mobile.onFinderActionPlay = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.match(RX_MONGODB_ID, e.context, kendo.format(assert.messages.match.default, 'e.context', RX_MONGODB_ID));
            var summaryId = e.context;
            // Find latest version (previous versions are not available in the mobile app)
            viewModel.loadLazyVersions(summaryId)
                .done(function () {
                    var version = viewModel.versions.at(0); // First is latest version
                    assert.instanceof(models.LazyVersion, version, kendo.format(assert.messages.instanceof.default, 'version', 'models.LazyVersion'));
                    assert.match(RX_MONGODB_ID, version.id, kendo.format(assert.messages.match.default, 'version.id', RX_MONGODB_ID));
                    mobile.application.navigate(DEVICE_SELECTOR + VIEW.PLAYER + '?summaryId=' + window.encodeURIComponent(summaryId) + '&versionId=' + window.encodeURIComponent(version.id));
                });
        };

        /**
         * Event handler for clicking the share option in the action sheet displayed from the GO button of summaries
         * @see https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
         * @param e
         */
        mobile.onFinderActionShare = function (e) {
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
            assert.match(RX_MONGODB_ID, e.view.params.summaryId, kendo.format(assert.messages.match.default, 'e.view.params.summaryId', RX_MONGODB_ID));
            assert.match(RX_MONGODB_ID, e.view.params.versionId, kendo.format(assert.messages.match.default, 'e.view.params.versionId', RX_MONGODB_ID));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizePlayerView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
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
         * Event handler triggered when showing the progress view when syncing
         * @param e
         */
        mobile.onProgressViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeProgressView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // TODO
        };

        /**
         * Event handler triggered when showing the score view after submitting a score
         * @param e
         */
        mobile.onScoreViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeScoreView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // TODO
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
            mobile._localizeSettingsView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
        };

        /**
         * Event handler triggered when showing the signin view
         * @param e
         */
        mobile.onSigninViewShow = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Localize UI (cannot be done in init because language may have changed during the session)
            mobile._localizeSigninView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
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
            var returnUrl = mobile.device && mobile.device.platform !== 'browser' && mobile.support.inAppBrowser ?
                app.uris.rapi.blank : window.location.protocol + '//' + window.location.host + '/' + DEVICE_SELECTOR + VIEW.USER;
            // When running in a browser via phonegap serve, the InAppBrowser turns into an iframe but authentication providers prevent running in an iframe by setting 'X-Frame-Options' to 'SAMEORIGIN'
            // So if the device platform is a browser, we need to keep the sameflow as Kidoju-WebApp with a redirectUrl that targets the user view
            rapi.oauth.getSignInUrl(provider, returnUrl)
                .done(function (signInUrl) {
                    logger.debug({
                        message: 'getSignInUrl',
                        method: 'mobile.onSigninButtonClick',
                        data: { provider: provider, returnUrl: returnUrl, signInUrl: signInUrl }
                    });
                    if (mobile.device && mobile.device.platform !== 'browser' && mobile.support.inAppBrowser) {
                        // running in Phonegap -> open InAppBrowser
                        var close = function () {
                            browser.removeEventListener('loadstart', loadStart);
                            browser.removeEventListener('loaderror', loadError);
                            browser.close();
                            browser = undefined;
                        };
                        var loadStart = function (e) {
                            logger.debug({
                                message: 'loadstart event of InAppBrowser',
                                method: 'mobile.onSigninButtonClick',
                                data: { url: e.url }
                            });
                            var token = rapi.util.parseToken(e.url);
                            // rapi.util.cleanHistory(); // Not needed because we close InAppBrowser
                            if ($.isPlainObject(token) && !$.isEmptyObject(token)) {
                                // window.alert(provider + ': success');
                                // We have a token, we are done
                                close();
                                mobile.application.navigate(DEVICE_SELECTOR + VIEW.USER);

                            }
                            // otherwise continue with the oAuth flow,
                            // as the loadstart event is triggered each time a new url (redirection) is loaded
                        };
                        var loadError = function (error) {
                            window.alert(JSON.stringify($.extend({}, error))); // TODO
                            logger.error({
                                message: 'loaderror event of InAppBrowser',
                                method: 'mobile.onSigninButtonClick',
                                error: error,
                                data: {url: error.url}
                            });
                            close();
                        };
                        var browser = mobile.InAppBrowser.open(signInUrl, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        // browser.addEventListener('exit', exit);
                        browser.addEventListener('loadstart', loadStart);
                        // browser.addEventListener('loadstop', loadStop);
                        browser.addEventListener('loaderror', loadError);
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
                        data:  {provider: provider, status: status, error: error, response: xhr.responseText } // TODO xhr.responseText
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
            mobile._localizeSummaryView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // Load the current user
            viewModel.user
        };

        /**
         * Event handler triggered when initializing the user view
         * @param e
         */
        mobile.onUserViewInit = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof(kendo.mobile.ui.View, e.view, kendo.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
            // Init masked textboxes if not already initialized
            e.view.element.find(kendo.roleSelector('maskedtextbox'))
                .on('focus', function () {
                    $(this).data('kendoMaskedTextBox').value('');
                })
                .each(function () {
                    // We cannot define data-mask in html with data binding
                    $(this).kendoMaskedTextBox({
                        mask: '0000' // 4 digits
                    });
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
            mobile._localizeUserView(viewModel.get(VIEWMODEL.SETTINGS.LANGUAGE));
            // Set the navigation bar buttons
            mobile._setNavBar(e.view);
            // Parse the oAuth token if necessary
            if (!mobile.device || mobile.device.platform === 'browser' || !mobile.support.inAppBrowser) {
                rapi.util.parseToken(window.location.href);
                rapi.util.cleanHistory();
            }
            // Load the remote mobile user (me) using the oAuth token
            if (!viewModel.hasMobileUser$()) {
                viewModel.user.load()
                    .done(function () {
                        app.notification.info('Please enter and confirm your 4-digit pin before saving.'); // TODO
                        e.view.element.find(kendo.roleSelector('maskedtextbox')).first().focus();
                    });
                // } else {
                // The mobile user is already loaded
            } else {
                e.view.element.find(kendo.roleSelector('maskedtextbox')).first().focus();
            }
        };

        /**
         * Evenet handler for clicking the save button of the user view
         * @param e
         */
        mobile.onUserSaveClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, kendo.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

            // Do we have matching pins?
            var view = e.button.closest(kendo.roleSelector('view'));
            var pinElements = view.find(kendo.roleSelector('maskedtextbox'));
            assert.equal(2, pinElements.length, kendo.format(assert.messages.equal.default, 'pinElements.length', '2'));
            var pinWidget = pinElements.first().data('kendoMaskedTextBox');
            assert.instanceof(kendo.ui.MaskedTextBox, pinWidget, kendo.format(assert.messages.instanceof.default, 'pinWidget', 'kendo.ui.MaskedTextBox'));
            var confirmWidget = pinElements.last().data('kendoMaskedTextBox');
            assert.instanceof(kendo.ui.MaskedTextBox, confirmWidget, kendo.format(assert.messages.instanceof.default, 'confirmWidget', 'kendo.ui.MaskedTextBox'));

            if (RX_PIN.test(pinWidget.value()) && confirmWidget.value() === pinWidget.value()) {

                // Does the user already exist in database?
                var sid = viewModel.get('user.sid');
                var found = viewModel.users.data().find(function (user) {
                    return user.get('sid') === sid;
                });
                if (!(found instanceof models.MobileUser)) {
                    // Add user
                    found = viewModel.get('user');
                    viewModel.users.add(found);
                }
                // Set properties
                found.addPin(pinWidget.value()); // Note a good test to trigger an error is to comment this line
                found.set('lastUse', new Date());
                // Synchronize
                viewModel.users.sync()
                    .done(function () {
                        viewModel.set('user', found);
                        mobile.application.navigate(DEVICE_SELECTOR + VIEW.CATEGORIES);
                    })
                    .fail(function (xhr, status, error) {
                        // Note: xhr can be an error
                        app.notification.error('There was an error creating or updating users.'); // TODO
                        debugger;
                    });

            } else {
                app.notification.warning('Please enter and confirm a 4 digit pin.')
            }
        };

        /**
         * Event handler for clicking the signin button of the user view
         * @param e
         */
        mobile.onUserSignInClick = function (e) {
            assert.isPlainObject(e, kendo.format(assert.messages.isPlainObject.default, 'e'));
            assert.instanceof($, e.button, kendo.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

            // Check the correct pin
            var view = e.button.closest(kendo.roleSelector('view'));
            var pinElement = view.find(kendo.roleSelector('maskedtextbox') + ':visible');
            assert.equal(1, pinElement.length, kendo.format(assert.messages.equal.default, 'pinElement.length', '1'));
            var pinWidget = pinElement.data('kendoMaskedTextBox');
            assert.instanceof(kendo.ui.MaskedTextBox, pinWidget, kendo.format(assert.messages.instanceof.default, 'pinWidget', 'kendo.ui.MaskedTextBox'));

            if (viewModel.user.verifyPin(pinWidget.value())) {
                mobile.application.navigate(DEVICE_SELECTOR + VIEW.CATEGORIES);
            } else {
                app.notification.warning('Wrong pin.'); // TODO
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
            mobile.notification.confirm(
                'You are the winner!', // message
                mobile.onNavbarSubmitConfirm,       // callback to invoke with index of button pressed
                'Confirm',             // title
                ['Yes', 'No']           // buttonLabels
            );
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

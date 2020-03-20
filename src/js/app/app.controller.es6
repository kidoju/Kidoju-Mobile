/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.binder';
import 'kendo.userevents';
import 'kendo.mobile.application';
import 'kendo.mobile.pane';
import { compareVersions } from '../common/pongodb.util.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import dialogs from '../plugins/plugins.dialogs.es6'
import inAppBrowser from '../plugins/plugins.inappbrowser.es6';
import safariViewController from '../plugins/plugins.safariviewcontroller.es6';
import splashScreen from '../plugins/plugins.splashscreen.es6'
import BaseController from '../rapi/rapi.controller.es6';
import AjaxPing from '../rapi/rapi.ping.es6';
// import { getSignInUrl, signOut } from '../rapi/rapi.oauth.es6';
import { VIEW } from '../ui/ui.constants.es6';
import config from './app.config.jsx';
import db from './app.db.es6';
import __ from './app.i18n.es6';

const { UserEvents, mobile: { Application, ui: { Pane } } } = window.kendo;
const logger = new Logger('app.controller');

/**
 * AppController
 * The page controller contains any UI function and event handler
 * IMPORTANT: Controller methods can call viewModel methods but not the contrary
 * @class AppController
 * @extends Observable
 */
const AppController = BaseController.extend({
    /**
     * init
     * @constructor
     */
    init(options = {}) {
        const prototype = Object.getPrototypeOf(this);
        const { features, initializers, viewModel } = options;
        BaseController.fn.init.call(this);

        // Add viewModel
        this.viewModel = viewModel;

        // Add features
        this.resizers = [];
        if (Array.isArray(features)) {
            features.forEach(feature => {
                Object.keys(feature || {}).forEach(key => {
                    const method = feature[key];
                    if ($.isFunction(method)) {
                        if (key === 'resize') {
                            this.resizers.push(method);
                        } else {
                            prototype[key] = method;
                        }
                    }
                });
            });
        }

        // TODO Wait until document is ready
        //  Initialize UI
        this.initializers.push(...initializers);
        $.when(...this.initializers).then(() => {
            // Log initialization
            logger.debug({
                message: `app controller initialized in ${__.locale}`,
                method: 'init'
            });

            // Check application and database versions
            // TODO Should we make checkForUpgrade an initializer?
            this.checkForUpgrade()
                .then(() => {
                    // Load viewModel, then initialize kendo application
                    debugger;
                    this.viewModel.load().always(this.initApplication.bind(this));
                })
                .catch(err => {
                    debugger;
                    // app.notification.error(i18n.culture.notifications.dbMigrationFailure);
                    if (err instanceof Error) {
                        // setTimeout ensures we call the global error handler
                        // @see https://stackoverflow.com/questions/39376805/how-can-i-trigger-global-onerror-handler-via-native-promise-when-runtime-error-o
                        setTimeout(function () { throw err; }, 0);
                    }

                    // This is an old version of the application, so request an upgrade
                    /*
                    dialogs.error(
                        i18n.culture.notifications.appVersionFailure,
                        function() {
                            // TODO Consider opening the app store
                            if (
                                window.navigator.app &&
                                $.isFunction(window.navigator.app.exitApp)
                            ) {
                                window.navigator.app.exitApp();
                            }
                        }
                    );
                    */
                });
        });
    },

    /**
     * Function to handle open Url
     * @param url
     */
    handleOpenURL(url) {
        const { appScheme, helpUrl } = config.constants;
        const rxAppScheme = new RegExp(`^${appScheme}://([a-z]{2})/([esx])/([0-9a-f]{24})($|/|\\?|#)`);
        debugger;
        // if (url.startsWith(`${appScheme}://oauth`)) {
        if (url.indexOf(`${appScheme}://oauth`) === 0) {
            // The whole oAuth flow is documented at
            // https://medium.com/@jlchereau/stop-using-inappbrowser-for-your-cordova-phonegap-oauth-flow-a806b61a2dc5
            feature.parseTokenAndLoadUser(url);
        } else if (rxAppScheme.test(url)) {
            const matches = rxAppScheme.exec(url);
            // Note: we have already tested the url, so we know there is a match
            const language = matches[1];
            const summaryId = matches[3];
            if (language === __.locale) {
                app.controller.application.navigate(`${CONSTANTS.HASH}${VIEW.SUMMARY}?language=${encodeURIComponent(language)}&summaryId=${encodeURIComponent(summaryId)}`);
            } else {
                app.notification.warning(__('notifications.openUrlLanguage'));
            }
        } else if (new RegExp(`^${helpUrl}`).test(url) || /^(itms-apps|market|ms-windows-store):\/\//.test(url)) {
            // For whatever reason, calling help in mobile._openHelp triggers handleOpenUrl on iOS (but not on Android)
            // For whatever reason, calling review schemes in mobile._requestAppStoreReview triggers handleOpenUrl on iOS (but not on Android)
            $.noop();
        } else {
            logger.warn({
                message: 'App scheme called with unknown url',
                method: 'handleOpenURL',
                data: { url: url }
            });
            app.notification.warning(__('notifications.openUrlUnknown'));
        }
        // Trying to accelerate the hiding of the splash screen does not help
        // if (mobile.support.splashscreen) { mobile.splashscreen.hide(); }
    },

    /**
     * Sign in with SFSafariViewController
     * requires https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller
     * also requires https://github.com/EddyVerbruggen/Custom-URL-scheme
     *
     * Note: Parsing the token is done by parseTokenAndLoadUser in handleOpenURL (see custom url scheme)
     *
     * Now that Google has deprecated oAuth flows from web views, this is the preferred way to sign in
     * although this is only compatible with iOS 9 and above
     * See: https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html
     * There is also a huge benefit: social accounts are remembered and users do not have to re-enter their MFA codes each time they signin
     *
     * @param signInUrl
     * @private
     */
    signinWithSafariViewController(signInUrl) {
    logger.debug({
        message: 'opening signInUrl in SafariViewController',
        method: 'signinWithSafariViewController',
        data: { signInUrl }
    });
    safariViewController.show(
        {
            url: signInUrl
            // hidden: false,
            // animated: false, // default true, note that 'hide' will reuse this preference (the 'Done' button will always animate though)
            // transition: 'curl', // (this only works in iOS 9.1/9.2 and lower) unless animated is false you can choose from: curl, flip, fade, slide (default)
            // enterReaderModeIfAvailable: readerMode, // default false
            // tintColor: "#00ffff", // default is ios blue
            // barColor: "#0000ff", // on iOS 10+ you can change the background color as well
            // controlTintColor: "#ffffff" // on iOS 10+ you can override the default tintColor
        },
        // this success callback will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
        result => {
            // result has only one property, event which can take any value among 'opened', 'loaded' and 'closed'
            logger.debug({
                message: 'safari/chrome successfully opened',
                method: 'signinWithSafariViewController',
                data: { event: result.event }
            });
        },
        // error callback
        msg => {
            logger.error({
                message: 'safari/chrome failed to open',
                method: 'signinWithSafariViewController',
                error: new Error(msg)
            });
        }
    );
},

    /**
     * Sign in with InAppBrowser
     * Requires https://github.com/apache/cordova-plugin-inappbrowser
     *
     * Note: Parsing the token is done here by parseTokenAndLoadUser
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
    signinWithInAppBrowser(signInUrl, returnUrl) {
        let browser;
        let loadStart;
        let loadError;
        function close() {
            // Makes it idempotent in case it has already been called
            if (browser) {
                browser.removeEventListener('loadstart', loadStart);
                // browser.removeEventListener('loadstop', loadStop);
                browser.removeEventListener('loaderror', loadError);
                browser.close();
                browser = undefined;
                logger.debug({
                    message: 'closed InAppBrowser',
                    method: 'signinWithInAppBrowser'
                });
            }
        }
        loadStart = e => {
            // There is an incompatibility between InAppBrowser and WkWebView that prevents
            // the loadstart event to be triggered in an oAuth flow if cordova-plugin-wkwebview-engine is installed
            // See https://issues.apache.org/jira/browse/CB-10698
            // See https://issues.apache.org/jira/browse/CB-11136
            // Seems to have been fixed in https://github.com/apache/cordova-plugin-inappbrowser/pull/187
            // Has yet to be released - https://github.com/kidoju/Kidoju-Mobile/issues/34
            logger.debug({
                message: 'loadstart event of InAppBrowser',
                method: 'signinWithInAppBrowser',
                data: { url: e.url }
            });
            // Once https://github.com/apache/cordova-plugin-inappbrowser/pull/99 is fixed
            // we should be able to have the same flow as in SafariViewController
            // if (e.url.startsWith(returnUrl)) {
            if (e.url.indexOf(returnUrl) === 0) {
                feature.parseTokenAndLoadUser(e.url).always(close);
            }
        };
        loadError = error => {
            // We have an issue with the InAppBrowser which raises an error when opening custom url schemes, e.g. com.kidoju.mobile://oauth
            // See https://github.com/apache/cordova-plugin-inappbrowser/pull/99
            // window.alert(JSON.stringify($.extend({}, error)));
            logger.error({
                message: 'loaderror event of InAppBrowser',
                method: 'signinWithInAppBrowser',
                error,
                data: { url: error.url }
            });
            // Close may have already been called in loadStart
            close();
        };
        browser = inAppBrowser.open(
            signInUrl,
            '_blank',
            'location=yes,clearsessioncache=yes,clearcache=yes,usewkwebview=yes'
        );
        // browser.addEventListener('exit', exit);
        browser.addEventListener('loadstart', loadStart);
        // browser.addEventListener('loadstop', loadStop);
        browser.addEventListener('loaderror', loadError);
        logger.debug({
            message: 'opening signInUrl in InAppBrowser',
            method: 'signinWithInAppBrowser',
            data: { signInUrl }
        });
    },

    /**
     * Sign in within the same browser as the application
     * @param signInUrl
     * @private
     */
    signinWithinBrowser(signInUrl) {
        logger.debug({
            message: 'opening signInUrl in browser',
            method: 'signinWithinBrowser',
            data: { signInUrl }
        });
        // Simply assign url and let the authentication provider redirect to the registered callback
        window.location.assign(signInUrl);
    },

    /**
     * Check for required upgrade
     */
    checkForUpgrade() {
        // Log initialization
        logger.debug({
            message: 'Checking for upgrade',
            method: 'checkForUpgrade'
        });
        const dfd = $.Deferred();
        const ping = new AjaxPing();
        ping
            .get()
            .then(result => {
                if (
                    result.compatible &&
                    compareVersions(config.version, result.compatible) < 0
                ) {
                    // This is an old version of the application, so request an upgrade
                    dfd.reject(new Error('Oops, incompatible app, please upgrade for app store'));
                } else {
                    // This is a current version of the application, so simply upgrade the database
                    db.upgrade().then(dfd.resolve).catch(dfd.reject);
                }
            })
            .catch(dfd.reject);
        return dfd.promise();
    },

    /**
     * Initialize Kendo UI application
     */
    initApplication() {
        logger.debug({
            message: 'Initializing kendo application',
            method: 'initApplication'
        });
        // Initialize event threshold as discussed at http://www.telerik.com/forums/click-event-does-not-fire-reliably
        UserEvents.defaultThreshold(kendo.support.mobileOS.name === 'android' ? 0 : 20);
        // Considering potential adverse effects with drag and drop, we are using http://docs.telerik.com/kendo-ui/api/javascript/mobile/ui/button#configuration-clickOn

        // Initial page
        var initial = CONSTANTS.HASH;
        if (app.viewModel.isSyncedUser$()) {
            // The viewModel user has been recently synced, show the user view
            initial += VIEW.USER;
        } else if (app.viewModel.isSavedUser$()) {
            // The viewModel user has not been synced for a while, suggest to signin to sync
            initial += `${VIEW.SIGNIN}?page=${encodeURIComponent(MISC.SIGNIN_PAGE)}&userId=${encodeURIComponent(app.viewModel.get(VIEW_MODEL.USER.ID))}`;
        } else {
            // The viewModel user is new, show walkthrough before signing in
            initial +=  VIEW.SIGNIN;
        }

        // Initialize application
        this.application = new Application(document.body, {
            initial: initial,
            // TODO skin: app.theme.name(),
            // http://docs.telerik.com/kendo-ui/controls/hybrid/application#hide-status-bar-in-ios-and-cordova
            // http://docs.telerik.com/platform/appbuilder/troubleshooting/archive/ios7-status-bar
            // http://www.telerik.com/blogs/everything-hybrid-web-apps-need-to-know-about-the-status-bar-in-ios7
            // http://devgirl.org/2014/07/31/phonegap-developers-guid/
            // statusBarStyle: mobile.support.cordova ? 'black-translucent' : undefined,
            statusBarStyle: 'hidden',
            init: e => {
                logger.debug({
                    message: 'Kendo application initialized',
                    method: 'application.init'
                });
                // Fix skin variant
                // TODO this._fixThemeVariant(e.sender.options.skin);
                // Localize the application
                // TODO this.localize(this.viewModel.get(VIEW_MODEL.LANGUAGE));
                // Fix signin page when initial page
                // TODO mobile._fixSigninViewLocalization();
                // Reinitialize notifications now that we know the size of .km-header
                // TODO mobile._initToastNotifications();
                // Wire the resize event handler for changes of device orientation
                $(window).resize(this.onResize.bind(this));
                // Bind the router change event to the onRouterChange handler
                this.application.router.bind(CONSTANTS.BACK, this.onRouterBack.bind(this));
                this.application.router.bind(CONSTANTS.CHANGE, this.onRouterChange.bind(this));
                // Trigger application init event for handleOpenURL event handler (custom url scheme)
                this.trigger('app.init');

                // hide the splash screen
                setTimeout(function () {
                    splashScreen.hide();
                }, 500); // + 500 for default fadeOut time
            }
        });
    },

    /**
     * Fix skin variant
     * @param theme
     */
    _fixThemeVariant(theme) {
        assert.type(CONSTANTS.STRING, theme, assert.format(assert.messages.type.default, 'theme', CONSTANTS.STRING));
        var skin = theme.split('-');
        if (Array.isArray(skin) && skin.length > 1) {
            $(document.body).addClass('km-' + theme);
        }
    },

    /**
     * Localize application
     */
    localize(locale) {
        $.noop(locale);
    },

    /**
     * Event handler for the resize event
     */
    onResize(e) {
        // In Android and iOS, onResize might be triggered before kendo.mobile.Application is instantiated
        // and/or before mobile.application as a pane which would trigger an error in mobile.application.view()
        // which is a shortcut for mobile.application.pane.view()
        if (this.application instanceof Application &&
            this.application.pane instanceof Pane) {
            const view = this.application.view();
            this.resizers.forEach(resize => {
                resize(e, view);
            });
        }
    },

    /**
     * Event handler triggered when clicking back (on platforms android and browser)
     * @param e
     */
    onRouterBack() {
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
    },

    /**
     * Event handler triggered when changing views
     * This is triggered before any view is shown (except the first one)
     * Note: mobile.application.view() returns the old view where as e.url points to the new view
     * @param e
     */
    onRouterChange(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.type(CONSTANTS.STRING, e.url, assert.format(assert.messages.type.default, 'e.url', CONSTANTS.STRING));
        // if (mobile.application instanceof kendo.mobile.Application) {
        app.controller.application.showLoading();
        // }
        // Check that we are online
        // TODO
        /*
        if (mobile.checkNetwork(e)) {
            // Track in analytics
            if (mobile.support.ga) {
                var pos = e.url.indexOf('?');
                var view = pos > 0 ? e.url.substr(0, pos) : e.url;
                mobile.ga.trackView(view, e.url);
            }
        }
         */
    }
});

/**
 * Default export
 */
export default AppController;

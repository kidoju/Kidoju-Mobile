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
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import app from '../common/window.global.es6';
import splashScreen from '../plugins/plugins.splashscreen.es6';
import BaseController from '../rapi/rapi.controller.es6';

const { navigator } = window;
const {
    UserEvents,
    mobile: {
        Application,
        ui: { Pane },
    },
    support,
} = window.kendo;
const logger = new Logger('ui.viewmodel');

/**
 * Extend viewModel
 */
const AppController = BaseController.extend({
    /**
     * Initialize Kendo UI application
     */
    initApplication() {
        logger.debug({
            message: 'Initializing kendo application',
            method: 'initApplication',
        });
        // Initialize event threshold as discussed at http://www.telerik.com/forums/click-event-does-not-fire-reliably
        UserEvents.defaultThreshold(
            support.mobileOS.name === 'android' ? 0 : 20
        );
        // Considering potential adverse effects with drag and drop, we are using http://docs.telerik.com/kendo-ui/api/javascript/mobile/ui/button#configuration-clickOn

        // Initial page
        let initial = CONSTANTS.HASH;
        /*
        if (app.viewModel.isSyncedUser$()) {
            // The viewModel user has been recently synced, show the user view
            initial += VIEW.USER;
        } else if (app.viewModel.isSavedUser$()) {
            // The viewModel user has not been synced for a while, suggest to signin to sync
            initial += `${VIEW.SIGNIN}?page=${encodeURIComponent(
                VIEW.SIGNIN_PAGE
            )}&userId=${encodeURIComponent(
                app.viewModel.get(VIEW_MODEL.USER.ID)
            )}`;
        } else {
        */
            // The viewModel user is new, show walkthrough before signing in
            initial += this.VIEW.SIGNIN;
        // }


        // Initialize application
        this.application = new Application(document.body, {
            initial,
            // TODO skin: app.theme.name(),
            // http://docs.telerik.com/kendo-ui/controls/hybrid/application#hide-status-bar-in-ios-and-cordova
            // http://docs.telerik.com/platform/appbuilder/troubleshooting/archive/ios7-status-bar
            // http://www.telerik.com/blogs/everything-hybrid-web-apps-need-to-know-about-the-status-bar-in-ios7
            // http://devgirl.org/2014/07/31/phonegap-developers-guid/
            // statusBarStyle: mobile.support.cordova ? 'black-translucent' : undefined,
            statusBarStyle: 'hidden',
            init: (/* e */) => {
                logger.debug({
                    message: 'Kendo application initialized',
                    method: 'application.init',
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
                this.application.router.bind(
                    CONSTANTS.BACK,
                    this.onRouterBack.bind(this)
                );
                this.application.router.bind(
                    CONSTANTS.CHANGE,
                    this.onRouterChange.bind(this)
                );
                // Trigger application init event for handleOpenURL event handler (custom url scheme)
                this.trigger('app.init');

                // hide the splash screen
                setTimeout(() => {
                    splashScreen.hide();
                }, 500); // + 500 for default fadeOut time
            },
        });
    },

    /**
     * Initialize fatal error
     * @param error
     */
    initFatalError(error) {
        logger.crit({
            message: 'Initializing fatal error',
            method: 'initFatalError',
            error,
        });
        // Initialize application
        this.application = new Application(document.body, {
            initial: '#error',
            // TODO: skin???
            init(/* e */) {
                // debugger;
                // hide the splash screen
                setTimeout(() => {
                    splashScreen.hide();
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
                }, 500); // + 500 for default fadeOut time
            },
        });
    },

    /**
     * Event handler for the resize event
     */
    onResize(e) {
        // In Android and iOS, onResize might be triggered before kendo.mobile.Application is instantiated
        // and/or before mobile.application as a pane which would trigger an error in mobile.application.view()
        // which is a shortcut for mobile.application.pane.view()
        if (
            this.application instanceof Application &&
            this.application.pane instanceof Pane
        ) {
            const view = this.application.view();
            this._resizers.forEach((resize) => {
                resize(e, view);
            });
        }
    },

    /**
     * Event handler triggered when clicking back (on platforms android and browser)
     * @param e
     */
    onRouterBack(e) {
        if (e.to === '') {
            // This prevents an error when clicking the back button on android devices and in the browser
            // when reaching the splash screen, which actually trigger a navigation to the default view (/)
            // which is the activities view and which requires e.view.params
            // Fixes https://github.com/kidoju/Kidoju-Mobile/issues/181
            e.preventDefault();
            if (navigator.app && $.isFunction(navigator.app.exitApp)) {
                navigator.app.exitApp();
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
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        assert.type(
            CONSTANTS.STRING,
            e.url,
            assert.format(
                assert.messages.type.default,
                'e.url',
                CONSTANTS.STRING
            )
        );
        if (app.viewModel.application instanceof Application) {
            app.viewModel.application.showLoading();
        }
        /*
        // Check that we are online and ping google analytics
        if (app.viewModel.checkNetwork(e)) {
            // Track in analytics
            if (mobile.support.ga) {
                var pos = e.url.indexOf('?');
                var view = pos > 0 ? e.url.substr(0, pos) : e.url;
                mobile.ga.trackView(view, e.url);
            }
        }
        */
    },
});

/**
 * Default export
 */
export default AppController;

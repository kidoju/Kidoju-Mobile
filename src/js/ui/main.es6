/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO Generic FileError handler to display app.notification
//   https://www.html5rocks.com/en/tutorials/file/filesystem/

// Import babel polyfills
// See https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babel
// eslint-disable-next-line import/no-extraneous-dependencies
import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import __ from '../app/app.i18n.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import AppController from './ui.viewmodel.es6';
import drawer from './ui.drawer.es6';
import layout from './ui.layout.es6';
import navbar from './ui.navbar.es6';
import network from './ui.network.es6';
// import settings from './ui.settings.es6';
// import signin from './ui.signin.es6';
// import summary from './ui.summary.es6';
// import user from './ui.user.es6';

// TODO remove stylesheets and use themer
import '../../styles/fonts/kidoju.less';
import '../../styles/vendor/kendo/web/kendo.flat.mobile.less';
// import '../../styles/vendor/kendo/mobile/kendo.mobile.all.less';
import '../../styles/ui/app.fonts.less';
import '../../styles/ui/app.mobile.less';

const logger = new Logger('main');

/**
 * Global error event handler
 * @param message
 * @param source
 * @param lineno
 * @param colno
 * @param error
 */
window.onerror = function onerror(message, source, lineno, colno, error) {
    // setTimeout is for SafariViewController and InAppBrowser
    setTimeout(() => {
        // Log
        if (logger && $.isFunction(logger.crit)) {
            logger.crit({
                message,
                method: 'window.onerror',
                error,
                data: { source, lineno, colno },
            });
        }
        // Notify analytics
        /*
        if (mobile.support.ga) {
            mobile.ga.trackException(message, true);
        }
        */
        // Display alert when debugging
        if (window.DEBUG) {
            window.alert(message); // TODO use dialogs
        }
        // Hide loading
        /*
        if (mobile.application instanceof kendo.mobile.Application) {
            mobile.application.hideLoading();
        }
         */
        // Show error notification
        /*
        if (i18n.culture && app.notification && $.isFunction(app.notification.error)) {
            app.notification.error(i18n.culture.notifications.unknownError);
        }
         */
    }, 0);
};

/**
 * By default jQuery has no timeout (0), but let's time out any $.ajax request at 20sec on mobile devices
 */
$.ajaxSetup({
    timeout: 20000, // Timeout in milliseconds
});

window.handleOpenUrl = function (url) {
    console.log(`--> ${url}`);
};

/**
 * Start the user interface
 */
function main() {
    logger.debug({
        message: 'Cordova device is ready',
        method: 'main',
    });

    // Set plugin shortcuts
    // TODO setShortcuts();
    // Set google analytics
    // TODO setAnalytics();
    // Schedule OS notifications
    // TODO mobile._scheduleSystemNotifications();
    // Initialize toast notifications
    // TODO mobile._initToastNotifications();
    // Initialize battery events
    // TODO mobile._initBatteryEvents();
    // Initialize network events
    // TODO mobile._initNetworkEvents();

    // Create the application
    app.viewModel = new AppController({
        initializers: [
            // Add initializers here
            // make sure they all return a jQuery promise
            __.load(),
        ],
        features: [
            // Add features here
            // Beware, there is no consistent rule as to what `this` refers to in these methods
            // because the Kendo UI framework will bind (via proxy) these methods when referred to in the HTML page via MVVM
            drawer,
            layout,
            navbar,
            // activities,
            // categories,
            network,
            // settings,
            // signin,
            // summaries,
            // summary,
            // user
            // user,
        ],
    });

    app.viewModel.reset();

    app.viewModel.start().then(() => {
        // Log initialization
        logger.debug({
            message: `app controller initialized in ${__.locale}`,
            method: 'init',
        });

        // Check application and database versions
        // TODO Should we make checkForUpgrade an initializer?
        // this.checkForUpgrade()
        $.Deferred()
            .resolve()
            .promise()
            .then(() => {
                // Load viewModel, then initialize kendo application
                app.viewModel.load().always(app.viewModel.initApplication());
            })
            .catch((err) => {
                // app.notification.error(i18n.culture.notifications.dbMigrationFailure);
                if (err instanceof Error) {
                    // setTimeout ensures we call the global error handler
                    // @see https://stackoverflow.com/questions/39376805/how-can-i-trigger-global-onerror-handler-via-native-promise-when-runtime-error-o
                    setTimeout(() => {
                        throw err;
                    }, 0);
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
}

/**
 * Default export
 */
export default main;

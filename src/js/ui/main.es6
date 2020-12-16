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
import features from './features.es6';
import initializers from './initializers.es6';
import AppController from './ui.viewmodel.es6';


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
function onDeviceReady() {
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
        initializers,
        features
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
            .catch((error) => {
                // app.notification.error(i18n.culture.notifications.dbMigrationFailure);
                // TODO Exit the application - occurs for example if app.culture.xx.es6 is missing
                app.viewModel.initFatalError.bind(this, error);
            });
    });
}

/**
 * Default export
 */
export default onDeviceReady;

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Import babel polyfills
// See https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babel
// eslint-disable-next-line import/no-extraneous-dependencies
import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import AppController from '../app/app.controller.es6';
import __ from '../app/app.i18n.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import drawer from './feature.drawer.es6';
import layout from './feature.layout.es6';
import navbar from './feature.navbar.es6';
import settings from './feature.settings.es6';
import signin from './feature.signin.es6';
import summary from './feature.summary.es6';
import user from './feature.user.es6';
import viewModel from './ui.viewmodel.es6';

// TODO remove stylesheets and use themer
import '../../styles/fonts/kidoju.less';
import '../../styles/vendor/kendo/web/kendo.flat.mobile.less';
// import '../../styles/vendor/kendo/mobile/kendo.mobile.all.less';
import '../../styles/ui/app.fonts.less';
import '../../styles/ui/app.mobile.less';

const logger = new Logger('app.start');

/**
 * Start the user interface
 */
function start() {
    logger.debug({
        message: 'Cordova device is ready',
        method: 'start'
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

    // Create the viewModel
    app.viewModel = viewModel;

    // Create the application
    app.controller = new AppController({
        initializers: [
            // Add initializers here
            // make sure they all return a jQuery promise
            __.load()
        ],
        features: [
            // Add features here
            // A feature is an object with methods but without state
            // Beware, there is no consistent rule as to what `this` refers to in these methods
            // because the Kendo UI framework will bind (via proxy) these methods when referred to in the HTML page via MVVM
            drawer,
            layout,
            navbar,
            // settings,
            signin
            // summary,
            // user
        ],
        viewModel
    });
}

/**
 * Default export
 */
export default start;

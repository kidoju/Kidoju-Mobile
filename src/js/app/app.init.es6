/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
// import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { oni18nLoaded } from '../ui/ui.application.es6';

const logger = new Logger('app.init');

/**
 * Event handler triggered when device is ready
 */
function onDeviceReady() {
    // window.alert('onDeviceReady!');
    logger.debug({
        message: 'Device is ready',
        method: 'onDeviceReady'
    });
    // Set plugin shortcuts
    // TODO setShortcuts();
    // Set google analytics
    // TODO setAnalytics();

    // initialize the user interface after loading i18n resources
    $(document).one(CONSTANTS.LOADED, oni18nLoaded);
    // Release the execution of jQuery's ready event (hold in index.html)
    // @see https://api.jquery.com/jquery.holdready/
    // Otherwise the ready event handler in app.i18n is not called
    // (in phonegap developer app, in packaged apps, but not in a browser served by phonegap)
    // and oni18nLoaded does not execute (strange but true)
    // ATTENTION: https://github.com/jquery/jquery/issues/3288
    $.holdReady(false);
}

/**
 * Bootstrap for cordova and browser
 */
if ($.type(window.cordova) === CONSTANTS.UNDEFINED) {
    // No need to wait
    onDeviceReady();
} else {
    // Wait for Cordova to load
    document.addEventListener('deviceready', onDeviceReady, false);
}

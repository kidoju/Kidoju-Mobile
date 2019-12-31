/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO
//   https://mariusbancila.ro/blog/2017/07/21/using-google-firebase-in-cordova-apps/
//   https://github.com/arnesson/cordova-plugin-firebase
//   https://github.com/chemerisuk/cordova-plugin-firebase-analytics

// Note: requires cordova-plugin-google-analytics or cordova-plugin-firebase-analytics
// so plugin.logEvent is only available after deviceready event

/**
 * Analytics plugin
 */
const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return !!window.ga && $.isFunction(window.ga.startTrackerWithId);
    },

    /**
     * Setup analytics
     * @see https://github.com/danwilson/google-analytics-plugin
     */
    init() {
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
    },

    /**
     * Log and event
     */
    logEvent() {
        // TODO
    }
};

/**
 * Default export
 */
export default plugin;

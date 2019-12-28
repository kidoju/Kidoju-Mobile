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
        return true;
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

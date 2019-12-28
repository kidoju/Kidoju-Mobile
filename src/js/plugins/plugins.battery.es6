/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires cordova-plugin-battery-status
// so window.cordova.InAppBrowser is only available after deviceready event

const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return true;
    },

    /**
     * Initialize battery events
     * @param low
     * @param critical
     */
    initEvents(low, critical) {

    }
};

/**
 * Default export
 */
export default plugin;

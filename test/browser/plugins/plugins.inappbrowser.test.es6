/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

    // TODO revert to window.open with browser device

// Note: requires cordova-plugin-inappbrowser
// so window.cordova.InAppBrowser is only available after deviceready event

const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return !!(window.cordova || {}).InAppBrowser;
    },

    /**
     * Open browser window
     * @param url
     * @param target
     * @param options
     */
    open(url, target, options) {
        const { InAppBrowser } = window.cordova || {};
        if (InAppBrowser && typeof InAppBrowser.open === 'function') {
            InAppBrowser.open(url, target, options);
        }
    }
};

/**
 * Default export
 */
export default plugin;

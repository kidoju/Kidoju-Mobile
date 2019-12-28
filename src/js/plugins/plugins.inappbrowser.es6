/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires cordova-plugin-inappbrowser
// so window.cordova.InAppBrowser is only available after deviceready event

const plugin = {
    /**
     * Ready
     * Note: InAppBrowser uses an iFrame on the browser platform, which is incompatible with the oAuth flow
     * @returns {boolean}
     */
    ready() {
        const { InAppBrowser } = window.cordova || {};
        const { platform } = window.device || {};
        return (
            platform !== 'browser' &&
            InAppBrowser &&
            typeof InAppBrowser.open === 'function'
        );
    },

    /**
     * Open browser window
     * @param url
     * @param target
     * @param options
     */
    open(url, target, options) {
        let browser;
        if (plugin.ready()) {
            browser = window.cordova.InAppBrowser.open(url, target, options);
        }
        return browser;
    }
};

/**
 * Default export
 */
export default plugin;

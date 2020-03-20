/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires cordova-plugin-safariviewcontroller
// so window.SafariViewController is only available after deviceready event

/**
 * SafariViewController plugin
 */
const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        const { SafariViewController } = window;
        const { platform } = window.device || {};
        return (
            SafariViewController &&
            platform !== 'browser' &&
            typeof SafariViewController.isAvailable === 'function' &&
            typeof SafariViewController.show === 'function'
        );
    },

    /**
     * Show
     * @param options
     * @param success
     * @param error
     */
    show(options, success, error) {
        if (plugin.ready()) {
            const { SafariViewController } = window;
            SafariViewController.isAvailable(available => {
                if (available) {
                    SafariViewController.show(options, success, error);
                } else {
                    error('SafariViewController not available');
                }
            });
        }
    }
};

/**
 * Default export
 */
export default plugin;

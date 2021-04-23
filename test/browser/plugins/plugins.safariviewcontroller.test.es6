/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO revert to window.open with browser device

// Note: requires cordova-plugin-safariviewcontroller
// so window.SafariViewController is only available after deviceready event

const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return !!window.SafariViewController;
    },

    /**
     * Show
     * @param options
     * @param success
     * @param error
     */
    show(options, success, error) {
        const { SafariViewController } = window;
        if (
            SafariViewController &&
            typeof SafariViewController.isAvailable === 'function' &&
            typeof SafariViewController.show === 'function'
        ) {
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

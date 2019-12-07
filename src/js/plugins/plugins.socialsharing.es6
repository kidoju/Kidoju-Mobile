/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires cordova-plugin-x-socialsharing
// so window.plugins.socialsharing is only available after deviceready event

const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return !!(window.plugins || {}).socialsharing;
    },

    /**
     * Share
     * @param options
     * @param success
     * @param error
     */
    share(options, success, error) {
        const { socialsharing } = window.plugins || {};
        if (
            socialsharing &&
            typeof socialsharing.shareWithOptions === 'function'
        ) {
            socialsharing.shareWithOptions(options, success, error);
        }
    }
};

/**
 * Default export
 */
export default plugin;

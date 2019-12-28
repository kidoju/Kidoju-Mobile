/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires cordova-plugin-x-socialsharing
// so window.plugins.socialsharing is only available after deviceready event

/**
 * SocialSharing plugin
 */
const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        const { socialsharing } = window.plugins || {};
        return (
            socialsharing &&
            typeof socialsharing.shareWithOptions === 'function'
        );
    },

    /**
     * Share
     * @param options
     * @param success
     * @param error
     */
    share(options, success, error) {
        if (plugin.ready()) {
            window.plugins.socialsharing.shareWithOptions(
                options,
                success,
                error
            );
        }
    }
};

/**
 * Default export
 */
export default plugin;

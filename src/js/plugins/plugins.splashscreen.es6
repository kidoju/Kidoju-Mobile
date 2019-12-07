/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires cordova-plugin-splashscreen
// so window.navigator.splashscreen is only available after deviceready event

const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return !!(window.navigator || {}).splashscreen;
    },

    /**
     * Hide
     */
    hide() {
        const { splashscreen } = window.navigator;
        if (splashscreen && typeof splashscreen.hide === 'function') {
            splashscreen.hide();
        }
    },

    /**
     * Show
     */
    show() {
        const { splashscreen } = window.navigator;
        if (splashscreen && typeof splashscreen.show === 'function') {
            splashscreen.show();
        }
    }
};

/**
 * Default export
 */
export default plugin;

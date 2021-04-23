/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires cordova-plugin-splashscreen
// so window.navigator.splashscreen is only available after deviceready event

/**
 * SplashScreen plugin
 */
const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        const { splashscreen } = window.navigator;
        return (
            splashscreen &&
            typeof splashscreen.hide === 'function' &&
            typeof splashscreen.show === 'function'
        );
    },

    /**
     * Hide
     */
    hide() {
        if (plugin.ready()) {
            window.navigator.splashscreen.hide();
        }
    },

    /**
     * Show
     */
    show() {
        if (plugin.ready()) {
            window.navigator.splashscreen.show();
        }
    }
};

/**
 * Default export
 */
export default plugin;

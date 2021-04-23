/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires https://github.com/lynrin/cordova-plugin-buildinfo
// so window.BuildInfo is only available after deviceready event

/**
 * BuildInfo plugin
 */
const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return !!window.BuildInfo;
    }
};

/**
 * Default export
 */
export default plugin;

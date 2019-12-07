/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires https://github.com/lynrin/cordova-plugin-buildinfo
// so window.BuildInfo is only available after deviceready event

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

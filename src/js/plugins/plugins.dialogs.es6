/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO use window.alert with browser device

// Note: requires https://github.com/apache/cordova-plugin-dialogs
// so window.navigator.notification is only available after deviceready event

const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return !!window.navigator.notification;
    },

    /**
     * Alert
     * @param message
     * @param callback
     * @param title
     * @param button
     */
    alert(message, callback, title = 'Alert', button = 'OK') {
        const { notification } = window.navigator;
        if (notification && typeof notification.alert === 'function') {
            notification.alert(message, callback, title, button);
        }
    },

    /**
     * Confirm
     * @param message
     * @param callback
     * @param title
     * @param buttons
     */
    confirm(message, callback, title = 'Confirm', buttons = ['OK', 'Cancel']) {
        const { notification } = window.navigator;
        if (notification && typeof notification.confirm === 'function') {
            notification.confirm(message, callback, title, buttons);
        }
    },

    /**
     * Prompt
     * @param message
     * @param callback
     * @param title
     * @param buttons
     */
    prompt(
        message,
        callback,
        title = 'Prompt',
        buttons = ['OK', 'Cancel'],
        text = ''
    ) {
        const { notification } = window.navigator;
        if (notification && typeof notification.prompt === 'function') {
            notification.prompt(message, callback, title, buttons, text);
        }
    },

    /**
     * Beep
     * @param times
     */
    beep(times = 1) {
        const { notification } = window.navigator;
        if (notification && typeof notification.beep === 'function') {
            notification.beep(times);
        }
    }
};

/**
 * Default export
 */
export default plugin;

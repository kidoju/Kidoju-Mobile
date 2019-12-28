/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO use window.alert with browser device

// Note: requires https://github.com/apache/cordova-plugin-dialogs
// so window.navigator.notification is only available after deviceready event

/**
 * Dialogs plugin
 */
const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        const { notification } = window.navigator;
        return (
            notification &&
            typeof notification.alert === 'function' &&
            typeof notification.confirm === 'function' &&
            typeof notification.prompt === 'function' &&
            typeof notification.beep === 'function'
        );
    },

    /**
     * Alert
     * @param message
     * @param callback
     * @param title
     * @param button
     */
    alert(message, callback, title = 'Alert', button = 'OK') {
        if (plugin.ready()) {
            window.navigator.notification.alert(
                message,
                callback,
                title,
                button
            );
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
        if (plugin.ready()) {
            window.navigator.notification.confirm(
                message,
                callback,
                title,
                buttons
            );
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
        if (plugin.ready()) {
            window.navigator.notification.prompt(
                message,
                callback,
                title,
                buttons,
                text
            );
        }
    },

    /**
     * Beep
     * @param times
     */
    beep(times = 1) {
        if (plugin.ready()) {
            window.navigator.notification.beep(times);
        }
    }
};

/**
 * Default export
 */
export default plugin;

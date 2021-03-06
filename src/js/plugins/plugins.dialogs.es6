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
            window.cordova &&
            notification &&
            typeof notification.alert === 'function' &&
            typeof notification.confirm === 'function' &&
            typeof notification.prompt === 'function' &&
            typeof notification.beep === 'function' // &&
            // typeof notification.dismissPrevious === 'function'
            // typeof notification.dismissAll === 'function'
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
        } else {
            window.alert(message);
            callback();
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
        } else {
            const ok = window.confirm(message);
            if (ok) {
                callback();
            }
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
        } else {
            const input = window.prompt(message);
            callback(input);
        }
    },

    /**
     * Beep
     * @param times
     */
    beep(times = 1) {
        if (plugin.ready()) {
            window.navigator.notification.beep(times);
        } else {
            // TODO https://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep
        }
    },
};

/*
mobile.dialogs = {
    confirm: function (message, callback, title, buttons) {
        if (mobile.support.dialogs) {
            window.navigator.notification.confirm(message, callback, title || i18n.culture.dialogs.confirm, Array.isArray(buttons) ? buttons : [i18n.culture.dialogs.buttons.ok.text, i18n.culture.dialogs.buttons.cancel.text]);
        } else {
            kidoju.dialogs.openAlert({
                type: 'info',
                title: title || i18n.culture.dialogs.confirm,
                message: message,
                buttonLayout: 'stretched',
                actions: [
                    {
                        action: 'ok',
                        text: (Array.isArray(buttons) && buttons.length > 1 ? buttons[0] : i18n.culture.dialogs.buttons.ok.text),
                        primary: true,
                        imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.ok.icon)
                    },
                    {
                        action: 'cancel',
                        text: (Array.isArray(buttons) && buttons.length > 1 ? buttons[1] : i18n.culture.dialogs.buttons.cancel.text),
                        imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.cancel.icon)
                    }
                ]
            })
                .done(function (result) {
                    if (result.action === 'ok') {
                        callback(1);
                    } else {
                        callback(2);
                    }
                });
        }
    },
    error: function (message, callback) {
        if (mobile.support.dialogs) {
            // window.navigator.notification.beep(1);
            window.navigator.notification.alert(message, callback, i18n.culture.dialogs.error, i18n.culture.dialogs.buttons.ok.text);
        } else {
            kidoju.dialogs.openAlert({
                type: 'error',
                title: i18n.culture.dialogs.error,
                message: message,
                buttonLayout: 'stretched',
                actions: [{
                    action: 'ok',
                    text: i18n.culture.dialogs.buttons.ok.text,
                    primary: true,
                    imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.ok.icon)
                }]
            }).done(callback);
        }
    },
    info: function (message, callback) {
        if (mobile.support.dialogs) {
            window.navigator.notification.alert(message, callback, i18n.culture.dialogs.info, i18n.culture.dialogs.buttons.ok.text);
        } else {
            kidoju.dialogs.openAlert({
                type: 'info',
                title: i18n.culture.dialogs.info,
                message: message,
                buttonLayout: 'stretched',
                actions: [{
                    action: 'ok',
                    text: i18n.culture.dialogs.buttons.ok.text,
                    primary: true,
                    imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.ok.icon)
                }]
            }).done(callback);
        }
    },
    success: function (message, callback) {
        if (mobile.support.dialogs) {
            window.navigator.notification.alert(message, callback, i18n.culture.dialogs.success, i18n.culture.dialogs.buttons.ok.text);
        } else {
            kidoju.dialogs.openAlert({
                type: 'success',
                title: i18n.culture.dialogs.success,
                message: message,
                buttonLayout: 'stretched',
                actions: [{
                    action: 'ok',
                    text: i18n.culture.dialogs.buttons.ok.text,
                    primary: true,
                    imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.ok.icon)
                }]
            }).done(callback);
        }
    },
    warning: function (message, callback) {
        if (mobile.support.dialogs) {
            window.navigator.notification.alert(message, callback, i18n.culture.dialogs.warning, i18n.culture.dialogs.buttons.ok.text);
        } else {
            kidoju.dialogs.openAlert({
                type: 'warning',
                title: i18n.culture.dialogs.warning,
                message: message,
                buttonLayout: 'stretched',
                actions: [{
                    action: 'ok',
                    text: i18n.culture.dialogs.buttons.ok.text,
                    primary: true,
                    imageUrl: kendo.format(app.uris.cdn.icons, i18n.culture.dialogs.buttons.ok.icon)
                }]
            }).done(callback);
        }
    }
};
 */

/**
 * Default export
 */
export default plugin;

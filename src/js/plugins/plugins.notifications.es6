/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires cordova-plugin-local-notifications
// so window.cordova.plugins.notification is only available after deviceready event

/**
 * Notification plugin
 */
const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return true;
    },

    /**
     * Schedule system notifications
     * Uses https://github.com/katzer/cordova-plugin-local-notifications
     * @private
     */
    _scheduleSystemNotifications() {
        var local = window.cordova && window.cordova.plugins && window.cordova.plugins.notification && window.cordova.plugins.notification.local;
        if (local && $.isFunction(local.cancelAll) && $.isFunction(local.schedule)) {
            // var firstAt = new Date();
            // firstAt.setHours(firstAt.getHours() + 1);
            // firstAt.setDate(firstAt.getDate() + 7);
            // Cancel all notifications before creating new ones
            local.cancelAll(function() {
                // Setup a reminder to use the application every week
                local.schedule({
                    title: i18n.culture.osNotifications.title,
                    text: kendo.format(i18n.culture.osNotifications.text, app.constants.appName),
                    // Icon paths explained at https://github.com/katzer/cordova-plugin-local-notifications/issues/1266#issuecomment-293508925
                    // See also https://github.com/katzer/cordova-plugin-local-notifications/wiki/10.-URIs
                    icon: 'file://img/notifications/icon.png',
                    // smallIcon: - @see https://documentation.onesignal.com/v3.0/docs/customize-notification-icons#section-small-icon
                    // Triggers explained at https://github.com/katzer/cordova-plugin-local-notifications/issues/1412
                    // With version 0.8.5 - https://github.com/katzer/cordova-plugin-local-notifications/blob/64a6e557fd10dcd66a13b22b6aa0ed50163bcd91/README.md
                    // every: 'week',
                    // firstAt: firstAt
                    // With version 0.9 - https://github.com/katzer/cordova-plugin-local-notifications
                    // trigger: { every: { weekday: 1, hour: 16, minute: 0 } },
                    // trigger: { every: 'hour', count: 1 },
                    trigger: {every: 'week'},
                    foreground: true
                });
            });
        }
    }
};

/**
 * Default export
 */
export default plugin;

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO Like network, we might want an observable object to trigger our events

// Note: requires ordova-plugin-battery-status
// so battery events are only available after deviceready event

/**
 * Battery plugin
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
     * Initialize battery events
     * @param low
     * @param critical
     */
    initEvents(low, critical) {
        // app.battery = app.battery || { status: {} };

        // batterylow
        window.addEventListener(
            'batterylow',
            function (status) { // status is en Event
                // app.battery.status.isPlugged = status.isPlugged;
                // app.battery.status.level = status.level;
                app.notification.warning(i18n.culture.notifications.batteryLow);
            },
            false
        );

        // batterycritical
        window.addEventListener(
            'batterycritical',
            function (status) { // status is en Event
                // app.battery.status.isPlugged = status.isPlugged;
                // app.battery.status.level = status.level;
                app.notification.warning(i18n.culture.notifications.batteryCritical);
            },
            false
        );

        // Warning: the Android and Fire OS implementations are greedy and prolonged use will drain the device's battery.
        // @see https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-battery-status/#quirks-android-&-amazon-fire-os

        // batterystatus
        /*
        window.addEventListener(
            'batterystatus',
            function (status) { // status is en Event
                app.battery.status.isPlugged = status.isPlugged;
                app.battery.status.level = status.level;
            },
            false
        );
        */
    }
};

/**
 * Default export
 */
export default plugin;

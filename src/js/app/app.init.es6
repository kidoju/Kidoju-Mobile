/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: this is a very generic phonegap/cordova bootstrap module
// The logic to start a Kendo Mobile UI application is in ./ui/ui.start.es6

import onDeviceReady from '../ui/main.es6';

/**
 * Bootstrap for cordova and browser
 */
if (typeof window.cordova === 'undefined') {
    // No need to wait
    onDeviceReady();
} else {
    // Wait for Cordova to load
    document.addEventListener('deviceready', onDeviceReady, false);
}

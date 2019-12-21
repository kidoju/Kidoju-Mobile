/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: this is a very generic phonegap/cordova bootstrap module
// The logic to start a Kendo Mobile UI application is in ./ui/ui.start.es6

import start from '../ui/ui.start.es6';

/**
 * Event handler triggered when device is ready
 */
function onDeviceReady() {
    // window.alert('onDeviceReady!');
    start();
}

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

/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true */
/* jshint browser: true */

;(function ($, undefined) {

    'use strict';

    var fn = Function,
        global = fn('return this')(),
        app = global.app = global.app || {};

    /**
     * Application initialization
     */
    app.initialize = function() {
        app.bindEvents();
    };

    /**
     * Bind Event Listeners
     * Bind any events that are required on startup.
     * Common events are: 'load', 'deviceready', 'offline', and 'online'.
     */
    app.bindEvents = function() {
        if(global.device && global.device.cordova) {
            document.addEventListener('deviceready', app.onDeviceReady, false);
        } else {
            app.onDeviceReady();
        }
    };

    /**
     * Update DOM when device is ready
     */
    app.onDeviceReady = function() {
        $(document).ready(function() {
            app.kendoApp = new global.kendo.mobile.Application(document.body);
            app.controller.localize();
        });
    };

    app.initialize();

}(jQuery));
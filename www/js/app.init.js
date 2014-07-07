/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */

;(function (win, $, undefined) {

    'use strict';

    var app = win.app = win.app || {};

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
        if(win.device && (win.device.cordova || win.device.phonegap)) {
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
            app.kendoApp = new win.kendo.mobile.Application(document.body);
            app.controller.localize();
        });
    };

    app.initialize();

}(this, jQuery));
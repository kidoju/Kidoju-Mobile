/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */

if (typeof(require) === 'function') {

    // Load kendo CSS
    require('../styles/vendor/kendo/web/kendo.common.less');
    // require('../styles/vendor/kendo/web/kendo.rtl.less');
    require('../styles/vendor/kendo/web/kendo.default.less');
    require('../styles/vendor/kendo/mobile/kendo.mobile.all.less');

    // Load app CSS
    require('../styles/app.mobile.less');
}

(function (f, define) {
    'use strict';
    define([
        './vendor/kendo/kendo.all'
        // './window.assert',
        // './window.logger',
        // './app.logger',
        // './app.i18n',
        // './app.rapi'
    ], f);
})(function () {

    'use strict';

    (function ($, undefined) {

        var kendo = window.kendo;
        var app = window.app || {};

        // Application Constructor
        app.initialize = function() {
            this.bindEvents();
        };

        /**
         * Bind Event Listeners
         *
         * Bind any events that are required on startup. Common events are:
         * 'load', 'deviceready', 'offline', and 'online'.
         */
        app.bindEvents = function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        };

        /**
         * deviceready Event Handler
         *
         * The scope of 'this' is the event. In order to call the 'receivedEvent'
         * function, we must explicitly call 'app.receivedEvent(...);'
         */
        app.onDeviceReady = function() {
            app.receivedEvent('deviceready');
        };

        /**
         * Update DOM on a Received Event
         * @param id
         */
        app.receivedEvent = function(id) {
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            console.log('Received Event: ' + id);
        };

    }(window.jQuery));

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */

(function (f, define) {
    'use strict';
    define([], f);
})(function () {

    'use strict';

    (function ($, undefined) {

        var UNDEFINED = 'undefined';
        var SEP = '.';

        /**
         * SecureStorage
         * @see https://github.com/Crypho/cordova-plugin-secure-storage
         * @param name
         * @constructor
         */
        var SecureStorage = function () {
            this._ss;
        };

        /**
         * Initialization;
         */
        SecureStorage.prototype.init = function (name) {
            if ($.type(this._ss) !== UNDEFINED) {
                return; // TODO assert?
            }
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.SecureStorage) {
                this._ss = new window.cordova.plugins.SecureStorage(
                    function () {
                        console.log('OK'); // TODO
                    },
                    function (error) {
                        console.log(error);
                        // TODO https://github.com/Crypho/cordova-plugin-secure-storage#users-must-have-a-secure-screen-lock-set
                        // Test and update on android
                        navigator.notification.alert(
                            'Please enable the screen lock on your device. This app cannot operate securely without it.',
                            function () {
                                this._ss.secureDevice(
                                    function () {
                                        console.log('OK');
                                    },
                                    function () {
                                        this.init();
                                    }
                                );
                            },
                            'Screen lock is disabled'
                        );
                    },
                    name);
            } else {
                this._ss = {
                    set: function (success, failure, key, value) {
                        try {
                            window.localStorage.setItem(name + SEP + key, value);
                            success(key);
                        } catch (err) {
                            failure(err);
                        }
                    },
                    get: function (success, failure, key) {
                        try {
                            var value = window.localStorage.getItem(name + SEP + key);
                            success(value);
                        } catch (err) {
                            failure(err);
                        }
                    },
                    remove: function (success, failure, key) {
                        try {
                            window.localStorage.removeItem(name + SEP + key);
                            success(key);
                        } catch (err) {
                            failure(err);
                        }
                    }
                }
            }
        };

        /**
         * Set an item by key
         * @param key
         * @param value
         * @returns {*}
         */
        SecureStorage.prototype.setItem =  function (key, value) {
            var dfd = $.Deferred();
            // TODO assert this._ss, key and value ???
            this._ss.set(dfd.resolve, dfd.reject, key, value);
            return dfd.promise();
        };

        /**
         * Get an item by key
         * @param key
         * @returns {*}
         */
        SecureStorage.prototype.getItem =  function (key) {
            var dfd = $.Deferred();
            this._ss.get(dfd.resolve, dfd.reject, key);
            return dfd.promise();
        };

        /**
         * Remove an item by key
         * @param key
         * @returns {*}
         */
        SecureStorage.prototype.removeItem =  function (key) {
            var dfd = $.Deferred();
            this._ss.remove(dfd.resolve, dfd.reject, key);
            return dfd.promise();
        };

        window.secureStorage = new SecureStorage();

    }(window.jQuery));

    return window.secureStorage;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

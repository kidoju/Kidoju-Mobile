/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */

(function (f, define) {
    'use strict';
    define([
        './window.assert',
        './window.logger'
    ], f);
})(function () {

    'use strict';

    (function ($, undefined) {

        var OBJECT = 'object';
        var STRING = 'string';
        var SEP = '.';
        var assert = window.assert;
        var logger = new window.Logger('app.secure');

        /**
         * SecureStorage
         * @see https://github.com/Crypho/cordova-plugin-secure-storage
         * @param name
         * @constructor
         */
        var SecureStorage = function () {};

        /**
         * Initialization;
         */
        SecureStorage.prototype.init = function (name) {
            assert.isUndefined(this._ss, '`this._ss` should be undefined when calling init');
            var that = this;
            var alert = window.navigator.notification.alert;
            alert('SecureStorage: ' + !!(window.cordova && window.cordova.plugins && window.cordova.plugins.SecureStorage));
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.SecureStorage) {
                that._ss = new window.cordova.plugins.SecureStorage(
                    function () {
                        alert('SecureStorage initialized'); // TODO: remove
                        logger.debug({
                            message: 'SecureStorage successfully initialized',
                            method: 'SecureStorage.prototype.init'
                        })
                    },
                    function (error) {
                        console.log(error);
                        // TODO https://github.com/Crypho/cordova-plugin-secure-storage#users-must-have-a-secure-screen-lock-set
                        // Test and update on android
                        alert(
                            'Please enable the screen lock on your device. This app cannot operate securely without it.',
                            function () {
                                that._ss.secureDevice(
                                    function () {
                                        alert('Screen lock enabled. Enjoy our secure features.');
                                    },
                                    function () {
                                        alert('Screen lock disabled. Sorry, but our app cannot store user pins without it.');
                                        window.navigator.app.exitApp();
                                    }
                                );
                            },
                            'Screen Lock'
                        );
                    },
                    name);
            } else {
                that._ss = {
                    set: function (success, failure, key, value) {
                        try {
                            window.localStorage.setItem(name + SEP + key, JSON.stringify(value));
                            success(key);
                        } catch (err) {
                            failure(err);
                        }
                    },
                    get: function (success, failure, key) {
                        try {
                            var value = JSON.parse(window.localStorage.getItem(name + SEP + key));
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
                };
                logger.info({
                    message: 'SecureStorage not available, using localStorage',
                    method: 'SecureStorage.prototype.init'
                })
            }
        };

        /**
         * Set an item by key
         * @param key
         * @param value
         * @returns {*}
         */
        SecureStorage.prototype.setItem =  function (key, value) {
            assert.type(this._ss, OBJECT, '`this._ss` should be an object after calling init');
            assert.type(key, STRING, '`key` should be a `string`');
            var dfd = $.Deferred();
            this._ss.set(dfd.resolve, dfd.reject, key, value);
            return dfd.promise();
        };

        /**
         * Get an item by key
         * @param key
         * @returns {*}
         */
        SecureStorage.prototype.getItem =  function (key) {
            assert.type(this._ss, OBJECT, '`this._ss` should be an object after calling init');
            assert.type(key, STRING, '`key` should be a `string`');
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
            assert.type(this._ss, OBJECT, '`this._ss` should be an object after calling init');
            assert.type(key, STRING, '`key` should be a `string`');
            var dfd = $.Deferred();
            this._ss.remove(dfd.resolve, dfd.reject, key);
            return dfd.promise();
        };

        window.secureStorage = new SecureStorage();

    }(window.jQuery));

    return window.secureStorage;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

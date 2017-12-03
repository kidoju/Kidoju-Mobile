/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */


(function (f, define) {
    'use strict';
    define([
        './window.pongodb',
        './window.assert',
        './window.logger'
    ], f);
})(function () {

    'use strict';

    var app = window.app = window.app || {};

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        var pongodb = window.pongodb;
        var assert = window.assert;
        var logger = new window.Logger('app.db');
        var OBJECT = 'object';

        /**
         * Database definition
         */
        var db = app.db = new pongodb.Database({
            name: 'KidojuDB',
            size: 5 * 1024 * 1024,
            collections: ['activities', 'users'],
            version: '0.3.4' // TODO
        });

        // TODO Triggers;

        // TODO Migrations

    }(window.jQuery));

    /* jshint +W071 */

    return app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

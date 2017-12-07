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
        var DB_NAME = 'KidojuDB';
        var DB_VERSION = '0.3.4'; // TODO
        var COLLECTION = {
            ACTIVITIES: 'activities',
            SUMMARIES: 'summaries',
            USERS: 'users',
            VERSIONS: 'versions'
        };
        var TRIGGER = {
            INSERT: 'insert',
            UPDATE: 'update',
            REMOVE: 'remove'
        };

        // TODO Check application upgrade with ping!!!!!

        /**
         * Database definition
         */
        var db = app.db = new pongodb.Database({
            name: DB_NAME,
            size: 10 * 1024 * 1024,
            collections: [COLLECTION.ACTIVITIES, COLLECTION.SUMMARIES, COLLECTION.USERS, COLLECTION.VERSIONS],
            version: DB_VERSION
        });

        /**
         * Full-text indexes
         */
        db.addFullTextIndex(COLLECTION.SUMMARIES, ['author.lastName', 'description', 'tags', 'title']);

        /**
         * Triggers
         */
        db.createTrigger(COLLECTION.ACTIVITIES, [TRIGGER.INSERT, TRIGGER.UPDATE], function (item) {
            debugger;
            return $.Deferred().resolve().promise();
        });

        // TODO Triggers;
        // 1. A first trigger would update summary with activity score so that a user would know which summaries he/she has already played
        // 2. We need a trigger to remove activities which are not related to app.constants.categoryId and app.constants.authorId
        // 3. We could use trigger to create/update/remove MobileUser picture
        // db.addTrigger('activities', 'create', function (item) {
        // `this` has to be the database so as to access other collections
        // });

        /**
         * Migrations
         */
        // TODO Migrations

    }(window.jQuery));

    /* jshint +W071 */

    return app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */


(function (f, define) {
    'use strict';
    define([
        './app.db',
        './vendor/kendo/kendo.core',
        './window.assert',
        './window.logger'
    ], f);
})(function () {

    'use strict';

    var pongodb = window.pongodb = window.pongodb || {};

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        var kendo = window.kendo;
        // var assert = window.assert;
        var logger = new window.Logger('app.db.migration');
        var OBJECT = 'object';

        /**
         * Compare semantic versions (either directly or as a _version property of an object)
         * @see: https://github.com/substack/semver-compare/blob/master/index.js
         * @param a
         * @param b
         * @returns {number}
         */
        function compareVersions (a, b) {
            // Get _version as an object property
            var va = $.type(a) === OBJECT ? a._version : a;
            var vb = $.type(b) === OBJECT ? b._version : b;
            // Remove `v` prefix if any
            va = va.charAt(0) === 'v' ? va.substr(1) : va;
            vb = vb.charAt(0) === 'v' ? vb.substr(1) : vb;
            var pa = va.split('.');
            var pb = vb.split('.');
            for (var i = 0; i < 3; i++) {
                var na = parseInt(pa[i], 10);
                var nb = parseInt(pb[i], 10);
                if (na > nb) { return 1; }
                if (nb > na) { return -1; }
                if (!isNaN(na) && isNaN(nb)) { return 1; }
                if (isNaN(na) && !isNaN(nb)) { return -1; }
            }
            return 0;
        }

        /**
         * An upgrade is a series of migrations
         */
        pongodb.Upgrade = kendo.Class.extend({

            /**
             * Initialisation
             * @constructor
             * @param options
             */
            init: function (options) {
                this._db = options.db;
                this._migrations = [];
            },

            /**
             * Push migration
             * @param migration
             */
            push: function (migration) {
                migration._db = this._db;
                this._migrations.push(migration);
            },
            // TODO Check application upgrade with ping!!!!!

            /**
             * Execution
             */
            execute: function () {
                var that = this;
                var dfd = $.Deferred();
                that._db.version() // Read from storage
                    .done(function (version) {
                        // Sort migrations by version number
                        var migrations = that._migrations.sort(compareVersions);
                        // Find the next migration
                        var found = false;
                        for (var i = 0, length = migrations.length; i < length; i++) {
                            var migration = migrations[i];
                            if (compareVersions(version, migration._version) < 0) {
                                found = true;
                                logger.info({
                                    method: 'pongodb.Upgrade.execute',
                                    message: 'Starting migration',
                                    data: { version: migration._version }
                                });
                                migration.execute()
                                    .progress(dfd.notify)
                                    .done(function () {
                                        that._db.version(migration._version)
                                            .done(function () {
                                                logger.info({
                                                    method: 'pongodb.Upgrade.execute',
                                                    message: 'Completed migration',
                                                    data: { version: migration._version }
                                                });
                                                // Use recursion to execute the following migration
                                                that.execute()
                                                    .progress(dfd.notify)
                                                    .done(dfd.resolve)
                                                    .fail(dfd.reject);
                                            })
                                            .fail(dfd.reject); // Note: migrations need to be idempotent otherwise this could be a problem
                                    })
                                    .fail(dfd.reject);
                                break;
                            }
                        }
                        // Without migration to execute, we are done
                        if (!found) {
                            dfd.resolve();
                        }
                    })
                    .fail(dfd.reject);
                return dfd.promise();
            }
        });

        /**
         * A migration progresses a database from one version to the next
         * IMPORTANT: Migrations need to be idempotent (can be executed any number of times)
         */
        pongodb.Migration = kendo.Class.extend({

            /**
             * Initialisation
             * @constructor
             * @param options
             */
            init: function (options) {
                this._db = null;
                this._scripts = options.scripts || [];
                this._version = options.version || '0.0.1';
            },

            /**
             * Execution
             */
            execute: function () {
                var dfd = $.Deferred();
                var scripts = this._scripts;
                var promises = [];
                for (var i = 0; i < scripts.length; i++) {
                    // bind is necessary to make this._db available to the migration script
                    promises.push(scripts[i].bind(this)().progress(dfd.notify));
                }
                $.when.apply(this, promises)
                    .done(dfd.resolve)
                    .fail(dfd.reject);
                return dfd.promise();
            }
        });

    }(window.jQuery));

    /* jshint +W071 */

    return pongodb;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

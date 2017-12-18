/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */


(function (f, define) {
    'use strict';
    define([
        './window.assert',
        './window.logger',
        './window.pongodb',
        './app.constants'
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
        var constants = app.constants;
        var NUMBER = 'number';
        var UNDEFINED = 'undefined';
        var LEVEL_CHARS = 4;
        var RX_ZEROS = new RegExp ('0{' + LEVEL_CHARS + '}', 'g');
        var ROOT_CATEGORY_ID = {
            en: (constants.rootCategoryId.en || '').replace(RX_ZEROS, ''),
            fr: (constants.rootCategoryId.fr || '').replace(RX_ZEROS, '')
        };
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
         * Trigger to create/update version from activity
         */
        db.createTrigger(COLLECTION.ACTIVITIES, [TRIGGER.INSERT, TRIGGER.UPDATE], function (activity) {
            var dfd = new $.Deferred();
            var language = activity.version.language;
            var activityId = activity.id;
            var summaryId = activity.version.summaryId;
            var versionId = activity.version.versionId;

            function upsert(activity, version, deferred) {
                if ((activity.type === 'Score' && version.type === 'Test') &&
                    ($.type(constants.authorId) === UNDEFINED || constants.authorId === version.userId) &&
                    ($.type(constants.language) === UNDEFINED || constants.language === language) &&
                    ($.type(constants.rootCategoryId[language]) === UNDEFINED || version.categoryId.startsWith(ROOT_CATEGORY_ID[language]))) {
                    // The activity belongs here
                    version.activities = version.activities || []; // We need an array considering we possibly have several users
                    var found;
                    for (var i = 0, length = version.activities.length; i < length; i++) {
                        if (version.activities[i].actorId === activity.actor.userId) {
                            found = i; // There is already an activity for the current user
                        }
                    }
                    var update = true;
                    if ($.type(found) === NUMBER && new Date(version.activities[found].updated) > activity.updated) {
                        // Keep existing version activity which is more recent
                        update = false;
                    } else if ($.type(found) === NUMBER) {
                        // Update version activity
                        version.activities[found] = { activityId: activity.id, actorId: activity.actor.userId, score: activity.score, updated: activity.updated }; // TODO replace updated with an activity date
                    } else {
                        // Create new version activity
                        version.activities.push({ activityId: activity.id, actorId: activity.actor.userId, score: activity.score, updated: activity.updated });
                    }
                    if (update) {
                        app.db.versions.update({id: versionId }, version, { upsert: true }).done(deferred.resolve).fail(deferred.reject);
                    } else {
                        deferred.resolve(version);
                    }
                } else {
                    // The activity (especially from synchronization does not belong here)
                    app.db.activities.remove({ id: activityId }).done(function () { deferred.resolve(version); }).fail(deferred.reject);
                }
            }

            if (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) ||
                (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
                app.db.versions.findOne({ id: versionId })
                    .done(function (local) {
                        upsert(activity, local, dfd);
                    })
                    .fail(function (err) {
                        dfd.reject(err);
                    });
            } else {
                var versions = app.rapi.v2.versions({language: language, summaryId: summaryId});
                versions.get(versionId)
                    .done(function (remote) {
                        app.db.versions.findOne({ id: versionId })
                            .done(function (local) {
                                var version = $.extend(remote, local);
                                upsert(activity, version, dfd);
                            })
                            .fail(function (err) {
                                // Not found
                                upsert(activity, remote, dfd);
                            });
                    })
                    .fail(dfd.reject);
            }
            return dfd.promise();
        });

        /**
         * Trigger to create/update summary from version
         */
        db.createTrigger(COLLECTION.VERSIONS, [TRIGGER.INSERT, TRIGGER.UPDATE], function (version) {
            var dfd = new $.Deferred();
            var language = version.language;
            var summaryId = version.summaryId;
            if (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) ||
                (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
                // Update local summary
                app.db.summaries.update({ id: summaryId }, { activities: version.activities }).done(dfd.resolve).fail(dfd.reject);
            } else {
                // Get remote summary
                var summaries = app.rapi.v2.summaries({language: language}); //, type: 'Test' });
                summaries.get(summaryId)
                    .done(function(summary) {
                        // Propagate activities from version to summary
                        if (Array.isArray(version.activities)) {
                            summary.activities = version.activities;
                        }
                        app.db.summaries.update({id: summaryId}, summary, { upsert: true }).done(dfd.resolve).fail(dfd.reject);
                    }).fail(dfd.reject);
            }
            return dfd.promise();
        });

        // TODO Triggers;
        // 3. We could use trigger to create/update/remove MobileUser picture

        /**
         * Migrations
         */
        // TODO Migrations

    }(window.jQuery));

    /* jshint +W071 */

    return app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

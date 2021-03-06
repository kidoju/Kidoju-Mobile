/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO We could also use a trigger to create/update/remove MobileUser picture

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import config from './app.config.jsx';
import network from './app.network.es6';
import Database from '../common/pongodb.database.es6';
import Migration from '../common/pongodb.migration.es6';
// import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import BaseModel from '../data/data.base.es6';
import LazySummary from '../data/data.summary.lazy.core.es6';
import AjaxSummaries from '../rapi/rapi.summaries.es6';

const logger = new Logger('app.db');

const RX_ZEROS = new RegExp(`0{${config.constants.levelChars}}`, 'g');
const ROOT_CATEGORY_ID = {
    en: (config.constants.rootCategoryId.en || '').replace(RX_ZEROS, ''),
    fr: (config.constants.rootCategoryId.fr || '').replace(RX_ZEROS, ''),
};

const COLLECTION = {
    ACTIVITIES: 'activities',
    CATEGORIES: 'categories', // TODO
    SUMMARIES: 'summaries',
    USERS: 'users',
    VERSIONS: 'versions',
};
const TRIGGER = {
    INSERT: 'insert',
    UPDATE: 'update',
    REMOVE: 'remove',
};

/**
 * Database definition
 */
const database = new Database({
    name: config.constants.dbName,
    size: 10 * 1024 * 1024,
    collections: Object.values(COLLECTION),
});

/**
 * Full-text indexes
 */
database.addFullTextIndex(COLLECTION.SUMMARIES, [
    'author.lastName',
    'description',
    'tags',
    'title',
]);

/**
 * Trigger to create/update version from activity
 */
database.createTrigger(
    COLLECTION.ACTIVITIES,
    [TRIGGER.INSERT, TRIGGER.UPDATE],
    (doc) => {
        // doc is an activity
        const dfd = new $.Deferred();
        const activityId = doc.id;
        const { language, summaryId, versionId } = doc.version;

        logger.debug({
            message: 'Executing trigger on activity to upsert version',
            method: 'database.createTrigger',
            data: {
                collection: COLLECTION.ACTIVITIES,
                triggers: [TRIGGER.INSERT, TRIGGER.UPDATE],
                id: activityId,
            },
        });

        function upsert(activity, version, deferred) {
            if (
                activity.type === 'Score' &&
                version.type === 'Test' &&
                ($.type(config.constants.authorId) === CONSTANTS.UNDEFINED ||
                    config.constants.authorId === version.userId) &&
                ($.type(config.constants.language) === CONSTANTS.UNDEFINED ||
                    config.constants.language === language) &&
                ($.type(config.constants.rootCategoryId[language]) ===
                    CONSTANTS.UNDEFINED ||
                    version.categoryId.indexOf(ROOT_CATEGORY_ID[language]) ===
                        0)
            ) {
                // The activity belongs here
                version.activities = version.activities || []; // We need an array considering we possibly have several users
                let found;
                for (
                    let i = 0, { length } = version.activities;
                    i < length;
                    i++
                ) {
                    if (
                        version.activities[i].actorId === activity.actor.userId
                    ) {
                        found = i; // There is already an activity for the current user
                    }
                }
                let update = true;
                if (
                    $.type(found) === CONSTANTS.NUMBER &&
                    new Date(version.activities[found].date) > activity.date
                ) {
                    // Keep existing version activity which is more recent
                    update = false;
                } else if ($.type(found) === CONSTANTS.NUMBER) {
                    // Update version activity
                    version.activities[found] = {
                        activityId: activity.id,
                        actorId: activity.actor.userId,
                        score: activity.score,
                        date: activity.date,
                    };
                } else {
                    // Create new version activity
                    version.activities.push({
                        activityId: activity.id,
                        actorId: activity.actor.userId,
                        score: activity.score,
                        date: activity.date,
                    });
                    if (update) {
                        database.versions
                            .update({ id: versionId }, version, {
                                upsert: true,
                            })
                            .then(deferred.resolve)
                            .catch(deferred.reject);
                    } else {
                        deferred.resolve(version);
                    }
                }
            } else {
                // window.alert('Warning! activity is being removed!');
                // The activity (especially from synchronization does not belong here)
                database.activities
                    .remove({ id: activityId })
                    .then(() => {
                        deferred.resolve(version);
                    })
                    .catch(deferred.reject);
                logger.debug({
                    message: 'Removing activity in local database trigger',
                    method: 'database.createTrigger',
                    data: {
                        collection: COLLECTION.ACTIVITIES,
                        triggers: [TRIGGER.INSERT, TRIGGER.UPDATE],
                        id: activityId,
                    },
                });
            }
        }

        if (network.isOffline()) {
            database.versions
                .findOne({ id: versionId })
                .then((local) => {
                    upsert(doc, local, dfd);
                })
                .catch((err) => {
                    dfd.reject(err);
                });
        } else {
            const versions = app.rapi.v2.versions({ language, summaryId });
            versions
                .get(versionId)
                .then((remote) => {
                    database.versions
                        .findOne({ id: versionId })
                        .then((local) => {
                            const version = $.extend(remote, local);
                            upsert(doc, version, dfd);
                        })
                        .catch((err) => {
                            // Not found
                            upsert(doc, remote, dfd);
                        });
                })
                .catch(dfd.reject);
        }
        return dfd.promise();
    }
);

/**
 * Trigger to create/update summary from version
 */
database.createTrigger(
    COLLECTION.VERSIONS,
    [TRIGGER.INSERT, TRIGGER.UPDATE],
    (doc) => {
        // doc is a version
        const dfd = new $.Deferred();
        const { language, summaryId } = doc;
        const versionId = doc.id;

        logger.debug({
            message: 'Executing trigger on version to upsert summary',
            method: 'database.createTrigger',
            data: {
                collection: COLLECTION.VERSIONS,
                triggers: [TRIGGER.INSERT, TRIGGER.UPDATE],
                id: versionId,
            },
        });

        if (network.isOffline()) {
            // Update local summary
            database.summaries
                .update({ id: summaryId }, { activities: doc.activities })
                .then(dfd.resolve)
                .catch(dfd.reject);
        } else {
            // Get remote summary
            // const ajaxSummaries = config.uris.rapi.v1.summaries({
            //    language,
            //    type: 'Test',
            // });
            const ajaxSummaries = new AjaxSummaries({
                // partition: getLanguageReference(),
                partition: { language },
                projection: BaseModel.projection(LazySummary),
            });
            ajaxSummaries
                .get(summaryId)
                .then((summary) => {
                    // Propagate activities from version to summary
                    if (Array.isArray(doc.activities)) {
                        summary.activities = doc.activities;
                    }
                    database.summaries
                        .update({ id: summaryId }, summary, { upsert: true })
                        .then(dfd.resolve)
                        .catch(dfd.reject);
                })
                .catch(dfd.reject);
        }
        return dfd.promise();
    }
);

/**
 * Migration to v0.3.8 (initial)
 */
database.addMigration(
    new Migration({
        version: '0.3.8',
        scripts: [
            (db) => {
                logger.info({
                    method: 'database.upgrade.push',
                    message: `Migrating database to ${db._version}`,
                });
                // Basically this first script initializes the database to version 0.3.4
                // return $.Deferred().notify({ version: db._version, pass: 1, percent: 1 }).reject(new Error('oops')).promise();
                return $.Deferred()
                    .notify({ version: db._version, pass: 1, percent: 1 })
                    .resolve()
                    .promise();
            },
        ],
    })
);

/**
 * Default export
 */
export default database;

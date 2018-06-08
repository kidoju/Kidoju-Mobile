/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// eslint-disable-next-line import/extensions
import $ from 'jquery';
import assert from './window.assert.es6';
import Database from './window.pongodb.database.es6';
import Migration from './window.pongodb.migration.es6';
import { compareVersions } from './window.pongodb.util.es6';

/**
 * Upgrade
 * An upgrade is a series of migrations
 * @class
 */
export default class Upgrade {
    /**
     * Constructor
     * @contructor
     * @param options
     */
    constructor(options) {
        assert.isPlainObject(
            options,
            assert.format(assert.messages.isPlainObject.default, 'options')
        );
        assert.instanceof(
            Database,
            options.db,
            assert.format(
                assert.messages.instanceof.default,
                'options.db',
                'Database'
            )
        );
        this._db = options.db;
        this._migrations = [];
    }

    /**
     * Push a migration
     * @param migration
     */
    push(migration) {
        assert.instanceof(
            Migration,
            migration,
            assert.format(
                assert.messages.instanceof.default,
                'migration',
                'Migration'
            )
        );
        // eslint-disable-next-line no-param-reassign
        migration._db = this._db;
        this._migrations.push(migration);
    }

    /**
     * Execute (execute all migrations)
     * @returns {*}
     */
    execute() {
        const that = this;
        const dfd = $.Deferred();
        that._db
            .version() // Read from storage
            .done(version => {
                // Sort migrations by version number
                const migrations = that._migrations.sort(compareVersions);
                var execute = function (migration) {

                };
                // Find the next migration
                var found = false;
                for (var i = 0, length = migrations.length; i < length; i++) {
                    var migration = migrations[i];
                    if (compareVersions(version, migration._version) < 0) {
                        found = true;
                        logger.info({
                            method: 'execute',
                            message: 'Starting migration',
                            data: { version: migration._version }
                        });
                        migration
                            .execute()
                            .progress(dfd.notify)
                            .done(() => {
                                that._db
                                    .version(migration._version)
                                    .done(() => {
                                        logger.info({
                                            method: 'execute',
                                            message: 'Completed migration',
                                            data: {
                                                version: migration._version
                                            }
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
}

/**
 * Maintain compatibility with legacy code
 */
window.pongodb = window.pongodb || {};
window.pongodb.Upgrade = Upgrade;

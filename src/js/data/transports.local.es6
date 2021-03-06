/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { dateReviver } from '../common/window.util.es6';
import { error2xhr, SYNC_STATE } from './data.util.es6';
import LazyLocalTransport from './transports.local.lazy.es6';

const logger = new Logger('transports.local');

/**
 * LocalTransport (using pongodb and localForage)
 */
const LocalTransport = LazyLocalTransport.extend({
    /**
     * Create
     * @param options
     */
    create(options) {
        assert.crud(options);
        logger.debug({
            message: 'Create local data',
            method: 'LocalTransport.create',
            data: options.data,
        });
        // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
        const item = JSON.parse(
            JSON.stringify(this.parameterMap(options.data, 'create')),
            dateReviver
        );
        /*
        if (item.updated) {
            item.updated = new Date();
        }
        */
        if (!item[this.idField()]) {
            item[SYNC_STATE.FIELD] = SYNC_STATE.CREATED;
        }
        // Validate item against partition
        const err = this._validate(item);
        if (err) {
            options.error(...error2xhr(err));
        } else {
            // Unless we give one ourselves, the collection will give the item an id
            this._collection
                .insert(item)
                .then((created) => {
                    // Note: created is the item with an id
                    options.success(created);
                })
                .catch((error) => {
                    options.error(...error2xhr(error));
                });
        }
    },

    /**
     * Destroy
     * @param options
     */
    destroy(options) {
        assert.crud(options);
        logger.debug({
            message: 'Destroy local data',
            method: 'LocalTransport.destroy',
            data: options.data,
        });
        // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
        const item = JSON.parse(
            JSON.stringify(this.parameterMap(options.data, 'destroy')),
            dateReviver
        );
        const idField = this.idField();
        const id = item[idField];
        if (item[SYNC_STATE.FIELD] === SYNC_STATE.CREATED) {
            // Items with __state__ === 'created' can be safely removed because they do not exist on the remote server
            if (CONSTANTS.RX_MONGODB_ID.test(id)) {
                const query = {};
                query[idField] = id;
                this._collection
                    .remove(query)
                    .then((response) => {
                        if (response && response.nRemoved === 1) {
                            options.success(response);
                        } else {
                            options.error(
                                ...error2xhr(new Error(CONSTANTS.NOT_FOUND_ERR))
                            );
                        }
                    })
                    .catch((error) => {
                        options.error(...error2xhr(error));
                    });
            } else {
                // No need to hit the database, it won't be found
                options.error(...error2xhr(new Error(CONSTANTS.NOT_FOUND_ERR)));
            }
        } else {
            if (item.updated) {
                item.updated = new Date();
            }
            item[SYNC_STATE.FIELD] = SYNC_STATE.DESTROYED;
            // Validate item against partition
            const err = this._validate(item);
            if (err) {
                options.error(...error2xhr(err));
            } else if (CONSTANTS.RX_MONGODB_ID.test(id)) {
                const query = {};
                query[idField] = id;
                this._collection
                    .update(query, item)
                    .then((response) => {
                        if (
                            response &&
                            response.nMatched === 1 &&
                            response.nModified === 1
                        ) {
                            options.success(response);
                        } else {
                            options.error(
                                ...error2xhr(new Error(CONSTANTS.NOT_FOUND_ERR))
                            );
                        }
                    })
                    .catch((error) => {
                        options.error(...error2xhr(error));
                    });
            } else {
                // No need to hit the database, it won't be found
                options.error(...error2xhr(new Error(CONSTANTS.NOT_FOUND_ERR)));
            }
        }
    },

    /**
     * Update
     * @param options
     */
    update(options) {
        assert.crud(options);
        logger.debug({
            message: 'Update local data',
            method: 'LocalTransport.update',
            data: options.data,
        });
        // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
        const item = JSON.parse(
            JSON.stringify(this.parameterMap(options.data, 'update')),
            dateReviver
        );
        if (item.updated) {
            item.updated = new Date();
        }
        if ($.type(item[SYNC_STATE.FIELD]) === CONSTANTS.UNDEFINED) {
            // Do not change the state of created and destroyed items
            item[SYNC_STATE.FIELD] = SYNC_STATE.UPDATED;
        }
        // Validate item against partition
        const err = this._validate(item);
        const idField = this.idField();
        const id = item[idField];
        if (err) {
            options.error(...error2xhr(err));
        } else if (CONSTANTS.RX_MONGODB_ID.test(id)) {
            const query = {};
            query[idField] = id;
            delete item[idField];
            this._collection
                .update(query, item, { upsert: true })
                .then((response) => {
                    if (
                        response &&
                        response.nMatched === 1 &&
                        response.nModified + response.nUpserted === 1
                    ) {
                        item[idField] = id;
                        options.success(item);
                    } else {
                        options.error(
                            ...error2xhr(new Error(CONSTANTS.NOT_FOUND_ERR))
                        );
                    }
                })
                .catch((error) => {
                    options.error(...error2xhr(error));
                });
        } else {
            // No need to hit the database, it won't be found
            options.error(...error2xhr(new Error(CONSTANTS.NOT_FOUND_ERR)));
        }
    },
});

/**
 * Default export
 */
export default LocalTransport;

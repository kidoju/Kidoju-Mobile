/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Writes in local database and makes available for sync to remote

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { SYNC_STATE } from './data.util.es6';
import LocalTransport from './transports.local.es6';
import RemoteTransport from './transports.remote.es6';

const {
    Class,
    // data: { Query }
} = window.kendo;
const logger = new Logger('strategy.upstream');

// TODO Consider using the network plugin
/*
function isOffline() {
    return (
        ('Connection' in window &&
            window.navigator.connection.type === window.Connection.NONE) ||
        (window.device &&
            window.device.platform === 'browser' &&
            !window.navigator.onLine)
    );
}
*/

/**
 * UpstreamStrategy
 * A synchronization strategy using pongodb (and localForage)
 * used for activities
 * @class UpstreamStrategy
 * @extends Class
 */
const UpstreamStrategy = Class.extend({
    /**
     * Initialization
     * @constructor
     * @param options
     */
    init(options) {
        assert.isNonEmptyPlainObject(
            options,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options'
            )
        );
        assert.instanceof(
            LocalTransport,
            options.localTransport,
            assert.format(
                assert.messages.instanceof.default,
                'options.localTransport',
                'LocalTransport'
            )
        );
        assert.instanceof(
            RemoteTransport,
            options.remoteTransport,
            assert.format(
                assert.messages.instanceof.default,
                'options.remoteTransport',
                'RemoteTransport'
            )
        );
        this._localTransport = options.localTransport;
        this._remoteTransport = options.remoteTransport;
    },

    /**
     * Gets/sets the partition (kind of permanent filter)
     * @param value
     */
    partition(value) {
        return this._remoteTransport.partition(value);
    },

    /**
     * Gets/sets the projection (list of fields to return)
     * @param value
     */
    projection(value) {
        return this._remoteTransport.projection(value);
    },

    /**
     * Create
     * @param options
     */
    create(options) {
        this._localTransport.create(options);
    },

    /**
     * Destroy
     * @param options
     */
    destroy(options) {
        this._localTransport.destroy(options);
    },

    /**
     * Get
     * @param options
     */
    get(options) {
        this._localTransport.get(options);
    },

    /**
     * Read
     * @param options
     */
    read(options) {
        this._localTransport.read(options);
    },

    /**
     * Update
     * @param options
     */
    update(options) {
        this._localTransport.update(options);
    },

    /**
     * Gets/sets the last synchronization date
     * @param value
     * @returns {*|{type, defaultValue}}
     */
    lastSync(value) {
        let ret;
        if ($.type(value) === CONSTANTS.UNDEFINED) {
            ret = this._lastSync;
        } else if ($.type(value) === CONSTANTS.DATE) {
            this._lastSync = value;
        } else {
            throw new TypeError('`value` should be a `Date`');
        }
        return ret;
    },

    /**
     * Upload a created item
     * @param item
     * @private
     */
    _createSync(item) {
        assert.isNonEmptyPlainObject(
            item,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'item')
        );
        assert.equal(
            SYNC_STATE.CREATED,
            item.__state__,
            assert.format(
                assert.messages.equal.default,
                'item.__state__',
                'created'
            )
        );
        const dfd = $.Deferred();
        const collection = this._collection;
        const { idField } = this;
        const mobileId = item[idField];
        item[idField] = null;
        delete item.__state__;
        this._remoteTransport.create({
            data: item,
            error(err) {
                dfd.reject(err);
            },
            success(response) {
                // Note: we do not prioritize deletion and creation but we should probably create before deleting
                // as it is probably better to have a duplicate than a missing record
                $.when(
                    collection.remove({ id: mobileId }),
                    collection.insert(response.data[0])
                )
                    .then(dfd.resolve)
                    .catch(dfd.reject);
            },
        });
        return dfd.promise();
    },

    /**
     * Upload a destroyed item
     * @param item
     * @private
     */
    _destroySync(item) {
        assert.isNonEmptyPlainObject(
            item,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'item')
        );
        assert.equal(
            SYNC_STATE.DESTROYED,
            item.__state__,
            assert.format(
                assert.messages.equal.default,
                'item.__state__',
                'destroyed'
            )
        );
        const dfd = $.Deferred();
        const collection = this._collection;
        const { idField } = this;
        delete item.__state__;
        this._remoteTransport.destroy({
            data: item,
            error(err) {
                if (err.message === '404') {
                    // TODO -----------------------------------------------------------------------------------
                    // If item is not found on the server, remove from local database
                    collection
                        .remove({ id: item[idField] })
                        .then(dfd.resolve)
                        .catch(dfd.reject);
                } else {
                    dfd.reject(err);
                }
            },
            success(response) {
                collection
                    .remove({ id: item[idField] })
                    .then(dfd.resolve)
                    .catch(dfd.reject);
            },
        });
        return dfd.promise();
    },

    /**
     * Download remote items
     * @private
     */
    _readSync() {
        const that = this;
        const dfd = $.Deferred();
        const collection = this._collection;
        const { idField } = this;
        this._remoteTransport.read({
            data: {
                filter: {
                    field: 'updated',
                    operator: 'gte',
                    value: that._lastSync,
                },
                sort: { field: 'updated', dir: 'desc' },
            },
            success(response) {
                const result = response.data; // this.remoteTransport.read ensures data is already partitioned
                let total = result.length;
                const promises = [];
                function update(index) {
                    const item = result[index];
                    return collection
                        .update({ id: item[idField] }, item, { upsert: true })
                        .always(function () {
                            dfd.notify({
                                collection: collection.name(),
                                pass: 2,
                                index,
                                total,
                            });
                        });
                }
                for (let idx = 0; idx < total; idx++) {
                    promises.push(update(idx));
                }
                $.when
                    .apply(that, promises)
                    .always(function () {
                        // Note: dfd.notify is ignored if called after dfd.resolve or dfd.reject
                        total = total || 1; // Cannot divide by 0;
                        dfd.notify({
                            collection: collection.name(),
                            pass: 2,
                            index: total - 1,
                            total,
                        }); // Make sure we always reach 100%
                        if (total >= 90) {
                            // Don not wait till we reach 100 to act
                            // TODO we certainly have an issue with paging in this case, because we only synced the first 90 items and there are more
                            // See https://github.com/kidoju/Kidoju-Mobile/issues/161
                            logger.crit({
                                message:
                                    'Time to add paging to synchronization',
                                method:
                                    'models.UpstreamStrategy._readSync',
                                data: { total },
                            });
                        }
                    })
                    .then(dfd.resolve)
                    .catch(dfd.reject);
            },
            error: dfd.reject,
        });
        return dfd.promise();
    },

    /**
     * Upload an updated item
     * @param item
     * @private
     */
    _updateSync(item) {
        assert.isNonEmptyPlainObject(
            item,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'item')
        );
        assert.equal(
            SYNC_STATE.UPDATED,
            item.__state__,
            assert.format(
                assert.messages.equal.default,
                'item.__state__',
                'updated'
            )
        );
        const dfd = $.Deferred();
        const collection = this._collection;
        const { idField } = this;
        const query = {};
        delete item.__state__;
        this._remoteTransport.update({
            data: item,
            error(err) {
                if ((err.message = '404')) {
                    // TODO ----------------------------------------------------------------
                    // If item is not found on the server, remove from local database
                    query[idField] = item[idField];
                    collection
                        .remove(query)
                        .then(dfd.resolve)
                        .catch(dfd.reject);
                } else {
                    dfd.reject(err);
                }
            },
            success(response) {
                query[idField] = response.data[0][idField];
                collection
                    .update(query, response.data[0])
                    .then(dfd.resolve)
                    .catch(dfd.reject);
            },
        });
        return dfd.promise();
    },

    /**
     * Synchronize
     * Note: the only limitation of our algorithm is we cannot identify items deleted on the server
     */
    sync() {
        const that = this;
        const dfd = $.Deferred();
        const collection = that._collection;
        const partition = that.remoteTransport._partition;
        this._collection
            .find(partition, this.projection())
            .then((items) => {
                const promises = [];
                let total = items.length;
                function syncItem(index) {
                    let ret;
                    const item = items[index];
                    if (item.__state__ === SYNC_STATE.CREATED) {
                        ret = that._createSync(item).always(function () {
                            dfd.notify({
                                collection: collection.name(),
                                pass: 1,
                                index,
                                total,
                            });
                        });
                    } else if (item.__state__ === SYNC_STATE.DESTROYED) {
                        ret = that._destroySync(item).always(function () {
                            dfd.notify({
                                collection: collection.name(),
                                pass: 1,
                                index,
                                total,
                            });
                        });
                    } else if (item.__state__ === SYNC_STATE.UPDATED) {
                        ret = that._updateSync(item).always(function () {
                            dfd.notify({
                                collection: collection.name(),
                                pass: 1,
                                index,
                                total,
                            });
                        });
                    }
                    return ret;
                }
                for (let idx = 0; idx < total; idx++) {
                    const promise = syncItem(idx);
                    if (promise) {
                        promises.push(promise);
                    }
                }
                $.when(...promises)
                    .always(() => {
                        // Note: dfd.notify is ignored if called after dfd.resolve or dfd.reject
                        total = total || 1; // Cannot divide by 0;
                        dfd.notify({
                            collection: collection.name(),
                            pass: 1,
                            index: total - 1,
                            total,
                        }); // Make sure we always reach 100%
                    })
                    .then(() => {
                        that._readSync()
                            .progress(dfd.notify)
                            .then(dfd.resolve)
                            .catch(dfd.reject);
                    })
                    .catch(dfd.reject);
            })
            .catch(dfd.reject);
        return dfd.promise();
    },
});

/**
 * Default export
 */
export default UpstreamStrategy;

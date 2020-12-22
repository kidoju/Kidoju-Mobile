/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import assert from '../common/window.assert.es6';
import Logger from '../common/window.logger.es6';
import LocalTransport from './transports.local.es6';
import LazyRemoteTransport from './transports.remote.lazy.es6';

const {
    Class,
    // data: { Query }
} = window.kendo;
const logger = new Logger('strategy.mobileme');

// TODO Consider using the network plugin
function isOffline() {
    return (
        ('Connection' in window &&
            window.navigator.connection.type === window.Connection.NONE) ||
        (window.device &&
            window.device.platform === 'browser' &&
            !window.navigator.onLine)
    );
}

/**
 * MobileMeStrategy
 * Like a read-only cache strategy using local database when offline
 * @class MobileMeStrategy
 * @extends Class
 */
const MobileMeStrategy = Class.extend({
    /**
     * Init
     * @constructor init
     * @param options
     */
    init(options = {}) {
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
            LazyRemoteTransport,
            options.remoteTransport,
            assert.format(
                assert.messages.instanceof.default,
                'options.remoteTransport',
                'LazyRemoteTransport'
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
    create(/* options */) {
        throw new Error('Use get to create users');
    },

    /**
     * Destroy
     * @param options
     */
    destroy(options) {
        assert.crud(options);
        logger.debug({
            message: 'destroy data',
            method: 'destroy',
            data: options.data,
        });
        // Always destroy users with _localTransport
        const { _localTransport } = this;
        _localTransport.destroy({
            data: options.data,
            error: options.error,
            success: options.success,
        });
    },

    /**
     * Get
     * @param options
     */
    get(options) {
        assert.crud(options);
        logger.debug({
            message: 'get data',
            method: 'get',
            data: options.data,
        });
        const { _localTransport, _remoteTransport } = this;
        _localTransport.get({
            data: options.data,
            error(xhr, status, errorThrown) {
                if (isOffline()) {
                    options.error(xhr, status, errorThrown);
                } else {
                    _remoteTransport.get({
                        data: options.data,
                        error: options.error,
                        success(onlineResponse) {
                            _localTransport.create({
                                // merge responses and update (upsert)
                                data: onlineResponse,
                                error: options.error,
                                success: options.success,
                                /*
                                success(created) {
                                    assert.equal(
                                        1,
                                        (created || {}).total,
                                        assert.format(
                                            assert.messages.equal.default,
                                            'created.total',
                                            '1'
                                        )
                                    );
                                    options.success(created.data[0]);
                                },
                                */
                            });
                        },
                    });
                }
            },
            success(offlineResponse) {
                if (isOffline()) {
                    options.success(offlineResponse);
                } else {
                    _remoteTransport.get({
                        data: options.data,
                        // error: options.error,
                        error() {
                            // We do not care if we have an error here
                            // We simply won't merge the online response
                            options.success(offlineResponse);
                        },
                        success(onlineResponse) {
                            _localTransport.update({
                                // merge responses and update (upsert)
                                data: { ...offlineResponse, ...onlineResponse },
                                error: options.error,
                                success: options.success,
                                /*
                                success(updated) {
                                    assert.equal(
                                        1,
                                        (updated || {}).total,
                                        assert.format(
                                            assert.messages.equal.default,
                                            'updated.total',
                                            '1'
                                        )
                                    );
                                    options.success(updated.data[0]);
                                },
                                */
                            });
                        },
                    });
                }
            },
        });
    },

    /**
     * Read
     * @param options
     */
    read(options) {
        assert.crud(options);
        logger.debug({
            message: 'read data',
            method: 'read',
            data: options.data,
        });
        // Always read users with _localTransport
        const { _localTransport } = this;
        _localTransport.read({
            data: options.data,
            error: options.error,
            success: options.success,
        });
    },


    /**
     * Update
     * @param options
     */
    update(options) {
        assert.crud(options);
        logger.debug({
            message: 'update data',
            method: 'update',
            data: options.data,
        });
        // Always update users using _localTransport
        const { _localTransport } = this;
        _localTransport.update({
            data: options.data,
            error: options.error,
            success: options.success,
        });
    },
});

/**
 * Default export
 */
export default MobileMeStrategy;

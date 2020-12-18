/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import LocalTransport from './transports.local.es6';
import LazyRemoteTransport from './transports.remote.lazy.es6';

const {
    Class,
    // data: { Query }
} = window.kendo;
const logger = new Logger('strategy.downstream.lazy');

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
 * LazyDownstreamStrategy
 * Like a read-only cache strategy using local database when offline
 * @class LazyDownstreamStrategy
 * @extends Class
 */
const LazyDownstreamStrategy = Class.extend({
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
     * Get
     * @param options
     */
    get(options) {
        assert.crud(options);
        logger.debug({
            message: 'get data',
            method: 'get',
            data: options.data, // TODO add isOffline
        });
        const { _localTransport, _remoteTransport } = this;
        _localTransport.get({
            data: options.data,
            error: options.error,
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
                                success(updatedResponse) {
                                    assert.equal(
                                        1,
                                        updatedResponse &&
                                            updatedResponse.total,
                                        assert.format(
                                            assert.messages.equal.default,
                                            'updatedResponse.total',
                                            '1'
                                        )
                                    );
                                    options.success(updatedResponse.data[0]);
                                },
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
            data: options.data, // TODO add isOffline
        });
        const { _localTransport, _remoteTransport } = this;
        _localTransport.read({
            data: options.data,
            error: options.error,
            success(offlineResponse) {
                if (isOffline()) {
                    options.success(offlineResponse);
                } else {
                    _remoteTransport.read({
                        data: options.data,
                        error: options.error,
                        success(onlineResponse) {
                            const promises = [];
                            function upsert(index) {
                                const dfd = $.Deferred();
                                // TODO: This should be an upsert, merging offline and online data
                                _localTransport.update({
                                    data: onlineResponse.data[index],
                                    error: dfd.reject,
                                    success: dfd.resolve,
                                });
                                return dfd.promise();
                            }
                            for (
                                let idx = 0, { length } = onlineResponse.data;
                                idx < length;
                                idx++
                            ) {
                                // avoid anonymous functions in for oops
                                promises.push(upsert(idx));
                            }
                            $.when(...promises).always(() => {
                                // Note: ignore errors caching the response
                                options.success(onlineResponse);
                            });
                        },
                    });
                }
            },
        });
    },
});

/**
 * Default export
 */
export default LazyDownstreamStrategy;

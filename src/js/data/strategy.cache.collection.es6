/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO: force if network error (especially for mobile app) !!!!!

// Items seem to magically persist althouth transports are created with each test
// transports.array.es6 loads a map of collections in memory and each transport accesses this same map

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import assert from '../common/window.assert.es6';
import { localCache, sessionCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseTransport from './transports.base.es6';

const {
    Class,
    data: { Query },
} = window.kendo;

/**
 * CacheCollectionStrategy
 * Reads an entire collection using window.cache.es6
 * This is especially used for categories
 * @class CacheCollectionStrategy
 * extends Class
 */
const CacheCollectionStrategy = Class.extend({
    /**
     * Init
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
        assert.type(
            CONSTANTS.STRING,
            options.key,
            assert.format(
                assert.messages.type.default,
                'options.key',
                CONSTANTS.STRING
            )
        );
        assert.instanceof(
            BaseTransport,
            options.transport,
            assert.format(
                assert.messages.instanceof.default,
                'options.transport',
                'BaseTransport'
            )
        );
        // Class.fn.init.call(this, options);
        this._key = options.key;
        this._transport = options.transport;
        // Optional
        this._cache = options.cache === 'session' ? sessionCache : localCache;
        this._ttl = options.ttl;
    },

    /**
     * key
     * @returns {*}
     */
    key() {
        return this._key;
    },

    /**
     * transport
     * @returns {*}
     */
    transport() {
        return this._transport;
    },

    /**
     * Read
     * @param options
     */
    read(options) {
        assert.crud(options);
        const { _cache, _key, _ttl } = this;
        const data = this._cache.getItem(_key);
        // if ($.type(data) !== CONSTANTS.NULL) {
        if (Array.isArray(data)) {
            const query = Query.process(
                data,
                // total is undefined when filter is undefined
                $.extend({ filter: {} }, options.data)
            );
            options.success(query);
        } else {
            this._transport.read({
                data: options.data,
                success(...args) {
                    _cache.setItem(_key, args[0].data, _ttl);
                    options.success(...args);
                },
                error: options.error,
            });
        }
    },
});

/**
 * Default export
 */
export default CacheCollectionStrategy;

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import 'kendo.core';
import assert from '../common/window.assert.es6';
import { localCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseTransport from './transports.base.es6';

const { Class } = window.kendo;

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
        this._ttl = options.ttl; // Optional
    },

    /**
     * Read
     * @param options
     */
    read(options) {
        assert.crud(options);
        assert.isEmptyObject(
            options.data,
            assert.format(assert.messages.isEmptyObject.default, 'options.data')
        );
        const key = this._key;
        const ttl = this._ttl;
        const data = localCache.getItem(key);
        if (Array.isArray(data)) {
            options.success({ data, total: data.length });
        } else {
            this._transport.read({
                data: options.data,
                success(...args) {
                    localCache.setItem(key, args[0].data, ttl);
                    options.success(...args);
                },
                error: options.error
            });
        }
    }
});

/**
 * Default export
 */
export default CacheCollectionStrategy;

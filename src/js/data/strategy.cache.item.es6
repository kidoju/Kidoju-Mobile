/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
import assert from '../common/window.assert.es6';
import { localCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseTransport from './transports.base.es6';

const { Class } = window.kendo;

/**
 * CacheItemStrategy
 * Creates/destroy/reads/updates an item using window.cache.es6
 * @class CacheItemStrategy
 * extends Class
 */
const CacheItemStrategy = Class.extend({
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
        Class.fn.init.call(this, options);
        this._key = options.key;
        this._transport = options.transport;
        // optional ttl
        this._ttl = options.ttl;
    },

    /**
     * Create
     * @param options
     */
    create(options) {
        assert.crud(options);
        const key = this._key;
        const ttl = this._ttl;
        const idField = this.transport._idField;
        this._transport.create({
            data: options.data,
            success(...args) {
                options.success(...args);
                localCache.setItem(`${key}.${args[0][idField]}`, args[0], ttl);
            },
            error: options.error
        });
    },

    /**
     * Destroy
     * @param options
     */
    destroy(options) {
        assert.crud(options);
        /*
        const key = this._key;
        const ttl = this._ttl;
        const idField = this.transport._idField;
        this._transport.create({
            data: options.data,
            success(...args) {
                options.success(...args);
                localCache.setItem(`${key}.${args[0][idField]}`, args[0], ttl);
            },
            error: options.error
        });
        */
    },

    /**
     * Get
     * @param options
     */
    get(options) {
        assert.crud(options);
        /*
        const key = this._key;
        const ttl = this._ttl;
        const idField = this.transport._idField;
        this._transport.create({
            data: options.data,
            success(...args) {
                options.success(...args);
                localCache.setItem(`${key}.${args[0][idField]}`, args[0], ttl);
            },
            error: options.error
        });
        */
    },

    /**
     * Read
     * @param options
     */
    read(options) {
        assert.crud(options);
        /*
        const key = this._key;
        const ttl = this._ttl;
        const idField = this.transport._idField;
        this._transport.create({
            data: options.data,
            success(...args) {
                options.success(...args);
                localCache.setItem(`${key}.${args[0][idField]}`, args[0], ttl);
            },
            error: options.error
        });
        */
    },

    /**
     * Update
     * @param options
     */
    update(options) {
        assert.crud(options);
        /*
        const key = this._key;
        const ttl = this._ttl;
        const idField = this.transport._idField;
        this._transport.create({
            data: options.data,
            success(...args) {
                options.success(...args);
                localCache.setItem(`${key}.${args[0][idField]}`, args[0], ttl);
            },
            error: options.error
        });
         */
    }
});

/**
 * Default export
 */
export default CacheItemStrategy;

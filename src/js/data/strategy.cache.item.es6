/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO: we need to clear cache from old entries in init
// TODO page/pageSize
// TODO Maybe should inherit from BaseTransport ???????????????

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
 * CacheItemStrategy
 * Creates/destroy/reads/updates an item using window.cache.es6
 * @class CacheItemStrategy
 * @extends Class
 */
const CacheItemStrategy = Class.extend({
    /**
     * Init
     * @constructor init
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
        // optional
        this._cache = options.cache === 'session' ? sessionCache : localCache;
        this._singleton = !!options.singleton;
        this._ttl = options.ttl;
    },

    /**
     * key
     * @method key
     * @returns {*}
     */
    key() {
        return this._key;
    },

    /**
     * Paramter map
     * @method parameterMap
     * @param data
     * @param method
     * @returns {*}
     */
    parameterMap(data, method) {
        return this._transport.parameterMap(data, method);
    },

    /**
     * Partition
     * @method partition
     * @param value
     * @returns {*}
     */
    partition(value) {
        let ret;
        if ($.type(value) === CONSTANTS.UNDEFINED) {
            ret = this._transport.partition();
        } else {
            this._transport.partition(value);
        }
        return ret;
    },

    /**
     * Projection
     * @method projection
     * @param value
     * @returns {*}
     */
    projection(value) {
        let ret;
        if ($.type(value) === CONSTANTS.UNDEFINED) {
            ret = this._transport.projection();
        } else {
            this._transport.projection(value);
        }
        return ret;
    },

    /**
     * Transport
     * @method transport
     * @returns {*}
     */
    transport() {
        return this._transport;
    },

    /**
     * Create
     * @method create
     * @param options
     */
    create(options) {
        assert.crud(options);
        // options.data[idField] might be undefined
        // and we might want to rely on transport to create it
        const {
            _cache,
            _key,
            _singleton,
            _ttl,
            _transport: { _idField },
        } = this;
        this._transport.create({
            data: options.data,
            success(...args) {
                options.success(...args);
                const key = _singleton ? _key : `${_key}.${args[0][_idField]}`;
                _cache.setItem(key, args[0], _ttl);
            },
            error: options.error,
        });
    },

    /**
     * Destroy
     * @method destroy
     * @param options
     */
    destroy(options) {
        assert.crud(options);
        // options.data[idField] must be defined
        const {
            _cache,
            _key,
            _singleton,
            _transport: { _idField },
        } = this;
        // const key = _singleton ? _key : `${_key}.${options.data[_idField]}`;
        this._transport.destroy({
            data: options.data,
            success(...args) {
                options.success(...args);
                const key = _singleton ? _key : `${_key}.${args[0][_idField]}`;
                _cache.removeItem(key);
            },
            error: options.error,
        });
    },

    /**
     * Get
     * @method get
     * @param options
     */
    get(options) {
        assert.crud(options);
        // options.data[idField] must be defined
        const {
            _cache,
            _key,
            _singleton,
            _ttl,
            _transport: { _idField },
        } = this;
        const key = _singleton ? _key : `${_key}.${options.data[_idField]}`;
        const item = _cache.getItem(key);
        if (item) {
            options.success(item);
        } else {
            this._transport.get({
                data: options.data,
                success(...args) {
                    options.success(...args);
                    _cache.setItem(key, args[0], _ttl);
                },
                error: options.error,
            });
        }
    },

    /**
     * Read
     * @method read
     * @param options
     */
    read(options) {
        assert.crud(options);
        const {
            _cache,
            _key,
            _singleton,
            _ttl,
            _transport: { _idField },
        } = this;
        const rx = new RegExp(`^${_key}\\.`);
        const data = _singleton ? [_cache.getItem(_key)] : _cache.getItems(rx);
        if (Array.isArray(data) && data.length) {
            const query = Query.process(
                data,
                // total is undefined when filter is undefined
                $.extend({ filter: {} }, options.data)
            );
            // console.dir(query);
            options.success(query);
        } else {
            this._transport.read({
                data: options.data,
                success(...args) {
                    if (_singleton && args[0].data.length > 1) {
                        throw new Error(
                            'Cannot cache several items as singleton.'
                        );
                    }
                    options.success(...args);
                    args[0].data.forEach((item) => {
                        const key = _singleton
                            ? _key
                            : `${_key}.${item[_idField]}`;
                        _cache.setItem(key, item, _ttl);
                    });
                },
                error: options.error,
            });
        }
    },

    /**
     * Update
     * @method update
     * @param options
     */
    update(options) {
        assert.crud(options);
        // options.data[idField] must be defined
        const {
            _cache,
            _key,
            _singleton,
            _ttl,
            _transport: { _idField },
        } = this;
        // const key = _singleton ? _key : `${_key}.${options.data[_idField]}`;
        this._transport.update({
            data: options.data,
            success(...args) {
                options.success(...args);
                const key = _singleton ? _key : `${_key}.${args[0][_idField]}`;
                _cache.setItem(key, args[0], _ttl);
            },
            error: options.error,
        });
    },
});

/**
 * Default export
 */
export default CacheItemStrategy;

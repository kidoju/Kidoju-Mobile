/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import assert from './window.assert.es6';
import CONSTANTS from './window.constants.es6';
import Logger from './window.logger.es6';
import { dateReviver } from './window.util.es6';
import md5 from '../vendor/blueimp/md5';

const logger = new Logger('window.cache');
const DEFAULTS = {
    cache: !(window.app || {}).NOCACHE,
    silent: false,
    ttl: 24 * 60 * 60 // 1 day in seconds
};

/**
 * Cache in localStorage
 */
class LocalCache {
    /**
     * Constructor
     * @param options
     */
    constructor(options = {}) {
        this._cache = options.cache || DEFAULTS.cache;
        this._silent = options.silent || DEFAULTS.silent;
        this._storeName = 'localStorage';
        this._store = window[this._storeName];
        this._ttl = options.ttl || DEFAULTS.ttl;
    }

    /**
     * Get item from cache
     * @param key
     */
    getItem(key) {
        assert.type(
            CONSTANTS.STRING,
            key,
            assert.format(assert.messages.type.default, 'key', CONSTANTS.STRING)
        );
        let value = null; // Key not found returns null
        try {
            if (this._cache) {
                const json = this._store.getItem(key);
                // eslint-disable-next-line valid-typeof
                if (typeof json === CONSTANTS.STRING) {
                    // Parse the value found for that key
                    // dateReviver is used to convert ISO strings to dates
                    const parsed = JSON.parse(json, dateReviver);
                    const { sig } = parsed;
                    delete parsed.sig;
                    if (
                        Date.now() < parsed.ts + 1000 * this._ttl && // Not expired
                        md5(JSON.stringify(parsed)) === sig // Not tampered with
                    ) {
                        ({ value } = parsed);
                    } else {
                        // No need to keep an expired or tampered value
                        this._store.removeItem(key);
                    }
                }
            }
        } catch (error) {
            logger.error({
                message: `Error getting value from ${this._storeName} cache`,
                method: 'getItem',
                error
            });
            if (!this._silent) {
                throw error;
            }
        }
        return value;
    }

    /**
     * Set item in cache
     * @param key
     * @param value
     * @param ttl
     */
    setItem(key, value, ttl) {
        assert.type(
            CONSTANTS.STRING,
            key,
            assert.format(assert.messages.type.default, 'key', CONSTANTS.STRING)
        );
        assert.typeOrUndef(
            CONSTANTS.NUMBER,
            ttl,
            assert.format(assert.messages.type.default, 'ttl', CONSTANTS.NUMBER)
        );
        try {
            if (this._cache) {
                const item = {
                    ts: Date.now(),
                    ttl: Math.round(ttl) || this._ttl,
                    value
                };
                const sig = md5(JSON.stringify(item));
                item.sig = sig;
                this._store.setItem(key, JSON.stringify(item));
            }
        } catch (error) {
            logger.error({
                message: `Error setting value into ${this._storeName} cache`,
                method: 'setItem',
                error
            });
            if (!this._silent) {
                throw error;
            }
        }
    }

    /**
     * Remove items from cache
     * @param rx, a string or regular expression
     */
    removeItems(rx) {
        // eslint-disable-next-line valid-typeof
        if (typeof rx !== CONSTANTS.STRING && !(rx instanceof RegExp)) {
            throw new TypeError(
                assert.format(
                    assert.messages.type.default,
                    'rx',
                    'string or RegExp'
                )
            );
        }
        try {
            if (this._cache) {
                // eslint-disable-next-line valid-typeof
                if (typeof rx === CONSTANTS.STRING) {
                    this._store.removeItem(rx);
                } else if (rx instanceof RegExp) {
                    for (let i = 0, { length } = this._store; i < length; i++) {
                        const key = this._store.key(i);
                        if (rx.test(key)) {
                            this._store.removeItem(key);
                        }
                    }
                }
            }
        } catch (error) {
            logger.error({
                message: `Error removing value from ${this._storeName} cache`,
                method: 'removeItems',
                error
            });
            if (!this._silent) {
                throw error;
            }
        }
    }
}

/**
 * Cache in sessionStorage
 */
class SessionCache extends LocalCache {
    /**
     * Constructor
     * @param options
     */
    constructor(options = {}) {
        super(options);
        this._cache = options.cache || DEFAULTS.cache;
        this._silent = options.silent || DEFAULTS.silent;
        this._storeName = 'sessionStorage';
        this._store = window[this._storeName];
        this._ttl = options.ttl || DEFAULTS.ttl;
    }
}

/**
 * Exports
 * @type {LocalCache}
 */
export const localCache = new LocalCache();
export const sessionCache = new SessionCache();
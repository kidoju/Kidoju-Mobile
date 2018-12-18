/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import { localCache } from '../common/window.cache.es6';
import BaseTransport from './transports.base.es6';

/**
 * CacheStrategy
 * Reads an entire collection using window.cache.es6
 * @class CacheStrategy
 * extends BaseTransport
 */
const CacheStrategy = BaseTransport.extend({
    /**
     * Init
     * @param options
     */
    init(options) {
        BaseTransport.fn.init.call(this, options);
    },

    /**
     * Read
     * @param options
     */
    read(options = {}) {

    }
});

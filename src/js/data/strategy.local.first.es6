/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
// import BaseTransport from './transports.base.es6';
import LocalTransport from './transports.local.es6';
import RemoteTransport from './transports.remote.es6';

const {
    Class
    // data: { Query }
} = window.kendo;
const logger = new Logger('strategy.local.first');

/**
 * LocalFirstStrategy
 * Creates/destroy/reads/updates an item using window.cache.es6
 * @class LocalFirstStrategy
 * @extends Class
 */
const LocalFirstStrategy = Class.extend({
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
        /*
        assert.type(
            CONSTANTS.STRING,
            options.key,
            assert.format(
                assert.messages.type.default,
                'options.key',
                CONSTANTS.STRING
            )
        );
         */
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
        // Class.fn.init.call(this, options);
        this._localTransport = options.localTransport;
        this._remoteTransport = options.remoteTransport;
        // optional
        // this._cache = options.cache === 'session' ? sessionCache : localCache;
        // this._singleton = !!options.singleton;
        // this._ttl = options.ttl;
    },

    /**
     * Create transport
     * @param options
     * @returns {*}
     * @private
     */
    create(options) {
        assert.isNonEmptyPlainObject(
            options,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options'
            )
        );
        assert.isNonEmptyPlainObject(
            options.data,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options.data'
            )
        );
        logger.debug({
            message: 'Data creation',
            method: 'create'
        });
        this._localTransport.create(options);
    },

    /**
     * Destroy transport
     * @param options
     * @private
     */
    destroy(options) {
        assert.isNonEmptyPlainObject(
            options,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options'
            )
        );
        assert.isNonEmptyPlainObject(
            options.data,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options.data'
            )
        );
        logger.debug({
            message: 'Data deletion',
            method: 'destroy'
        });
    },

    /**
     * Read transport
     * @param options
     * @private
     */
    read(options) {
        logger.debug({
            message: 'User data read',
            method: 'read'
        });
    },

    /**
     * Update transport
     * @param options
     * @returns {*}
     * @private
     */
    update(options) {
        assert.isNonEmptyPlainObject(
            options,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options'
            )
        );
        assert.isNonEmptyPlainObject(
            options.data,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options.data'
            )
        );
        logger.debug({
            message: 'User data update',
            method: 'update'
        });
    }
});

/**
 * Default export
 */
export default LocalFirstStrategy;

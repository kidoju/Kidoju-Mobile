/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import 'kendo.data';
import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import LazyOfflineStrategy from './strategy.offline.lazy.es6';

const logger = new Logger('strategy.offline');

/**
 * OfflineStrategy
 */
const OfflineStrategy = LazyOfflineStrategy.extend({
    /**
     * Create
     * @param options
     */
    create(options) {
        assert.crud(options);
        logger.debug({
            message: 'create data',
            method: 'create',
            data: options.data // TODO add isOffline
        });

        throw new Error('Not yet implemented');
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
            data: options.data // TODO add isOffline
        });

        throw new Error('Not yet implemented');
    },

    /**
     * Destroy
     * @param options
     */
    update(options) {
        assert.crud(options);
        logger.debug({
            message: 'update data',
            method: 'update',
            data: options.data // TODO add isOffline
        });

        throw new Error('Not yet implemented');
    }
});

/**
 * Default export
 */
export default OfflineStrategy;
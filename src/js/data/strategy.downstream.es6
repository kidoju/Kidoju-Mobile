/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
// import $ from 'jquery';
import 'kendo.data';
import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import LazyDownstreamStrategy from './strategy.downstream.lazy.es6';

const logger = new Logger('strategy.downstream');

/**
 * DownstreamStrategy
 */
const DownstreamStrategy = LazyDownstreamStrategy.extend({
    /**
     * Create
     * @param options
     */
    create(options) {
        assert.crud(options);
        logger.debug({
            message: 'create data',
            method: 'create',
            data: options.data, // TODO add isOffline
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
            data: options.data, // TODO add isOffline
        });

        throw new Error('Not yet implemented');
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
            data: options.data, // TODO add isOffline
        });

        throw new Error('Not yet implemented');
    },
});

/**
 * Default export
 */
export default DownstreamStrategy;

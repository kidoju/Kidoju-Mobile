/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import Collection from '../common/pongodb.collection.es6';
import { convertFilter } from '../common/pongodb.util.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import {
    error2xhr,
    extendQueryWithPartition,
    SYNC_STATE
} from './data.util.es6';
import BaseTransport from './transports.base.es6';

const logger = new Logger('transports.lazylocal');

/**
 * LazyLocalTransport
 */
const LazyLocalTransport = BaseTransport.extend({
    /**
     * Init
     * @constructor
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
        assert.instanceof(
            Collection,
            options.collection,
            assert.format(
                assert.messages.instanceof.default,
                'options.collection',
                'Collection'
            )
        );
        this._collection = options.collection;
        BaseTransport.fn.init.call(this, options);
    },

    /**
     * Get
     * @param options
     */
    get(options) {
        assert.crud(options);
        logger.debug({
            message: 'Get local data',
            method: 'LazyLocalTransport.get',
            data: options.data
        });
        const data = this.parameterMap(options.data, 'get');
        const query = {};
        query[this.idField()] = data[this.idField()];
        query[SYNC_STATE.FIELD] = { $ne: SYNC_STATE.DESTROYED };
        this._collection
            .findOne(query, this.projection())
            .then(response => {
                options.success(response);
            })
            .catch(error => {
                options.error(...error2xhr(error));
            });
    },

    /**
     * Read
     * @param options
     */
    read(options) {
        assert.crud(options);
        const partition = this.partition();
        logger.debug({
            message: 'Read local data',
            method: 'LazyLocalTransport.read',
            data: options.data
        });
        if ($.type(partition) === CONSTANTS.UNDEFINED) {
            // This lets us create a dataSource without knowing the partition, which can be set in the load method of the data source
            options.success({ total: 0, data: [] });
        } else {
            let query = this.parameterMap(options.data, 'read');
            query = extendQueryWithPartition(query, partition);
            // Filter all records with __state___ === 'destroyed', considering partition is ignored when false
            query.filter.filters.push({
                field: SYNC_STATE.FIELD,
                operator: 'neq',
                value: SYNC_STATE.DESTROYED
            });
            query = convertFilter(options.data.filter);
            this._collection
                .find(query, this.projection())
                .then(response => {
                    if ($.isArray(response)) {
                        options.success({
                            total: response.length,
                            data: response
                        });
                    } else {
                        options.error(
                            ...error2xhr(
                                new Error('Database should return an array')
                            )
                        );
                    }
                })
                .catch(error => {
                    options.error(...error2xhr(error));
                });
        }
    }
});

/**
 * Default export
 */
export default LazyLocalTransport;

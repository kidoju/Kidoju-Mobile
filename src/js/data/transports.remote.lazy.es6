/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import CONSTANTS from '../common/window.constants.es6';
import assert from '../common/window.assert.es6';
import AjaxBase from '../rapi/rapi.base.es6';
import BaseTransport from './transports.base.es6';

/**
 * LazyRemoteTransport (read-only)
 * @class
 */
const LazyRemoteTransport = BaseTransport.extend({
    /**
     * Constructor
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
            AjaxBase,
            options.collection,
            assert.format(
                assert.messages.instanceof.default,
                'options.collection',
                AjaxBase
            )
        );
        // BaseTransport.init calls this.partition(options.partition)
        // and this.projection(options.projection)
        BaseTransport.fn.init.call(this, options);
    },

    /**
     * partition getter/setter (filter on table rows)
     * Note: This is read from AjaxBase
     */
    partition(value) {
        assert.typeOrUndef(
            CONSTANTS.OBJECT,
            value,
            assert.format(
                assert.messages.typeOrUndef.default,
                'partition',
                CONSTANTS.OBJECT
            )
        );
        let ret;
        if ($.type(value) === CONSTANTS.UNDEFINED) {
            ret = this._collection.partition();
        } else {
            this._collection.partition(value);
        }
        return ret;
    },

    /**
     * Get
     * @param options
     */
    get(options) {
        assert.crud(options);
        // Fields are part of options.data, filter and sort order are not applicable
        const data = this.parameterMap(options.data, 'get');
        this._collection
            .get(data[this.idField()], { fields: data.fields })
            .then((result, textStatus, xhr) => {
                if (xhr.status === 200) {
                    options.success(result);
                } else {
                    options.error(xhr, xhr.statusText, 'Error getting');
                }
            })
            .catch(options.error);
    },

    /**
     * Read
     * @param options
     */
    read(options) {
        assert.crud(options);
        const partition = this.partition();
        if ($.type(partition) === CONSTANTS.UNDEFINED) {
            // This lets us create a dataSource without knowing the partition,
            // which can then be set after collecting data, including user id and language
            options.success({ total: 0, data: [] });
        } else {
            // Fields, filters and default sort order are part of options.data
            const data = this.parameterMap(options.data, 'read');
            // data.partition = undefined;
            this._collection
                .read(data)
                .then((result, textStatus, xhr) => {
                    if (xhr.status === 200) {
                        options.success(result);
                    } else {
                        options.error(xhr, xhr.statusText, 'Error reading');
                    }
                })
                .catch(options.error);
        }
    },
});

/**
 * Default export
 */
export default LazyRemoteTransport;

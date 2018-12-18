/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
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
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'options')
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
        // This calls this.partition(value)
        BaseTransport.fn.init.call(this, options);
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
            .then(options.success)
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
                .then(options.success)
                .catch(options.error);
        }
    }
});

/**
 * Default export
 */
export default LazyRemoteTransport;

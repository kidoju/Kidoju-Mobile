/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
import CONSTANTS from '../common/window.constants.es6';
import assert from '../common/window.assert.es6';

// TODO: maybe it is better to inject the BaseModel to automatically build projection????

/**
 * IMPORTANT
 * DataSource.init calls Transport.create which does transportOptions = options.transport ? $.extend({}, options.transport)
 * if options.transport is designed as an ES6 class, $.extend does not copy members create, destroy, read and update
 * if options.transport is designed as a kendo.Class, it does
 */
const { Class } = window.kendo;

/**
 * BaseTransport
 */
const BaseTransport = Class.extend({
    /**
     * Constructor
     * @constructor
     * @param options
     */
    init(options = {}) {
        assert.type(
            CONSTANTS.OBJECT,
            options,
            assert.format(
                assert.messages.type.default,
                'options',
                CONSTANTS.OBJECT
            )
        );
        // Collection cannot be changed after initialization
        this._collection = options.collection;
        assert.isDefined(
            this._collection,
            assert.format(
                assert.messages.isDefined.default,
                'options.collection'
            )
        );
        // idField cannot be changed after initialization
        this._idField = options.idField || 'id';
        assert.type(
            CONSTANTS.STRING,
            this._idField,
            assert.format(
                assert.messages.type.default,
                'options.idField',
                CONSTANTS.STRING
            )
        );
        if ($.isPlainObject(options.partition)) {
            this.partition(options.partition);
        }
        if ($.type(options.projection) === CONSTANTS.STRING) {
            this.projection(options.projection);
        }
        if ($.isFunction(options.parameterMap)) {
            this.parameterMap = options.parameterMap.bind(this);
        }
    },

    /**
     * collection
     * @returns {*}
     */
    collection() {
        return this._collection;
    },

    /**
     * idField
     * @returns {*}
     */
    idField() {
        return this._idField;
    },

    /**
     * partition getter/setter (filter on table rows)
     * Note: some partition fields impact the endpoint (url), other partition fields impact the query (filter)
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
            ret = this._partition || {};
        } else {
            this._partition = value;
        }
        return ret;
    },

    /**
     * projection setter (list of table columns)
     * @param value
     */
    projection(value) {
        assert.typeOrUndef(
            CONSTANTS.STRING,
            value,
            assert.format(
                assert.messages.typeOrUndef.default,
                'projection',
                CONSTANTS.STRING
            )
        );
        let ret;
        if ($.type(value) === CONSTANTS.UNDEFINED) {
            ret = this._projection;
        } else {
            this._projection = value;
        }
        return ret;
    },

    /**
     * Validates a data dataItem against the current partition
     * @param dataItem
     * @private
     */
    _validate(dataItem) {
        let ret;
        const errors = [];
        const partition = this.partition();
        assert.type(
            CONSTANTS.OBJECT,
            partition,
            assert.format(
                assert.messages.type.default,
                'partition',
                CONSTANTS.OBJECT
            )
        );
        Object.keys(partition).forEach((field) => {
            let value = dataItem;
            // TODO use getter
            // TODO check from fields
            // We need to find the value of composite properties like in dataItem['prop1.prop2'] which should be read as dataItem.prop1.prop2
            // We need that for activity.author.userId or activity.version.language
            const props = field.split('.');
            for (let i = 0, { length } = props; i < length; i++) {
                value = value[props[i]];
            }
            if (partition[field] !== value) {
                const err = new Error(`Invalid ${field}`);
                err.field = field;
                errors.push(err);
            }
        });
        if (errors.length) {
            ret = new Error('Bad request');
            ret.code = 400;
            ret.errors = errors;
        }
        return ret;
    },

    /**
     * Parameter map to change options.data payload before sending to transport
     * @param data
     * @param type (create, destroy, get, read or update)
     * @returns {*}
     */
    parameterMap(data /* , type */) {
        // Clone to avoid propagating changes
        return { ...data };
    },

    /**
     * Create
     */
    // eslint-disable-next-line class-methods-use-this
    create() {
        throw new Error(CONSTANTS.NOT_IMPLEMENTED_ERR);
    },

    /**
     * Create
     */
    // eslint-disable-next-line class-methods-use-this
    destroy() {
        throw new Error(CONSTANTS.NOT_IMPLEMENTED_ERR);
    },

    /**
     * Get
     */
    // eslint-disable-next-line class-methods-use-this
    get() {
        throw new Error(CONSTANTS.NOT_IMPLEMENTED_ERR);
    },

    /**
     * Read
     */
    // eslint-disable-next-line class-methods-use-this
    read() {
        throw new Error(CONSTANTS.NOT_IMPLEMENTED_ERR);
    },

    /**
     * Update
     */
    // eslint-disable-next-line class-methods-use-this
    update() {
        throw new Error(CONSTANTS.NOT_IMPLEMENTED_ERR);
    },
});

/**
 * Default export
 */
export default BaseTransport;

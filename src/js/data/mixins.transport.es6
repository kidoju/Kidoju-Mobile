/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* eslint-disable no-param-reassign */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';
import Me from './data.me.es6';

/**
 * Extend model with transport
 * @param DataModel - Note: use DataModel to avoid any confusion with Model in kendo.data.Model
 * @param transport
 */
export default function extendModelWithTransport(DataModel, transport) {
    assert.extends(
        BaseModel,
        DataModel,
        assert.format(assert.messages.extends.default, 'DataModel', 'BaseModel')
    );
    assert.isFunction(
        transport.get,
        assert.format(assert.messages.isFunction.default, 'transport.get')
    );
    // assert.isFunction(transport.create, assert.format(assert.messages.isFunction.default, 'transport.create'));
    // assert.isFunction(transport.update, assert.format(assert.messages.isFunction.default, 'transport.update'));

    // Add transport to kendo.data.Model
    DataModel.fn.transport = transport;

    /**
     * Load
     * @param options
     * @returns {*|jQuery}
     */
    DataModel.fn.load = function load(options) {
        // bare designates an endpoint to load an object without designating an id
        const bare = this instanceof Me;
        if (bare) {
            assert.isUndefined(
                options,
                assert.format(assert.messages.isUndefined.default, 'options')
            );
        } else {
            assert.isNonEmptyPlainObject(
                options,
                assert.format(
                    assert.messages.isNonEmptyPlainObject.default,
                    'options'
                )
            );
            assert.match(
                CONSTANTS.RX_MONGODB_ID,
                options[this.idField],
                assert.format(
                    assert.messages.match.default,
                    'options[this.idField]',
                    CONSTANTS.RX_MONGODB_ID
                )
            );
        }
        const accept = this.accept.bind(this);
        const dfd = $.Deferred();
        const { dirty, idField } = this;
        if (
            !this.isNew() &&
            !dirty &&
            (bare || this.get(idField) === options[idField])
        ) {
            // Already loaded and not modified
            dfd.resolve(this.toJSON());
        } else {
            const data = {};
            if (!bare) {
                data[idField] = options[idField];
            }
            // delete options[idField];
            this.transport.partition(options || {});
            this.transport.get({
                // TODO parameterMap is called when calling this.transport.get
                // Check remote transport, not array transport
                data: this.transport.parameterMap(data, 'get'),
                error: dfd.reject,
                success(response) {
                    // Not found is sent to error/dfd.reject with status 404
                    accept(response);
                    dfd.resolve(response);
                }
            });
        }
        return dfd.promise();
    };

    /**
     * Reset (maybe reset should be part of BaseModel since there is no transport involved)
     */
    DataModel.fn.reset = function reset() {
        const data = {};
        Object.keys(this.defaults).forEach(key => {
            data[key] = $.isFunction(this.defaults[key])
                ? this.defaults[key]()
                : this.defaults[key];
        });
        // Note: accept calls field parse functions
        this.accept(data);
    };

    /**
     * Save
     * Note that all model fields marked as serializable === false will be discarded
     * @returns {*|jQuery}
     */
    DataModel.fn.save = function save() {
        const accept = this.accept.bind(this);
        const dfd = $.Deferred();
        const { dirty, dirtyFields, idField } = this;
        if (this.isNew()) {
            // this.transport.partition() must have been called when loading
            // TODO parameterMap is called when calling this.transport.create
            this.transport.create({
                data: this.transport.parameterMap(this.toJSON(), 'create'),
                error: dfd.reject,
                success(response) {
                    accept(response);
                    dfd.resolve(response);
                }
            });
        } else if (dirty) {
            // TODO parameterMap is called when calling this.transport.update
            const json = this.transport.parameterMap(this.toJSON(), 'update');
            const data = {};
            // Only send dirty fields with id for update
            data[idField] = json[idField];
            Object.keys(dirtyFields).forEach(key => {
                if (dirtyFields[key]) {
                    data[key] = json[key];
                }
            });
            this.transport.update({
                data,
                error: dfd.reject,
                success(response) {
                    // Not found is sent to error/dfd.reject with status 404
                    accept(response);
                    dfd.resolve(response);
                }
            });
        } else {
            dfd.resolve(this.toJSON());
        }
        return dfd.promise();
    };
}

/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* eslint-disable no-param-reassign */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';

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
        const that = this;
        const dfd = $.Deferred();
        if (!that.dirty && that.get(that.idField) === options[that.idField]) {
            // Already loaded and not modified
            dfd.resolve(that.toJSON());
        } else {
            const data = {};
            data[that.idField] = options[that.idField];
            // delete options[that.idField];
            that.transport.partition(options);
            that.transport.get({
                data: that.transport.parameterMap(data, 'get'),
                error: dfd.reject,
                success(response) {
                    // Not found is sent to error/dfd.reject with status 404
                    that.accept(response);
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
        const that = this;
        const dfd = $.Deferred();
        if (that.isNew()) {
            // that.transport.partition() must have been called when loading
            that.transport.create({
                data: that.transport.parameterMap(that.toJSON(), 'create'),
                error: dfd.reject,
                success(response) {
                    that.accept(response);
                    dfd.resolve(response);
                }
            });
        } else if (that.dirty) {
            const json = that.transport.parameterMap(that.toJSON(), 'update');
            const data = {};
            // Only send dirty fields with id for update
            data[that.idField] = json[that.idField];
            Object.keys(that.dirtyFields).forEach(key => {
                if (that.dirtyFields[key]) {
                    data[key] = json[key];
                }
            });
            that.transport.update({
                data,
                error: dfd.reject,
                success(response) {
                    // Not found is sent to error/dfd.reject with status 404
                    that.accept(response);
                    dfd.resolve(response);
                }
            });
        } else {
            dfd.resolve(that.toJSON());
        }
        return dfd.promise();
    };
}

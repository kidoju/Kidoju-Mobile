/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* eslint-disable no-param-reassign */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
import i18n from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';
import Me from './data.me.es6';

const { Observable } = window.kendo;

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
        // bare designates an endpoint that loads an object without designating an id
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
            const that = this;
            const data = {};
            if (!bare) {
                data[idField] = options[idField];
            }
            // delete options[idField];
            that.transport.get({
                // Note: parameterMap is called when calling this.transport.get
                data,
                error: dfd.reject,
                success(response) {
                    // Not found is sent to error/dfd.reject with status 404
                    that.accept(response);
                    // accept does not trigger a change event
                    if (
                        $.isFunction(that.parent) &&
                        that.parent() instanceof Observable
                    ) {
                        const viewModel = that.parent();
                        Object.keys(viewModel).some(field => {
                            const ret = viewModel[field] === that;
                            if (ret) {
                                viewModel.trigger(CONSTANTS.CHANGE, { field });
                            }
                            return ret;
                        });
                    } else {
                        that.trigger(CONSTANTS.CHANGE);
                    }
                    dfd.resolve(response);
                }
            });
        }
        return dfd.promise();
    };

    /**
     * Reset
     */
    DataModel.fn.reset = function reset() {
        if (this instanceof Me) {
            // Note: maybe we should consider a more generic way of removing the item
            // that involves the transport and/or cache strategy
            sessionStorage.removeItem(CONSTANTS.ME);
        }
        const data = {};
        Object.keys(this.defaults).forEach(key => {
            data[key] = $.isFunction(this.defaults[key])
                ? this.defaults[key]()
                : this.defaults[key];
        });
        // Note: accept calls field parse functions
        this.accept(data);
        // accept does not trigger a change event
        if ($.isFunction(this.parent) && this.parent() instanceof Observable) {
            const that = this;
            const viewModel = that.parent();
            Object.keys(viewModel).some(field => {
                const ret = viewModel[field] === that;
                if (ret) {
                    viewModel.trigger(CONSTANTS.CHANGE, { field });
                }
                return ret;
            });
        } else {
            this.trigger(CONSTANTS.CHANGE);
        }
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
            // Note: parameterMap is called when calling this.transport.create
            this.transport.create({
                data: this.toJSON(),
                error: dfd.reject,
                success(response) {
                    accept(response);
                    dfd.resolve(response);
                }
            });
        } else if (dirty) {
            const json = this.toJSON();
            const data = {};
            // Note: json[idField] might not be available if
            // idField is accidentally marked as not serializable
            // data[idField] = json[idField];
            data[idField] = this[idField];
            // Some models might require language
            data.language = i18n.locale;
            // Only send dirty fields with id for update
            Object.keys(dirtyFields).forEach(key => {
                if (dirtyFields[key]) {
                    data[key] = json[key];
                }
            });
            // Note: parameterMap is called when calling this.transport.update
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

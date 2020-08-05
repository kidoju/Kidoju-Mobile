/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.binder';

const { observable } = window.kendo;

/**
 * viewModel
 */
const viewModel = observable({
    /**
     * Extend
     * @param options
     */
    extend(options) {
        if (!Array.isArray(this._loaders)) {
            this._loaders = [];
        }
        if (!Array.isArray(this._resetters)) {
            this._resetters = [];
        }
        Object.keys(options).forEach((key) => {
            const method = options[key];
            if ($.isFunction(method)) {
                if (key === 'load') {
                    this._loaders.push(method.bind(this));
                } else if (key === 'reset') {
                    this._resetters.push(method.bind(this));
                } else {
                    this[key] = method.bind(this);
                }
            }
        });
    },

    /**
     * Load
     */
    load() {
        const promises = [];
        (this._loaders || []).forEach((method) => {
            if ($.isFunction(method)) {
                promises.push(method());
            }
        });
        return $.when(...promises);
    },

    /**
     * Reset
     */
    reset() {
        (this._resetters || []).forEach((method) => {
            if ($.isFunction(method)) {
                method();
            }
        });
    },
});

/**
 * Default export
 */
export default viewModel;

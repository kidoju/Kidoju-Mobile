/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* eslint-disable no-param-reassign */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
// import 'kendo.core';
import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';

/**
 * Extends a model with rfc6902 diff (assuming transport implements patch)
 */
export default function extendModelWithPatch(DataModel) {
    assert.extends(
        BaseModel,
        DataModel,
        assert.format(assert.messages.extends.default, 'DataModel', 'BaseModel')
    );

    // The model should already have been extended with transport
    assert.isFunction(
        DataModel.fn.load,
        assert.format(assert.messages.isFunction.default, 'DataModel.fn.load')
    );

    // Redefine load to store response, so as to compare changes
    DataModel.fn._load = DataModel.fn.load;

    /**
     * Load
     * @param options
     * @returns {*|jQuery}
     */
    DataModel.fn.load = function load(options) {
        const that = this;
        return DataModel.fn._load(options).then(() => {
            that._data = that.toJSON();
        });
    };

    /**
     * Patch
     * @param options
     * @returns {*|jQuery}
     */
    DataModel.fn.patch = function patch(options) {
        // TODO
    };
}

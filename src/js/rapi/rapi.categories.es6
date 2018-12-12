/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxBase from './rapi.base.es6';
import { root, uris } from './rapi.uris.es6';
import { format } from './rapi.util.es6';

/**
 * AjaxCategories
 * @class
 */
export default class AjaxCategories extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'categories'
        });
        super(options);
        assert.isPlainObject(
            this._partition,
            assert.format(
                assert.messages.isPlainObject.default,
                'options.partition'
            )
        );
        assert.match(
            CONSTANTS.RX_LANGUAGE,
            this._partition.language,
            assert.format(
                assert.messages.match.default,
                'options.partition.language',
                CONSTANTS.RX_LANGUAGE
            )
        );
    }

    /**
     * Get headers
     * @param method
     * @private
     */
    // eslint-disable-next-line class-methods-use-this
    _getHeaders(/* method */) {}

    /**
     * Get method url
     * @param method
     * @private
     */
    _getUrl(method) {
        if (method === AjaxBase.METHOD.READ) {
            return assert.format(
                root() + uris().rapi.v1.categories,
                this._partition.language
            );
        }
        return super._getUrl(method);
    }
}

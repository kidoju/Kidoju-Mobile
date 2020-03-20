/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

/**
 * AjaxCategories
 * @class AjaxCategories
 * @extends AjaxBase
 */
class AjaxCategories extends AjaxBase {
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
        assert.isNonEmptyPlainObject(
            this._partition,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
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
    _getUrl(method /* , id */) {
        if (method === AjaxBase.METHOD.READ) {
            return format(
                config.uris.rapi.v1.categories,
                this._partition.language
            );
        }
        return super._getUrl(method);
    }
}

/**
 * Default export
 */
export default AjaxCategories;

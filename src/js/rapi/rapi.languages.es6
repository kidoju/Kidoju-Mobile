/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

/**
 * AjaxCategories
 * @class
 */
export default class AjaxLanguages extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'languages'
        });
        super(options);
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
     * @param id
     * @private
     */
    _getUrl(method, id) {
        if (method === AjaxBase.METHOD.READ) {
            return config.uris.rapi.v1.languages;
        }
        if (method === AjaxBase.METHOD.GET) {
            return root() + assert.format(uris().rapi.v1.language, id);
        }
        return super._getUrl(method);
    }
}

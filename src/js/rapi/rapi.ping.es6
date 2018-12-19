/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// eslint-disable-next-line import/extensions, import/no-unresolved

import config from '../app/app.config.jsx';
import AjaxBase from './rapi.base.es6';

/**
 * AjaxCategories
 * @class
 */
export default class AjaxPing extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'ping'
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
     * Get method endpoint
     * @param method
     * @returns {*}
     * @private
     */
    _getUrl(method) {
        if (method === AjaxBase.METHOD.GET) {
            return config.uris.rapi.ping;
        }
        return super._getUrl(method);
    }

    /**
     * Call get with a dummy MongoDB Id
     */
    // get() {
    //    return super.get(new Array(24).fill(0).join(''));
    // }
}

/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
import AjaxBase from './rapi.base.es6';

/**
 * AjaxPing
 * @class AjaxPing
 * @extends AjaxBase
 */
class AjaxPing extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'ping',
        });
        super(options);
    }

    /**
     * Get headers
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
    _getUrl(method /* , id */) {
        if (method === AjaxBase.METHOD.GET) {
            return config.uris.rapi.ping;
        }
        return super._getUrl(method);
    }
}

/**
 * Default export
 */
export default AjaxPing;

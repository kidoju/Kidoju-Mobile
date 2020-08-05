/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

/**
 * AjaxApplications
 * @class AjaxApplications
 * @extends AjaxBase
 */
class AjaxApplications extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'applications',
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
     * Get method url
     * @param method
     * @param id
     * @private
     */
    _getUrl(method, id) {
        if (method === AjaxBase.METHOD.READ) {
            return config.uris.rapi.v1.applications;
        }
        if (method === AjaxBase.METHOD.GET) {
            return format(config.uris.rapi.v1.application, id);
        }
        return super._getUrl(method, id);
    }
}

/**
 * Default export
 */
export default AjaxApplications;

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
// import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

/**
 * AjaxSubscriptions
 * @class AjaxSubscriptions
 * @extends AjaxBase
 */
class AjaxSubscriptions extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'subscriptions'
        });
        super(options);
    }

    /**
     * Get method url
     * @param method
     * @param id
     * @private
     */
    _getUrl(method, id) {
        if (
            method === AjaxBase.METHOD.CREATE ||
            method === AjaxBase.METHOD.READ
        ) {
            return config.uris.rapi.v1.subscriptions;
        }
        if (
            method === AjaxBase.METHOD.DESTROY ||
            method === AjaxBase.METHOD.GET ||
            method === AjaxBase.METHOD.UPDATE
        ) {
            return format(config.uris.rapi.v1.subscription, id);
        }
        return super._getUrl(method, id);
    }

    /**
     * Extend query with projection and partition
     * @param query
     * @private
     */
    _extendQuery(query) {
        return super._extendQuery(query);
    }
}

/**
 * Default export
 */
export default AjaxSubscriptions;

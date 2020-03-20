/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
// import assert from '../common/window.assert.es6';
import { sessionCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

/**
 * AjaxUsers
 * @class AjaxUsers
 * @extends AjaxBase
 */
class AjaxUsers extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'users'
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
        const me = sessionCache.getItem(CONSTANTS.ME) || {};
        if (
            (method === AjaxBase.METHOD.GET ||
                method === AjaxBase.METHOD.UPDATE) &&
            (typeof id === 'undefined' || id === me.id)
        ) {
            return config.uris.rapi.v1.me;
        }
        if (method === AjaxBase.METHOD.GET) {
            return format(config.uris.rapi.v1.user, id);
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
export default AjaxUsers;

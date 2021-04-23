/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
// import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';
// import Logger from '../common/window.logger.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

// const logger = new Logger('rapi.groups');

/**
 * AjaxGroups
 * @class AjaxGroups
 * @extends AjaxBase
 */
class AjaxGroups extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'groups',
        });
        super(options);
    }

    /**
     * Get method endpoint
     * @param method
     * @param id
     * @returns {*}
     * @private
     */
    _getUrl(method, id) {
        if (
            method === AjaxBase.METHOD.READ ||
            method === AjaxBase.METHOD.CREATE
        ) {
            return config.uris.rapi.v1.groups;
        }
        if (
            method === AjaxBase.METHOD.DESTROY ||
            method === AjaxBase.METHOD.GET ||
            method === AjaxBase.METHOD.UPDATE
        ) {
            return format(config.uris.rapi.v1.group, id);
        }
        return super._getUrl(method, id);
    }
}

/**
 * Default export
 */
export default AjaxGroups;

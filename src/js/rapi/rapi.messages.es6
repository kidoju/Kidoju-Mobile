/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
// import $ from 'jquery';
import config from '../app/app.config.jsx';
// import __ from '../app/app.i18n.es6';
// import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';
// import Logger from '../common/window.logger.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

// const logger = new Logger('rapi.messages');

/**
 * AjaxMessages
 * @class AjaxMessages
 * @extends AjaxBase
 */
class AjaxMessages extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'messages',
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
            return config.uris.rapi.v1.messages;
        }
        if (
            method === AjaxBase.METHOD.DESTROY ||
            method === AjaxBase.METHOD.GET ||
            method === AjaxBase.METHOD.UPDATE
        ) {
            return format(config.uris.rapi.v1.message, id);
        }
        return super._getUrl(method, id);
    }
}

/**
 * Default export
 */
export default AjaxMessages;

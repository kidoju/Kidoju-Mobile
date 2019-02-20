/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import config from '../app/app.config.jsx';
import i18n from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

const logger = new Logger('rapi.files');

/**
 * AjaxFiles
 * @class AjaxFiles
 * @extends AjaxBase
 */
class AjaxFiles extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'files'
        });
        super(options);
    }

    /**
     * Get method endpoint
     * @param method
     * @returns {*}
     * @private
     */
    _getUrl(method) {
        return super._getUrl(method);
    }
}

/**
 * Default export
 */
export default AjaxFiles;

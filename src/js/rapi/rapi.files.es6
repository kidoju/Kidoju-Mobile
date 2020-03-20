/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import config from '../app/app.config.jsx';
// import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
// import Logger from '../common/window.logger.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

// const logger = new Logger('rapi.files');

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
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            this._partition.summaryId,
            assert.format(
                assert.messages.match.default,
                'options.partition.summaryId',
                CONSTANTS.RX_MONGODB_ID
            )
        );
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
            return format(
                config.uris.rapi.v1.files,
                this._partition.language,
                this._partition.summaryId
            );
        }
        if (
            method === AjaxBase.METHOD.DESTROY ||
            method === AjaxBase.METHOD.GET ||
            method === AjaxBase.METHOD.UPDATE
        ) {
            return format(
                config.uris.rapi.v1.file,
                this._partition.language,
                this._partition.summaryId,
                id
            );
        }
        return super._getUrl(method, id);
    }
}

/**
 * Default export
 */
export default AjaxFiles;

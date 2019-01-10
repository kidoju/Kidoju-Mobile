/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { getHeaders } from './rapi.util.es6';

const logger = new Logger('app.rpc');
const HTTP = { POST: 'POST' };

/**
 * AjaxRpc
 * @class
 */
export default class AjaxRpc {
    /**
     * Call
     * @method call
     * @param options
     */
    static call(options) {
        assert.isNonEmptyPlainObject(
            options,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options'
            )
        );
        // Need a command (collection)
        assert.type(
            CONSTANTS.STRING,
            options.command,
            assert.format(
                assert.messages.type.default,
                'options.command',
                CONSTANTS.STRING
            )
        );
        // Need a context (collection)
        assert.type(
            CONSTANTS.STRING,
            options.context,
            assert.format(
                assert.messages.type.default,
                'options.context',
                CONSTANTS.STRING
            )
        );
        // Need an id
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            options.id,
            assert.format(
                assert.messages.match.default,
                'options.id',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        // Optionally need options.options
        logger.info({
            message: `rpc call for ${options.command} on ${options.context}`,
            method: 'call',
            data: options
        });
        return $.ajax({
            contentType: CONSTANTS.JSON_CONTENT_TYPE,
            data: JSON.stringify(options),
            headers: getHeaders(),
            method: HTTP.POST,
            url: config.uris.rapi.rpc
        });
    }
}

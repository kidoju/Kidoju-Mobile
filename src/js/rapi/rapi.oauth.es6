/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import assert from '../common/window.assert.es6';
import { localCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';

const logger = new Logger('rapi.oauth');
const { app, localStorage } = window;
const TOKEN = 'token';
const ACCESS_TOKEN = 'access_token';

/**
 * Read an access token from storage
 * @returns {*}
 */
function getAccessToken() {
    // TODO use window.cache
    if ('localStorage' in window) {
        const token = JSON.parse(localStorage.getItem(TOKEN));
        if (
            !token ||
            (token.ts &&
                token.expires &&
                token.ts + 1000 * token.expires < Date.now())
        ) {
            if (token) {
                localStorage.removeItem(TOKEN);
                logger.debug({
                    message: 'access token read from localStorage has expired',
                    method: 'util.getAccessToken',
                    data: { token }
                });
            }
            return null;
        }
        logger.debug({
            message: 'access token read from localStorage is still valid',
            method: 'util.getAccessToken',
            data: { token }
        });
        return token[ACCESS_TOKEN];
    }
    logger.error({
        message: 'without localStorage support, signing in cannot work',
        method: 'util.getAccessToken'
    });
    return null;
}

/**
 * Get headers for $.ajax calls
 * @param options
 * @returns {*}
 */
export function getHeaders(options = { security: true, trace: true }) {
    assert.isPlainObject(
        options,
        assert.format(assert.messages.isPlainObject.default, 'options')
    );
    const headers = {};
    if (options.security === true) {
        const accessToken = getAccessToken();
        // eslint-disable-next-line valid-typeof
        if ($.type(accessToken) === CONSTANTS.STRING) {
            headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    // TODO review app.constants
    if (app && app.constants && app.constants.appScheme) {
        headers['X-App-Scheme'] = app.constants.appScheme;
    }
    if (options.trace === true) {
        const trace = $('#trace').val();
        if ($.type(trace) === CONSTANTS.STRING) {
            headers['X-Trace-ID'] = trace.substr(0, 36); // should be long enough for a guid = 32 hex + 4 dashes
        }
    }
    return headers;
}

// To please ES6 until we have more functions
export function noop() {}

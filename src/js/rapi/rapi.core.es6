/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import deparam from '../common/jquery.deparam.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import {
    clearToken,
    getAccessTokenHashPos,
    getFingerPrint,
    getState,
    setToken
} from './rapi.util.es6';
import { refresh } from './rapi.oauth.es6';

const { cordova, chrome, history, location } = window;
const logger = new Logger('rapi.core');

const TOKEN = 'token';
const ACCESS_TOKEN = 'access_token';
const TOKEN_TYPE = 'token_type';
const EXPIRES_IN = 'expires_in';
const STATE = 'state';
const AUTHENTICATION_SUCCESS = 'auth.success';
const AUTHENTICATION_FAILURE = 'auth.failure';



/**
 * Clean the history from token information
 */
export function cleanHistory() {
    const pos = getAccessTokenHashPos(location.hash);
    if (pos >= 0) {
        if (history) {
            history.replaceState(
                {},
                document.title,
                location.pathname + location.hash.substr(0, pos)
            );
        } else {
            location.hash = location.hash.substr(0, pos); // for older browsers, might leave a # behind
        }
    }
}

/**
 * Ensure a refreshed token before expiration
 */
export function ensureToken() {
    let token = localCache.getItem(TOKEN);

    if ($.isPlainObject(token) && token.expires <= 24 * 60 * 60) {
        // if we have a short life token (Google and Live), i.e. expires === 3600, read token every minute and refresh no later than 15 minutes before expiration
        setInterval(() => {
            // we need to read the token again because if we remain a couple of hours on the same page (e.g. test designer), the token might have already been refreshed
            token = JSON.parse(localStorage.getItem(TOKEN));
            if (
                $.isPlainObject(token) &&
                Date.now() > token.ts + (token.expires - 10 * 60) * 1000
            ) {
                refresh();
            }
        }, 60 * 1000);
    }
    /*
     } else if ($.isPlainObject(token) &&  token.expires > 24 * 60 * 60) {
        // if we have a long life token (Facebook and Twitter), refresh is not available and we need to reset the token upon page load
        if (Date.now() > token.ts + 1000 * token.expires - 7 * 24 * 60 * 60 * 1000) {
            // Ideally, we should trigger the redirection required to acquire a new token silently (without login screen)
            // See https://github.com/Memba/Kidoju-Server/issues/68
        }
     }
     */
}

/**
 * Parse the access token into a Javascript object
 * @param url
 * @returns {{}}
 */
export function parseToken(url) {
    // When running tests with grunt.mochaTest, the url is a file url
    // i.e. file:///C:/Users/Jacques-Louis/Creative Cloud Files/Kidoju/Kidoju.Server/test/browser/app.cache.test.html
    // Also this assert fails in Phonegap InAppBrowser
    // assert.match(RX_URL, url, assert.format(assert.messages.match.default, 'url', RX_URL));
    assert.type(
        CONSTANTS.STRING,
        url,
        assert.format(assert.messages.type.default, 'url', CONSTANTS.STRING)
    );
    const dfd = $.Deferred();
    const pos = getAccessTokenHashPos(url);
    if (pos >= 0) {
        logger.debug({
            message: 'token found in url',
            method: 'parseToken',
            data: { url, pos }
        });

        // remove any trailing # to parse hash
        const qs = deparam(url.substr(pos + 1).split(CONSTANTS.HASH)[0], true);

        if ($.type(qs.error) !== CONSTANTS.UNDEFINED) {
            // Check any provider error
            const error = new Error(qs.error);
            dfd.reject(error);
            logger.error({
                message: qs.error,
                method: 'parseToken',
                data: { url },
                error
            });
        } else {
            getFingerPrint()
                .then(fingerPrint => {
                    // Check access_token
                    // Note: We could not find any better rule to match access tokens from facebook, google, live and twitter
                    if (
                        $.type(qs[ACCESS_TOKEN]) !== CONSTANTS.STRING ||
                        qs[ACCESS_TOKEN].length <= 10
                    ) {
                        qs.error = 'Invalid token';
                    }

                    // Note: We could check expires (Google and Windows Live are 3600 = 60*60 = 1h amd Facebook and Twitter are 5184000 = 60*60*24*60 = 60d)

                    // Check state, especially fingerPrint to ensure the authentication flow
                    // continues on the same machine that did originate state
                    // Note: getState() erases state, so it is not idempotent
                    if (
                        getState() !== qs[STATE] ||
                        qs[STATE].indexOf(fingerPrint) !== 0
                    ) {
                        qs.error = 'Invalid state';
                    }

                    // Check timestamp
                    const now = Date.now();
                    // Note there might be a lag, therefore -30s is required
                    if (
                        now - qs.ts < -30 * 1000 ||
                        now - qs.ts > 5 * 60 * 1000
                    ) {
                        qs.error = 'Invalid timestamp';
                    }

                    if ($.type(qs.error) === CONSTANTS.STRING) {
                        const error = new Error(qs.error);
                        dfd.reject(error);
                        logger.error({
                            message: qs.error,
                            method: 'parseToken',
                            data: { url },
                            error
                        });
                    } else {
                        // purge unwanted properties (especially state and token_type)
                        // as stated in https://github.com/Memba/Kidoju-Server/issues/29
                        const token = {
                            value: qs[ACCESS_TOKEN],
                            ttl: qs[EXPIRES_IN],                // TODO Or expires?
                            ts: qs.ts                           // TODO where do we get it from?
                        };
                        dfd.resolve(token);
                        logger.debug({
                            message: 'token verified',
                            method: 'parseToken',
                            data: { token }
                        });
                    }
                })
                .catch(dfd.reject);
        }
    } else {
        // Discard all the pages that do not have a token in their url
        dfd.resolve(null);
    }
    return dfd.promise();
}

/**
 * When html page is loaded, detect and parse #access_token (see oAuth callback)
 * CAREFUL: getHeaders({ security: true, trace: true }) is therefore not available until the HTML page is fully loaded!
 */
$(() => {
    // Do not execute in cordova and chrome apps
    // In cordova, we collect the token in InAppBrowser which does not load app.core.es6
    // In chrome apps, this throws an error
    if (
        $.type(cordova) === CONSTANTS.UNDEFINED &&
        !(chrome && $.isEmptyObject(chrome.app))
    ) {
        parseToken(location.href)
            .then(token => {
                if ($.type(token) !== CONSTANTS.NULL) {
                    // setToken in localStorage
                    setToken(token);
                    // Clean history (to avoid back)
                    cleanHistory();
                    // Notify page
                    setTimeout(() => {
                        $(document).trigger(AUTHENTICATION_SUCCESS);
                    }, 500);
                }
                ensureToken();
            })
            .catch(error => {
                // Let's simply discard any attempt to set a token that does not pass the checks here above
                clearToken();
                // Notify page (we may have qs.error)
                setTimeout(() => {
                    $(document).trigger(AUTHENTICATION_FAILURE, { error });
                }, 500);
            });
    }
});

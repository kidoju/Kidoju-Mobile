/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// rapi.util.es6 has methods for parsing and storing state and tokens

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import config from '../app/app.config.jsx';
import deparam from '../common/jquery.deparam.es6';
import assert from '../common/window.assert.es6';
import { localCache, sessionCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
// import Fingerprint from '../vendor/valve/fingerprint';
import Fingerprint2 from '../vendor/valve/fingerprint2';

const { history, location, navigator } = window;
const logger = new Logger('rapi.util');
const TOKEN = 'token';
const ACCESS_TOKEN = 'access_token';
const TOKEN_TYPE = 'token_type';
const EXPIRES = 'expires';
const EXPIRES_IN = 'expires_in';
const STATE = 'state';
const RX_ANDROID = /Android/;
const RX_IEXPLORE = /;\s(MSIE\s|Trident\/)/;
let fpromise; // Cache fingerprint promise

/**
 * Clear (delete) an access token from storage
 * @function clearToken
 */
function clearToken() {
    localCache.removeItem(TOKEN);
    logger.debug({
        message: 'Access token removed from storage',
        method: 'clearToken',
    });
}

/**
 * Simple format function to replace {n} with the (n)th arg
 * @function format
 * @param message
 * @param args
 * @returns {*}
 */
function format(message, ...args) {
    let ret = message;
    args.forEach((arg, idx) => {
        // Note: we definitely need \\ in the following regular expression
        const rx = new RegExp(`\\{${idx.toString()}\\}`, 'g');
        ret = ret.replace(rx, String(arg));
    });
    return ret;
}

/**
 * Get the position of the hash preceding the access_token
 * @function getAccessTokenHashPos
 * @param url
 * @returns {number}
 */
function getAccessTokenHashPos(url) {
    // When running tests with grunt.mochaTest, the url is a file url
    // i.e. file:///C:/Users/Jacques-Louis/Creative Cloud Files/Kidoju/Kidoju.Server/test/browser/app.cache.test.html
    // Also this assert fails in Phonegap InAppBrowser
    // assert.match(RX_URL, url, assert.format(assert.messages.match.default, 'url', RX_URL));
    assert.type(
        CONSTANTS.STRING,
        url,
        assert.format(assert.messages.type.default, 'url', CONSTANTS.STRING)
    );
    return Math.max(
        url.indexOf(`${CONSTANTS.HASH}${ACCESS_TOKEN}`), // Facebook and Google return access_token first
        url.indexOf(`${CONSTANTS.HASH}${TOKEN_TYPE}`), // Windows Live returns token_type first
        url.indexOf(`${CONSTANTS.HASH}${EXPIRES}`), // Others might have them in a different order
        url.indexOf(`${CONSTANTS.HASH}${EXPIRES_IN}`),
        url.indexOf(`${CONSTANTS.HASH}${STATE}`)
        // Note: Should we add error?
    );
}

/**
 * Clean the history from token information
 * @function cleanHistory
 */
function cleanHistory() {
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
 * Remove any token information from a url
 * Check its use in rapi.getSignInUrl where returnUrl would normally be window.location.href
 * In a browser, the whole authentication process redirects the browser to returnUrl#access_token=...
 * When authenticating again from this location, one would keep adding #access_token=... to the returnUrl, thus a requirement for cleaning it
 * @function cleanUrl
 * @param url
 * @returns {*}
 */
function cleanUrl(url) {
    // This assert fails in Phonegap InAppBrowser
    // assert.match(RX_URL, url, assert.format(assert.messages.match.default, 'url', RX_URL));
    assert.type(
        CONSTANTS.STRING,
        url,
        assert.format(assert.messages.type.default, 'url', CONSTANTS.STRING)
    );
    let ret = url;
    const pos1 = getAccessTokenHashPos(url);
    const pos2 = url.indexOf(CONSTANTS.HASH, pos1 + 1);
    if (pos1 >= 0) {
        ret = url.substring(0, pos1);
        if (pos2 >= 0) {
            ret += url.substr(pos2);
        }
    }
    if (ret.slice(-1) === CONSTANTS.HASH) {
        // remove trailing hash if any
        ret = ret.substring(0, ret.length - 1);
    }
    return ret;
}

/**
 * Read an access token from storage
 * @function getToken
 * @params raw
 * @returns {*}
 */
function getToken(raw = false) {
    return localCache.getItem(TOKEN, raw);
    /*
    // We already get logs from cache
    logger.debug({
        message: 'Access token read from storage',
        method: 'getToken'
    });
     */
}

/**
 * Uses https://github.com/Valve/fingerprintjs(2) to return a unique browser fingerprint
 * See https://github.com/Memba/Kidoju-Server/issues/35
 * @function getFingerPrint
 * @returns {*}
 */
function getFingerPrint() {
    if ($.type(fpromise) === CONSTANTS.UNDEFINED) {
        const dfd = $.Deferred();
        // if ($.isFunction(Fingerprint2)) {
        // Use https://github.com/Valve/fingerprintjs2
        const options = {}; // default options
        Fingerprint2.get(options, (components) => {
            const values = components.map((component) => component.value);
            const hash = Fingerprint2.x64hash128(
                values.join(CONSTANTS.EMPTY),
                31 // seed
            );
            dfd.resolve(hash);
        });
        /*
        } else if ($.isFunction(Fingerprint)) {
            // Use https://github.com/Valve/fingerprintjs
            const hash = new Fingerprint({
                canvas: true,
                ie_activex: false,
                screen_resolution: true
            }).get();
            dfd.resolve(hash);
        } else if (navigator && navigator.userAgent) {
            // See http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
            let hash = 0;
            let chr;
            const agent = navigator.userAgent;
            // hash = 0;
            for (let i = 0; i < agent.length; i++) {
                chr = agent.charCodeAt(i);
                hash = (hash << 5) - hash + chr;
                hash |= 0; // Convert to 32bit integer
            }
            // We have experienced a negative fingerprint on PhantomJS in Travis-CI
            dfd.resolve(Math.abs(hash));
        }
        */
        fpromise = dfd.promise();
    }
    return fpromise;
}

/**
 * Get headers for $.ajax calls
 * @function getHeaders
 * @param options
 * @returns {*}
 */
function getHeaders(options = { security: true, trace: true }) {
    assert.isNonEmptyPlainObject(
        options,
        assert.format(assert.messages.isNonEmptyPlainObject.default, 'options')
    );
    const headers = {};
    // Authorization header
    if (options.security) {
        const token = getToken();
        if ($.type(token) === CONSTANTS.STRING) {
            headers.Authorization = `Bearer ${token}`;
        }
    }
    // X-App-Scheme header
    // config.constants.appScheme allows an authorized redirection to authenticate mobile apps
    if (
        config &&
        config.constants &&
        $.type(config.constants.appScheme) === CONSTANTS.STRING
    ) {
        headers['X-App-Scheme'] = config.constants.appScheme;
    }
    // X-Trace-ID header
    if (options.trace) {
        const trace = $('input[type="hidden"][name="trace"]').val();
        if ($.type(trace) === CONSTANTS.STRING) {
            headers['X-Trace-ID'] = trace.substr(0, 36); // should be long enough for a guid = 32 hex + 4 dashes
        }
    }
    return headers;
}

/**
 * Reads and clears the oAuth state from session storage
 * @function getState
 */
function getState() {
    // use localStorage in Android and IE
    const cache =
        RX_IEXPLORE.test(navigator.userAgent) ||
        RX_ANDROID.test(navigator.userAgent)
            ? localCache
            : sessionCache;
    const state = cache.getItem(STATE);
    cache.removeItem(STATE);
    /*
    // We already get logs from cache
    logger.debug({
        message: `state read and cleared from ${cache._storeName}`,
        method: 'getState',
        data: { state }
    });
    */
    return state;
}

/**
 * Saves an oAuth state in session storage
 * @function setState
 * @param state
 */
function setState(state) {
    assert.type(
        CONSTANTS.STRING,
        state,
        assert.format(assert.messages.type.default, 'state', CONSTANTS.STRING)
    );
    // use localStorage in Android and IE
    const cache =
        RX_IEXPLORE.test(navigator.userAgent) ||
        RX_ANDROID.test(navigator.userAgent)
            ? localCache
            : sessionCache;
    cache.setItem(STATE, state, 5 * 60 * 1000); // 5 minutes
    /*
    // We already get logs from cache
    logger.debug({
        message: `state added to ${cache._storeName}`,
        method: 'setState',
        data: { state }
    });
    */
}

/**
 * Saves a token to storage
 * @function setToken
 * @param token
 */
function setToken(token) {
    assert.isNonEmptyPlainObject(
        token,
        assert.format(assert.messages.isNonEmptyPlainObject.default, 'token')
    );
    assert.type(
        CONSTANTS.STRING,
        token.value, // access_token
        assert.format(
            assert.messages.type.default,
            'token.value',
            CONSTANTS.STRING
        )
    );
    assert.type(
        CONSTANTS.NUMBER,
        token.ttl, // expires
        assert.format(
            assert.messages.type.default,
            'token.ttl',
            CONSTANTS.NUMBER
        )
    );
    assert.type(
        CONSTANTS.NUMBER,
        token.ts, // ts
        assert.format(
            assert.messages.type.default,
            'token.ts',
            CONSTANTS.NUMBER
        )
    );
    localCache.setItem(TOKEN, token.value, token.ttl, token.ts);
    /*
    // We already get logs from cache
    logger.debug({
        message: 'access token added to storage',
        method: 'setToken',
        data: { token }
    });
    */
}

/**
 * Get a uuid (similar to kendo.guid except it uses crypto API)
 * @see https://github.com/Memba/Kidoju-Server/issues/31#issuecomment-77665098
 * @function uuid
 * @returns {string}
 */
function uuid() {
    let uid = '';
    const crypto = window.crypto || window.msCrypto;
    if (
        crypto &&
        typeof crypto.getRandomValues === 'function' &&
        typeof Uint8Array === 'function' &&
        navigator.userAgent.indexOf('PhantomJS') < 0
    ) {
        // Note: $.isFunction(Uint8Array) is false in Safari for Windows
        // which is good because crypto.getRandomValues(new Uint8Array(32)) returns undefined
        const Seed = function Seed() {
            let b = [];
            Array.apply([], crypto.getRandomValues(new Uint8Array(32))).forEach(
                (c) => {
                    b = b.concat(c.toString(16).split(''));
                }
            );
            return function seed(i) {
                let t = '';
                switch (i) {
                    case 8:
                        t += `-${b.pop()}`;
                        break;
                    case 12:
                        t += '-4';
                        break;
                    case 16:
                        /* eslint-disable no-bitwise */
                        t += `-${((parseInt(b.pop(), 16) & 0x3) | 0x8).toString(
                            16
                        )}`;
                        /* eslint-enable no-bitwise */
                        break;
                    case 20:
                        t += `-${b.pop()}`;
                        break;
                    default:
                        t += b.pop();
                }
                return t;
            };
        };
        const seed = Seed();
        for (let i = 0; i < 32; i++) {
            uid += seed(i);
        }
    } else {
        // see http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            /* eslint-disable no-bitwise */
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
            /* eslint-enable no-bitwise */
        });
    }
    return uid;
}

/**
 * Parse the access token into a Javascript object
 * @function parseToken
 * @param url
 * @returns {*|jQuery}
 */
function parseToken(url) {
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
            data: { url, pos },
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
                error,
            });
        } else {
            getFingerPrint()
                .then((fingerPrint) => {
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
                            error,
                        });
                    } else {
                        // purge unwanted properties (especially state and token_type)
                        // as stated in https://github.com/Memba/Kidoju-Server/issues/29
                        const token = {
                            value: qs[ACCESS_TOKEN],
                            ttl: qs[EXPIRES] || qs[EXPIRES_IN],
                            ts: qs.ts, // TODO where do we get it from?
                        };
                        dfd.resolve(token);
                        logger.debug({
                            message: 'token verified',
                            method: 'parseToken',
                            data: { token },
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
 * Export
 */
export {
    clearToken,
    format,
    getAccessTokenHashPos,
    cleanHistory,
    cleanUrl,
    getToken,
    getFingerPrint,
    getHeaders,
    getState,
    setState,
    setToken,
    uuid,
    parseToken,
};

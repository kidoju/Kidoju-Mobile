/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import { localCache, sessionCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
// import Fingerprint from '../vendor/valve/fingerprint';
import Fingerprint2 from '../vendor/valve/fingerprint2';

const logger = new Logger('rapi.util');
const { navigator } = window;
const TOKEN = 'token';
const ACCESS_TOKEN = 'access_token';
const TOKEN_TYPE = 'token_type';
const EXPIRES_IN = 'expires_in';
const STATE = 'state';
const RX_ANDROID = /Android/;
const RX_IEXPLORE = /;\s(MSIE\s|Trident\/)/;
let fp; // Cache fingerprint promise

/**
 * Clear (delete) an access token from storage
 */
export function clearToken() {
    localCache.removeItems(TOKEN);
    logger.debug({
        message: 'Access token removed from storage',
        method: 'clearToken'
    });
}

/**
 * Simple format function to replace {n} with the (n)th arg
 * @param message
 * @param args
 * @returns {*}
 */
export function format(message, ...args) {
    let ret = message;
    args.forEach((arg, idx) => {
        // Note: we definitely need \\ in the following regular expression
        const rx = new RegExp(`\\{${idx.toString()}\\}`, 'g');
        ret = ret.replace(
            rx,
            $.isFunction((arg || {}).toString) ? arg.toString() : ''
        );
    });
    return ret;
}

/**
 * Get the position of the hash preceding the access_token
 * @param url
 * @returns {number}
 */
export function getAccessTokenHashPos(url) {
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
        url.indexOf(`${CONSTANTS.HASH}${EXPIRES_IN}`), // Others might have them in a different order
        url.indexOf(`${CONSTANTS.HASH}${STATE}`)
        // Note: Should we add error?
    );
}

/**
 * Remove any token information from a url
 * Check its use in rapi.getSignInUrl where returnUrl would normally be window.location.href
 * In a browser, the whole authentication process redirects the browser to returnUrl#access_token=...
 * When authenticating again from this location, one would keep adding #access_token=... to the returnUrl, thus a requirement for cleaning it
 * @param url
 * @returns {*}
 */
export function cleanUrl(url) {
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
export function getToken(raw = false) {
    logger.debug({
        message: 'Access token read from storage',
        method: 'getToken'
    });
    return localCache.getItem(TOKEN, raw);
}

/**
 * Uses https://github.com/Valve/fingerprintjs(2) to return a unique browser fingerprint
 * See https://github.com/Memba/Kidoju-Server/issues/35
 * @returns {*}
 */
export function getFingerPrint() {
    if ($.type(fp) === CONSTANTS.UNDEFINED) {
        const dfd = $.Deferred();
        // if ($.isFunction(Fingerprint2)) {
        // Use https://github.com/Valve/fingerprintjs2
        const options = {}; // default options
        Fingerprint2.get(options, components => {
            const values = components.map(component => component.value);
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
        fp = dfd.promise();
    }
    return fp;
}

/**
 * Get headers for $.ajax calls
 * @param options
 * @returns {*}
 */
export function getHeaders(options = { security: true, trace: true }) {
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
        const trace = $('#trace').val();
        if ($.type(trace) === CONSTANTS.STRING) {
            headers['X-Trace-ID'] = trace.substr(0, 36); // should be long enough for a guid = 32 hex + 4 dashes
        }
    }
    return headers;
}

/**
 * Reads and clears the oAuth state from session storage
 */
export function getState() {
    // use localStorage in Android and IE
    const cache =
        RX_IEXPLORE.test(navigator.userAgent) ||
        RX_ANDROID.test(navigator.userAgent)
            ? localCache
            : sessionCache;
    const state = cache.getItem(STATE);
    cache.removeItems(STATE);
    logger.debug({
        message: `state read and cleared from ${cache._storeName}`,
        method: 'getState',
        data: { state }
    });
    return state;
}

/**
 * Saves an oAuth state in session storage
 * @param state
 */
export function setState(state) {
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
    logger.debug({
        message: `state added to ${cache._storeName}`,
        method: 'setState',
        data: { state }
    });
}

/**
 * Saves a token to storage
 * @param token
 */
export function setToken(token) {
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
            'token.ttel',
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
    logger.debug({
        message: 'access token added to storage',
        method: 'setToken',
        data: { token }
    });
}

/**
 * Get a uuid (similar to kendo.guid except it uses crypto API)
 * @see https://github.com/Memba/Kidoju-Server/issues/31#issuecomment-77665098
 * @returns {number}
 */
export function uuid() {
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
        const Seed = function() {
            let b = [];
            Array.apply([], crypto.getRandomValues(new Uint8Array(32))).forEach(
                c => {
                    b = b.concat(c.toString(16).split(''));
                }
            );
            return function(i) {
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
        uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            /* eslint-disable no-bitwise */
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
            /* eslint-enable no-bitwise */
        });
    }
    return uid;
}

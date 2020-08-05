/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: rapi.oauth.es6 has $.ajax methods corresponding to the json API endpoints of Kidoju.Server

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import AjaxBase from './rapi.base.es6';
import {
    cleanUrl,
    clearToken,
    format,
    getFingerPrint,
    getHeaders,
    setState,
    setToken,
    uuid,
} from './rapi.util.es6';

const logger = new Logger('rapi.oauth');
const PROVIDERS = ['facebook', 'google', 'live', 'twitter'];

/**
 * Returns the authentication provider URL to call for signing in
 * @method getSignInUrl
 * @param provider
 * @param returnUrl
 * @returns {*}
 */
function getSignInUrl(provider, returnUrl) {
    assert.enum(
        PROVIDERS,
        provider,
        assert.format(assert.messages.enum.default, 'provider', PROVIDERS)
    );
    assert.match(
        CONSTANTS.RX_URL,
        returnUrl,
        assert.format(
            assert.messages.match.default,
            'returnUrl',
            CONSTANTS.RX_URL
        )
    );
    logger.info({
        message: '$.ajax',
        method: 'getSignInUrl',
        data: { provider, returnUrl },
    });
    const ajax = $.Deferred();
    const logout = $.Deferred();
    if (provider === 'live' && $.type(window.cordova) === CONSTANTS.UNDEFINED) {
        // chrome apps?
        // logout from Live to force a login screen (no need to clean up because there should be a redirection)
        const iframe = $('#live-logout');
        if (iframe.length) {
            iframe.attr('src', 'https://login.live.com/oauth20_logout.srf');
        } else {
            $(
                '<iframe id="live-logout" src="https://login.live.com/oauth20_logout.srf" style="position: absolute; left: -1000px; visibility: hidden;"></iframe>'
            ).appendTo('body');
        }
        // Note: we need to duplicate the jQuery selector since we might have just added the iframe
        $('#live-logout').on('load', () => {
            logout.resolve();
        });
    } else {
        logout.resolve();
    }
    $.when(getFingerPrint(), logout.promise())
        .then((fp) => {
            const state = `${fp}-${uuid()}`;
            setState(state);
            $.ajax({
                cache: false,
                data: {
                    returnUrl: cleanUrl(returnUrl),
                    state,
                },
                headers: getHeaders({ trace: true }),
                type: AjaxBase.HTTP.GET,
                url: format(config.uris.rapi.oauth.signIn, provider),
            })
                .then(ajax.resolve)
                .catch(ajax.reject);
        })
        .catch(ajax.reject);
    return ajax;
}

/**
 * Sign out
 * @method signOut
 * @returns {*}
 */
function signOut() {
    logger.info({
        message: '$.ajax',
        method: 'signOut',
    });
    return $.ajax({
        contentType: CONSTANTS.FORM_CONTENT_TYPE,
        headers: getHeaders({ security: true, trace: true }),
        type: AjaxBase.HTTP.POST,
        url: config.uris.rapi.oauth.signOut,
    }).always(() => {
        clearToken();
    });
}

/**
 * Refresh token
 * @method.refresh
 * @returns {*}
 */
function refresh() {
    logger.info({
        message: '$.ajax',
        method: 'refresh',
    });
    return $.ajax({
        cache: false,
        headers: getHeaders({ security: true, trace: true }),
        type: AjaxBase.HTTP.GET,
        url: config.uris.rapi.oauth.refresh,
    })
        .then((token) => {
            setToken(token);
        })
        .catch(() => {
            clearToken();
        });
}

/**
 * Revoke toekn
 * @returns {*}
 */
function revoke() {
    logger.info({
        message: '$.ajax',
        method: 'revoke',
    });
    return $.ajax({
        contentType: CONSTANTS.FORM_CONTENT_TYPE,
        headers: getHeaders({ security: true, trace: true }),
        type: AjaxBase.HTTP.POST,
        url: config.uris.rapi.oauth.revoke,
    }).always(() => {
        clearToken();
    });
}

/**
 * Export
 */
export { getSignInUrl, signOut, refresh, revoke };

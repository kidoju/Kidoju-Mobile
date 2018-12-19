/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

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
    uuid
} from './rapi.util.es6';

const logger = new Logger('rapi.oauth');
const PROVIDERS = ['facebook', 'google', 'live', 'twitter'];

/**
 * Returns the authentication provider URL to call for signing in
 * @param provider
 * @param returnUrl
 * @returns {*}
 */
export function getSignInUrl(provider, returnUrl) {
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
        method: 'auth.getSignInUrl',
        data: { provider, returnUrl }
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
        $('#live-logout').on('load', () => {
            logout.resolve();
        });
    } else {
        logout.resolve();
    }
    logout.promise().always(() => {
        const state = `${getFingerPrint()}-${uuid()}`;
        setState(state);
        $.ajax({
            cache: false,
            data: {
                returnUrl: cleanUrl(returnUrl),
                state
            },
            headers: getHeaders({ trace: true }),
            type: AjaxBase.HTTP.GET,
            url: format(uris.rapi.root + uris.rapi.oauth.signIn, provider)
        })
            .done(ajax.resolve)
            .fail(ajax.reject);
    });
    return ajax;
}

/**
 * Sign out
 * @returns {*}
 */
export function signOut() {
    logger.info({
        message: '$.ajax',
        method: 'auth.signout'
    });
    return $.ajax({
        contentType: CONSTANTS.FORM_CONTENT_TYPE,
        headers: getHeaders({ security: true, trace: true }),
        type: AjaxBase.HTTP.POST,
        url: root() + uris.rapi.oauth.signOut
    }).always(() => {
        clearToken();
    });
}

/**
 * Refresh token
 * @returns {*}
 */
export function refresh() {
    logger.info({
        message: '$.ajax',
        method: 'refresh'
    });
    return $.ajax({
        cache: false,
        headers: getHeaders({ security: true, trace: true }),
        type: AjaxBase.HTTP.GET,
        url: uris.rapi.root + uris.rapi.oauth.refresh
    })
        .done(token => {
            debugger;
            setToken(token);
        })
        .fail(() => {
            clearToken();
        });
}

/**
 * Revoke toekn
 * @returns {*}
 */
export function revoke() {
    logger.info({
        message: '$.ajax',
        method: 'revoke'
    });
    return $.ajax({
        contentType: CONSTANTS.FORM_CONTENT_TYPE,
        headers: getHeaders({ security: true, trace: true }),
        type: AjaxBase.HTTP.POST,
        url: uris.rapi.root + uris.rapi.oauth.revoke
    }).always(() => {
        clearToken();
    });
}

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// rapi.controller.es6 is the base controller to add authentication to a web page

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import {
    cleanHistory,
    clearToken,
    getToken,
    parseToken,
    setToken
} from './rapi.util.es6';
import { refresh } from './rapi.oauth.es6';

const { cordova, chrome, location } = window;
const { Observable } = window.kendo;
const logger = new Logger('rapi.controller');

/**
 * BaseController
 * @class BaseController
 * @extends Observable
 */
const BaseController = Observable.extend({
    /**
     * Init
     * @constructor init
     */
    init() {
        Observable.fn.init.call(this);
        this.initializers =
            // In cordova, we collect the token in SafariViewController ou InAppBrowser
            $.type(cordova) === CONSTANTS.UNDEFINED &&
            // In chrome apps, the following throws an error
            !(chrome && $.isEmptyObject(chrome.app))
                ? [this.readAccessToken()]
                : [];
    },

    /**
     * readAccessToken
     * Detect and parse #access_token form window.location (see oAuth callback)
     * CAREFUL: getHeaders({ security: true, trace: true }) is therefore not available until this is executed
     * @function readAccessToken
     */
    readAccessToken() {
        const dfd = $.Deferred();
        parseToken(location.href)
            .then(token => {
                if ($.type(token) !== CONSTANTS.NULL) {
                    // a null value means there is no token in window.location
                    logger.debug({
                        message: 'token found in url',
                        method: 'parseToken',
                        data: token
                    });
                    // setToken in localStorage
                    setToken(token);
                    // Clean history (to avoid parsing the token again when clicking back)
                    cleanHistory();
                }
                // With or without a token in window.location,
                // we need to periodically renew the token before it expires
                this.renewAccessToken();

                dfd.resolve({ token });
            })
            .catch(error => {
                logger.error({
                    message: 'Error parsing token from url',
                    method: 'parseToken',
                    error
                });
                // Let's simply discard any attempt to set a token that does not pass the checks here above
                clearToken();
                // Pass error
                dfd.reject(error);
            });
        return dfd.promise();
    },

    /**
     * renewAccessToken
     * Ensure a refreshed token before expiration
     * @method renewAccessToken
     */
    renewAccessToken() {
        let token = getToken();
        if ($.isPlainObject(token) && token.expires <= 24 * 60 * 60) {
            // if we have a short life token (Google and Live), i.e. expires === 3600,
            // read token every minute and refresh no later than 15 minutes before expiration
            setInterval(() => {
                // we need to read the token again because if we remain a couple of hours on the same page (e.g. test designer), the token might have already been refreshed
                token = getToken();
                if (
                    $.isPlainObject(token) &&
                    Date.now() > token.ts + (token.expires - 10 * 60) * 1000
                ) {
                    console.log('-----------------------------> RENEW TOKEN!');
                    refresh();
                }
            }, 60 * 1000); // every minute
        }
        // TODO Remove session ME when required
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
});

/**
 * Default export
 */
export default BaseController;

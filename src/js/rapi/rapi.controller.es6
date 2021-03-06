/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// rapi.controller.es6 is the base controller to add authentication to a web page

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
import 'kendo.data';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { isMobileApp } from '../data/data.util.es6';
import {
    cleanHistory,
    clearToken,
    getToken,
    parseToken,
    setToken,
} from './rapi.util.es6';
import { refresh } from './rapi.oauth.es6';

const {
    data: { ObservableObject },
    logToConsole,
} = window.kendo;
const logger = new Logger('rapi.controller');

/**
 * BaseController
 * @class BaseController
 * @extends ObservableObject
 */
const BaseController = ObservableObject.extend({
    /**
     * Init
     * @constructor init
     */
    init(options = {}) {
        const { features, initializers } = options;
        ObservableObject.fn.init.call(this);
        // Add initializers
        /*
        this._initializers =
            // In cordova, we collect the token in SafariViewController ou InAppBrowser
            $.type(cordova) === CONSTANTS.UNDEFINED &&
            // In chrome apps, the following throws an error
            !(chrome && $.isEmptyObject(chrome.app))
                ? [this.readAccessToken()]
                : [];
        */
        if (!isMobileApp()) {
            this._initializers.push(this.readAccessToken());
        }
        // Add initializers
        if (Array.isArray(initializers)) {
            initializers.forEach((initializer) => {
                if (initializer && $.isFunction(initializer.promise)) {
                    this._initializers.push(initializer);
                } else {
                    throw new TypeError('Expecting a jQuery promise');
                }
            });
        }
        // Add features
        if (Array.isArray(features)) {
            this.addFeatures(features);
        }
    },

    /**
     * Event handlers
     * Bound to the change, set and get events of this ObservableObject
     * Defined as part of a feature
     *
     * feature = {
     *     events: {
     *         change: (e) => { ... }
     *         get: (e) => { ... }
     *         set: (e) => { ... }
     *     }
     * }
     */
    _events: [],

    /**
     * Initializers
     */
    _initializers: [],

    /**
     * Loaders
     */
    _loaders: {},

    /**
     * Resetters
     */
    _resetters: {},

    /**
     * Resizers
     */
    _resizers: {},

    /**
     * VIEW selectors
     */
    VIEW: {},

    /**
     * VIEW_MODEL selectors
     */
    VIEW_MODEL: {},

    /**
     * Run the initializers
     * @returns {*}
     */
    ready() {
        return $.when(...this._initializers);
        // Consider raising ready event
    },

    /**
     * Add UI features
     * @param features
     */
    addFeatures(features) {
        const prototype = Object.getPrototypeOf(this);
        features.forEach((feature) => {
            const { _name } = feature;
            if (feature && $.type(_name) === CONSTANTS.STRING) {
                Object.keys(feature).forEach((key) => {
                    const prop = feature[key];
                    if (key === 'events' && $.isPlainObject(prop)) {
                        // `change`, `get` and `set` events of ObservableObject
                        Object.keys(prop).forEach((event) => {
                            const handler = prop[event];
                            if (
                                ['change', 'get', 'set'].indexOf(event) > -1 &&
                                $.isFunction(handler)
                            ) {
                                // Note cannot extend without breaking bindings
                                this._events[_name] = this._events[_name] || {};
                                this._events[_name][event] = handler.bind(this);
                                this.bind(event, this._events[_name][event]);
                            }
                        });
                    } else if (key === 'load' && $.isFunction(prop)) {
                        // Loaders (viewModel data)
                        this._loaders[_name] = prop.bind(this);
                    } else if (key === 'reset' && $.isFunction(prop)) {
                        // Resetters (viewModel data)
                        this._resetters[_name] = prop.bind(this);
                    } else if (key === 'resize' && $.isFunction(prop)) {
                        // Resizers, i.e. handlers for window resize event, including orientation change
                        this._resizers[_name] = prop.bind(this);
                    } else if (key === 'VIEW' && $.isPlainObject(prop)) {
                        // VIEW selectors (ids, class names)
                        $.extend(true, this.VIEW, prop);
                    } else if (key === 'VIEW_MODEL' && $.isPlainObject(prop)) {
                        // VIEW_MODEL selectors
                        $.extend(true, this.VIEW_MODEL, prop);
                    } else if (
                        $.type(prototype[key]) === CONSTANTS.UNDEFINED &&
                        $.isFunction(prop)
                    ) {
                        // All other functions and event handlers, especially view init, view show and buttons clicks
                        // BEWARE: With MVVM, there is a chance that this will be rebound to another object
                        // this[key] = prop.bind(this);
                        prototype[key] = prop;
                    } else if ($.type(this[key]) === CONSTANTS.UNDEFINED) {
                        // Anything else
                        if (key !== '_name') {
                            this.set(key, prop);
                        }
                    } else {
                        // Avoid duplicate names across features
                        throw new Error(
                            `${feature._name} uses key ${key} which has already been added (duplicate)`
                        );
                    }
                });
            }
        });
    },

    /**
     * Load data into viewModel
     * @returns {*}
     */
    load() {
        const promises = [];
        Object.keys(this._loaders).forEach((key) => {
            const prop = this._loaders[key];
            if ($.isFunction(prop)) {
                promises.push(prop());
            }
        });
        return $.when(...promises);
    },

    /**
     * Reset viewModel
     */
    reset() {
        Object.keys(this._resetters).forEach((key) => {
            const prop = this._resetters[key];
            if ($.isFunction(prop)) {
                prop();
            }
        });
    },

    /**
     * Resize view
     * @param e
     * @param view
     */
    resize(e, view) {
        Object.keys(this._resizers).forEach((key) => {
            const prop = this._resizers[key];
            if ($.isFunction(prop)) {
                prop(e, view);
            }
        });
    },

    /**
     * readAccessToken
     * Detect and parse #access_token form window.location (see oAuth callback)
     * CAREFUL: getHeaders({ security: true, trace: true }) is therefore not available until this is executed
     * @function readAccessToken
     * @param url
     */
    readAccessToken(url = window.location.href) {
        // TODO assert url
        const dfd = $.Deferred();
        parseToken(url)
            .then((token) => {
                if ($.type(token) !== CONSTANTS.NULL) {
                    // a null value means there is no token in window.location
                    logger.debug({
                        message: 'token found in url',
                        method: 'parseToken',
                        data: token,
                    });
                    // setToken in localStorage
                    setToken(token);
                    // Clean history (to avoid parsing the token again when clicking back)
                    cleanHistory();
                }
                // With or without a token in window.location,
                // we need to periodically renew the token before it expires
                this.renewAccessToken();
                // Return token
                dfd.resolve(token);
            })
            .catch((error) => {
                logger.error({
                    message: 'Error parsing token from url',
                    method: 'parseToken',
                    error,
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
                    logToConsole('-----------------------------> RENEW TOKEN!');
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
    },
});

/**
 * Default export
 */
export default BaseController;

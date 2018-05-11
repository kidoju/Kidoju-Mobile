/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true */
/* globals define: false, __VERSION__: false */

(function (f, define) {
    'use strict';
    define([], f);
})(function () {

    'use strict';

    /**
     * Note: This file is built with webpack using ./web_modules/jsx-loader.
     * Values are read from any of the JSON config files in ./webapp/config
     * depending on NODE_ENV: development, test or production (by default).
     */

    (function () {

        var app = window.app = window.app || {};

        function normalize (str) {
            return str
            .replace(/[\/]+/g, '/')
            .replace(/\/\?/g, '?')
            .replace(/\/\#/g, '#')
            .replace(/\:\//g, '://')
            .replace(/[\/\#\?]*$/, '');
        }

        /**
         * Join url bits, adding slashes where required
         * TODO: This could be improved to account for . and ..
         * TODO use url.resolve, but convertFormat should be alled after otherwise { and } are converted
         */
        var url = {
            join: function () {
                // Actually we first join with slashes, then we replace double or triple slashes, except when preceded by colons like in http://
                return Array.prototype.slice.call(arguments).join('/').replace(/([^:])[\/]{2,}/g, '$1/');

                // The following was are nodeJS url join function
                // var joined = [].slice.call(arguments, 0).join('/');
                // return normalize(joined);
            }
        };

        /**
         * application DEBUG mode
         * @type {boolean}
         */
        app.DEBUG = '<%- debug %>'.toLowerCase() === 'true';

        /**
         * application version
         * Note: this is the only way to do it because version does not exist in configuration files loaded by ./web_modules/jsx_loader
         */
        app.version = __VERSION__;

        /**
         * application locales
         */
        app.locales = JSON.parse('<%- JSON.stringify(locales) %>');

        /**
         * Constants
         * Note: This is replaced by app.constants.js in Kidoju-Mobile
         * @type {}
         */
        app.constants = app.constants || { // Makes sure Kidoju-Mobile wins

            // Application scheme
            appScheme: '<%- application.scheme %>',

            // Facebook clientID
            facebookAppId: '<%- facebook.clientID %>',

            // Twitter account
            twitterAccount: '<%- twitter.account %>'

        };

        /**
         * Convert nodejs printf like formatting strings into Kendo UI formatting strings
         * where %s placeholders are replaced with {i} placeholders
         * @see https://nodejs.org/api/util.html#util_util_format_format
         * @see http://docs.telerik.com/kendo-ui/api/javascript/kendo#methods-format
         * @param value
         * @returns {*}
         */
        function convertFormat (value) {
            var i = 0;
            var ret = value;
            var rx = /%[sdj]/;
            while (typeof ret === 'string' && rx.test(ret)) {
                ret = ret.replace(rx, '{' + i + '}');
                i++;
            }
            return ret;
        }

        /**
         * Assets for Asset Manager
         * @type {{audio: {collections, extensions, schemes, transport}, image: {collections, extensions, schemes, transport}, video: {collections, extensions, schemes, transport}}}
         */
        app.assets = {

            audio: {
                collections: JSON.parse('<%- JSON.stringify(assets.audio.collections) %>'),
                extensions: JSON.parse('<%- JSON.stringify(assets.audio.extensions) %>'),
                schemes: JSON.parse('<%- JSON.stringify(assets.audio.schemes) %>')
                // transport: JSON.parse('<%- JSON.stringify(assets.audio.transport) %>')
            },

            icon: {
                collections: JSON.parse('<%- JSON.stringify(assets.icon.collections) %>'),
                extensions: JSON.parse('<%- JSON.stringify(assets.icon.extensions) %>'),
                schemes: JSON.parse('<%- JSON.stringify(assets.icon.schemes) %>')
                // transport: JSON.parse('<%- JSON.stringify(assets.icon.transport) %>')
            },

            image: {
                collections: JSON.parse('<%- JSON.stringify(assets.image.collections) %>'),
                extensions: JSON.parse('<%- JSON.stringify(assets.image.extensions) %>'),
                schemes: JSON.parse('<%- JSON.stringify(assets.image.schemes) %>')
                // transport: JSON.parse('<%- JSON.stringify(assets.image.transport) %>')
            },

            video: {
                collections: JSON.parse('<%- JSON.stringify(assets.video.collections) %>'),
                extensions: JSON.parse('<%- JSON.stringify(assets.video.extensions) %>'),
                schemes: JSON.parse('<%- JSON.stringify(assets.video.schemes) %>')
                // transport: JSON.parse('<%- JSON.stringify(assets.video.transport) %>')
            }

        };

        /**
         * Application URIs
         * See /wepapp/middleware/locals.js
         * ATTENTION, contrary to server-side uris client-side uris are all concatenated with root expect for rapi
         */
        app.uris = {
            rapi: {
                root: '<%- uris.rapi.root %>',
                logger: url.join('<%- uris.rapi.root %>', convertFormat('<%- uris.rapi.logger %>')),
                web: {
                    search: url.join('<%- uris.rapi.root %>', convertFormat('<%- uris.rapi.web.search %>'))
                }
            },
            cdn: {
                icons: url.join('<%- uris.cdn.root %>', convertFormat('<%- uris.cdn.icons %>'))
            },
            help: {
                root: '<%- uris.help.root %>'
            },
            mobile: {
                icons: convertFormat('<%- uris.mobile.icons %>'),
                pictures: convertFormat('<%- uris.mobile.pictures %>')
            },
            webapp: {
                editor: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.editor %>')),
                error: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.error %>')),
                finder: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.finder %>')),
                home: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.home %>')),
                locale: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.locale %>')), // redirection when changing locale
                logger: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.logger %>')),
                ping: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.ping %>')),
                player: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.player %>')),
                proxy: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.proxy %>')),
                public: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.public %>')),
                rss: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.rss %>')),
                sitemap: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.sitemap %>')),
                summary: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.summary %>')),
                support: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.support %>')),
                user: url.join('<%- uris.webapp.root %>', convertFormat('<%- uris.webapp.user %>')),
                workerlib: url.join('<%- uris.webpack.root %>', convertFormat('<%- uris.webapp.workerlib %>'))
            }
        };

        /**
         * Logger configuration
         */
        app.logger = app.logger || {};
        app.logger.level = parseInt('<%- level %>', 10) || 0;
        app.logger.endPoint = app.uris.webapp.logger;

    }());

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

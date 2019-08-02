/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* globals __VERSION__: false */

/*
 * Note: This file is built with webpack using ./web_modules/jsx-loader.
 * Values are read from any of the JSON config files in ./webapp/config
 * depending on NODE_ENV: development, test or production (by default).
 */

/**
 * application DEBUG mode
 */
window.DEBUG = window.DEBUG || '<%- debug %>'.toLowerCase() === 'true';

/**
 * Join url bits, adding slashes where required
 * TODO: This could be improved to account for . and ..
 */
const url = {
    resolve(...args) {
        // Actually we first join with slashes, then we replace double or triple slashes, except when preceded by colons like in http://
        return Array.prototype.slice
            .call(args)
            .join('/')
            .replace(/([^:])[/]{2,}/g, '$1/');
    }
};

/**
 * Convert nodejs printf like formatting strings into Kendo UI formatting strings
 * where %s placeholders are replaced with {i} placeholders
 * @see https://nodejs.org/api/util.html#util_util_format_format
 * @see http://docs.telerik.com/kendo-ui/api/javascript/kendo#methods-format
 * @param value
 * @returns {*}
 */
function convertFormat(value) {
    let i = 0;
    let ret = value;
    const rx = /%[sdj]/;
    while (typeof ret === 'string' && rx.test(ret)) {
        ret = ret.replace(rx, `{${i}}`);
        i += 1;
    }
    return ret;
}

/**
 * The config object
 */
const config = {};

/**
 * Version
 * Note: this is the only way to do it
 * because version does not exist in configuration files loaded by ./web_modules/jsx_loader
 */
try {
    // Code is packaged via WebPack
    config.version = __VERSION__;
} catch (ex) {
    // ReferenceError: __VERSION__ is not defined
    // and JSON.parse fails
    // Code is not packaged (i.e. unit tests)
    config.version = false;
}

/**
 * Locales
 */
config.locales = config.version
    ? JSON.parse('<%- JSON.stringify(locales) %>')
    : ['en', 'fr'];

/**
 * Constants
 * Note: This is replaced by app.constants.js in Kidoju-Mobile
 */
config.constants = {
    // Makes sure Kidoju-Mobile wins

    // Application scheme
    appScheme: '<%- application.scheme %>',

    // Facebook clientID
    facebookAppId: '<%- facebook.clientID %>',

    // Twitter account
    twitterAccount: '<%- twitter.account %>'
};

/**
 * Assets
 */
try {
    config.assets = {
        audio: {
            collections: JSON.parse(
                '<%- JSON.stringify(assets.audio.collections) %>'
            ),
            extensions: JSON.parse(
                '<%- JSON.stringify(assets.audio.extensions) %>'
            ),
            schemes: JSON.parse('<%- JSON.stringify(assets.audio.schemes) %>')
            // transport: JSON.parse('<%- JSON.stringify(assets.audio.transport) %>')
        },

        icon: {
            collections: JSON.parse(
                '<%- JSON.stringify(assets.icon.collections) %>'
            ),
            extensions: JSON.parse(
                '<%- JSON.stringify(assets.icon.extensions) %>'
            ),
            schemes: JSON.parse('<%- JSON.stringify(assets.icon.schemes) %>')
            // transport: JSON.parse('<%- JSON.stringify(assets.icon.transport) %>')
        },

        image: {
            collections: JSON.parse(
                '<%- JSON.stringify(assets.image.collections) %>'
            ),
            extensions: JSON.parse(
                '<%- JSON.stringify(assets.image.extensions) %>'
            ),
            schemes: JSON.parse('<%- JSON.stringify(assets.image.schemes) %>')
            // transport: JSON.parse('<%- JSON.stringify(assets.image.transport) %>')
        },

        video: {
            collections: JSON.parse(
                '<%- JSON.stringify(assets.video.collections) %>'
            ),
            extensions: JSON.parse(
                '<%- JSON.stringify(assets.video.extensions) %>'
            ),
            schemes: JSON.parse('<%- JSON.stringify(assets.video.schemes) %>')
            // transport: JSON.parse('<%- JSON.stringify(assets.video.transport) %>')
        }
    };
} catch (ex) {
    // Without WebPack JSON.parse fails
    config.assets = {
        audio: {
            collections: [],
            extensions: [],
            schemes: {}
        },

        icon: {
            collections: [],
            extensions: [],
            schemes: {}
        },

        image: {
            collections: [],
            extensions: [],
            schemes: {}
        },

        video: {
            collections: [],
            extensions: [],
            schemes: {}
        }
    };
}

/**
 * URIs - See /wepapp/middleware/locals.js
 * ATTENTION, contrary to server-side uris,
 * client-side uris are all concatenated with root
 */
config.uris = {
    cdn: {
        icons: url.resolve(
            '<%- uris.cdn.root %>',
            convertFormat('<%- uris.cdn.icons %>')
        )
    },
    help: {
        root: '<%- uris.help.root %>'
    },
    mobile: {
        icons: convertFormat('<%- uris.mobile.icons %>'),
        pictures: convertFormat('<%- uris.mobile.pictures %>')
    },
    rapi: {
        root: '<%- uris.rapi.root %>',
        logger: url.resolve(
            '<%- uris.rapi.root %>',
            convertFormat('<%- uris.rapi.logger %>')
        ),
        oauth: {
            refresh: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.oauth.refresh %>')
            ),
            revoke: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.oauth.revoke %>')
            ),
            signIn: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.oauth.signIn %>')
            ),
            signOut: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.oauth.signOut %>')
            )
        },
        v1: {
            activities: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.activities %>')
            ),
            activity: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.activity %>')
            ),
            categories: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.categories %>')
            ),
            // TODO files
            me: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.me %>')
            ),
            myActivities: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.myActivities %>')
            ),
            mySummaries: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.mySummaries %>')
            ),
            summaries: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.summaries %>')
            ),
            summary: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.summary %>')
            ),
            // TODO organizations and organization
            user: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.user %>')
            ),
            versions: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.versions %>')
            ),
            version: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.v1.version %>')
            )
            // TODO draft
        },
        web: {
            search: url.resolve(
                '<%- uris.rapi.root %>',
                convertFormat('<%- uris.rapi.web.search %>')
            )
        }
    },
    webapp: {
        billing: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.billing %>')
        ),
        editor: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.editor %>')
        ),
        error: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.error %>')
        ),
        finder: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.finder %>')
        ),
        group: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.group %>')
        ),
        home: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.home %>')
        ),
        locale: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.locale %>')
        ), // redirection when changing locale
        logger: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.logger %>')
        ),
        messaging: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.messaging %>')
        ),
        organization: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.organization %>')
        ),
        ping: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.ping %>')
        ),
        player: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.player %>')
        ),
        proxy: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.proxy %>')
        ),
        public: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.public %>')
        ),
        rss: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.rss %>')
        ),
        sitemap: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.sitemap %>')
        ),
        summary: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.summary %>')
        ),
        support: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.support %>')
        ),
        user: url.resolve(
            '<%- uris.webapp.root %>',
            convertFormat('<%- uris.webapp.user %>')
        ),
        workerlib: url.resolve(
            '<%- uris.webpack.root %>',
            convertFormat('<%- uris.webapp.workerlib %>')
        )
    }
};

/**
 * Logger
 * @type {{}}
 */
config.logger = {
    level: parseInt('<%- level %>', 10) || 0,
    endPoint: config.uris.rapi.logger
};

/**
 * Default export
 */
export default config;

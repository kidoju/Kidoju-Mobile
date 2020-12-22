/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.binder';
import 'kendo.userevents';
import 'kendo.mobile.application';
import 'kendo.mobile.pane';
import { compareVersions } from '../common/pongodb.util.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import dialogs from '../plugins/plugins.dialogs.es6'
import inAppBrowser from '../plugins/plugins.inappbrowser.es6';
import safariViewController from '../plugins/plugins.safariviewcontroller.es6';
import splashScreen from '../plugins/plugins.splashscreen.es6'
import BaseController from '../rapi/rapi.controller.es6';
import AjaxPing from '../rapi/rapi.ping.es6';
// import { getSignInUrl, signOut } from '../rapi/rapi.oauth.es6';
import { VIEW } from '../ui/ui.constants.es6';
import config from './app.config.jsx';
import db from './app.db.es6';
import __ from './app.i18n.es6';

const logger = new Logger('app.controller');

/**
 * AppController
 * The page controller contains any UI function and event handler
 * IMPORTANT: Controller methods can call viewModel methods but not the contrary
 * @class AppController
 * @extends Observable
 */
const AppController = BaseController.extend({
    /**
     * Function to handle open Url
     * @param url
     */
    handleOpenURL(url) {
        const { appScheme, helpUrl } = config.constants;
        const rxAppScheme = new RegExp(`^${appScheme}://([a-z]{2})/([esx])/([0-9a-f]{24})($|/|\\?|#)`);
        // if (url.startsWith(`${appScheme}://oauth`)) {
        if (url.indexOf(`${appScheme}://oauth`) === 0) {
            // The whole oAuth flow is documented at
            // https://medium.com/@jlchereau/stop-using-inappbrowser-for-your-cordova-phonegap-oauth-flow-a806b61a2dc5
            feature.readAccessTokenAndLoadUser(url);
        } else if (rxAppScheme.test(url)) {
            const matches = rxAppScheme.exec(url);
            // Note: we have already tested the url, so we know there is a match
            const language = matches[1];
            const summaryId = matches[3];
            if (language === __.locale) {
                app.controller.application.navigate(`${CONSTANTS.HASH}${VIEW.SUMMARY}?language=${encodeURIComponent(language)}&summaryId=${encodeURIComponent(summaryId)}`);
            } else {
                app.notification.warning(__('notifications.openUrlLanguage'));
            }
        } else if (new RegExp(`^${helpUrl}`).test(url) || /^(itms-apps|market|ms-windows-store):\/\//.test(url)) {
            // For whatever reason, calling help in mobile._openHelp triggers handleOpenUrl on iOS (but not on Android)
            // For whatever reason, calling review schemes in mobile._requestAppStoreReview triggers handleOpenUrl on iOS (but not on Android)
            $.noop();
        } else {
            logger.warn({
                message: 'App scheme called with unknown url',
                method: 'handleOpenURL',
                data: { url: url },
            });
            app.notification.warning(__('notifications.openUrlUnknown'));
        }
        // Trying to accelerate the hiding of the splash screen does not help
        // if (mobile.support.splashscreen) { mobile.splashscreen.hide(); }
    },

    /**
     * Check for required upgrade
     */
    checkForUpgrade() {
        // Log initialization
        logger.debug({
            message: 'Checking for upgrade',
            method: 'checkForUpgrade'
        });
        const dfd = $.Deferred();
        const ping = new AjaxPing();
        ping.get()
            .then((result) => {
                if (
                    result.compatible &&
                    compareVersions(config.version, result.compatible) < 0
                ) {
                    // This is an old version of the application, so request an upgrade
                    dfd.reject(new Error('Oops, incompatible app, please upgrade for app store'));
                } else {
                    // This is a current version of the application, so simply upgrade the database
                    db.upgrade().then(dfd.resolve).catch(dfd.reject);
                }
            })
            .catch(dfd.reject);
        return dfd.promise();
    },

    /**
     * Fix skin variant
     * @param theme
     */
    _fixThemeVariant(theme) {
        assert.type(CONSTANTS.STRING, theme, assert.format(assert.messages.type.default, 'theme', CONSTANTS.STRING));
        var skin = theme.split('-');
        if (Array.isArray(skin) && skin.length > 1) {
            $(document.body).addClass('km-' + theme);
        }
    },

    /**
     * Localize application
     */
    localize(locale) {
        $.noop(locale);
    },
});

/**
 * Default export
 */
export default AppController;

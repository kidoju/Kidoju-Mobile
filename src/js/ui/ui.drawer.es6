/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.drawer';
import __ from '../app/app.i18n.es6';
import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import dialogs from '../plugins/plugins.dialogs.es6';
import barcodeScanner from '../plugins/plugins.barcodescanner.es6';
import inAppBrowser from '../plugins/plugins.inappbrowser.es6';

const QR_CODE = 'QR_CODE';
const RX_QR_CODE_MATCH = /^https?:\/\/[^/]+\/([a-z]{2})\/s\/([a-f0-9]{24})$/i;

const { attr } = window.kendo;
const logger = new Logger('ui.drawer');

/**
 * Drawer feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'drawer',

    /**
     * View
     */
    VIEW: {
        DRAWER: 'drawer',
    },

    /**
     * Event handler trigger when clicking an item in the drawer menu
     * @param e
     */
    onDrawerListViewClick(e) {
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        assert.instanceof(
            $,
            e.item,
            assert.format(
                assert.messages.instanceof.default,
                'e.item',
                'jQuery'
            )
        );
        e.preventDefault();
        const { controller, viewModel } = app;
        const command = e.item.attr(attr('command')); // TODO replace with action
        const language = __.locale(); // viewModel.get(VIEW_MODEL.LANGUAGE);
        const userId = viewModel.get(VIEW_MODEL.USER.SID);
        switch (command) {
            case 'categories':
                controller.application.navigate(
                    `${CONSTANTS.HASH}${
                        VIEW.CATEGORIES
                    }?language=${encodeURIComponent(language)}`
                );
                break;
            case 'scan':
                app.viewModel.scanQRCode();
                break;
            case 'activities':
                controller.application.navigate(
                    `${CONSTANTS.HASH}${
                        VIEW.ACTIVITIES
                    }?language=${encodeURIComponent(
                        language
                    )}&userId=${encodeURIComponent(userId)}`
                );
                break;
            case 'settings':
                controller.application.navigate(
                    `${CONSTANTS.HASH}${
                        VIEW.SETTINGS
                    }?userId=${encodeURIComponent(userId)}`
                );
                break;
            case 'help':
            default:
                app.viewModel.openHelp();
                break;
        }
    },

    /**
     * Scan a QR Code
     * @see https://github.com/phonegap/phonegap-plugin-barcodescanner
     * @private
     */
    scanQRCode() {
        if (barcodeScanner.ready()) {
            barcodeScanner.scan(
                // Success callback
                (result) => {
                    // result.canceled is 0 or 1 - 1 is when pressing the cancel button
                    // result also has properties text which contains our url and format which should be `QR_CODE`
                    if (!result.cancelled) {
                        assert.type(
                            CONSTANTS.STRING,
                            result.text,
                            assert.format(
                                assert.messages.type.default,
                                'result.text',
                                CONSTANTS.STRING
                            )
                        );
                        assert.equal(
                            QR_CODE,
                            result.format,
                            assert.format(
                                assert.messages.equal.default,
                                'result.format',
                                QR_CODE
                            )
                        );
                        const matches = result.text.match(RX_QR_CODE_MATCH);
                        if (Array.isArray(matches) && matches.length > 2) {
                            const language = matches[1];
                            const summaryId = matches[2];
                            const { controller, viewModel } = app;
                            if (
                                viewModel.get(VIEW_MODEL.LANGUAGE) === language
                            ) {
                                controller.application.navigate(
                                    `{CONSTANTS.HASH}${
                                        VIEW.SUMMARY
                                    }?language=${encodeURIComponent(
                                        language
                                    )}&summaryId=${encodeURIComponent(
                                        summaryId
                                    )}`
                                );
                            } else {
                                app.notification.warning(
                                    __('notifications.scanLanguageWarning')
                                );
                            }
                        } else {
                            app.notification.warning(
                                __('notifications.scanMatchWarning')
                            );
                        }
                    }
                },
                // Error callback
                (error) => {
                    dialogs.error(__('notifications.scanFailure'));
                    logger.error({
                        message: 'Scan failure',
                        method: 'mobile._scanQRCode',
                        error,
                    });
                },
                // Options
                {
                    preferFrontCamera: false, // iOS and Android
                    showFlipCameraButton: false, // iOS and Android
                    prompt: __('notifications.scanPrompt'), // supported on Android only
                    formats: QR_CODE, // default: all but PDF_417 and RSS_EXPANDED
                    // "orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
                }
            );
        }
    },

    /**
     * Open help
     * @private
     */
    openHelp() {
        const { helpUrl } = config.constants;
        assert.match(
            CONSTANTS.RX_URL,
            helpUrl,
            assert.format(
                assert.messages.match.default,
                'config.constants.helpUrl',
                CONSTANTS.RX_URL
            )
        );
        logger.debug({
            message: 'Opening the help content',
            method: 'mobile._openHelp',
            data: { url: helpUrl },
        });
        if (inAppBrowser.ready()) {
            // We are simply opening a custom url scheme and we do not need SafariViewController for that
            // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
            inAppBrowser.open(helpUrl, '_system', 'usewkwebview=yes');
        } else {
            window.open(helpUrl, '_system');
        }
        /*
        // TODO add analytics
        if (mobile.support.ga) {
            mobile.ga.trackEvent(
                ANALYTICS.CATEGORY.GENERAL,
                ANALYTICS.ACTION.HELP,
                app.constants.helpUrl
            );
        }
        */
    },
};

/**
 * Default export
 */
export default feature;

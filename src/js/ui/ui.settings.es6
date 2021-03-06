/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.application';
import config from '../app/app.config.jsx';
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import barcodeScanner from '../plugins/plugins.barcodescanner.es6';
import socialSharing from '../plugins/plugins.socialsharing.es6';

const logger = new Logger('ui.settings');

/**
 * Settings feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'settings',

    /**
     * View
     */
    VIEW: {
        SETTINGS: {
            _: 'settings',
        },
    },

    /**
     * ViewModel
     */
    VIEW_MODEL: {
        LANGUAGE: 'language',
        LANGUAGES: 'languages',
        THEME: 'theme',
        THEMES: 'themes',
    },

    /**
     * Reset
     */
    reset() {
        app.viewModel.resetLanguage();
        app.viewModel.resetTheme();
    },

    /**
     * Reset language
     */
    resetLanguage() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        viewModel.set(VIEW_MODEL.LANGUAGE, __.locale);
        viewModel.set(VIEW_MODEL.LANGUAGES, []);
    },

    /**
     * Reset theme
     */
    resetTheme() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        viewModel.set(VIEW_MODEL.THEME, 'flat'); // app.theme.name()
        viewModel.set(VIEW_MODEL.THEMES, []);
    },

    /**
     * Barcode scanner feature detection (remove drawer menu options)
     * @returns {*}
     */
    hasBarCodeScanner$() {
        return barcodeScanner.ready();
    },

    /**
     * Whether the app has a constant author id
     */
    hasConstantAuthorId$() {
        return !!config.constants.authorId;
    },

    /**
     * Whether the app has a constant language
     */
    hasConstantLanguage$() {
        return !!config.constants.language;
    },

    /**
     * Whether the app has a constant theme
     */
    hasConstantTheme$() {
        return !!config.constants.theme;
    },

    /**
     * Whether the app has a constant top category id
     */
    hasConstantRootCategoryId$() {
        return !!config.constants.rootCategoryId[__.locale];
    },

    /**
     * Social Sharing feature detection (remove actionsheet menu option)
     * @returns {protocol|*|SocialSharing}
     */
    hasSocialSharing$() {
        return socialSharing.ready() && !config.constants.appleKidSafety;
    },

    /**
     * Allow browsing the internet
     * Dissabled only help
     * @returns {boolean}
     */
    hasInternetBrowsing$() {
        return !config.constants.appleKidSafety;
    },

    /**
     * Language name from selected value
     */
    language$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const value = viewModel.get(VIEW_MODEL.LANGUAGE);
        const found = viewModel.get(VIEW_MODEL.LANGUAGES).filter(
            (language) => language.value === value
        );
        return found[0] && found[0].text;
    },

    /**
     * Theme name form selected value
     */
    theme$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const value = viewModel.get(VIEW_MODEL.THEME);
        const found = viewModel.get(VIEW_MODEL.THEMES).filter(
            (theme) => theme.value === value
        );
        return found[0] && found[0].text;
    },

    /**
     * Application version
     */
    version$() {
        // TODO use cordova-plugin-buildinfo
        return config.version;
    },

    /**
     * Event handler triggered when showing the Settings view
     * Note: the view event is triggered each time the view is requested
     * @param e
     */
    onSettingsViewShow(e) {
        return app.viewModel.onGenericViewShow(e);
    },

    /**
     * Event handler triggered when clicking the Switch button of the Settings view
     * @param e
     */
    onSettingsSwitchClick(e) {
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        assert.instanceof(
            $,
            e.button,
            assert.format(
                assert.messages.instanceof.default,
                'e.button',
                'jQuery'
            )
        );
        const {
            viewModel,
            viewModel: { VIEW },
        } = app;
        // Navigate to the user view
        viewModel.application.navigate(`${CONSTANTS.HASH}${VIEW.USER._}`);
    },
};

/**
 * Default export
 */
export default feature;

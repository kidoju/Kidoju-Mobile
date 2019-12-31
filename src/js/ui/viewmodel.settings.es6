/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/*
 * IMPORTANT: Never call app.controller from here
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import __ from '../app/app.i18n.es6';
import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import barcodeScanner from '../plugins/plugins.barcodescanner.es6';
import socialSharing from '../plugins/plugins.socialsharing.es6';
import { VIEW_MODEL } from './ui.constants.es6';

const logger = new Logger('viewmodel.settings');

/**
 * Extension
 */
const extension = {
    /**
     * Reset
     */
    reset() {
        this.resetLanguage();
        this.resetTheme();
    },

    /**
     * Reset language
     */
    resetLanguage() {
        this.set(VIEW_MODEL.LANGUAGE, __.locale);
        this.set(VIEW_MODEL.LANGUAGES, []);
    },

    /**
     * Reset theme
     */
    resetTheme() {
        this.set(VIEW_MODEL.THEME, 'flat'); // app.theme.name()
        this.set(VIEW_MODEL.THEMES, []);
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
        const value = this.get(VIEW_MODEL.LANGUAGE);
        const found = this[VIEW_MODEL.LANGUAGES].filter(language => {
            return language.value === value;
        });
        return found[0] && found[0].text;
    },

    /**
     * Theme name form selected value
     */
    theme$() {
        const value = this.get(VIEW_MODEL.THEME);
        const found = this[VIEW_MODEL.THEMES].filter(theme => {
            return theme.value === value;
        });
        return found[0] && found[0].text;
    },

    /**
     * Application version
     */
    version$() {
        // TODO use cordova-plugin-buildinfo
        return config.version;
    }
};

/**
 * Default export
 */
export default extension;

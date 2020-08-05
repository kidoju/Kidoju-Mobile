/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';

// var LANGUAGE = 'language';
// var THEME = 'theme';
// First 4 bytes define the language
// Following 4 bytes define the selected top category
// var LEVEL_CHARS = 4;
// var TOP_LEVEL_CHARS = 2 * LEVEL_CHARS;
// var RX_TOP_LEVEL_MATCH = new RegExp(`^[a-z0-9]{${  TOP_LEVEL_CHARS  }}0{${  24 - TOP_LEVEL_CHARS  }}$`);
// var RX_LANGUAGE = /^[a-z]{2}$/;
// var RX_MONGODB_ID = /^[a-f0-9]{24}$/;
// var localStorage; // = window.localStorage;
// An exception is catched when localStorage is explicitly disabled in browser settings (Safari Private Browsing)
// try { localStorage = window.localStorage; } catch (ex) {}

/**
 * These constants allow specialized versions of the app
 * Note:  This feeds config.constants in app.config.jsx
 */
const constants = {
    // The mobile application id corresponding to the app scheme in mongoDB
    appId: '5aa7b81cb706873118ffb5b4',
    // The application name
    appName: 'Kidoju',
    // TODO: logo to display in drawer...
    // The application scheme
    appScheme: 'com.kidoju.mobile',
    // For app store ratings
    appStoreUrl: {
        // TODO: these are all for testing with the twitter app
        // ----------------------------------------------------------------------------------------
        // For iOS, see:
        // https://developer.apple.com/library/content/qa/qa1629/_index.html
        // https://developer.apple.com/library/content/qa/qa1633/_index.html
        // ios: 'itms-apps://itunes.apple.com/app/viewContentsUserReviews/id333903271?action=write-review',
        // ios: 'itms-apps://itunes.apple.com/app/id333903271?action=write-review',
        ios:
            'itms-apps://itunes.apple.com/app/id1185442548?action=write-review',
        // ----------------------------------------------------------------------------------------
        // For Android, see:
        // https://developer.android.com/distribute/marketing-tools/linking-to-google-play.html
        // android: 'market://details?id=com.twitter.android',
        android: 'market://details?id=com.kidoju.mobile',
        // ----------------------------------------------------------------------------------------
        // For Fire OS, see:
        // https://developer.amazon.com/blogs/post/Tx3A1TVL67TB24B/Linking-To-the-Amazon-Appstore-for-Android.html
        // 'amazon-fireos': 'amzn://apps/android?p=com.twitter.android',
        'amazon-fireos': 'amzn://apps/android?p=com.kidoju.mobile',
        // ----------------------------------------------------------------------------------------
        // For windows (untested)
        windows: 'ms-windows-store://pdp/?ProductId=9wzdncrfj140',
    },
    // localForage database name
    dbName: 'KidojuDB',
    // Google analytics
    gaTrackingId: 'UA-63281999-4',
    // Feedback url
    feedbackUrl: 'https://www.kidoju.com/support/{0}/contact?about={1}', // TODO use gitter?
    // Help system
    helpUrl: 'https://help.kidoju.com',
    // Guideline 1.3 - Safety - Kids Category
    // Set to false for 13+ years old
    // appleKidSafety: /iphone|ipod|ipad/i.test(window.navigator.userAgent),
    appleKidSafety: false,
    // TODO: Maybe it makes more sense to have a generic filter
    // The authorId to search summaries from (until we support organizationId)
    authorId: undefined,
    // authorId: '56d6ee31bc039c1a00062950',
    // The app language
    language: undefined,
    // language: 'en',
    // language: 'fr',
    // The root categoryId
    rootCategoryId: {
        en: undefined,
        // en: '000100010000000000000000', // General Knowledge
        // en: '000100020000000000000000', // Reception
        // en: '000100030000000000000000', // Year 1
        fr: undefined,
        // fr: '000200010000000000000000' // Culture Générale
        // fr: '000200030000000000000000' // Maternelle
        // fr: '000200040000000000000000' // CP
    },
    // The app theme
    theme: undefined, // 'flat'
    // TODO: We might also want the possibility to hide categories for museum apps
};

/*
// Assert values
if ($.type(app.constants.authorId) !== CONSTANTS.UNDEFINED) {
    assert.match(RX_MONGODB_ID, app.constants.authorId, assert.format(assert.messages.match.default, 'app.constants.authorId', RX_MONGODB_ID));
}
if ($.type(app.constants.language) !== CONSTANTS.UNDEFINED) {
    assert.match(RX_LANGUAGE, app.constants.language, assert.format(assert.messages.match.default, 'app.constants.language', RX_LANGUAGE));
}
if ($.type(app.constants.rootCategoryId.en) !== CONSTANTS.UNDEFINED) {
    assert.match(RX_TOP_LEVEL_MATCH, app.constants.rootCategoryId.en, assert.format(assert.messages.match.default, 'app.constants.rootCategoryId.en', RX_TOP_LEVEL_MATCH));
}
if ($.type(app.constants.rootCategoryId.fr) !== CONSTANTS.UNDEFINED) {
    assert.match(RX_TOP_LEVEL_MATCH, app.constants.rootCategoryId.fr, assert.format(assert.messages.match.default, 'app.constants.rootCategoryId.fr', RX_TOP_LEVEL_MATCH));
}
// Set locale
if (typeof (app && app.i18n) !== CONSTANTS.UNDEFINED) {
    throw new Error('Load app.constants before app.i18n.');
} else if (localStorage && app.constants.language) {
    localStorage.setItem(LANGUAGE, app.constants.language);
}

// Set theme
if (typeof (app && app.theme) !== CONSTANTS.UNDEFINED) {
    throw new Error('Load app.constants before app.theme.');
} else if (localStorage && app.constants.theme) {
    localStorage.setItem(THEME, app.constants.theme);
}
*/

/**
 * Default export
 */
export default constants;

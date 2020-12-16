/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/**
 * LAYOUT
 */
const LAYOUT = {
    MAIN: 'main-layout',
};

/**
 * MISC
 */
const LEVEL_CHARS = 4;
const TOP_LEVEL_CHARS = 2 * LEVEL_CHARS;
const MISC = {
    LEVEL_CHARS,
    TOP_LEVEL_CHARS,
    RX_TOP_LEVEL_MATCH: new RegExp(
        `^[a-z0-9]{${TOP_LEVEL_CHARS}}0{${24 - TOP_LEVEL_CHARS}}$`
    ),
    SIGNIN_PAGE: 3, // Last page of walkthrough tour
};

/**
 * VIEW
 */
const VIEW = {
    CATEGORIES: 'categories',
    CORRECTION: 'correction',
    DRAWER: 'drawer',
    // FAVOURITES: 'favourites',
    FINDER: 'finder',
    NETWORK: 'network',
    PLAYER: 'player',
    SCORE: 'score',
    SETTINGS: 'settings',
    SUMMARY: 'summary',
    SIGNIN: 'signin',
    SYNC: 'sync',
    USER: 'user',
};

/**
 * VIEW_MODEL
 */
const VIEW_MODEL = {
    CATEGORIES: 'categories',
    /*
    CURRENT: {
        $: 'current',
        ID: 'current.id',
        SCORE: 'current.score',
        TEST: 'current.test',
        UPDATED: 'current.updated',
        VERSION: {
            LANGUAGE: 'current.version.language',
            SUMMARYID: 'current.version.summaryId',
            VERSION_ID: 'current.version.versionId'
        }
    },
     */
    LANGUAGE: 'language',
    LANGUAGES: 'languages',
    SELECTED_PAGE: 'selectedPage',
    SUMMARY: {
        _: 'summary',
        CATEGORY_ID: 'summary.categoryId',
        DESCRIPTION: 'summary.description',
        ID: 'summary.id',
        LANGUAGE: 'summary.language',
        TITLE: 'summary.title',
    },
    SUMMARIES: 'summaries',
    THEME: 'theme',
    THEMES: 'themes',
    USER: {
        _: 'user',
        ROOT_CATEGORY_ID: 'user.rootCategoryId',
        FIRST_NAME: 'user.firstName',
        ID: 'user.id',
        // LANGUAGE: 'user.language',
        LAST_NAME: 'user.lastName',
        LAST_SYNC: 'user.lastSync',
        LAST_USE: 'user.lastUse',
        PROVIDER: 'user.provider',
        REVIEW_STATE: 'user.reviewState',
        SID: 'user.sid',
        // THEME: 'user.theme'
    },
    USERS: 'users',
    VERSION: {
        _: 'version',
        // ID: 'version.id',
        // LANGUAGE: 'version.language',
        STREAM: {
            PAGES: 'version.stream.pages',
        },
        // SUMMARYID: 'version.summaryId'
    },
    VERSIONS: 'versions',
};

/**
 * Export
 */
export { LAYOUT, MISC, VIEW, VIEW_MODEL };

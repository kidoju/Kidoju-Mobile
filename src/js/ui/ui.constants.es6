/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */


/**
 * LAYOUT
 */
const LAYOUT = {
    MAIN: 'main-layout'
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
    SIGNIN_PAGE: 3 // Last page of walkthrough tour
};

/**
 * VIEW
 */
const VIEW = {
    ACTIVITIES: 'activities',
    CATEGORIES: 'categories',
    CORRECTION: 'correction',
    DEFAULT: 'activities', // <---------- url is '/'
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
    USER: 'user'
};

/**
 * VIEW_MODEL
 */
const VIEW_MODEL = {
    ACTIVITIES: 'activities',
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
            SUMMARY_ID: 'current.version.summaryId',
            VERSION_ID: 'current.version.versionId'
        }
    },
     */
    LANGUAGE: 'language',
    LANGUAGES: 'languages',
    SELECTED_PAGE: 'selectedPage',
    SUMMARY: 'summary',
    SUMMARY_: {
        CATEGORY_ID: 'summary.categoryId',
        DESCRIPTION: 'summary.description',
        ID: 'summary.id',
        LANGUAGE: 'summary.language',
        TITLE: 'summary.title'
    },
    SUMMARIES: 'summaries',
    THEME: 'theme',
    THEMES: 'themes',
    USER: 'user',
    USER_: {
        ROOT_CATEGORY_ID: 'user.rootCategoryId',
        FIRST_NAME: 'user.firstName',
        ID: 'user.id',
        // LANGUAGE: 'user.language',
        LAST_NAME: 'user.lastName',
        LAST_SYNC: 'user.lastSync',
        LAST_USE: 'user.lastUse',
        PROVIDER: 'user.provider',
        REVIEW_STATE: 'user.reviewState',
        SID: 'user.sid'
        // THEME: 'user.theme'
    },
    USERS: 'users',
    VERSION: 'version',
    VERSION_: {
        // ID: 'version.id',
        // LANGUAGE: 'version.language',
        STREAM_: {
            PAGES: 'version.stream.pages'
        }
        // SUMMARY_ID: 'version.summaryId'
    },
    VERSIONS: 'versions'
};

/**
 * Export
 */
export { LAYOUT, MISC, VIEW, VIEW_MODEL };

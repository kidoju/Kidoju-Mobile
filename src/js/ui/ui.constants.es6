/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/**
 * MISC
 */

const MISC = {
    SIGNIN_PAGE: 3, // Last page of walkthrough tour
};

/**
 * VIEW_MODEL
 */
const VIEW_MODEL = {
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

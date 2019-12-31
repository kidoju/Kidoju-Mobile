/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/*
 * IMPORTANT: Never call app.controller from here
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
// import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';
// import Logger from '../common/window.logger.es6';
import { LazyCategoryDataSource } from '../data/data.category.lazy.es6';
import { MISC, VIEW_MODEL } from './ui.constants.es6';

// const logger = new Logger('viewmodel.categories');

/**
 * Extension
 */
const extension = {
    /**
     * Reset
     */
    reset() {
        this.resetCategories();
    },

    /**
     * Reset categories
     */
    resetCategories() {
        this[VIEW_MODEL.CATEGORIES] = new LazyCategoryDataSource(); // models.LazyCategoryDataSource(),
    },

    /**
     * Return an array of top-level categories (ordered by id)
     */
    topCategories$() {
        return this[VIEW_MODEL.CATEGORIES]
            .data()
            .filter(category => {
                return MISC.RX_TOP_LEVEL_MATCH.test(category.id);
            })
            .sort((a, b) => {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0;
            });
    }
};

/**
 * Default export
 */
export default extension;

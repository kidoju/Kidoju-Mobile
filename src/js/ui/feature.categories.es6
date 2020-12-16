/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import app from '../common/window.global.es6';
import {MISC, VIEW_MODEL} from './ui.constants';
import {LazyCategoryDataSource} from '../data/data.category.lazy';

/**
 * Categories feature
 */
const feature = {
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
        this.set(VIEW_MODEL.CATEGORIES, new LazyCategoryDataSource()); // models.LazyCategoryDataSource(),
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
    },

    /**
     * Event handler triggered when showing the Categories view
     * Note: the view event is triggered each time the view is requested
     * @param e
     */
    onCategoriesViewShow(e) {
        return app.controller.onGenericViewShow(e);
    }
};

/**
 * Default export
 */
export default feature;

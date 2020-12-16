/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import app from '../common/window.global.es6';
import { LazyCategoryDataSource } from '../data/data.category.lazy.es6';

/**
 * Categories feature
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
        SETTINGS: 'settings',
    },

    /**
     * ViewModel
     */
    VIEW_MODEL: {
        CATEGORIES: 'categories',
    },

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
        this.set(this.VIEW_MODEL.CATEGORIES, new LazyCategoryDataSource());
    },

    /**
     * Return an array of top-level categories (ordered by id)
     */
    topCategories$() {
        return this[this.VIEW_MODEL.CATEGORIES]
            .data()
            .filter((category) => true) // TODO MISC.RX_TOP_LEVEL_MATCH.test(category.id))
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
        return app.viewModel.onGenericViewShow(e);
    },
};

/**
 * Default export
 */
export default feature;

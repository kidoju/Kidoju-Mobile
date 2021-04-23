/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.dropdownlist';
import 'kendo.mobile.view';
import 'kendo.mobile.listview';
import app from '../common/window.global.es6';
// import Logger from '../common/window.logger.es6';
import { LazyCategoryDataSource } from '../data/data.category.lazy.es6';

const LEVEL_CHARS = 4;
const TOP_LEVEL_CHARS = 2 * LEVEL_CHARS;
const RX_TOP_LEVEL_MATCH = new RegExp(
    `^[a-z0-9]{${TOP_LEVEL_CHARS}}0{${24 - TOP_LEVEL_CHARS}}$`
);

// const logger = new Logger('ui.categories');

/**
 * Categories feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'categories',

    /**
     * View
     */
    VIEW: {
        CATEGORIES: {
            _: 'categories',
        },
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
        app.viewModel.resetCategories();
    },

    /**
     * Reset categories
     */
    resetCategories() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        viewModel.set(VIEW_MODEL.CATEGORIES, new LazyCategoryDataSource());
    },

    /**
     * Load categories
     */
    loadCategories() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        return viewModel.get(VIEW_MODEL.CATEGORIES).read();
    },

    /**
     * Loader
     */
    load() {
        return app.viewModel.loadCategories();
    },

    /**
     * Return an array of top-level categories (ordered by id)
     */
    topCategories$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        return viewModel.get(VIEW_MODEL.CATEGORIES)
            .data()
            .filter((category) => RX_TOP_LEVEL_MATCH.test(category.id))
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

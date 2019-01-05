/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import config from '../app/app.config.jsx';
import i18n from '../app/app.i18n.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxCategories from '../rapi/rapi.categories.es6';
import BaseModel from './data.base.es6';
import { normalizeSchema } from './data.util.es6';
import CacheCollectionStrategy from './strategy.cache.collection.es6';
import LazyRemoteTransport from './transports.remote.lazy.es6';

const {
    data: { DataSource },
    format
} = window.kendo;

/**
 * LazyCategory
 * @class LazyCategory
 * @extends BaseModel
 */
export const LazyCategory = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false
        },
        ageGroup: {
            type: CONSTANTS.NUMBER,
            editable: false,
            parse(value) {
                // defaultValue: 0 does not work as we get null
                // default parse function is return kendo.parseFloat(value);
                return parseInt(value, 10) || 255;
            }
        },
        count: {
            type: CONSTANTS.NUMBER,
            editable: false,
            parse(value) {
                // defaultValue: 0 does not work as we get null
                // default parse function is return kendo.parseFloat(value);
                return parseInt(value, 10) || 0;
            }
        },
        /*
        description: {
            type: CONSTANTS.STRING,
            editable: false
        },
        */
        icon: {
            type: CONSTANTS.STRING,
            editable: false
        },
        language: {
            type: CONSTANTS.STRING,
            editable: false
        },
        name: {
            type: CONSTANTS.STRING,
            editable: false
        },
        path: {
            defaultValue: [],
            editable: false
        }
    },
    /**
     * The depth used to add a margin to simulate a tree in mobile app list views
     * Top categories get a depth$ of zero
     * We use `depth` because `level` is used in kendo.ui.TreeView
     */
    depth$() {
        // return (this.get(this.idField).replace(RX_TRIM_LEVEL, '').length - TOP_LEVEL_CHARS) / LEVEL_CHARS;
        return (this.get('path') || []).length;
    },
    /**
     * The icon representing the category
     */
    icon$() {
        return format(
            window.cordova ? config.uris.mobile.icons : config.uris.cdn.icons,
            this.get('icon')
        );
    },
    /**
     * The id of the parent category
     * @returns {string}
     */
    parentId$() {
        // Top categories have a parentId$ which is undefined
        // var trimmedId = this.get(this.idField).replace(RX_TRIM_LEVEL, '');
        // if (trimmedId.length >= TOP_LEVEL_CHARS + LEVEL_CHARS) {
        //     return (trimmedId.substr(0, trimmedId.length - LEVEL_CHARS) + '0000000000000000').substr(0, 24);
        // }
        const path = this.get('path') || [];
        let ret;
        if (path.length) {
            ret = path[path.length - 1].id;
        }
        return ret;
    },
    /**
     * The filter to list all summaries belonging to a category
     * @returns {XML|void|string|*|{REPLACE, REPLACE_NEGATIVE}}
     */
    filter$() {
        return $.param({
            filter: {
                logic: 'and',
                filters: [
                    {
                        field: 'categoryId',
                        operator: 'gte',
                        value: this.get('id')
                    },
                    {
                        field: 'categoryId',
                        operator: 'lte',
                        value: this.get('id').replace(/0000/g, 'ffff')
                    }
                ]
            }
        });
    }
});

/**
 * lazyCategoryTransport
 */
export const lazyCategoryTransport = new CacheCollectionStrategy({
    key: `categories.${i18n.locale()}`,
    transport: new LazyRemoteTransport({
        collection: new AjaxCategories({
            partition: {
                language: i18n.locale()
            }
        })
    })
    // ttl: 24 * 60 * 60
});

/**
 * LazyCategoryDataSource
 * @class LazySummaryDataSource
 * @extends DataSource
 */
export const LazyCategoryDataSource = DataSource.extend({
    init(options = {}) {
        DataSource.fn.init.call(
            this,
            Object.assign(options, {
                transport: lazyCategoryTransport,
                schema: normalizeSchema({
                    modelBase: LazyCategory,
                    model: LazyCategory
                })
            })
        );
    }
});

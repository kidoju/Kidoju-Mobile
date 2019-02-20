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
    data: { DataSource, HierarchicalDataSource, Node, ObservableArray },
    format
} = window.kendo;
const LEVEL_CHARS = 4;
const TOP_LEVEL_CHARS = 2 * LEVEL_CHARS;
const RX_TRIM_LEVEL = new RegExp(`(0{${LEVEL_CHARS}})+$`, 'g');
const F4 = new Array(LEVEL_CHARS).fill('f').join(CONSTANTS.EMPTY);
const O16 = new Array(24 - TOP_LEVEL_CHARS).fill('0').join(CONSTANTS.EMPTY);

/**
 * LazyCategory
 * @class LazyCategory
 * @extends BaseModel
 */
const LazyCategory = BaseModel.define({
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
        //     return (trimmedId.substr(0, trimmedId.length - LEVEL_CHARS) + O16).substr(0, 24);
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
                        value: this.get('id').replace(RX_TRIM_LEVEL, F4)
                    }
                ]
            }
        });
    }
});

/**
 * lazyCategoryTransport
 */
const lazyCategoryTransport = new CacheCollectionStrategy({
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
 * @class LazyCategoryDataSource
 * @extends DataSource
 */
const LazyCategoryDataSource = DataSource.extend({
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

/**
 * LazyRummage
 * @class LazyRummage
 * @extends Node
 */
const LazyRummage = Node.define({
    id: 'id',
    hasChildren: true,
    children: {
        schema: {
            data: 'items'
        }
    },
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
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
        /*
        language: {
            type: CONSTANTS.STRING,
            editable: false
        },
        */
        name: {
            type: CONSTANTS.STRING,
            editable: false
        },
        path: {
            // Different from the path in LazyCategory, this is for favourites/bookmarks
            type: CONSTANTS.STRING,
            editable: false
        },
        type: {
            // 0 = groups/folders, 1 = home, 2 = categories, 3 = favourites/bookmarks
            type: CONSTANTS.NUMBER,
            editable: false,
            defaultValue: 2 // categories
        }
    },

    /* This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

    /**
     * Return the href the category or bookmark points at
     * @returns {*}
     */
    href$() {
        const root = `${window.location.protocol}//${window.location.host}`;
        let finder = format(config.uris.webapp.finder, i18n.locale());
        finder =
            finder.indexOf(root) === 0 ? finder.substr(root.length) : finder;
        switch (this.get('type')) {
            case 1: // home
                // Note: without hashbang, the page is reloaded
                return finder + CONSTANTS.HASHBANG;
            case 2: // categories
                return (
                    finder +
                    CONSTANTS.HASHBANG +
                    $.param({
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
                                    value: this.get('id').replace(
                                        RX_TRIM_LEVEL,
                                        F4
                                    )
                                }
                            ]
                        }
                    })
                );
            case 3: // favourites
                return this.get('path');
            default:
                // including 0 (no hypertext link)
                return null; // should not be used!!!
        }
    },

    /**
     * Return a complete icon path (from CDN)
     * @returns {*}
     */
    icon$() {
        return format(
            window.cordova ? config.uris.mobile.icons : config.uris.cdn.icons,
            this.get('icon')
        );
    },

    /**
     * An array of parent categories up the the root of the hierarchy
     * Note: does not contains the current category
     */
    path$() {
        const ret = [];
        let item = this;
        while (
            $.isFunction(item.parent) &&
            item.parent() instanceof ObservableArray &&
            $.isFunction(item.parent().parent) &&
            item.parent().parent() instanceof LazyRummage
        ) {
            item = item.parent().parent();
            ret.push(item);
        }
        return ret.reverse();
    }
});

/**
 * Children schema model cannot be set until the model exists
 * @see http://www.telerik.com/forums/display-of-calculated-fields-in-treeview-template
 */
LazyRummage.prototype.children.schema.model = LazyRummage;
// LazyRummage.prototype.children.schema.modelBase = LazyRummage;

/**
 * HasChildren is necessary to avoid a triangle or plus sign
 * before treview nodes that do not expand because they have no children
 * @param node
 * @returns {boolean}
 */
LazyRummage.prototype.hasChildren = node => {
    return (node.items || []).length > 0;
    // return (node[node.children.schema.data] || {}).length > 0;
};

/**
 * Convert flat categories into a hierarchy
 * @see http://docs.telerik.com/kendo-ui/getting-started/web/treeview/overview#item-definition
 * @see http://docs.telerik.com/kendo-ui/getting-started/web/treeview/binding-to-flat-data#method-1-initial-pre-processing-of-all-data
 * @function parse
 * @param response
 */
function parse(response) {
    const hash = {};
    const { data } = response;
    // TODO: review count <----------------------------
    data.forEach(item => {
        const { id } = item;
        const node = {
            id,
            // ageGroup: item.ageGroup,
            count: item.count || 0,
            icon: item.icon,
            // language: item.language,
            name: item.name,
            type: 2
        };
        const trimmedId = id.replace(RX_TRIM_LEVEL, CONSTANTS.EMPTY);
        let parentId = 'root';
        if (trimmedId.length >= TOP_LEVEL_CHARS + LEVEL_CHARS) {
            parentId = `${trimmedId.substr(
                0,
                trimmedId.length - LEVEL_CHARS
            )}${O16}`.substr(0, 24);
        }
        hash[id] = hash[id] || [];
        hash[parentId] = hash[parentId] || [];
        node.items = hash[id];
        hash[parentId].push(node);
    });
    return hash.root || [];
}

/**
 * LazyCategoryHierarchicalDataSource
 * @class LazyCategoryHierarchicalDataSource
 * @extends HierarchicalDataSource
 */
const LazyCategoryHierarchicalDataSource = HierarchicalDataSource.extend({
    init(options = {}) {
        HierarchicalDataSource.fn.init.call(
            this,
            Object.assign(options, {
                transport: lazyCategoryTransport,
                // We do not want to normalize schema because
                // we get { data: [...], total: ...} from localCache
                // but our parser returns a hierarchy as an array [...]
                // schema: normalizeSchema({
                schema: {
                    // modelBase: LazyRummage,
                    model: LazyRummage,
                    // Parser to turn flat data into hierarchical data
                    parse
                }
                // This is the default
                // serverFiltering: false,
                // serverSorting: false,
                // serverPaging: false
            })
        );
    }
});

/**
 * LazyRummageHierarchicalDataSource
 * @class LazyRummageHierarchicalDataSource
 * @extends HierarchicalDataSource
 */
const LazyRummageHierarchicalDataSource = HierarchicalDataSource.extend({
    init(options = {}) {
        HierarchicalDataSource.fn.init.call(
            this,
            Object.assign(options, {
                transport: lazyCategoryTransport,
                // We do not want to normalize schema because
                // we get { data: [...], total: ...} from localCache
                // but our parser returns a hierarchy as an array [...]
                // schema: normalizeSchema({
                schema: {
                    // modelBase: LazyRummage,
                    model: LazyRummage,
                    // Parser to turn flat data into hierarchical data
                    parse
                }
                // This is the default
                // serverFiltering: false,
                // serverSorting: false,
                // serverPaging: false
            })
        );
    }
});

/**
 * Export
 */
export {
    LazyCategory,
    LazyCategoryDataSource,
    LazyCategoryHierarchicalDataSource,
    LazyRummage,
    LazyRummageHierarchicalDataSource
};

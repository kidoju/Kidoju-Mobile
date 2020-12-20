/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import CONSTANTS from '../common/window.constants.es6';
// import BaseModel from './data.base.es6';
import { isMobileApp } from './data.util.es6';

const {
    data: { Node },
} = window.kendo;

/**
 * Rummage node (displayed in treeview on find page)
 * @type {kendo.data.Node}
 */
const Rummage = Node.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    hasChildren: true,
    children: {
        schema: {
            data: 'items',
        },
    },
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
        },
        ageGroup: {
            type: CONSTANTS.NUMBER,
            editable: false,
            parse(value) {
                // defaultValue: 0 does not work as we get null
                // default parse function is return kendo.parseFloat(value);
                return window.parseInt(value, 10) || 255;
            },
        },
        count: {
            type: CONSTANTS.NUMBER,
            editable: false,
            parse(value) {
                // defaultValue: 0 does not work as we get null
                // default parse function is return kendo.parseFloat(value);
                return window.parseInt(value, 10) || 0;
            },
        },
        /*
        description: {
            type: CONSTANTS.STRING,
            editable: false
        },
        */
        icon: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        /*
        language: {
            type: CONSTANTS.STRING,
            editable: false
        },
        */
        name: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        path: {
            // Different from the path in LazyCategory, this is for favourites/bookmarks
            type: CONSTANTS.STRING,
            editable: false,
        },
        type: {
            // 0 = groups/folders, 1 = home, 2 = categories, 3 = favourites/bookmarks
            type: CONSTANTS.NUMBER,
            editable: false,
            defaultValue: 2, // categories
        },
    },

    /* This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

    /**
     * Return the href the category or bookmark points at
     * @returns {*}
     */
    href$() {
        const root = `${window.location.protocol}//${window.location.host}`;
        let finder = format(uris.webapp.finder, __.locale);
        finder =
            finder.indexOf(root) === 0 ? finder.substr(root.length) : finder;
        switch (this.get('type')) {
            case 1: // home
                return finder + HASHBANG; // Note: without hashbang, the page is reloaded
            case 2: // categories
                return (
                    finder +
                    HASHBANG +
                    $.param({
                        filter: {
                            logic: 'and',
                            filters: [
                                {
                                    field: 'categoryId',
                                    operator: 'gte',
                                    value: this.get('id'),
                                },
                                {
                                    field: 'categoryId',
                                    operator: 'lte',
                                    value: this.get('id').replace(
                                        /0000/g,
                                        'ffff'
                                    ),
                                },
                            ],
                        },
                    })
                );
            case 3: // favourites
                return this.get('path');
            default:
                // including 0 (no hypertext link)
                return null; // should not be used!!!
        }
    },

    /* jshint +W074 */

    /**
     * Return a complete icon path (from CDN)
     * @returns {*}
     */
    icon$() {
        return format(
            isMobileApp() ? uris.mobile.icons : uris.cdn.icons,
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
            item.parent().parent() instanceof models.Rummage
        ) {
            item = item.parent().parent();
            ret.push(item);
        }
        return ret.reverse();
    },
});

// Children schema model cannot be set until the model exists
// See http://www.telerik.com/forums/display-of-calculated-fields-in-treeview-template
Rummage.prototype.children.schema.model = Rummage;
// models.Rummage.prototype.children.schema.modelBase = models.Rummage;

/**
 * Hierarchical datasource of rummages
 * @type {*|void}
 */
const RummageHierarchicalDataSource = HierarchicalDataSource.extend({
    init(options) {
        const that = this;

        HierarchicalDataSource.fn.init.call(
            that,
            $.extend(
                true,
                {},
                {
                    transport: {
                        read: $.proxy(that._transport._read, that),
                        update: $.proxy(that._transport._update, that),
                        destroy: $.proxy(that._transport._destroy, that),
                    },
                    schema: {
                        model: models.Rummage,
                        modelBase: models.Rummage,
                    },
                },
                options
            )
        );
    },
    _transport: {
        _read(options) {
            logger.debug({
                message: 'dataSource.read',
                method:
                    'app.models.RummageHierarchicalDataSource.transport.read',
                // data: options.data
            });
            $.when(
                app.cache.getFavouriteHierarchy(__.locale),
                app.cache.getCategoryHierarchy(__.locale)
            )
                .then((favourites, categories) => {
                    const rootNodes = __('webapp.finder.treeview.rootNodes');
                    const rummages = [
                        {
                            id: HOME,
                            icon: rootNodes.home.icon,
                            name: rootNodes.home.name,
                            type: 1,
                        },
                        {
                            id: FAVOURITES,
                            icon: rootNodes.favourites.icon,
                            name: rootNodes.favourites.name,
                            items: favourites,
                            type: 0,
                        },
                        {
                            id: CATEGORIES,
                            icon: rootNodes.categories.icon,
                            name: rootNodes.categories.name,
                            items: categories,
                            type: 0,
                        },
                    ];
                    options.success(rummages);
                })
                .catch((xhr, status, errorThrown) => {
                    options.error(xhr, status, errorThrown);
                });
        },
        _update(options) {
            // Update is required because it is called on the parent node before any destroy of a child node
            return options.success(options.data);
        },
        _destroy(options) {
            logger.debug({
                message: 'dataSource.destroy',
                method:
                    'app.models.RummageHierarchicalDataSource.transport.destroy',
                data: options.data,
            });
            // assert.isNonEmptyPlainObject(options, assert.format(assert.messages.isNonEmptyPlainObject.default, 'options'));
            assert.isNonEmptyPlainObject(
                options.data,
                assert.format(
                    assert.messages.isNonEmptyPlainObject.default,
                    'options.data'
                )
            );
            assert.match(
                RX_MONGODB_ID,
                options.data.id,
                assert.format(
                    assert.messages.match.default,
                    'options.data.id',
                    RX_MONGODB_ID
                )
            );
            return app.rapi.v1.user
                .deleteMyFavourite(__.locale, options.data.id)
                .then(() => {
                    app.cache.removeMyFavourites(__.locale).always(() => {
                        options.success(options.data);
                    });
                })
                .catch(options.error);
        },
    },
});

/**
 * Export
 */
export { Rummage, RummageHierarchicalDataSource };

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';

const { } = window.kendo;

/**
 * Rummage node (displayed in treeview on find page)
 * @type {kendo.data.Node}
 */
models.Rummage = Node.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
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
                return window.parseInt(value, 10) || 255;
            }
        },
        count: {
            type: CONSTANTS.NUMBER,
            editable: false,
            parse(value) {
                // defaultValue: 0 does not work as we get null
                // default parse function is return kendo.parseFloat(value);
                return window.parseInt(value, 10) || 0;
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
        path: { // Different from the path in LazyCategory, this is for favourites/bookmarks
            type: CONSTANTS.STRING,
            editable: false
        },
        type: { // 0 = groups/folders, 1 = home, 2 = categories, 3 = favourites/bookmarks
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
    href$: function () {
        var root = window.location.protocol + '//' + window.location.host;
        var finder = format(uris.webapp.finder, __.locale);
        finder = finder.indexOf(root) === 0 ? finder.substr(root.length) : finder;
        switch (this.get('type')) {
            case 1: // home
                return finder + HASHBANG; // Note: without hashbang, the page is reloaded
            case 2: // categories
                return finder + HASHBANG + $.param({
                    filter: {
                        logic: 'and',
                        filters: [
                            { field: 'categoryId', operator: 'gte', value: this.get('id') },
                            { field: 'categoryId', operator: 'lte', value: this.get('id').replace(/0000/g, 'ffff') }
                        ]
                    }
                });
            case 3: // favourites
                return this.get('path');
            default: // including 0 (no hypertext link)
                return null; // should not be used!!!
        }
    },

    /* jshint +W074 */

    /**
     * Return a complete icon path (from CDN)
     * @returns {*}
     */
    icon$: function () {
        return format(window.cordova ? uris.mobile.icons : uris.cdn.icons, this.get('icon'));
    },

    /**
     * An array of parent categories up the the root of the hierarchy
     * Note: does not contains the current category
     */
    path$: function () {
        var ret = [];
        var item = this;
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
    }
});

// Children schema model cannot be set until the model exists
// See http://www.telerik.com/forums/display-of-calculated-fields-in-treeview-template
models.Rummage.prototype.children.schema.model = models.Rummage;
// models.Rummage.prototype.children.schema.modelBase = models.Rummage;

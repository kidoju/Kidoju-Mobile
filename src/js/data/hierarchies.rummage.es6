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
 * Hierarchical datasource of rummages
 * @type {*|void}
 */
models.RummageHierarchicalDataSource = HierarchicalDataSource.extend({
    init: function (options) {

        var that = this;

        HierarchicalDataSource.fn.init.call(that, $.extend(true, {}, {
            transport: {
                read: $.proxy(that._transport._read, that),
                update: $.proxy(that._transport._update, that),
                destroy: $.proxy(that._transport._destroy, that)
            },
            schema: {
                model: models.Rummage,
                modelBase: models.Rummage
            }
        }, options));

    },
    _transport: {
        _read: function (options) {
            logger.debug({
                message: 'dataSource.read',
                method: 'app.models.RummageHierarchicalDataSource.transport.read'
                // data: options.data
            });
            $.when(
                app.cache.getFavouriteHierarchy(__.locale),
                app.cache.getCategoryHierarchy(__.locale)
            )
            .then(function (favourites, categories) {
                var rootNodes = __('webapp.finder.treeview.rootNodes');
                var rummages = [
                    { id: HOME, icon: rootNodes.home.icon, name: rootNodes.home.name, type: 1 },
                    { id: FAVOURITES, icon: rootNodes.favourites.icon, name: rootNodes.favourites.name, items: favourites, type: 0 },
                    { id: CATEGORIES, icon: rootNodes.categories.icon, name: rootNodes.categories.name, items: categories, type: 0 }
                ];
                options.success(rummages);
            })
            .catch(function (xhr, status, errorThrown) {
                options.error(xhr, status, errorThrown);
            });
        },
        _update: function (options) {
            // Update is required because it is called on the parent node before any destroy of a child node
            return options.success(options.data);
        },
        _destroy: function (options) {
            logger.debug({
                message: 'dataSource.destroy',
                method: 'app.models.RummageHierarchicalDataSource.transport.destroy',
                data: options.data
            });
            // assert.isNonEmptyPlainObject(options, assert.format(assert.messages.isNonEmptyPlainObject.default, 'options'));
            assert.isNonEmptyPlainObject(options.data, assert.format(assert.messages.isNonEmptyPlainObject.default, 'options.data'));
            assert.match(RX_MONGODB_ID, options.data.id, assert.format(assert.messages.match.default, 'options.data.id', RX_MONGODB_ID));
            return app.rapi.v1.user.deleteMyFavourite(__.locale, options.data.id)
            .then(function () {
                app.cache.removeMyFavourites(__.locale)
                .always(function () {
                    options.success(options.data);
                });
            })
            .catch(options.error);
        }
    }
});

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.listview';
import 'kendo.mobile.view';
import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import { LazySummaryDataSource } from '../data/data.summary.lazy.es6';
import { xhr2error } from '../data/data.util.es6';

const {
    mobile: {
        ui: { ListView, View },
    },
    roleSelector,
} = window.kendo;
const logger = new Logger('ui.finder');

/**
 * Finder feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'finder',

    /**
     * View
     */
    VIEW: {
        FINDER: {
            _: 'finder',
        },
    },

    VIEW_MODEL: {
        SUMMARIES: 'summaries',
    },

    /**
     * Reset
     */
    reset() {
        app.viewModel.resetSummaries();
    },

    /**
     * Reset summaries
     */
    resetSummaries() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        viewModel.set(VIEW_MODEL.SUMMARIES, new LazySummaryDataSource());
        // new LazySummaryDataSource({ pageSize: VIRTUAL_PAGE_SIZE })
    },

    /**
     * Load lazy summaries
     * @param options
     */
    loadSummaries(options) {
        assert.isNonEmptyPlainObject(
            options,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options'
            )
        );
        assert.isNonEmptyPlainObject(
            options.partition,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options.partition'
            )
        );
        assert.match(
            CONSTANTS.RX_LANGUAGE,
            options.partition.language,
            assert.format(
                assert.messages.match.default,
                'options.partition.language',
                CONSTANTS.RX_LANGUAGE
            )
        );
        const {
            notification,
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        return viewModel.get(VIEW_MODEL.SUMMARIES)
            .query(options)
            .fail((xhr, status, errorThrown) => {
                notification.error(
                    __('mobile.notifications.summariesQueryFailure')
                );
                logger.error({
                    message: 'error loading summaries',
                    method: 'loadSummaries',
                    error: xhr2error(xhr, status, errorThrown),
                });
            });
    },

    /**
     * Event handler triggered before showing the Summaries view
     */
    onFinderBeforeViewShow(/* e */) {
        // The application loader is transparent by default and covers the entire layout
        // if (mobile.application instanceof kendo.mobile.Application) {
        //     mobile.application.showLoading();
        // }
        // Workaround
        // ------------
        // Clearing here the summaries data source avoids a "flickering" effect
        // where previous results are replaced by new results after the view is shown
        // Note that we have tried unsuccessfully to use the loader to hide the UI changes as explained at
        // http://www.telerik.com/forums/-bug-report-databound-event-not-firing-for-kendomobilelistview
        // TODO app.viewModel.summaries.data([]);
    },

    /**
     * Event handler triggered when showing the Summaries view
     * Note: the view event is triggered each time the view is requested
     * @param e
     */
    onFinderViewShow(e) {
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        assert.instanceof(
            View,
            e.view,
            assert.format(
                assert.messages.instanceof.default,
                'e.view',
                'kendo.mobile.ui.View'
            )
        );
        assert.isNonEmptyPlainObject(
            e.view.params,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'e.view.params'
            )
        );
        // var language = __.locale; // viewModel.get(VIEW_MODEL.LANGUAGE)
        const { language } = e.view.params;
        // Launch the query
        // Kendo UI is not good at building the e.view.params object from query string params
        // Here we would typically get e.view.params like:
        // {
        //  'filter[field]': 'categories',
        //  'filter[operator]': 'eq',
        //  'filter[value]': '000100010002000000000000'
        // }
        // instead of
        // {
        //   filter: {
        //    field: 'categories',
        //    operator: 'eq',
        //    value: '000100010002000000000000'
        //   }
        // }
        // So we really need $.deparam($.param(...))
        const { viewModel } = app;
        viewModel
            .loadSummaries(
                $.extend(
                    true,
                    {
                        // TODO: fields could be found in LazySummary (use the from property not the field name) - @see https://github.com/kidoju/Kidoju-Widgets/issues/218
                        fields:
                            'author,icon,metrics.comments.count,language,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,type,updated',
                        page: 1,
                        pageSize: viewModel.summaries.pageSize(),
                        partition: {
                            language,
                            type: 'Test',
                            'author.userId': config.constants.authorId, // TODO
                        },
                        sort: { field: 'updated', dir: 'desc' },
                    },
                    $.deparam($.param(e.view.params))
                )
            )
            // See comment onSummariesBeforeViewShow
            .always(() => {
                viewModel.onGenericViewShow(e);
            });
    },

    /**
     * Resize finder listview
     * @param e
     * @param view
     * @private
     */
    resize(e, view) {
        assert.instanceof(
            View,
            view,
            assert.format(
                assert.messages.instanceof.default,
                'view',
                'kendo.mobile.ui.View'
            )
        );
        if (view.id === `${CONSTANTS.HASH}${this.VIEW.FINDER._}`) {
            // Refreshing list views only works in data bound mode
            // It removes the html markup especially with forms
            const $listViews = view.content.find(roleSelector('listview'));
            $listViews.each((index, element) => {
                const listView = $(element).data('kendoMobileListView');
                if (listView instanceof ListView) {
                    listView.refresh();
                }
            });
        }
    },
};

/**
 * Default export
 */
export default feature;
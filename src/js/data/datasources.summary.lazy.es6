/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import 'kendo.data';
// import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';

/*
const {
    data: { DataSource }
} = window.kendo;
*/

/**
 * DataSource of Lazy summaries
 * @type {kendo.Observable}
 */
models.LazySummaryDataSource = DataSource.extend({

    /**
     * Init
     * @constructor
     * @param options
     */
    init: function (options) {
        DataSource.fn.init.call(this, $.extend(true, { pageSize: 5 }, options, {
            transport: new models.LazySummaryTransport({
                partition: options && options.partition
            }),
            serverFiltering: true,
            serverSorting: true,
            // pageSize: 5,
            serverPaging: true,
            schema: {
                data: 'data',
                total: 'total',
                errors: 'error',
                modelBase: models.LazySummary,
                model: models.LazySummary,
                parse: function (response) {
                    // We parse the response to flatten data for our LazySummary model (instead of using field.from and field.defaultValue definitions)
                    if (response && $.type(response.total) === NUMBER && $.isArray(response.data)) {
                        $.each(response.data, function (index, summary) {
                            // We need to flatten author and metrics in case we need to represent data in a kendo.ui.Grid
                            // Flatten author
                            assert.isNonEmptyPlainObject(summary.author, assert.format(assert.messages.isNonEmptyPlainObject.default, 'summary.author'));
                            summary.userId = summary.author.userId;
                            summary.firstName = summary.author.firstName;
                            summary.lastName = summary.author.lastName;
                            summary.author = undefined; // delete summary.author;
                            // Flatten metrics
                            summary.comments = summary.metrics && summary.metrics.comments && summary.metrics.comments.count || 0;
                            summary.ratings = summary.metrics && summary.metrics.ratings && summary.metrics.ratings.average || null;
                            summary.scores = summary.metrics && summary.metrics.scores && summary.metrics.scores.average || null;
                            summary.views = summary.metrics && summary.metrics.views && summary.metrics.views.count || 0;
                            if ($.isPlainObject(summary.metrics)) {
                                summary.metrics = undefined; // delete summary.metrics;
                            }
                        });
                    }
                    return response;
                }
            }
        }));
    },

    /**
     * Sets the partition and queries the data source
     * @param options
     */
    load: function (options) {
        if (options && $.isPlainObject(options.partition)) {
            this.transport.partition(options.partition);
        }
        return this.query(options);
    }
});

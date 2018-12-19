/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO: Add functions to pull the test model from version.stream

import 'kendo.core';
import CONSTANTS from '../common/window.constants.es6';
import Activity from './data.activity.es6';

const { i18n } = window; // TODO Review
const { format } = window.kendo;

import Activity from './data.activity';
import CONSTANTS from '../common/window.constants';

/**
 * Score model
 * @class Score
 * @extends Activity
 */
const Score = Activity.define({
    fields: {
        test: {
            defaultValue: null
            /*
             A test is a hash object of
             val_abcd: {
             result: true/false,
             score: n,
             value: 'user answer'
             }
             */
        },
        score: {
            type: CONSTANTS.NUMBER,
            editable: false
        }
    },

    /**
     * Init
     * @constructor init
     * @param data
     */
    init(data) {
        // Call the base init method
        Activity.fn.init.call(this, data);
        // Enforce the type
        this.type = 'Score';
    },

    /**
     * Score name // TODO rename into description$
     * @method scoreName$
     * @returns {*}
     */
    scoreName$() {
        let ret;
        const id = this.get(this.idField); // TODO Check!!!
        if (CONSTANTS.RX_MONGODB_ID.test(id)) {
            ret = format(
                `{0:${i18n.culture.dateFormat}} ({1:p0})`, // TODO: i18n
                this.get('created'), // TODO: timezone
                this.get('score') / 100
            );
        }
        return ret;
    }
});

/**
 * Datasource of summary scores
 * This is used both for the leaderboard on the summary page and in the player, accordingly, userId is optional
 * @type {kendo.Observable}
 */
models.ScoreDataSource = DataSource.extend({

    /**
     * Init
     * @constructor
     * @param options
     */
    init: function (options) {
        var that = this;
        that.summaryId = options && options.summaryId;
        that.userId = options && options.userId; // optional authenticated user
        that.versionId = options && options.versionId;
        DataSource.fn.init.call(that, $.extend(true, { pageSize: 100 }, options, {
            transport: {
                read: $.proxy(that._transport._read, that)
            },
            serverFiltering: true,
            serverSorting: true,
            // pageSize: 100,
            serverPaging: true,
            schema: {
                data: function (response) {
                    // See: http://www.telerik.com/forums/transport-methods-and-ids-created-on-the-server
                    if (response && $.type(response.total) === NUMBER && $.isArray(response.data)) { // read list
                        return response.data;
                    } else { // create, update, delete
                        return response;
                    }
                },
                total: 'total',
                errors: 'error',
                modelBase: models.Score,
                model: models.Score,
                parse: function (response) {
                    // add userId of authenticated user
                    if (response) {
                        if ($.type(response.total) === NUMBER && $.isArray(response.data)) { // a read
                            $.each(response.data, function (index, comment) {
                                comment.userId = that.userId;
                            });
                        } else { // a create or update
                            response.userId = that.userId;
                        }
                    }
                    return response;
                }
            }
        }));
    },

    load: function (options) {
        var that = this;
        that.summaryId = options && options.summaryId;
        that.userId = options && options.userId;
        that.versionId = options && options.versionId;
        return that.query(options);
    },
    /*
     * Setting _transport._read here with a reference above is a trick
     * so as to be able to replace this function in mockup scenarios
     */
    _transport: {
        _read: function (options) {
            var that = this;
            // We cannot fetch scores without a summary Id, version Id and user Id
            assert.match(RX_MONGODB_ID, that.summaryId, assert.format(assert.messages.match.default, 'this.summaryId', RX_MONGODB_ID));
            // assert.match(RX_MONGODB_ID, that.userId, assert.format(assert.messages.match.default, 'this.userId', RX_MONGODB_ID));
            assert.match(RX_MONGODB_ID, that.versionId, assert.format(assert.messages.match.default, 'this.versionId', RX_MONGODB_ID));
            options.data.fields = 'date,score,test';
            options.data.filter = [
                { field: 'type', operator: 'eq', value: 'Score' },
                { field: 'version.versionId', operator: 'eq', value: that.versionId }
            ];
            if (RX_MONGODB_ID.test(that.userId)) {
                options.data.filter.push({ field: 'actor.userId', operator: 'eq', value: that.userId });
            }
            options.data.sort = [{ field: 'id', dir: 'desc' }];
            rapi.v1.content.findSummaryActivities(
                i18n.locale(),
                that.summaryId,
                options.data
            )
            .then(function (response) {
                options.success(response);
            })
            .catch(function (xhr, status, error) {
                options.error(xhr, status, error);
            });
        }
    }
});

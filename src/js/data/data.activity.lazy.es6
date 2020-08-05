/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import config from '../app/app.config.jsx';
import { getActorReference } from '../app/app.partitions.es6';
import { summaryUri, userUri } from '../app/app.uris.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';
import LazyRemoteTransport from './transports.remote.lazy.es6';
import AjaxActivities from '../rapi/rapi.activities.es6';
import { normalizeSchema } from './data.util.es6';

const {
    data: { DataSource },
    format,
} = window.kendo;

/**
 * LazyActivity
 * @class LazyActivity
 * @extends BaseModel
 */
const LazyActivity = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
        },
        actorId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
        },
        /*
        // Not needed in lists
        categoryId: {
            type: CONSTANTS.STRING,
            editable: false
        },
        created: {
            type: CONSTANTS.DATE,
            editable: false
        },
        */
        date: {
            type: CONSTANTS.DATE,
            editable: false,
            defaultValue() {
                return new Date();
            },
        },
        /*
        // TODO review
        firstName: {
            type: CONSTANTS.STRING,
            editable: false
        },
        */
        language: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        /*
        // TODO Review
        lastName: {
            type: CONSTANTS.STRING,
            editable: false
        },
        */
        score: {
            type: CONSTANTS.NUMBER,
            nullable: true,
            editable: false,
        },
        summaryId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
        },
        /*
        text: {
            type: CONSTANTS.STRING,
            nullable: true,
            editable: false
        },
        */
        title: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        type: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        /*
        updated: {
            type: CONSTANTS.DATE,
            editable: false
        },
        */
        versionId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
        },
        /*
        value: {
            type: CONSTANTS.NUMBER,
            nullable: true,
            editable: false
        }
        */
    },
    actorName$() {
        // TODO review with firstName and lastName
        // return `${(this.get('firstName') || '').trim()} ${(
        //         (this.get('lastName') || '').trim()}`
        // ).trim();
    },
    actorUri$() {
        return userUri(this.get('language'), this.get('userId'));
    },
    date$() {
        // TODO timezones
        return this.get('date');
    },
    scoreUri$() {
        // TODO use app.uris.es6
        return (
            format(
                config.uris.webapp.player,
                this.get('language'),
                this.get('summaryId'),
                this.get('versionId')
            ) + format('#/report/{0}', this.get('id'))
        ); // TODO: add to config files
    },
    summaryUri$() {
        // Some activities like `creation` may refer to unpublished summaries and we do not know whether the summary is published or not
        // Therefore, we should always bypass server-side data requests to display such summaries
        // This is not an issue regarding SEO because activities are only displayed to authenticated user
        return summaryUri(this.get('language'), this.get('summaryId'));
    },
});

/**
 * lazyActivityTransport
 */
const lazyActivityTransport = new LazyRemoteTransport({
    collection: new AjaxActivities({
        partition: getActorReference(),
        projection: BaseModel.projection(LazyActivity),
    }),
});

/**
 * LazyActivityDataSource
 * @class LazyActivityDataSource
 * @extends DataSource
 */
const LazyActivityDataSource = DataSource.extend({
    /**
     * Init
     * @constructor
     * @param options
     */
    init(options = {}) {
        DataSource.fn.init.call(
            this,
            $.extend(
                true,
                { pageSize: CONSTANTS.DATA_PAGE_SIZE.SMALL },
                options,
                {
                    transport: lazyActivityTransport,
                    schema: normalizeSchema({
                        modelBase: LazyActivity,
                        model: LazyActivity,
                    }),
                    serverFiltering: true,
                    serverSorting: true,
                    serverPaging: true,
                }
            )
        );
    },

    /**
     * Sets the partition and queries the data source
     * @param options
     */
    /*
    load(options) {
        if (options && $.isPlainObject(options.partition)) {
            this.transport.partition(options.partition);
        }
        return this.query(options);
    }
    */
});

/**
 * Datasource of summary scores
 * This is used both for the leaderboard on the summary page and in the player, accordingly, userId is optional
 * @type {kendo.Observable}
 */
/*
const ScoreDataSource = DataSource.extend({
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
                __.locale,
                that.summaryId,
                options.data
            )
            .then(function (response) {
                options.success(response);
            })
            .catch(function (xhr, status, errorThrown) {
                options.error(xhr, status, errorThrown);
            });
        }
    }
});
*/

/**
 * Export
 */
export { LazyActivity, LazyActivityDataSource };

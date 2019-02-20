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
import { Page } from './data.page.es6';

const {
    data: { DataSource, Model } // TODO MOdel
} = window.kendo;

/**
 * Comment model
 * @type {kidoju.data.Model}
 */
const Comment = Activity.define({
    fields: {
        text: {
            type: CONSTANTS.STRING
        },
        // the authenticated user
        userId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        }
    },
    init(data) {
        // Call the base init method
        Model.fn.init.call(this, data);
        // Enforce the type
        this.type = 'comment';
    },
    actor$() {
        return `${(this.get('actor.firstName') || '').trim()} ${(
            this.get('actor.lastName') || ''
        ).trim()}`.trim();
    },
    // TODO: add actorUri$
    isEditable$() {
        return this.get('actor.userId') === this.get('userId');
    },
    color$() {
        let hex = '000000';
        const name = this.get('actor.lastName');
        for (let i = 0; i < Math.min(3, name.length); i++) {
            // 26 alphabet lower case letters spanning char codes 65 to 91,
            // we need to 'space' them to create more color variety
            hex += ((43 * name.charCodeAt(i)) % 256).toString(16);
        }
        return `#${hex.slice(-6)}`;
    }
});

// export const CommentTransport = BaseTranspo

/**
 * Datasource of comments
 * @type {kendo.Observable}
 */
const CommentDataSource = DataSource.extend({
    /**
     * Init
     * @constructor
     * @param options
     */
    init(options) {
        const that = this;
        that.userId = options && options.userId; // the authenticated user
        that.summaryId = options && options.summaryId;

        DataSource.fn.init.call(
            that,
            $.extend(
                true,
                {},
                {
                    transport: {
                        create: $.proxy(that._transport._create, that),
                        destroy: $.proxy(that._transport._destroy, that),
                        read: $.proxy(that._transport._read, that),
                        update: $.proxy(that._transport._update, that)
                    },
                    serverFiltering: true,
                    serverSorting: true,
                    pageSize: 5,
                    serverPaging: true,
                    schema: {
                        data(response) {
                            // See: http://www.telerik.com/forums/transport-methods-and-ids-created-on-the-server
                            if (
                                response &&
                                $.type(response.total) === NUMBER &&
                                $.isArray(response.data)
                            ) {
                                // read list
                                return response.data;
                            }
                            // create, update, delete
                            return response;
                        },
                        total: 'total',
                        errors: 'error',
                        modelBase: models.Comment,
                        model: models.Comment,
                        parse(response) {
                            // add userId of authenticated user
                            if (response) {
                                if (
                                    $.type(response.total) === NUMBER &&
                                    $.isArray(response.data)
                                ) {
                                    // a read
                                    $.each(response.data, (index, comment) => {
                                        comment.userId = that.userId;
                                    });
                                } else {
                                    // a create or update
                                    response.userId = that.userId;
                                }
                            }
                            return response;
                        }
                    }
                },
                options
            )
        );
    },
    load(options) {
        const that = this;
        that.summaryId = options && options.summaryId;
        that.userId = options && options.userId;
        return that.query(options);
    },
    /*
     * Setting _transport._read here with a reference above is a trick
     * so as to be able to replace this function in mockup scenarios
     */
    _transport: {
        _create(options) {
            const that = this;
            rapi.v1.content
                .createSummaryActivity(
                    (options.data.version && options.data.version.language) ||
                        i18n.locale(),
                    (options.data.version && options.data.version.summaryId) ||
                        that.summaryId,
                    { type: 'comment', text: options.data.text }
                )
                .then(response => {
                    options.success(response);
                })
                .catch((xhr, status, error) => {
                    options.error(xhr, status, errorThrown);
                });
        },
        _destroy(options) {
            const that = this;
            rapi.v1.content
                .deleteSummaryActivity(
                    options.data.version.language,
                    options.data.version.summaryId,
                    options.data.id
                )
                .then(response => {
                    options.success(response);
                })
                .catch((xhr, status, error) => {
                    options.error(xhr, status, errorThrown);
                });
        },
        _read(options) {
            const that = this;
            // We cannot fetch activities without a summary Id
            assert.match(
                RX_MONGODB_ID,
                that.summaryId,
                assert.format(
                    assert.messages.match.default,
                    'this.summaryId',
                    RX_MONGODB_ID
                )
            );
            options.data.fields = 'actor,date,text,version';
            options.data.filter = {
                field: 'type',
                operator: 'eq',
                value: 'Comment'
            };
            options.data.sort = [{ field: 'id', dir: 'desc' }];
            rapi.v1.content
                .findSummaryActivities(
                    i18n.locale(),
                    that.summaryId,
                    options.data
                )
                .then(response => {
                    options.success(response);
                })
                .catch((xhr, status, error) => {
                    options.error(xhr, status, errorThrown);
                });
        },
        _update(options) {
            rapi.v1.content
                .updateSummaryActivity(
                    options.data.version.language,
                    options.data.version.summaryId,
                    options.data.id,
                    { text: options.data.text }
                )
                .then(response => {
                    options.success(response);
                })
                .catch((xhr, status, error) => {
                    options.error(xhr, status, errorThrown);
                });
        }
    }
});

/**
 * Export
 */
export { Comment, CommentDataSource };

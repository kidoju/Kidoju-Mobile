/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
import __ from '../app/app.i18n.es6';
import { getLanguageReference } from '../app/app.partitions.es6';
import { iconUri, summaryUri } from '../app/app.uris.es6';
// import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxRpc from '../rapi/rapi.rpc.es6';
import AjaxSummaries from '../rapi/rapi.summaries.es6';
import BaseModel from './data.base.es6';
import { SummaryMetricsReference } from './reference.metrics.es6';
import UserReference from './reference.user.es6';
import RemoteTransport from './transports.remote.es6';
import extendModelWithTransport from './mixins.transport.es6';
import JSC from 'jscheck';
import ObjectId from '../common/window.objectid';

const { toString } = window.kendo;

/**
 * NewSummary
 * @class NewSummary
 * @extends BaseModel
 */
const NewSummary = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        author: {
            defaultValue: {},
            parse(value) {
                return value instanceof UserReference
                    ? value
                    : new UserReference(value);
            }
        },
        categoryId: {
            type: CONSTANTS.STRING,
            nullable: true
        },
        language: {
            type: CONSTANTS.STRING,
            defaultValue: __.locale,
            editable: false,
            validation: {
                required: true
            }
        },
        title: {
            type: CONSTANTS.STRING,
            validation: {
                required: true,
                pattern: '^\\S[^<>]{4,48}\\S$'
            }
        } /* ,
                 type: {
                 type: CONSTANTS.STRING,
                 validation: {
                 required: true
                 }
                 } */
    },
    language$() {
        const locale = this.get('language');
        const languages = __('webapp.languages');
        for (let i = 0; i < languages.length; i++) {
            if (languages[i].value === locale) {
                return languages[i].name;
            }
        }
        return null;
    },
    /*
    // TODO use transport mixin
    load() {
        const that = this;
        return app.cache.getMe().then(me => {
            if ($.isPlainObject(me) && CONSTANTS.RX_MONGODB_ID.test(me.id)) {
                me.userId = me.id;
                // delete me.picture;
                that.set('author', new models.UserReference(me));
                // that.set('language', __.locale);
            }
        });
    },
    */
    reset() {
        const that = this;
        that.set('categoryId', this.defaults.category);
        that.set('title', this.defaults.title);
        // that.set('type', this.defaults.type);
    }
    /*
    // TODO use transport mixin
    save() {
        const that = this;
        // We could also have used toJSON and deleted any useless data
        const newSummary = {
            author: {
                userId: that.get('author.userId')
                // Let the server feed the authenticated user firstName and lastName from author.userId
            },
            categoryId: that.get('categoryId'), // sets the icon and age group
            language: that.get('language'),
            title: that.get('title'),
            type: that.get('type.value')
        };
        // Call server to create a new summary and return a promise
        return rapi.v1.content.createSummary(__.locale, newSummary);
    }
    */
});

/**
 * Summary
 * @class Summary
 * @extends BaseModel
 */
const Summary = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
            serializable: false
        },
        ageGroup: {
            type: CONSTANTS.NUMBER,
            defaultValue: 255
        },
        author: {
            // For complex types, the recommendation is to leave the type undefined and set a default value
            // See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
            // See: http://demos.telerik.com/kendo-ui/grid/editing-custom
            defaultValue: {},
            editable: false,
            serializable: false,
            parse(value) {
                return value instanceof UserReference || value === null
                    ? value
                    : new UserReference(value);
            }
        },
        categoryId: {
            type: CONSTANTS.STRING
        },
        created: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        },
        description: {
            type: CONSTANTS.STRING
        },
        icon: {
            type: CONSTANTS.STRING,
            defaultValue: 'spacer'
        },
        language: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        metrics: {
            defaultValue: {},
            editable: false,
            serializable: false,
            parse(value) {
                return value instanceof SummaryMetricsReference ||
                    value === null
                    ? value
                    : new SummaryMetricsReference(value);
            }
        },
        published: {
            type: CONSTANTS.DATE,
            editable: false,
            nullable: true,
            serializable: false
        },
        tags: {
            defaultValue: []
        },
        title: {
            type: CONSTANTS.STRING
        },
        type: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        updated: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        },
        userScore: {
            // Used in Kidoju-Mobile only
            from: 'activities',
            type: CONSTANTS.NUMBER,
            editable: false,
            nullable: true,
            serializable: false,
            parse(activities) {
                // We need a userId but `this` is undefined, so we cannot find it in this object or in its parents
                // so we are assigning app._userId in app.mobile.viewModel._reset but this is really crap
                if (
                    Array.isArray(activities) &&
                    CONSTANTS.RX_MONGODB_ID.test(app._userId)
                ) {
                    for (let i = 0, { length } = activities; i < length; i++) {
                        if (activities[i].actorId === app._userId) {
                            return activities[i].score;
                        }
                    }
                }
            }
        }
    },
    init(data) {
        const that = this;
        BaseModel.fn.init.call(that, data);
        that.bind(CONSTANTS.CHANGE, $.proxy(that._onChange, that));
    },
    hasUserScore$() {
        // Used in Kidoju-Mobile only
        return $.type(this.get('userScore')) === CONSTANTS.NUMBER;
    },
    icon$() {
        return iconUri(this.get('icon'));
    },
    isError$() {
        // Used in Kidoju-Mobile only
        const userScore = this.get('userScore');
        // Note: we need to test the value type because comparing a null to a number is always true
        return $.type(userScore) === CONSTANTS.NUMBER && userScore < 50;
    },
    isSuccess$() {
        // Used in Kidoju-Mobile only
        const userScore = this.get('userScore');
        return $.type(userScore) === CONSTANTS.NUMBER && userScore >= 75;
    },
    isWarning$() {
        // Used in Kidoju-Mobile only
        const userScore = this.get('userScore');
        return (
            $.type(userScore) === CONSTANTS.NUMBER &&
            userScore >= 50 &&
            userScore < 75
        );
    },
    summaryUri$() {
        return summaryUri(this.get('language'), this.get('id'));
    },
    tags$() {
        return this.get('tags').join(', ');
    },
    userScore$() {
        // Used in Kidoju-Mobile only
        return toString(this.get('userScore') / 100, 'p0');
    },
    _onChange(e) {
        // call the base function
        BaseModel.fn._notifyChange.call(this, e);
        // kendo only handles add/remove on arrays of child elements
        // set dirty when an itemchange occurs in an array, e.g. versions
        // See: http://blog.falafel.com/Blogs/JoshEastburn/josh-eastburn/2014/04/25/dirty-children-and-kendo-ui
        if (e.action === CONSTANTS.ITEMCHANGE) {
            this.dirty = true;
        }
    },
    /*
    load(data) {
        const that = this;
        const dfd = $.Deferred();
        if (CONSTANTS.RX_MONGODB_ID.test(data)) {
            // data is a summary id and we fetch a full summary
            rapi.v1.content
                .getSummary(__.locale, data)
                .then(summary => {
                    that.accept(summary);
                    dfd.resolve(summary);
                })
                .catch(dfd.reject);
        } else if (
            $.isPlainObject(data) &&
            CONSTANTS.RX_MONGODB_ID.test(data.id)
        ) {
            if (data.published instanceof Date) {
                // data is a published summary and we use model.accept to load data
                that.accept(data);
                dfd.resolve(data);
            } else {
                // data is a draft summary, hence it is incomplete
                // because the webapp could not fetch the summary without authentication
                // We therefore need to fetch a full summary
                // data is a summary id and we fetch a full summary
                rapi.v1.content
                    .getSummary(__.locale, data.id)
                    .then(summary => {
                        that.accept(summary);
                        dfd.resolve(summary);
                    })
                    .catch(dfd.reject);
            }
        } else {
            const xhr = new ErrorXHR(
                400,
                'Neither data nor data.id is a MongoDB ObjectId'
            );
            // dfd.reject(xhr, status, errorThrown);
            dfd.reject(xhr, ERROR, xhr.statusText);
        }
        return dfd.promise();
    },
    save(fields) {
        const that = this;
        const dfd = $.Deferred();
        if (that.dirty) {
            // TODO Validate
            const data = filter(that.toJSON(), fields);
            assert.isNonEmptyPlainObject(
                data,
                assert.format(
                    assert.messages.isNonEmptyPlainObject.default,
                    'data'
                )
            );
            // Check that all model fields marked as serializable === false won't be sent
            assert.isUndefined(
                data.author,
                assert.format(
                    assert.messages.isUndefined.default,
                    'data.author'
                )
            );
            assert.isUndefined(
                data.created,
                assert.format(
                    assert.messages.isUndefined.default,
                    'data.created'
                )
            );
            assert.isUndefined(
                data.id,
                assert.format(assert.messages.isUndefined.default, 'data.id')
            );
            assert.isUndefined(
                data.language,
                assert.format(
                    assert.messages.isUndefined.default,
                    'data.language'
                )
            );
            assert.isUndefined(
                data.metrics,
                assert.format(
                    assert.messages.isUndefined.default,
                    'data.metrics'
                )
            );
            assert.isUndefined(
                data.type,
                assert.format(assert.messages.isUndefined.default, 'data.type')
            );
            assert.isUndefined(
                data.updated,
                assert.format(
                    assert.messages.isUndefined.default,
                    'data.updated'
                )
            );
            const language = that.get('language');
            const id = that.get('id');
            rapi.v1.content
                .updateSummary(language, id, data)
                .then(data => {
                    // Note: data is not parsed, so dates are string
                    that.accept(data); // this updates dirty and updated
                    dfd.resolve(data);
                })
                .catch((xhr, status, error) => {
                    dfd.reject(xhr, status, errorThrown);
                });
        } else {
            setTimeout(() => {
                dfd.resolve(); // nothing to save
            }, 0);
        }
        return dfd.promise();
    },
    */
    createDraft() {
        const draft = {
            command: 'draft',
            context: 'Summary',
            id: this.get('id'),
            options: {
                // language: this.get('language')
            }
        };
        AjaxRpc.call(draft);
        /*
        return rapi.v1.content.executeCommand(
            this.get('language'),
            this.get('id'),
            { command: 'draft' }
        );
         */
    },
    publish() {
        const publish = {
            command: 'publish',
            context: 'Summary',
            id: this.get('id'),
            options: {
                // language: this.get('language')
            }
        };
        AjaxRpc.call(publish);
        /*
        return rapi.v1.content.executeCommand(
            this.get('language'),
            this.get('id'),
            { command: 'publish' }
        );
         */
    },
    rate(value) {
        // TODO use rpc call
        // TODO: what if already rated?????
        // TODO: check that an author cannot rate his own summaries
        const rate = {
            command: 'rate',
            context: 'Summary',
            id: this.get('id'),
            options: {
                // language: this.get('language'),
                value
            }
        };
        AjaxRpc.call(rate);
        /*
        return rapi.v1.content.createSummaryActivity(
            this.get('language'),
            this.get('id'),
            { type: 'rating', value }
        );
         */
    }
});

/**
 * summaryTransport
 */
const summaryTransport = new RemoteTransport({
    collection: new AjaxSummaries({
        partition: getLanguageReference(),
        projection: BaseModel.projection(Summary)
    })
});

/**
 * Extend Summary with transport
 */
extendModelWithTransport(NewSummary, summaryTransport);
extendModelWithTransport(Summary, summaryTransport);

/**
 * Export
 */
export { NewSummary, Summary };

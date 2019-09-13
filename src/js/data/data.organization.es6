/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
// import __ from '../app/app.i18n.es6';
// import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxOrganizations from '../rapi/rapi.organizations.es6';
import BaseModel from './data.base.es6';
import UserReference from './reference.user.es6';
import RemoteTransport from './transports.remote.es6';
import extendModelWithTransport from './mixins.transport.es6';

// const { toString } = window.kendo;

/**
 * NewOrganization
 * @class NewOrganization
 * @extends BaseModel
 */
const NewOrganization = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        /*
        author: {
            defaultValue: {},
            parse(value) {
                return value instanceof UserReference
                    ? value
                    : new UserReference(value);
            }
        },
         */
        name: {
            type: CONSTANTS.STRING,
            validation: {
                required: true,
                pattern: '^\\S[^<>]{4,48}\\S$'
            }
        }
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
        that.set('name', this.defaults.name);
    }
    /*
    // TODO use transport mixin
    save() {
        const that = this;
        // We could also have used toJSON and deleted any useless data
        const newOrganization = {
            author: {
                userId: that.get('author.userId')
                // Let the server feed the authenticated user firstName and lastName from author.userId
            },
            categoryId: that.get('categoryId'), // sets the icon and age group
            language: that.get('language'),
            title: that.get('title'),
            type: that.get('type.value')
        };
        // Call server to create a new organization and return a promise
        return rapi.v1.content.createOrganization(__.locale, newOrganization);
    }
    */
});

/**
 * Organization
 * @class Organization
 * @extends BaseModel
 */
const Organization = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
            serializable: false
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
        created: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        },
        description: {
            type: CONSTANTS.STRING
        },
        title: {
            type: CONSTANTS.STRING
        },
        updated: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
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
    _onChange(e) {
        // call the base function
        BaseModel.fn._notifyChange.call(this, e);
        // kendo only handles add/remove on arrays of child elements
        // set dirty when an itemchange occurs in an array, e.g. versions
        // See: http://blog.falafel.com/Blogs/JoshEastburn/josh-eastburn/2014/04/25/dirty-children-and-kendo-ui
        if (e.action === CONSTANTS.ITEMCHANGE) {
            this.dirty = true;
        }
    }
    /*
    load(data) {
        const that = this;
        const dfd = $.Deferred();
        if (CONSTANTS.RX_MONGODB_ID.test(data)) {
            // data is a organization id and we fetch a full organization
            rapi.v1.content
                .getOrganization(__.locale, data)
                .then(organization => {
                    that.accept(organization);
                    dfd.resolve(organization);
                })
                .catch(dfd.reject);
        } else if (
            $.isPlainObject(data) &&
            CONSTANTS.RX_MONGODB_ID.test(data.id)
        ) {
            if (data.published instanceof Date) {
                // data is a published organization and we use model.accept to load data
                that.accept(data);
                dfd.resolve(data);
            } else {
                // data is a draft organization, hence it is incomplete
                // because the webapp could not fetch the organization without authentication
                // We therefore need to fetch a full organization
                // data is a organization id and we fetch a full organization
                rapi.v1.content
                    .getOrganization(__.locale, data.id)
                    .then(organization => {
                        that.accept(organization);
                        dfd.resolve(organization);
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
                .updateOrganization(language, id, data)
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
});

/**
 * organizationTransport
 */
const organizationTransport = new RemoteTransport({
    collection: new AjaxOrganizations({
        partition: { language: 'en' }, // TODO remove but raises an error
        projection: BaseModel.projection(Organization)
    })
});

/**
 * Extend Organization with transport
 */
extendModelWithTransport(NewOrganization, organizationTransport);
extendModelWithTransport(Organization, organizationTransport);

/**
 * Export
 */
export { NewOrganization, Organization };

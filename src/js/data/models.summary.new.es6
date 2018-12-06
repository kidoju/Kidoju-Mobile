/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import 'kendo.core';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './models.base.es6';
import UserReference from './models.user.reference.es6';

const { i18n, uris } = window.app;
const { format } = window.kendo;

/**
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
            defaultValue: i18n.locale(),
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
        const languages = i18n.culture.languages;
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
            if ($.isPlainObject(me) && RX_MONGODB_ID.test(me.id)) {
                me.userId = me.id;
                // delete me.picture;
                that.set('author', new models.UserReference(me));
                // that.set('language', i18n.locale());
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
        return rapi.v1.content.createSummary(i18n.locale(), newSummary);
    }
    */
});

/**
 * Default export
 */
export default NewSummary;

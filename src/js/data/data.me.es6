/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import 'kendo.core';
import config from '../app/app.config.jsx';
import i18n from '../app/app.i18n.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxUsers from '../rapi/rapi.users.es6';
import BaseModel from './data.base.es6';
import extendModelWithTransport from './mixins.transport.es6';
import CacheItemStrategy from './strategy.cache.item.es6';
import LazyRemoteTransport from './transports.remote.lazy.es6';

const { format } = window.kendo;

/**
 * Me (current user)
 * @class Me
 * @extends BaseModel
 */
const Me = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        firstName: {
            type: CONSTANTS.STRING,
            editable: false
        },
        lastName: {
            type: CONSTANTS.STRING,
            editable: false
        },
        picture: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        provider: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        }
        // TODO timezone (for display of dates), born (for searches)
        // TODO subscription
        // TODO User Group (sysadmin, ...)
    },
    fullName$() {
        return `${(this.get('firstName') || '').trim()} ${(
            this.get('lastName') || ''
        ).trim()}`.trim();
    },
    picture$() {
        return this.get('picture') || format(config.uris.cdn.icons, 'user');
    },
    isAuthenticated$() {
        return CONSTANTS.RX_MONGODB_ID.test(this.get('id'));
    },
    userUri$() {
        return format(config.uris.webapp.user, i18n.locale(), this.get('id'));
    },
    reset() {
        // Since we have marked fields as non editable, we cannot use 'that.set'
        this.accept({
            id: this.defaults.id,
            firstName: this.defaults.firstName,
            lastName: this.defaults.lastName,
            picture: this.defaults.picture
        });
    }
    /*
    // TODO Use transport mixin
    load() {
        const that = this;
        return app.cache.getMe().then(data => {
            if ($.isPlainObject(data) && CONSTANTS.RX_MONGODB_ID.test(data.id)) {
                // Since we have marked fields as non editable, we cannot use 'that.set',
                // This should raise a change event on the parent viewModel
                that.accept({
                    id: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    picture: data.picture
                });
            } else {
                that.reset();
            }
        });
    }
    */
});

/**
 * Me transport
 */
const meTransport = new CacheItemStrategy({
    cache: 'session',
    key: 'me',
    singleton: true,
    transport: new LazyRemoteTransport({
        collection: new AjaxUsers({
            partition: {
                id: 'me'
            }
            // TODO Add field projection
        })
    })
    // ttl: 24 * 60 * 60
});

/**
 * Extend model with transport
 */
extendModelWithTransport(Me, meTransport);

/**
 * Default export
 */
export default Me;

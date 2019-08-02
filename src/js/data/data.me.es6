/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import 'kendo.core';
import __ from '../app/app.i18n.es6';
import { iconUri, userUri } from '../app/app.uris.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxUsers from '../rapi/rapi.users.es6';
import BaseModel from './data.base.es6';
import extendModelWithTransport from './mixins.transport.es6';
import CacheItemStrategy from './strategy.cache.item.es6';
import LazyRemoteTransport from './transports.remote.lazy.es6';

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
            // TODO Review
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
        return this.get('picture') || iconUri('user');
    },
    isAuthenticated$() {
        return CONSTANTS.RX_MONGODB_ID.test(this.get('id'));
    },
    userUri$() {
        return userUri(__.locale, this.get('id'));
    },
    onUserPictureError(e) {
        // https://blog.imagekit.io/how-to-handle-loading-images-that-may-not-exist-on-your-website-92e6c3c6ea63
        // on the img tag, bind this error handler as follows: data-bind="events: { error: me.onUserPictureError }"
        e.target.onerror = null;
        e.target.src = iconUri('user');
    }
});

/**
 * Me transport
 */
const meTransport = new CacheItemStrategy({
    cache: 'session',
    key: CONSTANTS.ME,
    singleton: true,
    transport: new LazyRemoteTransport({
        collection: new AjaxUsers({
            projection: BaseModel.projection(Me)
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

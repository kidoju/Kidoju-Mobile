/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import 'kendo.core';
import __ from '../app/app.i18n.es6';
import { iconUri, userUri } from '../app/app.uris.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';
import { UserMetricsReference } from './reference.metrics';

/**
 * UserReference
 * @class UserReference
 * @extends BaseModel
 */
const UserReference = BaseModel.define({
    id: 'id', // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            // nullable: true, // isNew is not required
            serializable: false
        },
        created: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        },
        firstName: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        lastName: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        metrics: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof UserMetricsReference
                    ? value
                    : new UserMetricsReference(value);
            },
            serializable: false
        },
        picture: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        updated: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        }
    },
    fullName$() {
        return `${(this.get('firstName') || '').trim()} ${(
            this.get('lastName') || ''
        ).trim()}`.trim();
    },
    picture$() {
        return this.get('picture') || iconUri('user');
    },
    userUri$() {
        return userUri(__.locale, this.get('id'));
    },
    onUserPictureError(e) {
        // https://blog.imagekit.io/how-to-handle-loading-images-that-may-not-exist-on-your-website-92e6c3c6ea63
        // on the img tag, bind this error handler as follows: data-bind="events: { error: summary.author.onUserPictureError }"
        e.target.onerror = null;
        e.target.src = iconUri('user');
    }
});

/**
 * Default export
 */
export default UserReference;

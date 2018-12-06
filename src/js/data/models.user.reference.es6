/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import 'kendo.core';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './models.base.es6';

const { i18n, uris } = window.app;
const { format } = window.kendo;

/**
 * UserReference
 * @class UserReference
 * @extends BaseModel
 */
const UserReference = BaseModel.define({
    id: 'userId', // the identifier of the model, which is required for isNew() to work
    fields: {
        userId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true // TODO Are we sure because this is not the way to create and isNew is not required
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
        }
    },
    fullName$() {
        return `${(this.get('firstName') || '').trim()} ${(
            this.get('lastName') || ''
        ).trim()}`.trim();
    },
    userUri$() {
        return format(uris.webapp.user, i18n.locale(), this.get('userId'));
    }
});

/**
 * Default export
 */
export default UserReference;

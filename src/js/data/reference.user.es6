/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import 'kendo.core';
import config from '../app/app.config.jsx';
import i18n from '../app/app.i18n.es6';
import { userUri } from '../app/app.uris.es6';
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
    userUri$() {
        return userUri(i18n.locale, this.get('id'));
    }
});

/**
 * Default export
 */
export default UserReference;

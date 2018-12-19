/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';

/**
 * Account
 * @class Account
 * @extends BaseModel
 */
const Account = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
            serializable: false
        },
        email: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        firstName: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        gender: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        lastName: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        link: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        locale: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        timezone: {
            type: CONSTANTS.STRING,
            editable: false,
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
        },
        verified: {
            type: CONSTANTS.BOOLEAN,
            editable: false,
            serializable: false
        }
    }
});

/**
 * Default export
 */
export default Account;

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO can probably be removed

import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';

/**
 * Version reference for activities
 * @type {kidoju.data.Model}
 */
const VersionReference = BaseModel.define({
    id: 'versionId', // the identifier of the model, which is required for isNew() to work
    fields: {
        language: {
            type: CONSTANTS.STRING,
            editable: false
        },
        summaryId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        title: {
            type: CONSTANTS.STRING,
            editable: false
        },
        versionId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        }
    }
});

/**
 * Default export
 */
export default VersionReference;

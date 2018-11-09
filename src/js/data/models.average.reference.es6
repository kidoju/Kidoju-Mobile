/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './models.base.es6';

/**
 * AverageReference
 * @class AverageReference
 * @extends BaseModel
 */
const AverageReference = BaseModel.define({
    fields: {
        average: {
            type: CONSTANTS.NUMBER,
            editable: false,
            nullable: true, // average is null when there is no count
            parse(value) {
                return Number.isNaN(value) ? null : value;
            },
            serializable: false
        }
    }
});

/**
 * Default export
 */
export default AverageReference;

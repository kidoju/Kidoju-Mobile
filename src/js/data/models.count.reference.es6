/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './models.base.es6';

/**
 * CountReference
 * @class CountReference
 * @extends BaseModel
 */
const CountReference = BaseModel.define({
    fields: {
        count: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        }
    }
});

/**
 * Default export
 */
export default CountReference;

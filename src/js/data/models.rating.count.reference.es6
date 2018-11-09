/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './models.base.es6';

/**
 * RatingCountReference
 * @class RatingCountReference
 * @extends BaseModel
 */
const RatingCountReference = BaseModel.define({
    fields: {
        average: {
            type: CONSTANTS.NUMBER,
            editable: false,
            nullable: true, // average is null when there is no count
            parse(value) {
                return Number.isNaN(value) || value < 0 ? null : value;
            },
            serializable: false
        },
        count_1: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0
                    ? 0
                    : Math.trunc(value);
            },
            serializable: false
        },
        count_2: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0
                    ? 0
                    : Math.trunc(value);
            },
            serializable: false
        },
        count_3: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0
                    ? 0
                    : Math.trunc(value);
            },
            serializable: false
        },
        count_4: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0
                    ? 0
                    : Math.trunc(value);
            },
            serializable: false
        },
        count_5: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0
                    ? 0
                    : Math.trunc(value);
            },
            serializable: false
        }
    }
});

/**
 * Default export
 */
export default RatingCountReference;

/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import BaseModel from './models.base.es6';
import CountReference from './models.count.reference.es6';
import RatingCountReference from './models.rating.count.reference.es6';
import ScoreCountReference from './models.score.count.reference.es6';

/**
 * SummaryMetricsReference
 * @class SummaryMetricsReference
 * @extends BaseModel
 */
const SummaryMetricsReference = BaseModel.define({
    fields: {
        comments: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof CountReference
                    ? value
                    : new CountReference(value);
            },
            serializable: false
        },
        ratings: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof RatingCountReference
                    ? value
                    : new RatingCountReference(value);
            },
            serializable: false
        },
        scores: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof ScoreCountReference
                    ? value
                    : new ScoreCountReference(value);
            },
            serializable: false
        },
        views: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof CountReference
                    ? value
                    : new CountReference(value);
            },
            serializable: false
        }
    }
});

/**
 * Default export
 */
export default SummaryMetricsReference;

/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import BaseModel from './models.base.es6';
import CountReference from './models.count.reference.es6';
import RatingCountReference from './models.rating.count.reference.es6';
import ScoreCountReference from './models.score.count.reference.es6';

/**
 * UserMetricsReference
 * @class UserMetricsReference
 * @extends BaseModel
 */
const UserMetricsReference = BaseModel.define({
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
        summaries: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof CountReference
                    ? value
                    : new CountReference(value);
            },
            serializable: false
        }
    },

    // We might as well call them student points
    actorPoints$() {
        const ratings =
            (this.get('ratings.count_1') || 0) +
            (this.get('ratings.count_2') || 0) +
            (this.get('ratings.count_3') || 0) +
            (this.get('ratings.count_4') || 0) +
            (this.get('ratings.count_5') || 0);
        const average = this.get('scores.average');
        const count =
            // this.get('scores.count_00') || 0 +
            // (this.get('scores.count_00') || 0) +
            // (this.get('scores.count_05') || 0) +
            // (this.get('scores.count_10') || 0) +
            // (this.get('scores.count_15') || 0) +
            // (this.get('scores.count_20') || 0) +
            (this.get('scores.count_25') || 0) +
            (this.get('scores.count_30') || 0) +
            (this.get('scores.count_35') || 0) +
            (this.get('scores.count_40') || 0) +
            (this.get('scores.count_45') || 0) +
            (this.get('scores.count_50') || 0) +
            (this.get('scores.count_55') || 0) +
            (this.get('scores.count_60') || 0) +
            (this.get('scores.count_65') || 0) +
            (this.get('scores.count_70') || 0) +
            (this.get('scores.count_75') || 0) +
            (this.get('scores.count_80') || 0) +
            (this.get('scores.count_85') || 0) +
            (this.get('scores.count_90') || 0) +
            (this.get('scores.count_95') || 0);
        // Each score above 25 is worth its prorata of 1 point (100/100)
        // And we add some bonus points for rating Kidojus
        return Math.round((count * average) / 100 + 0.1 * ratings);
    },

    // We might as well call them teacher points
    authorPoints$() {
        // Each published Kidoju quiz is worth 10 points
        return this.get('summaries.count') || 0;
    }
});

/**
 * Default export
 */
export default UserMetricsReference;

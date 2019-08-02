/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';
import { iconUri } from '../app/app.uris';

/**
 * AverageReference
 * @class AverageReference
 * @extends BaseModel
 */
/*
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
*/

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
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_2: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_3: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_4: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_5: {
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
 * ScoreCountReference
 * @class ScoreCountReference
 * @extends BaseModel
 */
const ScoreCountReference = BaseModel.define({
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
        count_00: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_05: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_10: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_15: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_20: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_25: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_30: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_35: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_40: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_45: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_50: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_55: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_60: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_65: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_70: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_75: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_80: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_85: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_90: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        },
        count_95: {
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
            parse(value) {
                return Number.isNaN(value) || value < 0 ? 0 : Math.trunc(value);
            },
            serializable: false
        }
    },

    /**
     * Return an array ready for a kendo.dataviz.Chart histogram
     * To draw on the chart, see http://docs.telerik.com/kendo-ui/dataviz/chart/how-to/draw-on-scatter-plots
     */
    series$() {
        return [
            { score: '0+', count: this.get('count_00') },
            { score: '5+', count: this.get('count_05') },
            { score: '10+', count: this.get('count_10') },
            { score: '15+', count: this.get('count_15') },
            { score: '20+', count: this.get('count_20') },
            { score: '25+', count: this.get('count_25') },
            { score: '30+', count: this.get('count_30') },
            { score: '35+', count: this.get('count_35') },
            { score: '40+', count: this.get('count_40') },
            { score: '45+', count: this.get('count_45') },
            { score: '50+', count: this.get('count_50') },
            { score: '55+', count: this.get('count_55') },
            { score: '60+', count: this.get('count_60') },
            { score: '65+', count: this.get('count_65') },
            { score: '70+', count: this.get('count_70') },
            { score: '75+', count: this.get('count_75') },
            { score: '80+', count: this.get('count_80') },
            { score: '85+', count: this.get('count_85') },
            { score: '90+', count: this.get('count_90') },
            { score: '95+', count: this.get('count_95') }
        ];
    }
});

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
    },

    /**
     * Get actor medal (based on actor/student) points
     * @returns {*}
     */
    actorMedalUri$() {
        const points = this.actorPoints$();
        const medals = [
            'grey',
            'yellow',
            'orange',
            'pink',
            'red',
            'blue',
            'green',
            'black'
        ];
        const index = Math.min(Math.floor(points / 10), 7);
        return iconUri(`medal_${medals[index]}`);
    },

    /**
     * Get author medal (based on author/teacher) points
     * @returns {*}
     */
    authorMedalUri$() {
        const points = this.authorPoints$();
        const medals = [
            'grey',
            'yellow',
            'orange',
            'pink',
            'red',
            'blue',
            'green',
            'black'
        ];
        const index = Math.min(Math.floor(points / 10), 7);
        return iconUri(`medal2_${medals[index]}`);
    }
});

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
 * Export
 */
export { UserMetricsReference, SummaryMetricsReference };

/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO: Add functions to pull the test model from version.stream

import 'kendo.core';
import CONSTANTS from '../common/window.constants.es6';
import Activity from './models.activity.es6';

const { i18n } = window; // TODO Review
const { format } = window.kendo;

/**
 * Score model
 * @class Score
 * @extends Activity
 */
const Score = Activity.define({
    fields: {
        test: {
            defaultValue: null
            /*
             A test is a hash object of
             val_abcd: {
             result: true/false,
             score: n,
             value: 'user answer'
             }
             */
        },
        score: {
            type: CONSTANTS.NUMBER,
            editable: false
        }
    },

    /**
     * Init
     * @constructor init
     * @param data
     */
    init(data) {
        // Call the base init method
        Activity.fn.init.call(this, data);
        // Enforce the type
        this.type = 'Score';
    },

    /**
     * Score name // TODO rename into description$
     * @method scoreName$
     * @returns {*}
     */
    scoreName$() {
        let ret;
        const id = this.get(this.idField); // TODO Check!!!
        if (CONSTANTS.RX_MONGODB_ID.test(id)) {
            ret = format(
                `{0:${i18n.culture.dateFormat}} ({1:p0})`, // TODO: i18n
                this.get('created'), // TODO: timezone
                this.get('score') / 100
            );
        }
        return ret;
    }
});

/**
 * Default export
 */
export default Score;

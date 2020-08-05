/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO: Add functions to pull the test model from version.stream and verify it

import 'kendo.core';
import __ from '../app/app.i18n.es6';
import { getVersionReference } from '../app/app.partitions.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxActivities from '../rapi/rapi.activities.es6';
import Activity from './data.activity.es6';
import BaseModel from './data.base.es6';
import extendModelWithTransport from './mixins.transport.es6';
import RemoteTransport from './transports.remote.es6';

const { format } = window.kendo;

/**
 * Score
 * @class Score
 * @extends Activity
 */
const Score = Activity.define({
    fields: {
        test: {
            defaultValue: null,
            /*
             // A test is a hash object of
             val_abcdef: {
                result: true/false,
                score: n,
                value: 'user answer'
             },
             // An array of
             interactions: [],
             // An array of variables
             variables: []
             */
        },
        value: {
            type: CONSTANTS.NUMBER,
            editable: false,
        },
    },

    /**
     * Init
     * @constructor init
     * @param options
     */
    init(options) {
        // Call the base init method
        Activity.fn.init.call(this, options);
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
                `{0:${__('webapp.dateFormat')}} ({1:p0})`, // TODO: i18n
                this.get('created'), // TODO: timezone
                this.get('value') / 100
            );
        }
        return ret;
    },
});

/**
 * scoreTransport
 */
const scoreTransport = new RemoteTransport({
    collection: new AjaxActivities({
        partition: getVersionReference(),
        projection: BaseModel.projection(Score), // TODO beware null values
    }),
});

/**
 * Extend Activity with transport
 */
extendModelWithTransport(Score, scoreTransport);

/**
 * Default export
 */
export default Score;

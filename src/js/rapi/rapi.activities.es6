/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

/**
 * AjaxActivities
 * @class
 */
export default class AjaxActivities extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'activities'
        });
        super(options);
        assert.isNonEmptyPlainObject(
            this._partition,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options.partition'
            )
        );
        assert.match(
            CONSTANTS.RX_LANGUAGE,
            this._partition.language,
            assert.format(
                assert.messages.match.default,
                'options.partition.language',
                CONSTANTS.RX_LANGUAGE
            )
        );
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            this._partition.summaryId,
            assert.format(
                assert.messages.match.default,
                'options.partition.summaryId',
                CONSTANTS.RX_MONGODB_ID
            )
        );
    }

    /**
     * Get method url
     * @param method
     * @param id
     * @private
     */
    _getUrl(method, id) {
        let ret;
        if (
            method === AjaxBase.METHOD.CREATE ||
            method === AjaxBase.METHOD.READ
        ) {
            ret = format(
                // TODO config.uris.rapi.v1.myActivities,
                config.uris.rapi.v1.activities,
                this._partition.language,
                this._partition.summaryId
            );
        } else {
            ret = assert.format(
                config.uris.rapi.v1.activity,
                this._partition.language,
                this._partition.summaryId,
                id
            );
        }
        return ret;
    }

    /**
     * Extend query with projection and partition
     * @param query
     * @private
     */
    _extendQuery(query) {
        return super._extendQuery(query);
    }
}
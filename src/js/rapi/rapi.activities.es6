/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import { sessionCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

/**
 * AjaxActivities
 * @class
 */
class AjaxActivities extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'activities',
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
        if (this._partition.actorId) {
            assert.match(
                CONSTANTS.RX_MONGODB_ID,
                this._partition.actorId,
                assert.format(
                    assert.messages.match.default,
                    'options.partition.actorId',
                    CONSTANTS.RX_MONGODB_ID
                )
            );
        }
        if (this._partition.summaryId) {
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
    }

    /**
     * Get method url
     * @param method
     * @param id
     * @private
     */
    _getUrl(method, id) {
        const me = sessionCache.getItem(CONSTANTS.ME) || {};
        if (method === AjaxBase.METHOD.READ) {
            // mySummaries lists private and unpublished summaries
            return format(
                me.id && this._partition.actorId === me.id
                    ? config.uris.rapi.v1.myActivities
                    : config.uris.rapi.v1.activities,
                this._partition.language,
                this._partition.summaryId
            );
        }
        if (method === AjaxBase.METHOD.CREATE) {
            return format(
                config.uris.rapi.v1.activities,
                this._partition.language,
                this._partition.summaryId
            );
        }
        return format(
            config.uris.rapi.v1.activity,
            this._partition.language,
            this._partition.summaryId,
            id
        );
        // return super._getUrl(method, id);
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

/**
 * Default export
 */
export default AjaxActivities;

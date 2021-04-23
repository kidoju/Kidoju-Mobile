/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import { sessionCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

/**
 * AjaxSummaries
 * @class AjaxSummaries
 * @extends AjaxBase
 */
class AjaxSummaries extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'summaries',
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
                me.id && this._partition.authorId === me.id
                    ? config.uris.rapi.v1.mySummaries
                    : config.uris.rapi.v1.summaries,
                this._partition.language
            );
        }
        if (method === AjaxBase.METHOD.CREATE) {
            return format(
                config.uris.rapi.v1.summaries,
                this._partition.language
            );
        }
        if (
            method === AjaxBase.METHOD.DESTROY ||
            method === AjaxBase.METHOD.GET ||
            method === AjaxBase.METHOD.UPDATE
        ) {
            return format(
                config.uris.rapi.v1.summary,
                this._partition.language,
                id
            );
        }
        return super._getUrl(method, id);
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
export default AjaxSummaries;

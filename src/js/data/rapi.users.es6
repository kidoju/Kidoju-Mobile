/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxBase from './rapi.base.es6';

/**
 * AjaxUsers
 * @class
 */
export default class AjaxUsers extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'users'
        });
        super(options);
        assert.isPlainObject(
            this._partition,
            assert.format(
                assert.messages.isPlainObject.default,
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
        let ret;
        if (
            method === AjaxBase.METHOD.CREATE ||
            method === AjaxBase.METHOD.READ
        ) {
            ret = assert.format(
                'http://localhost:3001/api/v1/{0}/users',
                this._partition.language
            );
        } else {
            ret = assert.format(
                'http://localhost:3001/api/v1/{0}/users/{1}',
                this._partition.language,
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

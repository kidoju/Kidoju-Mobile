/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import config from '../app/app.config.jsx';
import i18n from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import AjaxBase from './rapi.base.es6';
import { format } from './rapi.util.es6';

const logger = new Logger('rapi.websearch');

/**
 * AjaxWebSearch
 * @class AjaxWebSearch
 * @extends AjaxBase
 */
class AjaxWebSearch extends AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        Object.assign(options, {
            collection: 'websearch'
        });
        super(options);

        // We need a provider like `google`
        this._provider = options.provider;
        this._searchType = options.searchType;
        assert.type(
            CONSTANTS.STRING,
            this._provider,
            assert.format(
                assert.messages.type.default,
                'options.provider',
                CONSTANTS.STRING
            )
        );
    }

    /**
     * Get method endpoint
     * @param method
     * @returns {*}
     * @private
     */
    _getUrl(method) {
        if (method === AjaxBase.METHOD.READ) {
            return format(config.uris.rapi.web.search, this._provider);
        }
        return super._getUrl(method);
    }

    /**
     * Extend query
     * @param query
     * @private
     */
    _extendQuery(query) {
        if (this._provider === 'google') {
            const ret = { q: '' };
            // query.filter is built by the assetmanager search box
            if (
                query.filter &&
                query.filter.logic === 'and' &&
                Array.isArray(query.filter.filters) &&
                query.filter.filters.length > 1 &&
                query.filter.filters[1].field === 'url'
            ) {
                ret.q = query.filter.filters[1].value || '';
            }
            ret.type = this._searchType;
            ret.language = i18n.locale();
            return ret;
        }
        return super._extendQuery(query);
    }

    /**
     * Get (many)
     * @param query
     */
    read(query) {
        assert.isPlainObjectOrUndef(
            query,
            assert.format(assert.messages.isPlainObjectOrUndef.default, 'query')
        );
        const url = this._getUrl(AjaxBase.METHOD.READ);
        const q = this._extendQuery(query);
        logger.info({
            message: '$.ajax',
            method: `${this._collection}.${AjaxBase.METHOD.READ}`,
            data: { url, q }
        });
        return $.ajax({
            cache: true, // <----------This is different from AjaxBase.read
            data: q,
            headers: this._getHeaders(AjaxBase.METHOD.READ),
            type: AjaxBase.HTTP.GET,
            url
        });
    }
}

/**
 * Default export
 */
export default AjaxWebSearch;

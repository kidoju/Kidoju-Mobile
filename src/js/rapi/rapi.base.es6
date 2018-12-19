/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { getHeaders } from './rapi.util.es6';

const logger = new Logger('rapi.base');
const HTTP = {
    DELETE: 'DELETE',
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    PUT: 'PUT'
};
// Note: we cannot use arguments.callee.name in strict mode
const METHOD = {
    CREATE: 'create',
    DESTROY: 'destroy',
    GET: 'get',
    READ: 'read',
    UPDATE: 'update'
};

/**
 * AjaxBase
 * @class
 */
export default class AjaxBase {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options) {
        this._collection = options.collection;
        this._partition = options.partition;
        this._projection = options.projection;
    }

    /**
     * HTTP statics
     * @returns {{DELETE: string, GET: string, POST: string, PATCH: string, PUT: string}}
     * @constructor
     */
    static get HTTP() {
        return HTTP;
    }

    /**
     * METHOD statics
     * @returns {{CREATE: string, DESTROY: string, GET: string, READ: string, UPDATE: string}}
     * @constructor
     */
    static get METHOD() {
        return METHOD;
    }

    /**
     * Get headers for each method
     * @param method
     * @private
     */
    // eslint-disable-next-line class-methods-use-this
    _getHeaders(/* method */) {
        return getHeaders();
    }

    /**
     * Get Url from partition
     * Note: Generally, create and read use the collection endpoint
     * and get, destroy and update use endpoint/{id}
     * @param method
     * @param id
     */
    // eslint-disable-next-line class-methods-use-this
    _getUrl(method /* , id */) {
        throw new Error(
            `This is an abstract class. \`${method}\` has no end point`
        );
    }

    /**
     * Extend query with partition and projection
     * @param query
     * @private
     */
    // eslint-disable-next-line class-methods-use-this
    _extendQuery(query) {
        return query; // By default simply return query
    }

    /**
     * Get/set projection
     * @param value
     * @returns {*}
     */
    partition(value) {
        let ret;
        if ($.type(value) === CONSTANTS.UNDEFINED) {
            ret = this._partition;
        } else {
            this._partition = value;
        }
        return ret;
    }

    /**
     * Get/set projection
     * @param value
     * @returns {*}
     */
    projection(value) {
        let ret;
        if ($.type(value) === CONSTANTS.UNDEFINED) {
            ret = this._projection;
        } else {
            this._projection = value;
        }
        return ret;
    }

    /**
     * Create
     * @param doc
     */
    create(doc) {
        assert.isNonEmptyPlainObject(
            doc,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'doc')
        );
        const url = this._getUrl(METHOD.CREATE);
        logger.info({
            message: '$.ajax',
            method: `${this._collection}.${METHOD.CREATE}`,
            data: { url, doc }
        });
        return $.ajax({
            contentType: CONSTANTS.JSON_CONTENT_TYPE,
            data: JSON.stringify(doc),
            headers: this._getHeaders(METHOD.CREATE),
            type: HTTP.POST,
            url
        });
    }

    /**
     * Destroy
     * @param id
     */
    destroy(id) {
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            id,
            assert.format(
                assert.messages.match.default,
                'id',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        const url = this._getUrl(METHOD.DESTROY, id);
        logger.info({
            message: '$.ajax',
            method: `${this._collection}.${METHOD.DESTROY}`,
            data: { url }
        });
        return $.ajax({
            headers: this._getHeaders(METHOD.DESTROY),
            type: HTTP.DELETE,
            url
        });
    }

    /**
     * Get (one)
     * @param id
     * @param query
     */
    get(id, query) {
        if (['languages', 'ping'].indexOf(this._collection) === -1) {
            assert.match(
                CONSTANTS.RX_MONGODB_ID,
                id,
                assert.format(
                    assert.messages.match.default,
                    'id',
                    CONSTANTS.RX_MONGODB_ID
                )
            );
        }
        assert.isNonEmptyPlainObjectOrUndef(
            query,
            assert.format(
                assert.messages.isNonEmptyPlainObjectOrUndef.default,
                'query'
            )
        );
        const url = this._getUrl(METHOD.GET, id);
        const q = this._extendQuery(query);
        logger.info({
            message: '$.ajax',
            method: `${this._collection}.${METHOD.GET}`,
            data: { url, q }
        });
        return $.ajax({
            cache: false,
            data: q,
            headers: this._getHeaders(METHOD.GET),
            type: HTTP.GET,
            url
        });
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
        const url = this._getUrl(METHOD.READ);
        const q = this._extendQuery(query);
        logger.info({
            message: '$.ajax',
            method: `${this._collection}.${METHOD.READ}`,
            data: { url, q }
        });
        return $.ajax({
            cache: false,
            data: q,
            headers: this._getHeaders(METHOD.READ),
            type: HTTP.GET,
            url
        });
    }

    /**
     * Update
     * @param id
     * @param doc
     */
    update(id, doc) {
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            id,
            assert.format(
                assert.messages.match.default,
                'id',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        assert.isNonEmptyPlainObject(
            doc,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'doc')
        );
        const url = this._getUrl(METHOD.UPDATE, id);
        logger.info({
            message: '$.ajax',
            method: `${this._collection}.${METHOD.UPDATE}`,
            data: { url, doc }
        });
        return $.ajax({
            contentType: CONSTANTS.JSON_CONTENT_TYPE,
            data: JSON.stringify(doc),
            headers: this._getHeaders(METHOD.UPDATE),
            type: HTTP.PUT,
            url
        });
    }
}

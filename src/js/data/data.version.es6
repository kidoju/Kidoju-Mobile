/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO Implement patch rfc 6902
// TODO implement timezones

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import 'kendo.core';
import __ from '../app/app.i18n.es6';
import { getSummaryReference } from '../app/app.partitions.es6';
import { editorUri, playerUri, summaryUri } from '../app/app.uris.es6';
// import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxVersions from '../rapi/rapi.versions.es6';
import BaseModel from './data.base.es6';
import Stream from './data.stream.es6';
import RemoteTransport from './transports.remote.es6';
import extendModelWithTransport from './mixins.transport.es6';

/**
 * Version
 * @type {kidoju.data.Model}
 */
const Version = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
            serializable: false
        },
        authorId: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        categoryId: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        created: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        },
        language: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        state: {
            type: CONSTANTS.NUMBER,
            editable: false,
            serializable: false
        },
        stream: {
            defaultValue: {}, // new Stream(),
            nullable: false,
            parse(value) {
                return value instanceof Stream ? value : new Stream(value);
            }
        },
        summaryId: {
            type: CONSTANTS.STRING,
            editable: false
            // We need to serialize summaryId so that partition validation passes
            // serializable: false
        },
        type: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        updated: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        }
    },
    created$() {
        // TODO timezone
        return this.get('created');
    },
    updated$() {
        // TODO timezone
        return this.get('updated');
    },
    playerUri$() {
        return playerUri(__.locale, this.get('summaryId'), this.get('id'));
    },
    editorUri$() {
        return editorUri(__.locale, this.get('summaryId'));
    },
    summaryUri$() {
        return summaryUri(__.locale, this.get('summaryId'));
    }
    /*
    load(summaryId, versionId) {
        const that = this;
        return rapi.v1.content
            .getSummaryVersion(__.locale, summaryId, versionId)
            .then(version => {
                that.accept(version);
                assert.equal(
                    MD5_A,
                    md5('a'),
                    assert.format(
                        assert.messages.equal.default,
                        'md5("a")',
                        MD5_A
                    )
                );
                that._md5 = md5(JSON.stringify(that.toJSON()));
            });
    },
    save() {
        const that = this;
        // That.dirty is not updated when modifying dataSource items
        // so we have no way to optimize and avoid saving unmodified versions based on `dirty`
        // like we have done elsewhere
        const _md5 = that._md5;
        const data = that.toJSON(true); // true means with hierarchy of data sources
        assert.isNonEmptyPlainObject(
            data,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'data')
        );
        assert.isUndefined(
            data.created,
            assert.format(assert.messages.isUndefined.default, 'data.created')
        );
        assert.isUndefined(
            data.id,
            assert.format(assert.messages.isUndefined.default, 'data.id')
        );
        assert.isUndefined(
            data.language,
            assert.format(assert.messages.isUndefined.default, 'data.language')
        );
        assert.isUndefined(
            data.state,
            assert.format(assert.messages.isUndefined.default, 'data.state')
        );
        assert.isUndefined(
            data.summaryId,
            assert.format(assert.messages.isUndefined.default, 'data.summaryId')
        );
        assert.isUndefined(
            data.type,
            assert.format(assert.messages.isUndefined.default, 'data.type')
        );
        assert.isUndefined(
            data.updated,
            assert.format(assert.messages.isUndefined.default, 'data.updated')
        );
        assert.isUndefined(
            data.userId,
            assert.format(assert.messages.isUndefined.default, 'data.userId')
        );
        assert.equal(
            MD5_A,
            md5('a'),
            assert.format(assert.messages.equal.default, 'md5("a")', MD5_A)
        );
        that._md5 = md5(JSON.stringify(data));
        if (that._md5 !== _md5) {
            // if (that.dirty) { // TODO Validate
            const language = that.get('language');
            const summaryId = that.get('summaryId');
            const versionId = that.get('id');
            return rapi.v1.content
                .updateSummaryVersion(language, summaryId, versionId, data)
                .then(data => {
                    // Note: data is not parsed, so dates are string
                    that.accept(data); // this updates dirty and updated
                });
        }
        return $.Deferred()
            .resolve()
            .promise();
    }
    */
});

/**
 * versionTransport
 */
const versionTransport = new RemoteTransport({
    collection: new AjaxVersions({
        partition: getSummaryReference(),
        projection: BaseModel.projection(Version)
    })
});

/**
 * Extend Version with transport
 */
extendModelWithTransport(Version, versionTransport);

/**
 * Export
 */
export default Version;

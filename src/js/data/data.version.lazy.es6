/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import { editorUri, playerUri } from '../app/app.uris.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';
import __ from '../app/app.i18n.es6';
import { getSummaryReference } from '../app/app.partitions.es6';
import themer from '../app/app.themer.es6';
import LazyRemoteTransport from './transports.remote.lazy.es6';
import AjaxVersions from '../rapi/rapi.versions.es6';
import { normalizeSchema } from './data.util.es6';

const {
    data: { DataSource },
    format
} = window.kendo;

/**
 * Lazy version
 * @class LazyVersion
 * @extends BaseModel
 */
const LazyVersion = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        // created
        // language
        name: {
            from: CONSTANTS.EMPTY, // Do not include in projection
            type: CONSTANTS.STRING,
            editable: false
        },
        state: {
            type: CONSTANTS.NUMBER,
            editable: false
        },
        // stream
        summaryId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        }
        // type
        // updated
        // userId
    },
    playerUri$() {
        return playerUri(
            __.locale,
            this.get('summaryId'),
            this.get('id')
        );
    },
    editorUri$() {
        return editorUri(
            __.locale,
            this.get('summaryId')
        );
    },
    iframe$() {
        // TODO consider the sandbox attribute -- see http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/
        return format(
            '<iframe src="{0}?embed=true{1}" style="height:500px;width:100%;border:solid 1px #d5d5d5;"></iframe>',
            this.playerUri$(),
            themer && $.isFunction(themer.name)
                ? `&theme=${encodeURIComponent(themer.name())}`
                : ''
        );
    }
});

/**
 * lazyVersionTransport
 */
const lazyVersionTransport = new LazyRemoteTransport({
    collection: new AjaxVersions({
        partition: getSummaryReference(),
        projection: BaseModel.projection(LazyVersion)
    })
});

/**
 * LazyVersionDataSource
 * @class LazyVersionDataSource
 * @extends DataSource
 */
const LazyVersionDataSource = DataSource.extend({
    /**
     * Init
     * @constructor
     * @param options
     */
    init(options = {}) {
        DataSource.fn.init.call(
            this,
            $.extend(
                true,
                {
                    pageSize: CONSTANTS.DATA_PAGE_SIZE.MAX
                },
                options,
                {
                    transport: lazyVersionTransport,
                    schema: normalizeSchema({
                        modelBase: LazyVersion,
                        model: LazyVersion,
                        parse(response) {
                            // Name versions: draft, version 1, version 2, ....
                            // TODO Add a sort order to only get the last 100 in case there are more...
                            if (
                                response &&
                                $.type(response.total) === CONSTANTS.NUMBER &&
                                $.isArray(response.data)
                            ) {
                                response.data.forEach((item, index) => {
                                    /* eslint-disable prettier/prettier */
                                    // eslint-disable-next-line no-param-reassign
                                    item.name =
                                        item.state === CONSTANTS.WORKFLOW.DRAFT
                                            ? __('webapp.versions.draft.name')
                                            : format(
                                                __('webapp.versions')
                                                    .published.name,
                                                response.data.length - index
                                            );
                                    /* eslint-enable prettier/prettier */
                                });
                            }
                            return response;
                        }
                    }),
                    serverFiltering: true,
                    serverSorting: true,
                    serverPaging: true
                }
            )
        );
    }
});

/**
 * Export
 */
export { LazyVersion, LazyVersionDataSource };

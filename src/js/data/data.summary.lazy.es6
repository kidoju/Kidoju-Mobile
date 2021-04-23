/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO UserScore$ for Kidoju-WebApp and colors

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import db from '../app/app.db.es6';
// import __ from '../app/app.i18n.es6';
import { getAuthorReference } from '../app/app.partitions.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxSummaries from '../rapi/rapi.summaries.es6';
import BaseModel from './data.base.es6';
import LazySummary from './data.summary.lazy.core.es6';
import { isMobileApp, normalizeSchema } from './data.util.es6';
import extendModelWithTransport from './mixins.transport.es6';
import LocalTransport from './transports.local.es6';
import LazyRemoteTransport from './transports.remote.lazy.es6';
import DownstreamStrategy from './strategy.downstream.es6';

const {
    data: { DataSource },
} = window.kendo;

/**
 * localTransport
 */
const localTransport = new LocalTransport({
    collection: db.summaries,
    partition: getAuthorReference(),
    projection: BaseModel.projection(LazySummary),
});

/**
 * remoteTransport
 */
const remoteTransport = new LazyRemoteTransport({
    collection: new AjaxSummaries({
        partition: getAuthorReference(),
        projection: BaseModel.projection(LazySummary),
    }),
});

/**
 * transport
 */
/* eslint-disable prettier/prettier */
const transport = isMobileApp()
    ? new DownstreamStrategy({
        localTransport,
        remoteTransport,
    })
    : remoteTransport;
/* eslint-enable prettier/prettier */

/**
 * Extend LazySummary with transport
 */
extendModelWithTransport(LazySummary, transport);

/**
 * LazySummaryDataSource
 * @class LazySummaryDataSource
 * @extends DataSource
 */
const LazySummaryDataSource = DataSource.extend({
    init(options = {}) {
        DataSource.fn.init.call(
            this,
            $.extend(
                true,
                { pageSize: CONSTANTS.DATA_PAGE_SIZE.SMALL },
                options,
                {
                    transport,
                    schema: normalizeSchema({
                        modelBase: LazySummary,
                        model: LazySummary,
                    }),
                    serverFiltering: true,
                    serverSorting: true,
                    serverPaging: true,
                }
            )
        );
    },
});

/**
 * Export
 */
export { LazySummary, LazySummaryDataSource };

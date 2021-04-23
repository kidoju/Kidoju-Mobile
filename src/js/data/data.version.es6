/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO Implement patch rfc 6902
// TODO implement timezones

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
// import $ from 'jquery';
import 'kendo.data';
import db from '../app/app.db.es6';
import { getSummaryReference } from '../app/app.partitions.es6';
import AjaxVersions from '../rapi/rapi.versions.es6';
import BaseModel from './data.base.es6';
import { isMobileApp } from './data.util.es6';
import Version from './data.version.core.es6';
import extendModelWithTransport from './mixins.transport.es6';
import LocalTransport from './transports.local.es6';
import RemoteTransport from './transports.remote.es6';
import DownstreamStrategy from './strategy.downstream.es6';

/**
 * localTransport
 */
const localTransport = new LocalTransport({
    collection: db.versions,
    partition: getSummaryReference(),
    projection: BaseModel.projection(Version),
});

/**
 * remoteTransport
 */
const remoteTransport = new RemoteTransport({
    collection: new AjaxVersions({
        partition: getSummaryReference(),
        projection: BaseModel.projection(Version),
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
 * Extend Version with transport
 */
extendModelWithTransport(Version, transport);

/**
 * Export
 */
export default Version;

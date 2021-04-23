/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import 'kendo.core';
import { isMobileApp } from '../data/data.util.es6';
import config from './app.config.jsx';

const { format } = window.kendo;

/**
 * Billing uri
 * @param language
 * @returns {string}
 */
const billingUri = (language) =>
    isMobileApp() ? 'TODO' : format(config.uris.webapp.billing, language);

/**
 * Editor uri
 * @param language
 * @param summaryId
 * @returns {*}
 */
const editorUri = (language, summaryId) =>
    isMobileApp()
        ? 'TODO'
        : format(config.uris.webapp.editor, language, summaryId);

/**
 * Error uri
 * @param language
 * @param code
 * @returns {*}
 */
const errorUri = (language, code) =>
    isMobileApp()
        ? 'TODO'
        : `${format(config.uris.webapp.error, language)}?code=${code}`;

/**
 * Finder uri
 * @param language
 * @returns {string}
 */
const finderUri = (language) =>
    isMobileApp() ? 'TODO' : format(config.uris.webapp.finder, language);

/**
 * Group uri
 * @param language
 * @returns {string}
 */
const groupUri = (language) =>
    isMobileApp() ? 'TODO' : format(config.uris.webapp.group, language);

/**
 * Icon uri
 * @param icon
 * @returns {string}
 */
const iconUri = (icon) =>
    format(
        isMobileApp() ? config.uris.mobile.icons : config.uris.cdn.icons,
        icon
    );

/**
 * Messaging uri
 * @param language
 * @returns {string}
 */
const messagingUri = (language) =>
    isMobileApp() ? 'TODO' : format(config.uris.webapp.messaging, language);

/**
 * Organization uri
 * @param language
 * @param organizationId
 * @returns {*}
 */
const organizationUri = (language, organizationId) =>
    isMobileApp()
        ? 'TODO'
        : format(config.uris.webapp.organization, language, organizationId);

/**
 * Player uri
 * @param language
 * @param summaryId
 * @param versionId
 * @returns {*}
 */
const playerUri = (language, summaryId, versionId) =>
    // TODO activityId?
    /* eslint-disable prettier/prettier */
    isMobileApp()
        ? 'TODO'
        : format(
            config.uris.webapp.player,
            language,
            summaryId,
            versionId,
            ''
        ).slice(0, -1);
    /* eslint-enable prettier/prettier */

/**
 * Summary uri
 * @param language
 * @param summaryId
 * @returns {*}
 */
const summaryUri = (language, summaryId) =>
    isMobileApp()
        ? 'TODO'
        : format(config.uris.webapp.summary, language, summaryId);

/**
 * User uri
 * @param language
 * @param userId
 * @returns {*}
 */
const userUri = (language, userId) =>
    isMobileApp() ? 'TODO' : format(config.uris.webapp.user, language, userId);

/**
 * Export
 */
export {
    billingUri,
    editorUri,
    errorUri,
    finderUri,
    groupUri,
    iconUri,
    messagingUri,
    organizationUri,
    playerUri,
    summaryUri,
    userUri,
};

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/*
 * IMPORTANT: Never call app.controller from here
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import Version from '../data/data.version.es6';
import { LazyVersionDataSource } from '../data/data.version.lazy.es6';
import { VIEW_MODEL } from './ui.constants.es6';

const logger = new Logger('viewmodel.versions');

/**
 * Extension
 */
const extension = {
    /**
     * Reset
     */
    reset() {
        this.resetVersions();
    },

    /**
     * Reset versions
     */
    resetVersions() {
        this.set(VIEW_MODEL.VERSION._, new Version()); // new models.Version()
        this[VIEW_MODEL.VERSIONS] = new LazyVersionDataSource(); // new models.LazyVersionDataSource()
    },

    /**
     * Load version (and stream pages)
     * Copied from app.player.js
     * @param options
     * @returns {*}
     */
    loadVersion: function (options) {

        function versionLoadFailure(xhr, status, error) {
            app.notification.error(i18n.culture.notifications.versionLoadFailure);
            logger.error({
                message: 'error loading version',
                method: 'viewModel.loadVersion',
                data: { language: options.language, summaryId: options.summaryId, versionId: options.versionId, response: parseResponse(xhr) }
            });
        }

        // Load version and pages
        assert.isNonEmptyPlainObject(options, assert.format(assert.messages.isNonEmptyPlainObject.default, 'options'));
        assert.match(RX_LANGUAGE, options.language, assert.messages.match.default, 'options.language', RX_LANGUAGE);
        assert.match(RX_MONGODB_ID, options.summaryId, assert.messages.match.default, 'options.summaryId', RX_MONGODB_ID);
        assert.match(RX_MONGODB_ID, options.id, assert.messages.match.default, 'options.id', RX_MONGODB_ID);
        return viewModel.version.load(options)
        .done(function () {
            // Load stream
            viewModel.version.stream.load()
            .done(function () {
                var promises = [];
                var pageCollectionDataSource = viewModel.get(VIEW_MODEL.PAGES_COLLECTION);
                assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
                $.each(pageCollectionDataSource.data(), function (idx, page) {
                    assert.instanceof(Page, page, assert.format(assert.messages.instanceof.default, 'page', 'kidoju.data.Page'));
                    promises.push(page.load());
                });
                $.when.apply($, promises).fail(versionLoadFailure);
            })
            .fail(versionLoadFailure);
        })
        .fail(versionLoadFailure);

    },

    /**
     * Load lazy versions of a summary
     * @param options
     */
    loadLazyVersions: function (options) {
        assert.isNonEmptyPlainObject(options, assert.format(assert.messages.isNonEmptyPlainObject.default, 'options'));
        assert.isNonEmptyPlainObject(options.partition, assert.format(assert.messages.isNonEmptyPlainObject.default, 'options.partition'));
        assert.match(RX_LANGUAGE, options.partition.language, assert.messages.match.default, 'options.partition.language', RX_LANGUAGE);
        assert.match(RX_MONGODB_ID, options.partition.summaryId, assert.messages.match.default, 'options.partition.summaryId', RX_MONGODB_ID);
        return viewModel.versions.load(options)
        .fail(function (xhr, status, error) {
            app.notification.error(i18n.culture.notifications.versionsLoadFailure);
            logger.error({
                message: 'error loading versions',
                method: 'viewModel.loadLazyVersions',
                data: {
                    options: options,
                    status: status,
                    error: error,
                    response: parseResponse(xhr)
                }
            });
        });
    },
};

/**
 * Default export
 */
export default extension;

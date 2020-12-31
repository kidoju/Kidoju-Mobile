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
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import { Page, PageDataSource } from '../data/data.page.es6';
import { xhr2error } from '../data/data.util.es6';
import Version from '../data/data.version.es6';
import { LazyVersionDataSource } from '../data/data.version.lazy.es6';

const logger = new Logger('ui.versions');

const feature = {
    /**
     * Name
     */
    _name: 'versions',

    /**
     * View
     */
    VIEW: {
        VERSION: {
            _: 'version',
        },
    },

    /**
     * ViewModel
     */
    VIEW_MODEL: {
        VERSION: {
            _: 'version',
            ID: 'version.id',
            LANGUAGE: 'version.language',
            STREAM: {
                _: 'version.stream',
                PAGES: 'version.stream.pages',
            },
            SUMMARYID: 'version.summaryId',
        },
        VERSIONS: 'versions',
    },

    /**
     * Reset
     */
    reset() {
        app.viewModel.resetVersions();
    },

    /**
     * Reset versions
     */
    resetVersions() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        viewModel.set(VIEW_MODEL.VERSION._, new Version());
        viewModel[VIEW_MODEL.VERSIONS] = new LazyVersionDataSource();
    },

    /**
     * Load version (and stream pages)
     * Copied from app.player.js
     * @param options
     * @returns {*}
     */
    loadVersion(options) {
        function versionLoadFailure(xhr, status, errorThrown) {
            app.notification.error(
                __('mobile.notifications.versionLoadFailure')
            );
            logger.error({
                message: 'error loading version',
                method: 'loadVersion',
                data: options,
                error: xhr2error(xhr, status, errorThrown),
            });
        }

        // Load version and pages
        assert.isNonEmptyPlainObject(
            options,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options'
            )
        );
        assert.match(
            CONSTANTS.RX_LANGUAGE,
            options.language,
            assert.messages.match.default,
            'options.language',
            CONSTANTS.RX_LANGUAGE
        );
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            options.summaryId,
            assert.messages.match.default,
            'options.summaryId',
            CONSTANTS.RX_MONGODB_ID
        );
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            options.id,
            assert.messages.match.default,
            'options.id',
            CONSTANTS.RX_MONGODB_ID
        );
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        return viewModel
            .get(VIEW_MODEL.VERSION._)
            .load(options)
            .then(() => {
                // Load stream
                viewModel
                    .get(VIEW_MODEL.VERSION.STREAM._)
                    .load()
                    .then(() => {
                        const promises = [];
                        debugger;
                        const pageDataSource = viewModel[VIEW_MODEL.PAGES];
                        assert.instanceof(
                            PageDataSource,
                            pageDataSource,
                            assert.format(
                                assert.messages.instanceof.default,
                                'pageDataSource',
                                'PageDataSource'
                            )
                        );
                        $.each(pageDataSource.data(), (idx, page) => {
                            assert.instanceof(
                                Page,
                                page,
                                assert.format(
                                    assert.messages.instanceof.default,
                                    'page',
                                    'Page'
                                )
                            );
                            promises.push(page.load());
                        });
                        $.when(...promises).catch(versionLoadFailure);
                    })
                    .catch(versionLoadFailure);
            })
            .catch(versionLoadFailure);
    },

    /**
     * Load lazy versions of a summary
     * @param options
     */
    loadVersions(options) {
        assert.isNonEmptyPlainObject(
            options,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options'
            )
        );
        assert.isNonEmptyPlainObject(
            options.partition,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options.partition'
            )
        );
        assert.match(
            CONSTANTS.RX_LANGUAGE,
            options.partition.language,
            assert.messages.match.default,
            'options.partition.language',
            CONSTANTS.RX_LANGUAGE
        );
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            options.partition.summaryId,
            assert.messages.match.default,
            'options.partition.summaryId',
            CONSTANTS.RX_MONGODB_ID
        );
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        // Update partition to designate the current summary (from hash)
        viewModel[VIEW_MODEL.VERSIONS].transport.partition(options.partition);
        // Query the data source
        return app.viewModel[VIEW_MODEL.VERSIONS]
            .query(options)
            .catch((xhr, status, errorThrown) => {
                app.notification.error(
                    __('mobile.notifications.versionsLoadFailure')
                );
                logger.error({
                    message: 'error loading versions',
                    method: 'loadVersions',
                    data: options,
                    error: xhr2error(xhr, status, errorThrown),
                });
            });
    },
};

/**
 * Default export
 */
export default feature;

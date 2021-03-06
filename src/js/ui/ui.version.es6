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
import { xhr2error } from '../data/data.util.es6';
import Version from '../data/data.version.es6';

const logger = new Logger('ui.version');

const feature = {
    /**
     * Name
     */
    _name: 'version',

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
            SUMMARY_ID: 'version.summaryId',
        },
    },

    /**
     * Reset versions
     */
    resetVersion() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        viewModel.set(VIEW_MODEL.VERSION._, new Version());
    },

    /**
     * Reset
     */
    reset() {
        app.viewModel.resetVersion();
    },

    /**
     * Load version (and stream pages)
     * @param options
     * @returns {*}
     */
    loadVersion(options) {
        const dfd = $.Deferred();
        function versionLoadFailure(xhr, status, errorThrown) {
            dfd.reject(xhr, status, errorThrown);
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
        // Get version
        viewModel
            .get(VIEW_MODEL.VERSION._)
            .load(options)
            .then(() => {
                const stream = viewModel.get(VIEW_MODEL.VERSION.STREAM._);
                // Load tools
                stream
                    .initTools()
                    .then(() => {
                        // Fetch data from transport
                        stream
                            .fetch()
                            .then(() => {
                                // Preload assets
                                stream
                                    .preloadAssets()
                                    .always(() => dfd.resolve());
                            })
                            .catch(versionLoadFailure);
                    })
                    .catch(versionLoadFailure);
            })
            .catch(versionLoadFailure);
        return dfd.promise();
    },
};

/**
 * Default export
 */
export default feature;

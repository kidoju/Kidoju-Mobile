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
import Logger from '../common/window.logger.es6';
import { Summary } from '../data/data.summary.es6';
import { xhr2error } from '../data/data.util.es6';
import { LazySummaryDataSource } from '../data/data.summary.lazy.es6';
import { VIEW_MODEL } from './ui.constants.es6';

const logger = new Logger('viewmodel.summaries');

/**
 * Extension
 */
const extension = {
    /**
     * Reset
     */
    reset() {
        this.resetSummaries();
    },

    /**
     * Reset summaries
     */
    resetSummaries() {
        this.set(VIEW_MODEL.SUMMARY.$, new Summary()); // new models.Summary()
        this.set(VIEW_MODEL.SUMMARIES, new LazySummaryDataSource()); // new models.LazySummaryDataSource({ pageSize: VIRTUAL_PAGE_SIZE })
    },

    /**
     * Load summaries
     * @param options
     */
    loadSummaries(options) {
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
            assert.format(
                assert.messages.match.default,
                'options.partition.language',
                CONSTANTS.RX_LANGUAGE
            )
        );
        return this[VIEW_MODEL.SUMMARIES]
            .load(options)
            .catch((xhr, status, errorThrown) => {
                app.notification.error(__('notifications.summariesQueryFailure'));
                logger.error({
                    message: 'error loading summaries',
                    method: 'loadSummaries',
                    error: xhr2error(xhr, status, errorThrown),
                    data: { options }
                });
            });
    },

    /**
     * Load summary from remote servers
     * @param options
     */
    loadSummary(options) {
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
            assert.format(
                assert.messages.match.default,
                'options.language',
                CONSTANTS.RX_LANGUAGE
            )
        );
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            options.id,
            assert.format(
                assert.messages.match.default,
                'options.id',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        return this[VIEW_MODEL.SUMMARY.$]
            .load(options)
            .catch((xhr, status, errorThrown) => {
                app.notification.error(__('notifications.summaryLoadFailure'));
                logger.error({
                    message: 'error loading summary',
                    method: 'loadSummary',
                    error: xhr2error(xhr, status, errorThrown),
                    data: { options }
                });
            });
    },

    /**
     * Summary category
     */
    summaryCategory$() {
        var ret = '';
        var categoryId = this.get(VIEW_MODEL.SUMMARY.CATEGORY_ID);
        var category = this.get(VIEW_MODEL.CATEGORIES).get(categoryId);
        if (category instanceof models.LazyCategory && $.isFunction(category.path.map) && category.path.length) {
            var path = category.path.map(function (item) {
                return item.name;
            });
            ret = '<span>' + path.join('</span><span class="k-icon k-i-arrow-60-right"></span><span>') + '</span>';
        }
        return ret;
    }
};

/**
 * Default export
 */
export default extension;

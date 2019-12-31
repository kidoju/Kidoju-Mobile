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
import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { LazyActivityDataSource } from '../data/data.activity.lazy.es6';
import { xhr2error } from '../data/data.util.es6';
import { VIEW_MODEL } from './ui.constants.es6';

const logger = new Logger('viewmodel.activities');

/**
 * Extension
 */
const extension = {
    /**
     * Reset
     */
    reset() {
        this.resetActivities();
    },

    /**
     * Reset activities
     */
    resetActivities() {
        this[VIEW_MODEL.ACTIVITIES] = new LazyActivityDataSource(); // models.MobileActivityDataSource()
    },

    /**
     * Load user activities
     * @param options
     */
    loadActivities(options) {
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
            options.userId,
            assert.format(
                assert.messages.match.default,
                'options.userId',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        const activities = this[VIEW_MODEL.ACTIVITIES];
        const partition = activities.transport.partition();
        const dfd = $.Deferred();
        if (
            partition['version.language'] === options.language &&
            partition['actor.userId'] === options.userId &&
            activities.total() > 0 &&
            activities.at(0).version.language === options.language &&
            activities.at(0).actor.id === options.userId
        ) {
            dfd.resolve();
        } else {
            activities.transport.partition({
                'actor.userId': options.userId,
                // Note: Until we introduce bundles, synchronization remains limited to score activities with the same scheme
                scheme: config.constants.appScheme,
                type: 'Score',
                'version.language': options.language
            });
            activities._filter = undefined;
            activities
                .read()
                .done(dfd.resolve)
                .fail((xhr, status, errorThrown) => {
                    dfd.reject(xhr, status, errorThrown);
                    app.notification.error(__('notifications.activitiesQueryFailure'));
                    logger.error({
                        message: 'error loading activities',
                        method: 'viewModel.loadActivities',
                        error: xhr2error(xhr, status, errorThrown)
                    });
                });
        }
        return dfd.promise();
    }
};

/**
 * Default export
 */
export default extension;

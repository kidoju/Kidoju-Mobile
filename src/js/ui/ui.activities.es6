/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.view';
import __ from '../app/app.i18n.es6';
import app from '../common/window.global.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { LazyActivityDataSource } from '../data/data.activity.lazy.es6';
import config from '../app/app.config.jsx';
import { xhr2error } from '../data/data.util.es6';

const {
    dataviz: {
        ui: { Chart },
    },
    mobile: {
        ui: { View },
    },
    roleSelector,
} = window.kendo;
const logger = new Logger('ui.activities');

/**
 * Activities feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'activities',

    /**
     * View
     */
    VIEW: {
        ACTIVITIES: {
            _: 'activities',
        },
    },

    /**
     * ViewModel
     */
    VIEW_MODEL: {
        ACTIVITIES: 'activities',
    },

    /**
     * Reset
     */
    reset() {
        app.viewModel.resetActivities();
    },

    /**
     * Reset activities
     */
    resetActivities() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        viewModel[VIEW_MODEL.ACTIVITIES] = new LazyActivityDataSource();
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
        debugger;
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const activities = viewModel[VIEW_MODEL.ACTIVITIES];
        const partition = activities.transport.partition();
        const dfd = $.Deferred();
        if (
            partition.language === options.language &&
            partition.actorId === options.userId &&
            activities.total() > 0 &&
            activities.at(0).language === options.language &&
            activities.at(0).actor.id === options.userId
        ) {
            dfd.resolve();
        } else {
            activities.transport.partition({
                actorId: options.userId,
                // Note: Until we introduce bundles, synchronization remains limited to score activities with the same scheme
                scheme: config.constants.appScheme,
                type: 'Score',
                language: options.language,
            });
            activities._filter = undefined;
            activities
                .read()
                .then(dfd.resolve)
                .catch((xhr, status, errorThrown) => {
                    dfd.reject(xhr, status, errorThrown);
                    app.notification.error(
                        __('mobile.notifications.activitiesQueryFailure')
                    );
                    logger.error({
                        message: 'error loading activities',
                        method: 'loadActivities',
                        error: xhr2error(xhr, status, errorThrown),
                    });
                });
        }
        return dfd.promise();
    },

    /**
     * Event handler triggered when showing the Activities view
     * Note: the view event is triggered each time the view is requested
     * @param e
     */
    onActivitiesViewShow(e) {
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        assert.instanceof(
            View,
            e.view,
            assert.format(
                assert.messages.instanceof.default,
                'e.view',
                'kendo.mobile.ui.View'
            )
        );
        // If e.view.params is empty, so we most probably clicked the back button to the default view (/)
        // Note that this is now fixed in mobile.onRouterBack - https://github.com/kidoju/Kidoju-Mobile/issues/181
        // if (!$.isEmptyObject(e.view.params)) {
        assert.isNonEmptyPlainObject(
            e.view.params,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'e.view.params'
            )
        );
        const { language, userId } = e.view.params;
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        assert.equal(
            language,
            __.locale,
            assert.format(assert.messages.equal.default, '__.locale', language)
        );
        assert.equal(
            language,
            viewModel.get(VIEW_MODEL.LANGUAGE),
            assert.format(
                assert.messages.equal.default,
                'viewModel.get("language")',
                language
            )
        );
        assert.equal(
            userId,
            viewModel.get(VIEW_MODEL.USER.ID),
            assert.format(
                assert.messages.equal.default,
                'viewModel.get("user.id")',
                userId
            )
        );

        // Always reload
        viewModel.loadActivities({ language, userId }).always(() => {
            viewModel.onGenericViewShow(e);
        });
    },

    /**
     * Event handler triggered when selecting a button for the button group on the activities view
     * @param e
     */
    onActivitiesButtonGroupSelect(e) {
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        assert.type(
            CONSTANTS.NUMBER,
            e.index,
            assert.format(
                assert.messages.type.default,
                'e.index',
                CONSTANTS.NUMBER
            )
        );
        const { viewModel } = app;
        const view = viewModel.application.view();
        const { content } = view;
        if (!e.index) {
            // ListView
            content.find(roleSelector('listview')).show();
            content.find(roleSelector('chart')).hide();
        } else {
            // Chart
            content.find(roleSelector('listview')).hide();
            content.find(roleSelector('chart')).show();
            viewModel.resize(e, view);
        }
    },

    /**
     * Resize activities chart
     * @param e
     * @param view
     * @private
     */
    resize(e, view) {
        assert.instanceof(
            View,
            view,
            assert.format(
                assert.messages.instanceof.default,
                'view',
                'kendo.mobile.ui.View'
            )
        );
        const {
            viewModel: { VIEW },
        } = app;
        if (
            view.id === CONSTANTS.SLASH ||
            view.id === CONSTANTS.HASH + VIEW.ACTIVITIES
        ) {
            // This would only work on the activities view anyway
            const { content } = view;
            const chart = content.find(roleSelector('chart'));
            const chartWidget = chart.data('kendoChart');
            if (chartWidget instanceof Chart) {
                const buttonGroup = content.find(roleSelector('buttongroup'));
                chart.outerHeight(
                    content.height() - buttonGroup.outerHeight(true)
                );
                chart.outerWidth(content.width());
                chartWidget.resize();
            }
        }
    },
};

/**
 * Default export
 */
export default feature;

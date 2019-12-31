/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import 'kendo.mobile.view';
import __ from '../app/app.i18n.es6';
import app from '../common/window.global.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
// import Logger from '../common/window.logger.es6';
import { VIEW, VIEW_MODEL } from './ui.constants.es6';

const {
    dataviz: {
        ui: { Chart }
    },
    mobile: {
        ui: { View }
    },
    roleSelector
} = window.kendo;
// const logger = new Logger('feature.activities');

/**
 * Activities feature
 */
const feature = {
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
        assert.equal(
            language,
            __.locale,
            assert.format(
                assert.messages.equal.default,
                'i18n.locale()',
                language
            )
        );
        assert.equal(
            language,
            app.viewModel.get(VIEW_MODEL.LANGUAGE),
            assert.format(
                assert.messages.equal.default,
                'viewModel.get("language")',
                language
            )
        );
        assert.equal(
            userId,
            app.viewModel.get(VIEW_MODEL.USER.SID),
            assert.format(
                assert.messages.equal.default,
                'viewModel.get("user.sid")',
                userId
            )
        );

        // Always reload
        app.viewModel.loadActivities({ language, userId }).always(() => {
            app.controller.onGenericViewShow(e);
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
        const view = app.controller.application.view();
        const { content } = view;
        if (!e.index) {
            // ListView
            content.find(roleSelector('listview')).show();
            content.find(roleSelector('chart')).hide();
        } else {
            // Chart
            content.find(roleSelector('listview')).hide();
            content.find(roleSelector('chart')).show();
            feature.resize(view);
        }
    },

    /**
     * Resize activities chart
     * @param view
     * @private
     */
    resize(view) {
        assert.instanceof(
            View,
            view,
            assert.format(
                assert.messages.instanceof.default,
                'view',
                'kendo.mobile.ui.View'
            )
        );
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
    }
};

/**
 * Default export
 */
export default feature;

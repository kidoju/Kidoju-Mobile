/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo/mobile.view';
import app from '../common/window.global.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { VIEW, VIEW_MODEL } from './ui.constants.es6';

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
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof(View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
        // If e.view.params is empty, so we most probably clicked the back button to the default view (/)
        // Note that this is now fixed in mobile.onRouterBack - https://github.com/kidoju/Kidoju-Mobile/issues/181
        // if (!$.isEmptyObject(e.view.params)) {
        assert.isNonEmptyPlainObject(e.view.params, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e.view.params'));
        var language = e.view.params.language;
        assert.equal(language, i18n.locale(), assert.format(assert.messages.equal.default, 'i18n.locale()', language));
        assert.equal(language, viewModel.get(VIEW_MODEL.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("language")', language));
        var userId = e.view.params.userId;
        assert.equal(userId, viewModel.get(VIEW_MODEL.USER.SID), assert.format(assert.messages.equal.default, 'viewModel.get("user.sid")', userId));

        // Always reload
        viewModel.loadActivities({ language: language, userId: userId }).always(function () {
            mobile.onGenericViewShow(e);
        });
        // }
    },

    /**
     * Event handler triggered when selecting a button for the button group on the activities view
     * @param e
     */
    onActivitiesButtonGroupSelect(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.type(NUMBER, e.index, assert.format(assert.messages.type.default, 'e.index', NUMBER));
        var view = app.mobile.application.view();
        if (!e.index) { // ListView
            view.content.find(kendo.roleSelector('listview')).show();
            view.content.find(kendo.roleSelector('chart')).hide();
        } else { // Chart
            view.content.find(kendo.roleSelector('listview')).hide();
            view.content.find(kendo.roleSelector('chart')).show();
            mobile._resizeChart(view);
        }
    }
};

/**
 * Default export
 */
export default feature;

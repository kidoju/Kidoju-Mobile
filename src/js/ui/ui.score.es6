/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.application';
import 'kendo.mobile.view';
import 'kendo.mobile.listview';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';

const {
    destroy,
    format,
    mobile: {
        ui: { ListView, View },
    },
} = window.kendo;
const logger = new Logger('ui.score');

/**
 * Score feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'score',

    /**
     * View
     */
    VIEW: {
        SCORE: {
            _: 'score',
        },
    },

    /**
     * Initialize score listview
     * @param view
     * @private
     */
    _initScoreListView(view) {
        assert.instanceof(View, view, assert.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
        const { language, summaryId, versionId, activityId } = view.params;
        const { content } = view;
        // Find and destroy the listview as it needs to be rebuilt if locale changes
        // Note: if the grid is set as <div data-role="listview"></div> in index.html then .km-pane-wrapper does not exist, so we need an id
        // var $listView = view.element.find(kendo.roleSelector('listview'));
        const $listView = content.find(`${CONSTANTS.HASH}${VIEW.SCORE}-listview`);
        if ($listView.length) {
            let listView = $listView.data('kendoMobileListView');
            if (listView instanceof ListView) {
                destroy($listView);
            }
            // TODO We should be able to view scores without reloading the summary and recalculating everything
            // TODO check we do not get disabled values
            // TODO check we are using value$() and solution$() which display correctly with all tools
            listView = $listView.kendoMobileListView({
                click: e => {
                    e.preventDefault();
                    app.viewModel.application.navigate(
                        CONSTANTS.HASH + VIEW.CORRECTION +
                        '?language=' + encodeURIComponent(language) +
                        '&summaryId=' + encodeURIComponent(summaryId) +
                        '&versionId=' + encodeURIComponent(versionId) +
                        '&activityId=' + encodeURIComponent(activityId) + // Note: this is a local id, not a sid
                        '&page=' + encodeURIComponent(e.dataItem.page + 1)
                    );
                },
                dataSource: {
                    data: app.viewModel.get(VIEW_MODEL.CURRENT.TEST).getScoreArray(),
                    group: { field: 'page' }
                },
                filterable: false,
                fixedHeaders: true,
                headerTemplate: content.find('#score-header-template').html().trim(),
                template: content.find('#score-template').html().trim(),
                type: 'group'
            });
        }
    },

    /**
     * Event handler triggered when showing the score view after submitting a score
     * @param e
     */
    onScoreViewShow(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof(View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
        // Get the activity id from params
        const { activityId } = e.view.params; // Note: activityId is a local id (not a sid)
        if (CONSTANTS.RX_MONGODB_ID.test(activityId)) {
            // If we have an activityId, replace the current test to display score and correction
            const activity = app.viewModel[VIEW_MODEL.ACTIVITIES].get(activityId);
            // TODO Load activities if necessary to make the view idempotent, otherwise the following assert will fail
            assert.instanceof(models.MobileActivity, activity, assert.format(assert.messages.instanceof.default, 'activity', 'app.models.MobileActivity'));
            assert.equal('Score', activity.type, assert.format(assert.messages.equal.default, 'activity.type', 'Score'));
            $.when(
                app.viewModel.loadSummary({ language: __.locale, id: activity.get('version.summaryId') }),
                app.viewModel.loadVersion({ language: __.locale, summaryId: activity.get('version.summaryId'), id: activity.get('version.versionId') })
            )
            .then(() => {
                // Note: We cannot assign the activity, otherwise calculate will make changes that will make it dirty in MobileActivityDataSource
                app.viewModel.set(VIEW_MODEL.CURRENT.$, activity.toJSON());
                app.viewModel.calculate() // TODO: We should not have to recalculate what is already calculated
                    .then(() => {
                        app.viewModel.setNavBarTitle(e.view, format(__('mobile.score.viewTitle'), app.viewModel.get((VIEW_MODEL.CURRENT.SCORE) || 0) / 100));
                        feature.initScoreListView(e.view);
                    });
            })
            .always(() => {
                app.viewModel.onGenericViewShow(e);
            });
        } else {
            // Otherwise, use the current test
            // TODO assert current state (percent function?)
            feature._initScoreListView(e.view);
            app.viewModel.onGenericViewShow(e);
        }
    }
};

/**
 * Default export
 */
export default feature;

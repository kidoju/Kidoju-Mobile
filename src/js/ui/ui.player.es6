/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
// import 'kendo.mobile.application';
import 'kendo.mobile.button';
import 'kendo.mobile.view';
// import 'kendo.mobile.scrollview';
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
// import Logger from '../common/window.logger.es6';

const {
    attr,
    bind,
    dataviz,
    destroy,
    mobile,
    mobile: {
        ui: { Button, View },
    },
    roleSelector,
    ui,
} = window.kendo;
// const logger = new Logger('ui.player');

/**
 * Player feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'player',

    /**
     * View
     */
    VIEW: {
        PLAYER: {
            _: 'player',
        },
    },

    /**
     * Event handler triggered when initializing the Player view
     * Note: the init event is triggered the first time the view is requested
     * @param e
     */
    onPlayerViewInit(e) {
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
        const { content } = e.view;

        // Destroy the stage - see mobile.onPlayerViewHide
        destroy(content.find(roleSelector('stage')));

        // The play TTS button is a bit small, so let's use the entire heading
        content
            .find('div.heading')
            .off()
            // .on(CONSTANTS.CLICK + ' ' + TAP, e => {
            .on(`${CONSTANTS.CLICK} ${CONSTANTS.TOUCHSTART}`, (/* e */) => {
                e.preventDefault(); // So that a tap does not trigger a click, resulting in this code being executed twice thus cancelling TTS
                const $button = $(e.currentTarget).find(
                    'a[data-role="button"][data-icon="ear"]'
                );
                const button = $button.data('kendoMobileButton');
                if (button instanceof Button) {
                    $button.addClass('km-state-active');
                    button.trigger(CONSTANTS.CLICK, { button: $button });
                    setTimeout(() => {
                        $button.removeClass('km-state-active');
                    }, 250);
                }
            });
    },

    /**
     * Event handler triggered when showing the Player view
     * Note: the view event is triggered each time the view is requested
     * @param e
     */
    onPlayerViewShow(e) {
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
        assert.isNonEmptyPlainObject(
            e.view.params,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'e.view.params'
            )
        );

        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;

        // Scan params
        const { language } = e.view.params;
        const { summaryId } = e.view.params;
        const { versionId } = e.view.params;

        assert.equal(
            viewModel.get(VIEW_MODEL.LANGUAGE),
            language,
            assert.format(
                assert.messages.equal.default,
                'language',
                'viewModel.get("language")'
            )
        );
        assert.equal(
            __.locale,
            language,
            assert.format(
                assert.messages.equal.default,
                'language',
                '__.locale'
            )
        );
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            summaryId,
            assert.format(
                assert.messages.match.default,
                'summaryId',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            versionId,
            assert.format(
                assert.messages.match.default,
                'versionId',
                CONSTANTS.RX_MONGODB_ID
            )
        );

        // Let's remove the clickSubmitInfo attr used to track and limit toast notifications (see viewModel.bind(CHANGE))
        e.view.element.removeProp(attr('clickSubmitInfo')); // TODO??????

        // load data
        // $.when(
        // load version to display quiz content in the player
        viewModel
            .loadVersion({
                language,
                summaryId,
                id: versionId,
            })
            // ,
            // Load activities to save score in datasource
            // viewModel.loadActivities({
            //     language,
            //     userId: viewModel.get(VIEW_MODEL.USER.ID),
            // })
            // )
            .then(() => {
                const TestModel = viewModel
                    .get(VIEW_MODEL.VERSION.STREAM._)
                    .getTestModel();
                viewModel.set(
                    VIEW_MODEL.PAGE,
                    viewModel.get(VIEW_MODEL.VERSION.STREAM.PAGES).at(0)
                );
                viewModel.set('current', new TestModel());
                // Rebuild stage and bind viewModel
                bind(
                    e.view.content.find(roleSelector('stage')),
                    viewModel[VIEW_MODEL.CURRENT._],
                    ui,
                    dataviz.ui,
                    mobile.ui
                );
                viewModel._resizers.stage(e, e.view);
            })
            .always(() => {
                viewModel.onGenericViewShow(e);
                app.notification.info(
                    __('mobile.notifications.pageNavigationInfo')
                );
                /*
                if (mobile.support.ga) {
                   app.gatrackEvent(
                        ANALYTICS.CATEGORY.SUMMARY,
                        ANALYTICS.ACTION.PLAY,
                        summaryId
                    );
                }
                */
            });
    },

    /**
     * Event handler triggered when hiding the Player view
     * @param e
     */
    onPlayerViewHide(e) {
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

        // Destroy the stage
        destroy(e.view.content.find(roleSelector('stage')));

        // Cancel any utterance spoken
        // app.tts.cancelSpeak();
    },
};

/**
 * Default export
 */
export default feature;

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
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
// const logger = new Logger('ui.correction');

/**
 * Drawer feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'correction',

    /**
     * View
     */
    VIEW: {
        CORRECTION: {
            _: 'correction',
        },
    },

    /**
     * Event handler triggered when initializing the Correction view
     * Note: the init event is triggered the first time the view is requested
     * @param e
     */
    onCorrectionViewInit(e) {
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

        // Destroy the stage - see mobile.onCorrectionViewHide
        destroy(content.find(roleSelector('stage')));

        // The play TTS button is a bit small, so let's use the entire heading
        content
            .find('div.heading h2')
            .off()
            .on(`${CONSTANTS.CLICK} ${CONSTANTS.TAP}`, (/* e */) => {
                // TODO review TAP
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
     * Event handler triggered when showing the Correction view
     * Note: the view event is triggered each time the view is requested
     * @param e
     */
    onCorrectionViewShow(e) {
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
        const { content } = e.view;
        const { language, summaryId, versionId, activityId } = e.view.params;
        const page = parseInt(e.view.params.page, 10) || 1;

        assert.equal(
            app.viewModel.get(VIEW_MODEL.LANGUAGE),
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
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            activityId,
            assert.format(
                assert.messages.match.default,
                'activityId',
                CONSTANTS.RX_MONGODB_ID
            )
        );

        // Let's remove the showScoreInfo attr (see viewModel.bind(CHANGE))
        e.view.element.removeProp(attr('showScoreInfo'));

        // Rebuild stage and bind viewModel
        bind(
            content.find(roleSelector('stage')),
            app.viewModel,
            ui,
            dataviz.ui,
            mobile.ui
        );
        // viewModel._resizers.stage(e, e.view);

        /*
        // TODO We are dependant on the data loaded in mobile.onScoreViewShow, so this page cannot be refreshed in dev
        // We might want to reload the data after reviewing activities not to have to recalculate scores
        // Load data
        $.when(
            // load version to display quiz content in the player
            viewModel.loadVersion({ language: language, summaryId: summaryId, id: versionId }),
            // Load activities
            viewModel.loadActivities({ language: language, userId: viewModel.get(VIEW_MODEL.USER.ID) })
        )
        .then(function () {
            // Set activity, but we do not want to recalculate score
            viewModel.set(VIEW_MODEL.PAGE, viewModel[VIEW_MODEL.PAGES].at(page - 1));
        })
        .always(function () {
            mobile.onGenericViewShow(e);
            app.notification.info(__('mobile.notifications.pageNavigationInfo'));
        });
        */

        // version is already loaded - viewModel.loadVersion({ language: language, summaryId: summaryId, id: versionId }),
        // activities are already loaded - viewModel.loadActivities({ language: language, userId: viewModel.get(VIEW_MODEL.USER.ID) })
        app.viewModel.set(
            VIEW_MODEL.PAGE,
            app.viewModel[VIEW_MODEL.PAGES].at(page - 1)
        );

        mobile.onGenericViewShow(e);
        app.notification.info(__('mobile.notifications.pageNavigationInfo'));
    },

    /**
     * Event handler triggered when hiding the Correction view
     * Note: the view event is triggered each time the view is discarded
     * @param e
     */
    onCorrectionViewHide(e) {
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

        // Destroy the stage (necessary to hide the floating toolbar and avoid initializing widgets simultaneously in correction and player modes)
        destroy(e.view.content.find(roleSelector('stage')));

        // Cancel any utterance spoken
        // app.tts.cancelSpeak();
    },
};

/**
 * Default export
 */
export default feature;

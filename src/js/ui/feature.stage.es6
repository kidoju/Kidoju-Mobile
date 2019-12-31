/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
// import 'kendo.mobile.application';
import 'kendo.mobile.button';
import 'kendo.mobile.view';
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import { VIEW_MODEL } from './ui.constants.es6';

const { attr, bind, dataviz, destroy, mobile, mobile: { ui: { Button, View } }, roleSelector, ui } = window.kendo;

/**
 * Stage feature
 */
const feature = {
    /**
     * Resize player/correction stage and instructions/explanations markdown
     * @param view
     * @private
     */
    resize(e, view) {
        assert.instanceof(kendo.mobile.ui.View, view, assert.format(assert.messages.instanceof.default, 'view', 'kendo.mobile.ui.View'));
        var content = view.content;
        var stageElement = content.find(kendo.roleSelector('stage'));
        var stageWidget = stageElement.data('kendoStage');
        // If the stage widget has not yet been initialized, we won't get the correct stageWrapper
        if (kendo.ui.Stage && stageWidget instanceof kendo.ui.Stage) {
            /**
             * ATTENTION jQuery 3 breaking change
             * There is a breaking change in jQuery 3 regarding height and width
             * jQuery 2 reports the actual CSS value (clientHeight, clientWidth)
             * jQuery 3 reports the scaled value
             * See https://github.com/jquery/jquery/issues/3193
             */
            var HEIGHT = stageElement.outerHeight();
            assert.equal(HEIGHT, 768, assert.format(assert.messages.equal.default, 'HEIGHT', '768'));
            var WIDTH = stageElement.outerWidth();
            assert.equal(WIDTH, 1024, assert.format(assert.messages.equal.default, 'WIDTH', '1024'));
            var height = content.height();  // The screen height minus layout header and footer
            var width = content.width();    // The screen width minus layout header and footer
            var scale;
            var infoHeight = 0;
            var infoWidth = 0;
            var proportion = 1;
            if (width > height) { // landsacpe mode
                // Note: we want the info panel to be between 25% and 33% of the screen real estate and at least 200px wide
                infoWidth = Math.min(0.33 * width, Math.max(200, 0.25 * width, width - height * WIDTH  / HEIGHT));
                // now look at the proportion of what is left for our stage
                if ((width - infoWidth) / height > WIDTH / HEIGHT) {
                    // There is room to set the stage full height and increase our info panel
                    scale = height / HEIGHT;
                    infoWidth = width - scale * WIDTH;
                } else {
                    // There is no room to set the stage full height, so let's set a proportion to add a border
                    scale = (width - infoWidth) / WIDTH;
                    proportion = 0.95;
                }
            } else { // portrait mode
                // Note: we want the info panel to be between 25% and 33% of the screen real estate and at least 100px high
                infoHeight = Math.min(0.33 * height, Math.max(180, 0.25 * height, height - width * HEIGHT / WIDTH));
                // now look at the proportion of what is left for our stage
                if ((height - infoHeight) / width > HEIGHT / WIDTH) {
                    // There is room to set the stage full width and increase our info panel
                    scale = width / WIDTH;
                    infoHeight = height - scale * HEIGHT;
                } else {
                    // There is no room to set the stage full width, so let's set a proportion to add a border
                    scale = (height - infoHeight) / HEIGHT;
                    proportion = 0.95;
                }
            }
            // Resize the stage
            stageWidget.scale(proportion * scale);
            var stageWrapper = stageElement.parent();
            assert.ok(stageWrapper.hasClass('kj-stage'), 'Stage wrapper is expected to have class `kj-stage`');
            var stageContainer = stageWrapper.closest('.stretched-item');
            stageContainer
            .outerWidth(width - Math.ceil(infoWidth)) // We use Math.ceil instead of Math.floor here to get the leeway required by Microsoft Edge in embedded mode
                .outerHeight(height - Math.ceil(infoHeight))
                .css('position', 'relative');
            stageContainer.children('.centered')
            .width(proportion * scale * WIDTH)
            .height(proportion * scale * HEIGHT)
            .css({
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginLeft: -proportion * scale * WIDTH / 2,
                marginTop: -proportion * scale * HEIGHT / 2
            });
            stageContainer.find('.kj-stage')
            .css({ borderWidth: proportion === 1 ? 0 : 1 });
            // Resize the markdown container and scroller for instructions/explanations
            var markdownElement = content.find(kendo.roleSelector('markdown'));
            var markdownScrollerElement = markdownElement.closest(kendo.roleSelector('scroller'));
            var markdownScroller = markdownScrollerElement.data('kendoMobileScroller');
            assert.instanceof(kendo.mobile.ui.Scroller, markdownScroller, assert.format(assert.messages.instanceof.default, 'markdownScroller', 'kendo.mobile.ui.Scroller'));
            var markdownContainer = markdownElement.closest('.stretched-item');
            var markdownHeading = markdownContainer.children('.heading');
            markdownContainer
            .outerWidth(Math.floor(infoWidth) || width)
            .outerHeight(Math.floor(infoHeight) || height)
            .css({
                borderTopWidth: infoHeight ? 1 : 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                borderLeftWidth: infoWidth ? 1 : 0
            });
            markdownScroller.destroy();
            markdownScrollerElement.outerHeight(markdownContainer.height() - markdownHeading.outerHeight() - parseInt(markdownContainer.css('padding-bottom'), 10));
            var markdownScrollerWidget = markdownScrollerElement.kendoMobileScroller().data('kendoMobileScroller');
            markdownScrollerWidget.reset();
        }
    },

    /**
     * Event handler triggered when initializing the Correction view
     * Note: the init event is triggered the first time the view is requested
     * @param e
     */
    onCorrectionViewInit(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof(View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
        const { content } = e.view;

        // Destroy the stage - see mobile.onCorrectionViewHide
        destroy(content.find(roleSelector('stage')));

        // The play TTS button is a bit small, so let's use the entire heading
        content
            .find('div.heading h2')
            .off()
            .on(CONSTANTS.CLICK + ' ' + CONSTANTS.TAP, e => {
                // TODO review TAP
                const $button = $(e.currentTarget).find('a[data-role="button"][data-icon="ear"]');
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
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof(View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
        assert.isNonEmptyPlainObject(e.view.params, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e.view.params'));

        // Scan params
        const { content } = e.view;
        const { language, summaryId, versionId, activityId } = e.view.params;
        const page = parseInt(e.view.params.page, 10) || 1;

        assert.equal(app.viewModel.get(VIEW_MODEL.LANGUAGE), language, assert.format(assert.messages.equal.default, 'language', 'viewModel.get("language")'));
        assert.equal(__.locale, language, assert.format(assert.messages.equal.default, 'language', 'i18n.locale()'));
        assert.match(CONSTANTS.RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', CONSTANTS.RX_MONGODB_ID));
        assert.match(CONSTANTS.RX_MONGODB_ID, versionId, assert.format(assert.messages.match.default, 'versionId', CONSTANTS.RX_MONGODB_ID));
        assert.match(CONSTANTS.RX_MONGODB_ID, activityId, assert.format(assert.messages.match.default, 'activityId', CONSTANTS.RX_MONGODB_ID));

        // Let's remove the showScoreInfo attr (see viewModel.bind(CHANGE))
        e.view.element.removeProp(attr('showScoreInfo'));

        // Rebuild stage and bind viewModel
        bind(content.find(roleSelector('stage')), app.viewModel, ui, dataviz.ui, mobile.ui);
        mobile._resizeStage(e.view);

        /*
        // TODO We are dependant on the data loaded in mobile.onScoreViewShow, so this page cannot be refreshed in dev
        // We might want to reload the data after reviewing activities not to have to recalculate scores
        // Load data
        $.when(
            // load version to display quiz content in the player
            viewModel.loadVersion({ language: language, summaryId: summaryId, id: versionId }),
            // Load activities
            viewModel.loadActivities({ language: language, userId: viewModel.get(VIEW_MODEL.USER.SID) })
        )
        .done(function () {
            // Set activity, but we do not want to recalculate score
            viewModel.set(VIEW_MODEL.SELECTED_PAGE, viewModel.get(VIEW_MODEL.PAGES_COLLECTION).at(page - 1));
        })
        .always(function () {
            mobile.onGenericViewShow(e);
            app.notification.info(i18n.culture.notifications.pageNavigationInfo);
        });
        */

        // version is already loaded - viewModel.loadVersion({ language: language, summaryId: summaryId, id: versionId }),
        // activities are already loaded - viewModel.loadActivities({ language: language, userId: viewModel.get(VIEW_MODEL.USER.SID) })
        app.viewModel.set(
            VIEW_MODEL.SELECTED_PAGE,
            app.viewModel.get(VIEW_MODEL.PAGES_COLLECTION).at(page - 1)
        );

        mobile.onGenericViewShow(e);
        app.notification.info(__('notifications.pageNavigationInfo'));
    },

    /**
     * Event handler triggered when hiding the Correction view
     * Note: the view event is triggered each time the view is discarded
     * @param e
     */
    onCorrectionViewHide(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof(View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));

        // Destroy the stage (necessary to hide the floating toolbar and avoid initializing widgets simultaneously in correction and player modes)
        destroy(e.view.content.find(roleSelector('stage')));

        // Cancel any utterance spoken
        app.tts.cancelSpeak();
    },

    /**
     * Event handler for swiping over #player instructions and #correction explanations
     * @param e
     */
    onPageSwipe(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        $(document.activeElement).blur(); // Make sure we update the viewModel with current input
        if (e.direction === 'left') {
            app.viewModel.nextPage();
        } else if (e.direction === 'right') {
            app.viewModel.previousPage();
        }
    },

    /**
     * Play text-to-speach synthesis
     * @see https://github.com/vilic/cordova-plugin-tts
     * @param e
     */
    onTTSClick(e) {
        const SPEAKING = 'speaking';
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

        // IMPORTANT: prevent bubbling considering parent element might have triggered the click
        e.preventDefault();

        // Record the speaking state on the button
        const speaking = e.button.attr(attr(SPEAKING));
        if (!speaking) {
            e.button.attr(attr(SPEAKING), 'true');
            const field = e.button.attr(attr('tts'));
            const text = app.viewModel.get(field) || '';
            // Speak
            app.tts.doSpeak(text, __.locale, true).always(() => {
                e.button.removeAttr(attr(SPEAKING));
            });
        } else {
            // Cancel
            app.tts.cancelSpeak().always(() => {
                e.button.removeAttr(attr(SPEAKING));
            });
        }
    }
};

/**
 * Default export
 */
export default feature;

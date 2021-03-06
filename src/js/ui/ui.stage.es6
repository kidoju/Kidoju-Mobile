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
import 'kendo.mobile.scroller';
import 'kendo.mobile.view';
import '../widgets/widgets.stage.es6';
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import { Page, PageDataSource } from '../data/data.page.es6';

const {
    attr,
    bind,
    dataviz,
    destroy,
    format,
    mobile,
    mobile: {
        ui: { Button, Scroller, View },
    },
    roleSelector,
    ui,
    ui: { Stage },
} = window.kendo;
const logger = new Logger('ui.stage');

/**
 * Stage feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'stage',

    /**
     * ViewModel
     */
    VIEW_MODEL: {
        PAGE: 'page',
        // PAGES: 'version.stream.pages',
        CURRENT: {
            // --> ACTIVITY ??
            _: 'current',
            ID: 'current.id',
            SCORE: 'current.score',
            TEST: 'current.test',
            UPDATED: 'current.updated',
            VERSION: {
                LANGUAGE: 'current.version.language',
                SUMMARY_ID: 'current.version.summaryId',
                VERSION_ID: 'current.version.versionId',
            },
        },
    },

    /**
     * Reset
     */
    reset() {
        app.viewModel.resetStage();
    },

    /**
     * Reset test
     */
    resetStage() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        viewModel.set(VIEW_MODEL.CURRENT._, undefined);
        viewModel.set(VIEW_MODEL.PAGE, undefined);
        // viewModel.set(VIEW_MODEL.VERSION.STREAM.PAGES, new PageDataSource());
    },

    /**
     * Check first page
     * @returns {boolean}
     */
    isFirstPage$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const page = viewModel.get(VIEW_MODEL.PAGE);
        const pageDataSource = viewModel.get(VIEW_MODEL.VERSION.STREAM.PAGES);
        assert.instanceof(
            PageDataSource,
            pageDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'pageDataSource',
                'PageDataSource'
            )
        );
        const index = pageDataSource.indexOf(page);
        return index === 0;
    },

    /**
     * Check last page
     * @returns {boolean}
     */
    isLastPage$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const page = viewModel.get(VIEW_MODEL.PAGE);
        const pageDataSource = viewModel.get(VIEW_MODEL.VERSION.STREAM.PAGES);
        assert.instanceof(
            PageDataSource,
            pageDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'pageDataSource',
                'PageDataSource'
            )
        );
        const index = pageDataSource.indexOf(page);
        return index === -1 || index === pageDataSource.total() - 1;
    },

    /**
     * Return current page
     * @returns {*}
     */
    page$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const page = viewModel.get(VIEW_MODEL.PAGE);
        const pageDataSource = viewModel.get(VIEW_MODEL.VERSION.STREAM.PAGES);
        assert.instanceof(
            PageDataSource,
            pageDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'pageDataSource',
                'PageDataSource'
            )
        );
        return pageDataSource.indexOf(page) + 1;
    },

    /**
     * Return total number of pages
     */
    totalPages$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const pageDataSource = viewModel.get(VIEW_MODEL.VERSION.STREAM.PAGES);
        assert.instanceof(
            PageDataSource,
            pageDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'pageDataSource',
                'PageDataSource'
            )
        );
        return pageDataSource.total();
    },

    /**
     * Select the previous page from viewModel.version.stream.pages
     */
    firstPage() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        logger.debug({
            method: 'firstPage',
            message: 'Show first page',
        });
        const pageDataSource = viewModel.get(VIEW_MODEL.VERSION.STREAM.PAGES);
        assert.instanceof(
            PageDataSource,
            pageDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'pageDataSource',
                'PageDataSource'
            )
        );
        viewModel.set(VIEW_MODEL.PAGE, pageDataSource.at(0));
        // app.tts.cancelSpeak();
    },

    /**
     * Select the previous page from viewModel.version.stream.pages
     */
    previousPage() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        logger.debug({
            method: 'previousPage',
            message: 'Show previous page',
        });
        const page = viewModel.get(VIEW_MODEL.PAGE);
        const pageDataSource = viewModel.get(VIEW_MODEL.VERSION.STREAM.PAGES);
        assert.instanceof(
            PageDataSource,
            pageDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'pageDataSource',
                'PageDataSource'
            )
        );
        const index = pageDataSource.indexOf(page);
        if ($.type(index) === CONSTANTS.NUMBER && index > 0) {
            viewModel.set(VIEW_MODEL.PAGE, pageDataSource.at(index - 1));
            // app.tts.cancelSpeak();
        }
    },

    /**
     * Select the next page from viewModel.version.stream.pages
     */
    nextPage() {
        logger.debug({
            method: 'nextPage',
            message: 'Show next page',
        });
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const page = viewModel.get(VIEW_MODEL.PAGE);
        const pageDataSource = viewModel.get(VIEW_MODEL.VERSION.STREAM.PAGES);
        assert.instanceof(
            PageDataSource,
            pageDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'pageDataSource',
                'PageDataSource'
            )
        );
        const index = pageDataSource.indexOf(page);
        if (
            $.type(index) === CONSTANTS.NUMBER &&
            index < pageDataSource.total() - 1
        ) {
            viewModel.set(VIEW_MODEL.PAGE, pageDataSource.at(index + 1));
            // app.tts.cancelSpeak();
        }
    },

    /**
     * Select the last page from viewModel.version.stream.pages
     */
    lastPage() {
        logger.debug({
            method: 'lastPage',
            message: 'Show last page',
        });
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const pageDataSource = viewModel.get(VIEW_MODEL.VERSION.STREAM.PAGES);
        assert.instanceof(
            PageDataSource,
            pageDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'pageDataSource',
                'PageDataSource'
            )
        );
        const lastPage = pageDataSource.total() - 1;
        viewModel.set(VIEW_MODEL.PAGE, pageDataSource.at(lastPage));
        // app.tts.cancelSpeak();
    },

    /**
     * Reset current test
     */
    resetCurrent() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        // Assert ids
        const userId = viewModel.get(VIEW_MODEL.USER.ID); // Foreign keys use sids (server ids)
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            userId,
            assert.format(
                assert.messages.match.default,
                'userId',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        const language = __.locale;
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
            language,
            viewModel.get(VIEW_MODEL.SUMMARY.LANGUAGE),
            assert.format(
                assert.messages.equal.default,
                'viewModel.get("summary.language")',
                language
            )
        );
        assert.equal(
            language,
            viewModel.get(VIEW_MODEL.VERSION.LANGUAGE),
            assert.format(
                assert.messages.equal.default,
                'viewModel.get("version.language")',
                language
            )
        );
        const summaryId = viewModel.get(VIEW_MODEL.SUMMARY.ID);
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            summaryId,
            assert.format(
                assert.messages.match.default,
                'summaryId',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        assert.equal(
            summaryId,
            viewModel.get(VIEW_MODEL.VERSION.SUMMARY_ID),
            assert.format(
                assert.messages.equal.default,
                'viewModel.get("version.summaryId")',
                summaryId
            )
        );
        const versionId = viewModel.get(VIEW_MODEL.VERSION.ID);
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            versionId,
            assert.format(
                assert.messages.match.default,
                'versionId',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        // Set viewModel field
        // IMPORTANT: viewModel.current is not a MobileActivity - For more information, see saveCurrent
        // TODO viewModel.set(VIEW_MODEL.CURRENT._, new MobileActivity({
        viewModel.set(VIEW_MODEL.CURRENT._, {
            actor: {
                firstName: viewModel.get(VIEW_MODEL.USER.FIRST_NAME),
                lastName: viewModel.get(VIEW_MODEL.USER.LAST_NAME),
                userId, // Foreign keys use sids (server ids)
            },
            // test initialized for player data binding
            test: viewModel.version.stream.pages.getTestFromProperties(),
            type: 'Score',
            version: {
                language,
                // TODO Add categoryId for better statistics
                summaryId,
                title: viewModel.get(VIEW_MODEL.SUMMARY.TITLE),
                versionId,
            },
        });
    },

    /**
     * Calculate test results
     * @returns {*}
     */
    calculate() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const pageDataSource = viewModel.get(VIEW_MODEL.VERSION.STREAM.PAGES);
        assert.instanceof(
            PageDataSource,
            pageDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'pageDataSource',
                'PageDataSource'
            )
        );
        return pageDataSource
            .validateTestFromProperties(viewModel.get(VIEW_MODEL.CURRENT.TEST))
            .then((result) => {
                // Note: result has methods including percent and getScoreArray
                assert.isNonEmptyPlainObject(
                    result,
                    assert.format(
                        assert.messages.isNonEmptyPlainObject.default,
                        'result'
                    )
                );
                assert.isFunction(
                    result.percent,
                    assert.format(
                        assert.messages.isFunction.default,
                        'result.percent'
                    )
                );
                assert.isFunction(
                    result.getScoreArray,
                    assert.format(
                        assert.messages.isFunction.default,
                        'result.getScoreArray'
                    )
                );
                viewModel.set(VIEW_MODEL.CURRENT.TEST, result);
            })
            .catch((xhr, status, error) => {
                app.notification.error(
                    __('mobile.notifications.scoreCalculationFailure')
                );
                logger.error({
                    message: 'Failed to calculate user score',
                    method: 'calculate',
                    data: { status, error, response: parseResponse(xhr) },
                });
            });
    },

    /**
     * Save the score activity
     * @returns {*}
     */
    saveCurrent() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        // Get current
        const current = viewModel.get(VIEW_MODEL.CURRENT._);
        // assert.instanceof(MobileActivity, current, assert.format(assert.messages.instanceof.default, 'current', 'MobileActivity'));
        assert.isUndefined(
            current.id,
            assert.format(assert.messages.isUndefined.default, 'current.id')
        );
        assert.isFunction(
            current.test.percent,
            assert.format(
                assert.messages.isFunction.default,
                'current.test.percent'
            )
        );
        assert.isFunction(
            current.test.getScoreArray,
            assert.format(
                assert.messages.isFunction.default,
                'current.test.getScoreArray'
            )
        );
        // Update current
        viewModel.set(VIEW_MODEL.CURRENT.SCORE, current.test.percent());
        viewModel.set(VIEW_MODEL.CURRENT.UPDATED, new Date());
        // Add to datasource and sync
        const activities = viewModel.get(VIEW_MODEL.ACTIVITIES);
        assert.instanceof(
            MobileActivityDataSource,
            activities,
            assert.format(
                assert.messages.instanceof.default,
                'activities',
                'MobileActivityDataSource'
            )
        );
        const activity = new MobileActivity(current);
        activities.add(activity);
        return activities
            .sync()
            .then(() => {
                // current is not a MobileActivity because since percent and getScoreArray are not model methods,
                // There are lost at this stage. We would need to make a model with percent and getScoreArray methods
                const activityId = activity.get('id');
                assert.match(
                    CONSTANTS.RX_MONGODB_ID,
                    activityId,
                    assert.format(
                        assert.messages.match.default,
                        'activityId',
                        CONSTANTS.RX_MONGODB_ID
                    )
                );
                viewModel.set(VIEW_MODEL.CURRENT.ID, activityId);
                app.notification.success(
                    __('mobile.notifications.scoreSaveSuccess')
                );
            })
            .catch((xhr, status, error) => {
                activities.remove(activity);
                app.notification.error(
                    __('mobile.notifications.scoreSaveFailure')
                );
                logger.error({
                    message: 'error saving current score',
                    method: 'saveCurrent',
                    data: { status, error, response: parseResponse(xhr) },
                });
            });
    },

    /**
     * Resize player/correction stage and instructions/explanations markdown
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
        const { content } = view;
        const stageElement = content.find(roleSelector('stage'));
        const stageWidget = stageElement.data('kendoStage');
        // If the stage widget has not yet been initialized, we won't get the correct stageWrapper
        if (stageWidget instanceof Stage) {
            /**
             * ATTENTION jQuery 3 breaking change
             * There is a breaking change in jQuery 3 regarding viewHeight and viewWidth
             * jQuery 2 reports the actual CSS value (clientHeight, clientWidth)
             * jQuery 3 reports the scaled value
             * See https://github.com/jquery/jquery/issues/3193
             */
            const HEIGHT = stageElement.outerHeight();
            assert.equal(
                HEIGHT,
                768,
                assert.format(assert.messages.equal.default, 'HEIGHT', '768')
            );
            const WIDTH = stageElement.outerWidth();
            assert.equal(
                WIDTH,
                1024,
                assert.format(assert.messages.equal.default, 'WIDTH', '1024')
            );
            const viewHeight = content.height(); // The screen viewHeight minus layout header and footer
            const viewWidth = content.width(); // The screen viewWidth minus layout header and footer
            let scale;
            let proportion = 1;
            let infoHeight = 0;
            let infoWidth = 0;
            // let proportion = 1;
            if (viewWidth > viewHeight) {
                // landscape mode
                // Note: we want the info panel to be between 25% and 33% of the screen real estate and at least 200px wide
                infoWidth = Math.min(
                    0.33 * viewWidth,
                    Math.max(
                        200,
                        0.25 * viewWidth,
                        viewWidth - (viewHeight * WIDTH) / HEIGHT
                    )
                );
                // now look at the proportion of what is left for our stage
                if ((viewWidth - infoWidth) / viewHeight > WIDTH / HEIGHT) {
                    // There is room to set the stage full viewHeight and increase our info panel
                    scale = viewHeight / HEIGHT;
                    infoWidth = viewWidth - scale * WIDTH;
                } else {
                    // There is no room to set the stage full viewHeight, so let's set a proportion to add a border
                    scale = (viewWidth - infoWidth) / WIDTH;
                    proportion = 0.95;
                }
            } else {
                // portrait mode
                // Note: we want the info panel to be between 25% and 33% of the screen real estate and at least 100px high
                infoHeight = Math.min(
                    0.33 * viewHeight,
                    Math.max(
                        180,
                        0.25 * viewHeight,
                        viewHeight - (viewWidth * HEIGHT) / WIDTH
                    )
                );
                // now look at the proportion of what is left for our stage
                if ((viewHeight - infoHeight) / viewWidth > HEIGHT / WIDTH) {
                    // There is room to set the stage full viewWidth and increase our info panel
                    scale = viewWidth / WIDTH;
                    infoHeight = viewHeight - scale * HEIGHT;
                } else {
                    // There is no room to set the stage full viewWidth, so let's set a proportion to add a border
                    scale = (viewHeight - infoHeight) / HEIGHT;
                    proportion = 0.95;
                }
            }
            // Resize the stage
            stageWidget.scale(proportion * scale);
            const stageWrapper = stageElement.parent();
            assert.ok(
                stageWrapper.hasClass('kj-stage'),
                'Stage wrapper is expected to have class `kj-stage`'
            );
            const stageContainer = stageWrapper.closest('.app-stage-container');
            stageContainer
                .outerWidth(viewWidth - Math.ceil(infoWidth)) // We use Math.ceil instead of Math.floor here to get the leeway required by Microsoft Edge in embedded mode
                .outerHeight(viewHeight - Math.ceil(infoHeight))
                .css('position', 'relative');
            stageWrapper.css({ borderWidth: proportion === 1 ? 0 : 1 });
            // Resize the markdown container and scroller for instructions/explanations
            const markdownElement = content.find(roleSelector('markdown'));
            const markdownScrollerElement = markdownElement.closest(
                roleSelector('scroller')
            );
            const markdownScroller = markdownScrollerElement.data(
                'kendoMobileScroller'
            );
            assert.instanceof(
                Scroller,
                markdownScroller,
                assert.format(
                    assert.messages.instanceof.default,
                    'markdownScroller',
                    'kendo.mobile.ui.Scroller'
                )
            );
            const markdownContainer = markdownElement.closest(
                '.app-info-container'
            );
            const markdownHeading = markdownContainer.children('.app-heading');
            markdownContainer
                .outerWidth(Math.floor(infoWidth) || viewWidth)
                .outerHeight(Math.floor(infoHeight) || viewHeight)
                .css({
                    borderTopWidth: infoHeight ? 1 : 0,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    borderLeftWidth: infoWidth ? 1 : 0,
                });
            markdownScroller.destroy();
            markdownScrollerElement.outerHeight(
                markdownContainer.height() -
                    markdownHeading.outerHeight() -
                    parseInt(markdownContainer.css('padding-bottom'), 10)
            );
            const markdownScrollerWidget = markdownScrollerElement
                .kendoMobileScroller()
                .data('kendoMobileScroller');
            markdownScrollerWidget.reset();
        }
    },

    /**
     * Event handler for swiping over #player instructions and #correction explanations
     * @param e
     */
    onPageSwipe(e) {
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
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
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        assert.instanceof(
            $,
            e.button,
            assert.format(
                assert.messages.instanceof.default,
                'e.button',
                'jQuery'
            )
        );

        // IMPORTANT: prevent bubbling considering parent element might have triggered the click
        e.preventDefault();

        // Record the speaking state on the button
        const speaking = e.button.attr(attr(SPEAKING));
        if (!speaking) {
            e.button.attr(attr(SPEAKING), 'true');
            const field = e.button.attr(attr('tts'));
            const text = app.viewModel.get(field) || '';
            // Speak
            // app.tts.doSpeak(text, __.locale, true).always(() => {
            //     e.button.removeAttr(attr(SPEAKING));
            // });
        } else {
            // Cancel
            // app.tts.cancelSpeak().always(() => {
            //     e.button.removeAttr(attr(SPEAKING));
            // });
        }
    },

    events: {
        change(e) {
            assert.isNonEmptyPlainObject(
                e,
                assert.format(
                    assert.messages.isNonEmptyPlainObject.default,
                    'e'
                )
            );
            assert.type(
                CONSTANTS.STRING,
                e.field,
                assert.format(
                    assert.messages.type.default,
                    'e.field',
                    CONSTANTS.STRING
                )
            );
            const {
                notification,
                viewModel,
                viewModel: {
                    application,
                    page$,
                    totalPages$,
                    setNavBar,
                    setNavBarTitle,
                    VIEW,
                    VIEW_MODEL,
                },
            } = app;
            // assert.instanceof(Observable, e.sender, assert.format(assert.messages.instanceof.default, 'e.sender', 'kendo.Observable'));
            if (e.field === VIEW_MODEL.PAGE) {
                const view = application.view();
                if (view.id === `${CONSTANTS.HASH}${VIEW.CORRECTION._}`) {
                    // Reset NavBar buttons and title
                    setNavBar(view);
                    setNavBarTitle(
                        view,
                        format(
                            __('mobile.correction.viewTitle'),
                            page$(),
                            totalPages$()
                        )
                    );
                    if (
                        viewModel.isLastPage$() &&
                        !view.element.prop(attr('showScoreInfo'))
                    ) {
                        // Let's remember that we have already displayed this notification for this test
                        view.element.prop(attr('showScoreInfo'), true);
                        notification.info(
                            __('mobile.notifications.showScoreInfo')
                        );
                    }
                } else if (view.id === `${CONSTANTS.HASH}${VIEW.PLAYER._}`) {
                    // Reset NavBar buttons and title
                    setNavBar(view);
                    setNavBarTitle(
                        view,
                        format(
                            __('mobile.player.viewTitle'),
                            page$(),
                            totalPages$()
                        )
                    );
                    if (
                        viewModel.isLastPage$() &&
                        !view.element.prop(attr('clickSubmitInfo'))
                    ) {
                        // Let's remember that we have already displayed this notification for this test
                        view.element.prop(attr('clickSubmitInfo'), true);
                        notification.info(
                            __('mobile.notifications.clickSubmitInfo')
                        );
                    }
                }
            }
        },
    },
};

/**
 * Default export
 */
export default feature;

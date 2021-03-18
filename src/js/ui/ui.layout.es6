/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.application';
import 'kendo.mobile.navbar';
import 'kendo.mobile.view';
import 'kendo.mobile.scroller';
import 'kendo.mobile.scrollview';
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import dialogs from '../plugins/plugins.dialogs.es6';

const {
    format,
    mobile: {
        Application,
        ui: { Scroller, ScrollView, View },
    },
    roleSelector,
} = window.kendo;
const logger = new Logger('ui.layout');

/**
 * Layout feature
 * including navigation bar
 */
const feature = {
    /**
     * Name
     */
    _name: 'layout',

    /**
     * View
     */
    VIEW: {
        MAIN_LAYOUT: 'main-layout',
    },

    /**
     * @method onLayoutViewShow
     * @param e
     */
    onLayoutViewShow(e) {
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
        // Reset notifications
        app.viewModel.resetNotifications();
        // Reset view scroller
        if (e.view.scroller instanceof Scroller) {
            // Stretched view like #correction and #player do not have a scroller
            e.view.scroller.reset();
        }
        // Reset other scrollers including markdown scrollers
        e.view.content.find(roleSelector('scroller')).each((index, element) => {
            const scroller = $(element).data('kendoMobileScroller');
            if (scroller instanceof Scroller) {
                scroller.reset();
            }
        });
        logger.debug({
            message: 'Layout shown',
            method: 'onLayoutViewShow',
        });
    },

    /**
     * A generic event handler triggered when showing a view
     * @method onGenericViewShow
     * @param e
     */
    onGenericViewShow(e) {
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
        const { view } = e;
        const {
            viewModel,
            viewModel: { VIEW },
        } = app;
        const id =
            view.id === CONSTANTS.SLASH ? VIEW.DEFAULT : view.id.substr(1); // Remove #
        let viewTitle = __(`mobile.${id}.viewTitle`); // Note: this supposes culture names match view id names
        if (id === VIEW.SCORE._) {
            // viewTitle = format(
            //     viewTitle,
            //     viewModel.get(VIEW_MODEL.CURRENT.SCORE || 0) / 100
            // );
        } else if (id === VIEW.CORRECTION._ || id === VIEW.PLAYER._) {
            viewTitle = format(
                viewTitle,
                viewModel.page$(),
                viewModel.totalPages$()
            );
        }
        viewModel.setNavBar(view);
        viewModel.setNavBarTitle(view, viewTitle);
        if (viewModel.application instanceof Application) {
            // viewModel.application is not available on first view shown
            viewModel.application.hideLoading();
        }
    },

    /**
     * Resize
     * @param e
     * @param view
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
        view.content.find(roleSelector('scrollview')).each((index, element) => {
            const scrollView = $(element).data('kendoMobileScrollView');
            if (scrollView instanceof ScrollView) {
                scrollView.refresh();
            }
        });
    },

    /**
     * Show/hide relevant navbar commands
     * @param view
     * @private
     */
    setNavBar(view) {
        // TODO: This could also be split across features
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
            viewModel,
            viewModel: { VIEW },
        } = app;
        const $view = view.element;
        let showDrawerButton = false;
        let showHomeButton = false;
        let showUserButton = false;
        // We do not show the first page button to leave room for the drawer button
        // var showFirstPageButton = false;
        let showPreviousPageButton = false;
        let showPreviousUserButton = false;
        let showNextUserButton = false;
        let showNextPageButton = false;
        let showLastPageButton = false;
        let showSubmitButton = false;
        let showScoreButton = false;
        let showSummaryButton = false;
        let showSyncButton = false;
        let showSearchButton = false;
        switch (view.id.replace(CONSTANTS.HASH, CONSTANTS.EMPTY)) {
            default:
            case CONSTANTS.SLASH:
            case VIEW.ACTIVITIES._:
                showDrawerButton = true;
                showSyncButton = true;
                break;
            case VIEW.CATEGORIES._:
                showDrawerButton = true;
                showSearchButton = true;
                break;
            case VIEW.CORRECTION._:
                showDrawerButton = true;
                showPreviousPageButton = !viewModel.isFirstPage$();
                showNextPageButton = !viewModel.isLastPage$();
                showLastPageButton = !viewModel.isLastPage$();
                showScoreButton = viewModel.isLastPage$();
                break;
            /*
            case VIEW.FAVOURITES._:
                showDrawerButton = true;
                showSyncButton = true;
                break;
            */
            case VIEW.FINDER._:
                showDrawerButton = true;
                showHomeButton = true;
                // showSearchButton = true;
                break;
            case VIEW.NETWORK._:
                showDrawerButton = true;
                break;
            case VIEW.PLAYER._:
                showDrawerButton = true;
                showPreviousPageButton = !viewModel.isFirstPage$();
                showNextPageButton = !viewModel.isLastPage$();
                showLastPageButton = !viewModel.isLastPage$();
                showSubmitButton = viewModel.isLastPage$();
                break;
            case VIEW.SCORE._:
                showDrawerButton = true;
                showSummaryButton = true;
                break;
            case VIEW.SETTINGS._:
                showDrawerButton = true;
                break;
            case VIEW.SIGNIN._:
                showUserButton = viewModel.isSavedUser$();
                break;
            case VIEW.SUMMARY._:
                showDrawerButton = true;
                showHomeButton = true;
                break;
            case VIEW.SYNC._:
                break;
            case VIEW.USER._:
                showPreviousUserButton =
                    viewModel.isSavedUser$() && !viewModel.isFirstUser$();
                showNextUserButton =
                    viewModel.isSavedUser$() && !viewModel.isLastUser$();
                break;
        }
        // Note: each view has no button by default, so let's fix that
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-drawer`).css({
            display: showDrawerButton ? CONSTANTS.INLINE_BLOCK : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-home`).css({
            display: showHomeButton ? CONSTANTS.INLINE_BLOCK : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-user`).css({
            display: showUserButton ? CONSTANTS.INLINE_BLOCK : CONSTANTS.NONE,
        });
        // $view
        //     .find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-first-page`)
        //     .css({ display: showFirstPageButton ? CONSTANTS.INLINE_BLOCK : CONSTANTS.NONE });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-previous-page`).css({
            display: showPreviousPageButton
                ? CONSTANTS.INLINE_BLOCK
                : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-previous-user`).css({
            display: showPreviousUserButton
                ? CONSTANTS.INLINE_BLOCK
                : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-next-user`).css({
            display: showNextUserButton
                ? CONSTANTS.INLINE_BLOCK
                : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-next-page`).css({
            display: showNextPageButton
                ? CONSTANTS.INLINE_BLOCK
                : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-last-page`).css({
            display: showLastPageButton
                ? CONSTANTS.INLINE_BLOCK
                : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-submit`).css({
            display: showSubmitButton ? CONSTANTS.INLINE_BLOCK : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-score`).css({
            display: showScoreButton ? CONSTANTS.INLINE_BLOCK : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-summary`).css({
            display: showSummaryButton
                ? CONSTANTS.INLINE_BLOCK
                : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-sync`).css({
            display: showSyncButton ? CONSTANTS.INLINE_BLOCK : CONSTANTS.NONE,
        });
        $view.find(`${CONSTANTS.HASH}${VIEW.MAIN_LAYOUT}-search`).css({
            display: showSearchButton ? CONSTANTS.INLINE_BLOCK : CONSTANTS.NONE,
        });
    },

    /**
     * Set the navigation bar title
     * @param view
     * @param text
     * @private
     */
    setNavBarTitle(view, text) {
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
        const $navbar = view.header.find('.km-navbar');
        const navbar = $navbar.data('kendoMobileNavBar');
        if ($.type(text) === CONSTANTS.UNDEFINED) {
            const id =
                view.id === CONSTANTS.SLASH ? VIEW.DEFAULT : view.id.substr(1); // Removes #
            const viewTitle = __(`mobile.${id}.viewTitle`); // Note: this supposes culture names match view id names
            navbar.title(viewTitle);
        } else {
            navbar.title(text);
        }
        // Fix km-no-title issue to align km-view-title properly within km-navbar
        // Does not work here so it is repeated in onGenericViewShow, where it works
        view.header.find('.km-view-title').removeClass('km-no-title');
    },

    /**
     * Get view from button click
     * @param e
     * @private
     */
    getViewFromButtonClick(e) {
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
        const $view = e.button.closest('.km-view');
        assert.hasLength(
            $view,
            assert.format(assert.messages.hasLength.default, '$view')
        );
        const view = $view.data('kendoMobileView');
        assert.instanceof(
            View,
            view,
            assert.format(
                assert.messages.instanceof.default,
                'view',
                'kendo.mobile.ui.View'
            )
        );
        return view;
    },

    /**
     * Event handler triggered when clicking the previous user button in the navbar
     * @param e
     */
    onNavBarPreviousUserClick(e) {
        const {
            getViewFromButtonClick,
            previousUser,
            setNavBar,
        } = app.viewModel;
        previousUser();
        setNavBar(getViewFromButtonClick(e));
    },

    /**
     * Event handler triggered when clicking the next user button in the navbar
     * @param e
     */
    onNavBarNextUserClick(e) {
        const { getViewFromButtonClick, nextUser, setNavBar } = app.viewModel;
        nextUser();
        setNavBar(getViewFromButtonClick(e));
    },

    /**
     * Event handler triggered when clicking the first page button in the navbar
     */
    onNavBarFirstPageClick() {
        // Note: NavBar is updated from change event handler because users can also swipe
        app.viewModel.firstPage();
    },

    /**
     * Event handler triggered when clicking the previous page button in the navbar
     */
    onNavBarPreviousPageClick() {
        // Note: NavBar is updated from change event handler because users can also swipe
        app.viewModel.previousPage();
    },

    /**
     * Event handler triggered when clicking the next page button in the navbar
     */
    onNavBarNextPageClick() {
        // Note: NavBar is updated from change event handler because users can also swipe
        app.viewModel.nextPage();
    },

    /**
     * Event handler triggered when clicking the last page button in the navbar
     */
    onNavBarLastPageClick() {
        // Note: NavBar is updated from change event handler because users can also swipe
        app.viewModel.lastPage();
    },

    /**
     * Event handler triggered when clicking the score button in the navbar
     * @param e
     */
    onNavBarScoreClick(e) {
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
        const {
            viewModel,
            viewModel: { application, VIEW, VIEW_MODEL },
        } = app;
        const language = viewModel.get(VIEW_MODEL.CURRENT.VERSION.LANGUAGE);
        assert.match(
            CONSTANTS.RX_LANGUAGE,
            language,
            assert.format(
                assert.messages.match.default,
                'language',
                CONSTANTS.RX_LANGUAGE
            )
        );
        const summaryId = viewModel.get(VIEW_MODEL.CURRENT.VERSION.SUMMARY_ID);
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            summaryId,
            assert.format(
                assert.messages.match.default,
                'summaryId',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        const versionId = viewModel.get(VIEW_MODEL.CURRENT.VERSION.VERSION_ID);
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            versionId,
            assert.format(
                assert.messages.match.default,
                'versionId',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        const activityId = viewModel.get(VIEW_MODEL.CURRENT.ID);
        assert.match(
            CONSTANTS.RX_MONGODB_ID,
            activityId,
            assert.format(
                assert.messages.match.default,
                'activityId',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        application.navigate(
            `${CONSTANTS.HASH}${VIEW.SCORE._}?language=${encodeURIComponent(
                language
            )}&summaryId=${encodeURIComponent(
                summaryId
            )}&versionId=${encodeURIComponent(
                versionId
            )}&activityId=${encodeURIComponent(activityId)}`
        ); // This is not a sid
    },

    /**
     * Event handler triggered when clicking the submit button in the navbar
     * @param e
     */
    onNavBarSubmitClick(e) {
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
        dialogs.confirm(
            __('mobile.notifications.confirmSubmit'),
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    const { viewModel } = app;
                    viewModel.calculate().then(() => {
                        // Note: failure is already taken care of
                        viewModel.saveCurrent().then(() => {
                            viewModel.onNavBarScoreClick(e);
                            // TODO analytics
                            /*
                        if (mobile.support.ga) {
                           app.gatrackEvent(
                                ANALYTICS.CATEGORY.ACTIVITY,
                                ANALYTICS.ACTION.SCORE,
                                viewModel.get(VIEW_MODEL.CURRENT.VERSION.SUMMARY_ID),
                                parseInt(viewModel.get(VIEW_MODEL.CURRENT.SCORE), 10)
                            );
                        }
                        */
                        });
                    });
                }
            }
        );
    },

    /**
     * Event handler triggered when clicking the summary button in the navbar
     * @param e
     */
    onNavBarSummaryClick(e) {
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
        const {
            viewModel,
            viewModel: { application, VIEW_MODEL },
        } = app;
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
        assert.equal(
            summaryId,
            viewModel.get(VIEW_MODEL.VERSION.SUMMARY_ID),
            assert.format(
                assert.messages.equal.default,
                'viewModel.get("version.summaryId")',
                summaryId
            )
        );
        application.navigate(
            `${CONSTANTS.HASH}${
                this.VIEW.SUMMARY._
            }?language=${encodeURIComponent(
                language
            )}&summaryId=${encodeURIComponent(summaryId)}`
        );
    },

    /**
     * Event handler triggered when clicking the sync button in the navbar
     * @param e
     */
    onNavBarSyncClick(/* e */) {
        const {
            viewModel,
            viewModel: { application, VIEW, VIEW_MODEL },
        } = app;
        // application.navigate(`${CONSTANTS.HASH}${VIEW.SYNC._}`);
        application.navigate(
            `${CONSTANTS.HASH}${VIEW.SIGNIN._}?page=${encodeURIComponent(
                VIEW.SIGNIN.LAST_PAGE
            )}&userId=${encodeURIComponent(viewModel.get(VIEW_MODEL.USER.ID))}`
        );
    },

    /**
     * Event handler triggered when clicking the search button in the navbar
     */
    onNavBarSearchClick() {
        const {
            viewModel: { application, VIEW },
        } = app;
        const language = __.locale; // viewModel.get(VIEW_MODEL.LANGUAGE);
        application.navigate(
            `${CONSTANTS.HASH}${VIEW.FINDER._}?language=${encodeURIComponent(
                language
            )}`
        );
        // @see http://www.telerik.com/forums/hiding-filter-input-in-mobile-listview
        // var summaryView = $(CONSTANTS.HASH + VIEW.FINDER);
        // summaryView.find(kendo.roleSelector('listview')).getKendoMobileListView()._filter._clearFilter({ preventDefault: $.noop });
        // summaryView.find('.km-filter-form').show();
    },
};

/**
 * Default export
 */
export default feature;
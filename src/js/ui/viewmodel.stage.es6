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
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import LazyCategoryDataSource from '../data/data.category.lazy.es6';
import { VIEW_MODEL } from './ui.constants.es6';

const logger = new Logger('viewmodel.stage');

/**
 * Extension
 */
const extension = {
    /**
     * Reset
     */
    reset() {
        this.resetStage();
    },

    /**
     * Reset test
     */
    resetStage() {
        this.set(VIEW_MODEL.CURRENT, { test: undefined });
        this.set(VIEW_MODEL.SELECTED_PAGE, undefined);
        this.set(VIEW_MODEL.PAGES_COLLECTION, []);
    },

    /**
     * Check first page
     * @returns {boolean}
     */
    isFirstPage$() {
        var page = this.get(VIEW_MODEL.SELECTED_PAGE);
        var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
        assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
        var index = pageCollectionDataSource.indexOf(page);
        return index === 0;
    },

    /**
     * Check last page
     * @returns {boolean}
     */
    isLastPage$() {
        var page = this.get(VIEW_MODEL.SELECTED_PAGE);
        var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
        assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
        var index = pageCollectionDataSource.indexOf(page);
        return index === -1 || index === pageCollectionDataSource.total() - 1;
    },

    /**
     * Return current page
     * @returns {*}
     */
    page$() {
        var page = this.get(VIEW_MODEL.SELECTED_PAGE);
        var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
        assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
        return pageCollectionDataSource.indexOf(page) + 1;
    },

    /**
     * Return total number of pages
     */
    totalPages$() {
        var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
        assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
        return pageCollectionDataSource.total();
    },

    /**
     * Select the previous page from viewModel.version.stream.pages
     */
    firstPage() {
        logger.debug({ method: 'viewModel.firstPage', message: 'Show first page' });
        var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
        assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
        this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(0));
        app.tts.cancelSpeak();
    },

    /**
     * Select the previous page from viewModel.version.stream.pages
     */
    previousPage() {
        logger.debug({ method: 'viewModel.previousPage', message: 'Show previous page' });
        var page = this.get(VIEW_MODEL.SELECTED_PAGE);
        var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
        assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
        var index = pageCollectionDataSource.indexOf(page);
        if ($.type(index) === NUMBER && index > 0) {
            this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(index - 1));
            app.tts.cancelSpeak();
        }
    },

    /**
     * Select the next page from viewModel.version.stream.pages
     */
    nextPage() {
        logger.debug({ method: 'viewModel.nextPage', message: 'Show next page' });
        var page = this.get(VIEW_MODEL.SELECTED_PAGE);
        var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
        assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
        var index = pageCollectionDataSource.indexOf(page);
        if ($.type(index) === NUMBER && index < pageCollectionDataSource.total() - 1) {
            this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(index + 1));
            app.tts.cancelSpeak();
        }
    },

    /**
     * Select the last page from viewModel.version.stream.pages
     */
    lastPage() {
        logger.debug({ method: 'viewModel.lastPage', message: 'Show last page' });
        var pageCollectionDataSource = this.get(VIEW_MODEL.PAGES_COLLECTION);
        assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
        var lastPage = pageCollectionDataSource.total() - 1;
        this.set(VIEW_MODEL.SELECTED_PAGE, pageCollectionDataSource.at(lastPage));
        app.tts.cancelSpeak();
    },

    /**
     * Reset current test
     */
    resetCurrent() {
        var that = this;
        // Assert ids
        var userId = that.get(VIEW_MODEL.USER.SID); // Foreign keys use sids (server ids)
        assert.match(RX_MONGODB_ID, userId, assert.format(assert.messages.match.default, 'userId', RX_MONGODB_ID));
        var language = i18n.locale();
        assert.equal(language, that.get(VIEW_MODEL.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("language")', language));
        assert.equal(language, that.get(VIEW_MODEL.SUMMARY.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("summary.language")', language));
        assert.equal(language, that.get(VIEW_MODEL.VERSION.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("version.language")', language));
        var summaryId = that.get(VIEW_MODEL.SUMMARY.ID);
        assert.match(RX_MONGODB_ID, summaryId, assert.format(assert.messages.match.default, 'summaryId', RX_MONGODB_ID));
        assert.equal(summaryId, this.get(VIEW_MODEL.VERSION.SUMMARY_ID), assert.format(assert.messages.equal.default, 'viewModel.get("version.summaryId")', summaryId));
        var versionId = that.get(VIEW_MODEL.VERSION.ID);
        assert.match(RX_MONGODB_ID, versionId, assert.format(assert.messages.match.default, 'versionId', RX_MONGODB_ID));
        // Set viewModel field
        // IMPORTANT: viewModel.current is not a models.MobileActivity - For more information, see saveCurrent
        // viewModel.set(VIEW_MODEL.CURRENT.$, new models.MobileActivity({
        viewModel.set(VIEW_MODEL.CURRENT.$, {
            actor: {
                firstName: that.get(VIEW_MODEL.USER.FIRST_NAME),
                lastName: that.get(VIEW_MODEL.USER.LAST_NAME),
                userId: userId // Foreign keys use sids (server ids)
            },
            // test initialized for player data binding
            test: viewModel.version.stream.pages.getTestFromProperties(),
            type: 'Score',
            version : {
                language: language,
                // TODO Add categoryId for better statistics
                summaryId: summaryId,
                title: that.get(VIEW_MODEL.SUMMARY.TITLE),
                versionId: versionId
            }
        });
    },

    /**
     * Calculate test results
     * @returns {*}
     */
    calculate() {
        var pageCollectionDataSource = viewModel.get(VIEW_MODEL.PAGES_COLLECTION);
        assert.instanceof(PageCollectionDataSource, pageCollectionDataSource, assert.format(assert.messages.instanceof.default, 'pageCollectionDataSource', 'kidoju.data.PageCollectionDataSource'));
        return pageCollectionDataSource.validateTestFromProperties(viewModel.get(VIEW_MODEL.CURRENT.TEST))
        .done(function (result) {
            // Note: result has methods including percent and getScoreArray
            assert.isNonEmptyPlainObject(result, assert.format(assert.messages.isNonEmptyPlainObject.default, 'result'));
            assert.type(FUNCTION, result.percent, assert.format(assert.messages.type.default, 'result.percent', FUNCTION));
            assert.type(FUNCTION, result.getScoreArray, assert.format(assert.messages.type.default, 'result.getScoreArray', FUNCTION));
            viewModel.set(VIEW_MODEL.CURRENT.TEST, result);
        })
        .fail(function (xhr, status, error) {
            app.notification.error(i18n.culture.notifications.scoreCalculationFailure);
            logger.error({
                message: 'Failed to calculate user score',
                method: 'viewModel.calculate',
                data: { status: status, error: error, response: parseResponse(xhr) }
            });
        });
    },

    /**
     * Save the score activity
     * @returns {*}
     */
    saveCurrent() {
        // Get current
        var current = this.get(VIEW_MODEL.CURRENT.$);
        // assert.instanceof(models.MobileActivity, current, assert.format(assert.messages.instanceof.default, 'current', 'app.models.MobileActivity'));
        assert.type(UNDEFINED, current.id, assert.format(assert.messages.type.default, 'current.id', UNDEFINED));
        assert.type(FUNCTION, current.test.percent, assert.format(assert.messages.type.default, 'current.test.percent', FUNCTION));
        assert.type(FUNCTION, current.test.getScoreArray, assert.format(assert.messages.type.default, 'current.test.getScoreArray', FUNCTION));
        // Update current
        viewModel.set(VIEW_MODEL.CURRENT.SCORE, current.test.percent());
        viewModel.set(VIEW_MODEL.CURRENT.UPDATED, new Date());
        // Add to datasource and sync
        var activities = this.get(VIEW_MODEL.ACTIVITIES);
        assert.instanceof(models.MobileActivityDataSource, activities, assert.format(assert.messages.instanceof.default, 'activities', 'app.models.MobileActivityDataSource'));
        var activity = new models.MobileActivity(current);
        activities.add(activity);
        return activities.sync()
        .done(function () {
            // current is not a models.MobileActivity because since percent and getScoreArray are not model methods,
            // There are lost at this stage. We would need to make a model with percent and getScoreArray methods
            var activityId = activity.get('id');
            assert.match(RX_MONGODB_ID, activityId, assert.format(assert.messages.match.default, 'activityId', RX_MONGODB_ID));
            viewModel.set(VIEW_MODEL.CURRENT.ID, activityId);
            app.notification.success(i18n.culture.notifications.scoreSaveSuccess);
        })
        .fail(function (xhr, status, error) {
            activities.remove(activity);
            app.notification.error(i18n.culture.notifications.scoreSaveFailure);
            logger.error({
                message: 'error saving current score',
                method: 'viewModel.saveCurrent',
                data: { status: status, error: error, response: parseResponse(xhr) }
            });
        });
    }
};

/**
 * Default export
 */
export default extension;

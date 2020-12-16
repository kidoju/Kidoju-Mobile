/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
// import 'kendo.mobile.application';
// import 'kendo.mobile.button';
import 'kendo.mobile.view';
// import 'kendo.mobile.scrollview';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import { MISC, VIEW, VIEW_MODEL } from './ui.constants.es6';
import { Summary } from '../data/data.summary';
import { LazySummaryDataSource } from '../data/data.summary.lazy';
import __ from '../app/app.i18n';
import { xhr2error } from '../data/data.util';

const {
    attr,
    mobile: {
        Application,
        ui: { Button, ScrollView, View },
    },
    roleSelector,
} = window.kendo;

/**
 * Summary feature
 */
const feature = {
    /**
     * Name
     */
    name: '_summary',

    /**
     * View
     */
    VIEW: {
        SUMMARY: 'summary',
    },

    /**
     * Reset
     */
    reset() {
        this.resetSummaries();
    },

    /**
     * Reset summaries
     */
    resetSummaries() {
        this.set(VIEW_MODEL.SUMMARY._, new Summary()); // new models.Summary()
        this.set(VIEW_MODEL.SUMMARIES, new LazySummaryDataSource()); // new models.LazySummaryDataSource({ pageSize: VIRTUAL_PAGE_SIZE })
    },

    /**
     * Load summaries
     * @param options
     */
    loadSummaries(options) {
        assert.isNonEmptyPlainObject(
            options,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options'
            )
        );
        assert.isNonEmptyPlainObject(
            options.partition,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options.partition'
            )
        );
        assert.match(
            CONSTANTS.RX_LANGUAGE,
            options.partition.language,
            assert.format(
                assert.messages.match.default,
                'options.partition.language',
                CONSTANTS.RX_LANGUAGE
            )
        );
        return this[VIEW_MODEL.SUMMARIES]
            .load(options)
            .catch((xhr, status, errorThrown) => {
                app.notification.error(
                    __('notifications.summariesQueryFailure')
                );
                logger.error({
                    message: 'error loading summaries',
                    method: 'loadSummaries',
                    error: xhr2error(xhr, status, errorThrown),
                    data: { options },
                });
            });
    },

    /**
     * Load summary from remote servers
     * @param options
     */
    loadSummary(options) {
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
            options.id,
            assert.format(
                assert.messages.match.default,
                'options.id',
                CONSTANTS.RX_MONGODB_ID
            )
        );
        return this[VIEW_MODEL.SUMMARY]
            .load(options)
            .catch((xhr, status, errorThrown) => {
                app.notification.error(__('notifications.summaryLoadFailure'));
                logger.error({
                    message: 'error loading summary',
                    method: 'loadSummary',
                    error: xhr2error(xhr, status, errorThrown),
                    data: { options },
                });
            });
    },

    /**
     * Summary category
     */
    summaryCategory$() {
        let ret = '';
        const categoryId = this.get(VIEW_MODEL.SUMMARY.CATEGORY_ID);
        const category = this.get(VIEW_MODEL.CATEGORIES).get(categoryId);
        if (
            category instanceof models.LazyCategory &&
            $.isFunction(category.path.map) &&
            category.path.length
        ) {
            const path = category.path.map((item) => item.name);
            ret = `<span>${path.join(
                '</span><span class="k-icon k-i-arrow-60-right"></span><span>'
            )}</span>`;
        }
        return ret;
    },

    /**
     * Event handler triggered when showing the summary view
     * @param e
     */
    onSummaryViewShow(e) {
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
        // load the summary
        const language = i18n.locale();
        assert.equal(
            language,
            viewModel.get(VIEW_MODEL.LANGUAGE),
            assert.format(
                assert.messages.equal.default,
                'viewModel.get("language")',
                language
            )
        );
        const { summaryId } = e.view.params;
        viewModel.loadSummary({ language, id: summaryId }).always(() => {
            mobile.onGenericViewShow(e);
            // Set the background color
            // This cannot be done via bindings because the view and vien.content cannot be bound
            const summary = viewModel.get(VIEW_MODEL.SUMMARY._);
            view.content
                .toggleClass('error', summary.isError$())
                .toggleClass('success', summary.isSuccess$())
                .toggleClass('warning', summary.isWarning$());
            app.notification.info(i18n.culture.notifications.summaryViewInfo);
        });
    },

    /**
     * Event handler triggered when clicking the play option in the action sheet displayed from the GO button of summaries
     */
    onSummaryActionPlay() {
        // assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        const language = i18n.locale();
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
        const summaryId = viewModel.get(VIEW_MODEL.SUMMARY.ID);

        // Find latest version (version history is not available in the mobile app)
        viewModel
            .loadLazyVersions({
                // TODO: fields could be found in models.LazyVersion (use the from property not the field name) - @see https://github.com/kidoju/Kidoju-Widgets/issues/218
                fields: 'id,state,summaryId', // Note for whatever reason we also receive the type in the response payload
                filter: { field: 'state', operator: 'eq', value: 5 },
                partition: { language, summaryId },
                sort: { field: 'id', dir: 'desc' },
            })
            .done(() => {
                const version = viewModel.versions.at(0); // First is latest version
                assert.instanceof(
                    models.LazyVersion,
                    version,
                    assert.format(
                        assert.messages.instanceof.default,
                        'version',
                        'models.LazyVersion'
                    )
                );
                assert.match(
                    RX_MONGODB_ID,
                    version.get('id'),
                    assert.format(
                        assert.messages.match.default,
                        'version.get(\'id")',
                        RX_MONGODB_ID
                    )
                );
                // version has no language - we therfore assume same langauge
                // assert.equal(language, version.get('language'), assert.format(assert.messages.equal.default, 'version.get(\'language")', language));
                assert.equal(
                    summaryId,
                    version.get('summaryId'),
                    assert.format(
                        assert.messages.equal.default,
                        'version.get(\'summaryId")',
                        summaryId
                    )
                );
                mobile.application.navigate(
                    `${
                        CONSTANTS.HASH + VIEW.PLAYER
                    }?language=${window.encodeURIComponent(
                        language
                    )}&summaryId=${window.encodeURIComponent(
                        summaryId
                    )}&versionId=${window.encodeURIComponent(
                        version.get('id')
                    )}`
                );
            });
    },

    /**
     * Event handler triggered when clicking the share option in the action sheet displayed from the GO button of summaries
     * @see https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
     */
    onSummaryActionShare() {
        if (mobile.support.socialsharing) {
            const culture = i18n.culture.summary.socialSharing;
            mobile.socialsharing.shareWithOptions(
                {
                    message: kendo.format(
                        culture.message, // not supported on some apps (Facebook, Instagram)
                        viewModel.get(VIEW_MODEL.SUMMARY.TITLE),
                        // viewModel.summary.summaryUri$(),
                        viewModel.get(VIEW_MODEL.SUMMARY.DESCRIPTION)
                    ),
                    subject: kendo.format(
                        culture.subject, // for email
                        viewModel.get(VIEW_MODEL.SUMMARY.TITLE)
                    ),
                    // TODO Add files - https://github.com/kidoju/Kidoju-Mobile/issues/178
                    // files: ['www/icon.png'], // an array of filenames either locally or remotely
                    // here, www/icon.png is included in email and prevents facebook from using the file linked in the web page via og:image meta tag
                    url: viewModel.summary.summaryUri$(),
                    chooserTitle: culture.chooserTitle, // Android only, you can override the default share sheet title
                },
                (result) => {
                    app.notification.success(
                        i18n.culture.notifications.sharingSuccess
                    );
                    // mobile.dialogs.info('Share completed? ' + result.completed + '/' + result.app);
                    // On Android apps mostly return result.completed=false even while it's true
                    // On Android result.app (the app shared to) is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                    // Track with Google Analytics
                    if (mobile.support.ga) {
                        mobile.ga.trackEvent(
                            ANALYTICS.CATEGORY.SUMMARY,
                            ANALYTICS.ACTION.SHARE + result.app,
                            viewModel.get(VIEW_MODEL.SUMMARY.ID)
                        );
                    }
                },
                (msg) => {
                    // mobile.dialogs.error('Sharing failed: ' + msg);
                    app.notification.error(
                        i18n.culture.notifications.sharingFailure
                    );
                    logger.error({
                        message: 'Error sharing',
                        method: 'mobile.onSummaryActionShare',
                        error: new Error(msg),
                    });
                }
            );
        }
    },

    /**
     * Event handler triggered when clicking the feedback option in the action sheet displayed from the GO button of summaries
     */
    onSummaryActionFeedback() {
        const url = kendo.format(
            app.constants.feedbackUrl,
            i18n.locale(),
            encodeURIComponent(viewModel.summary.summaryUri$())
        );
        // targeting _system should open the web browser instead of the InApp browser (target = _blank)
        if (mobile.support.inAppBrowser) {
            mobile.InAppBrowser.open(url, '_system', 'usewkwebview=yes');
        } else {
            window.open(url, '_system');
        }
        if (mobile.support.ga) {
            mobile.ga.trackEvent(
                ANALYTICS.CATEGORY.GENERAL,
                ANALYTICS.ACTION.FEEDBACK
            );
        }
    },
};

/**
 * Default export
 */
export default feature;

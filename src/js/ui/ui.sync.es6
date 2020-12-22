/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import 'kendo.mobile.view';
import 'kendo.progressbar';
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import { xhr2error } from '../data/data.util.es6';

const {
    mobile: {
        ui: { View },
    },
    roleSelector,
} = window.kendo;
const logger = new Logger('ui.sync');

/**
 * Sync feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'sync',

    /**
     * View
     */
    VIEW: {
        SYNC: {
            _: 'sync',
        },
    },

    /**
     * Event handler triggered when showing the sync view
     * @param e
     */
    onSyncViewShow(e) {
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
        const {
            i18n,
            viewModel,
            viewModel: { VIEW, VIEW_MODEL },
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

        const culture = __('mobile.sync');
        const message = e.view.content.find('p.message');
        const passProgressBar = e.view.content
            .find('#sync-pass')
            .data('kendoProgressBar');
        const percentProgressBar = e.view.content
            .find('#sync-percent')
            .data('kendoProgressBar');

        // Update navigation bar
        viewModel.onGenericViewShow(e);

        // Reset progress bars
        // passProgressBar.value(0);
        // percentProgressBar.value(0);

        // Display custom status
        passProgressBar.unbind('change');
        passProgressBar.bind('change', (evt) => {
            evt.sender.progressStatus.text(
                status.pass < 2 ? culture.pass.remote : culture.pass.local
            );
        });

        // Disable single continue button
        const continueButton = e.view.content
            .find(roleSelector('button'))
            .data('kendoMobileButton');
        continueButton.unbind('click');
        continueButton.enable(false);

        // Check network
        if (
            (window.device &&
                !window.device.isVirtual &&
                window.device.platform !== 'browser' &&
                'Connection' in window &&
                window.navigator.connection.type !==
                    window.Connection.ETHERNET &&
                window.navigator.connection.type !== window.Connection.WIFI) ||
            (window.device &&
                window.device.platform === 'browser' &&
                !window.navigator.onLine)
        ) {
            // !window.device.isVirtual ensures emulators do sync whatever the connection
            app.notification.warning(
                __('mobile.notifications.syncBandwidthLow')
            );
            return viewModel.application.navigate(
                `${
                    CONSTANTS.HASH + VIEW.CATEGORIES
                }?language=${encodeURIComponent(language)}`
            );
        }

        // Check batteries
        // Commented because there is no way to ensure a battery event to set app.battery.status before syncing
        /*
        if ((!app.battery.status.isPlugged) && ($.type(app.battery.status.level) !== NUMBER || app.battery.status.level < 20)) {
            return app.notification.warning(__('mobile.notifications.syncBatteryLow'));
        }
        */

        // Synchronize activities
        viewModel.activities.setLastSync(
            viewModel.get(VIEW_MODEL.USER.LAST_SYNC)
        );
        viewModel.activities
            .remoteSync()
            .progress((status) => {
                message.text(culture.message[status.collection]);
                passProgressBar.value(status.pass);
                percentProgressBar.value(
                    (100 * (status.index + 1)) / status.total
                );
            })
            .then(() => {
                passProgressBar.value(2);
                percentProgressBar.value(100);

                // Update user
                const now = new Date();
                viewModel.set(VIEW_MODEL.USER.LAST_USE, now);
                viewModel.set(VIEW_MODEL.USER.LAST_SYNC, now);
                viewModel.users
                    .sync()
                    .then(() => {
                        message.text(culture.message.complete);
                        app.notification.success(
                            __('mobile.notifications.syncSuccess')
                        );
                        /*
                        if (viewModel.support.ga) {
                            viewModel.ga.trackEvent(
                                ANALYTICS.CATEGORY.ACTIVITY,
                                ANALYTICS.ACTION.SYNC
                                // Note: It would be nice to report the total number of activities synced
                            );
                        }
                        */
                    })
                    .catch((xhr, status, errorThrown) => {
                        app.notification.error(
                            __('mobile.notifications.userSaveFailure')
                        );
                        logger.error({
                            message:
                                'Error updating user after synchronization',
                            method: 'viewModel.onSyncViewShow',
                            error: xhr2error(xhr, status, errorThrown),
                        });
                    });
            })
            .catch((xhr, status, errorThrown) => {
                if (xhr.status === 401) {
                    app.notification.error(
                        __('mobile.notifications.syncUnauthorized')
                    );
                } else {
                    app.notification.error(
                        __('mobile.notifications.syncFailure')
                    );
                    logger.error({
                        message: 'Error Synchronizing',
                        method: 'viewModel.onSyncViewShow',
                        error: xhr2error(xhr, status, errorThrown),
                    });
                }
            })
            .always(() => {
                // Enable continue button
                continueButton.bind('click', (evt) => {
                    evt.preventDefault();
                    viewModel.application.navigate(
                        `${
                            CONSTANTS.HASH + VIEW.CATEGORIES
                        }?language=${encodeURIComponent(language)}`
                    );
                });
                continueButton.enable(true);
            });
    },

    /**
     * Event handler triggered when hiding the sync view
     * @param e
     */
    onSyncViewHide(e) {
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
                'kendo.viewModel.ui.View'
            )
        );
        const { content } = e.view;
        const message = content.find('p.message');
        const passProgressBar = content
            .find('#sync-pass')
            .data('kendoProgressBar');
        const percentProgressBar = content
            .find('#sync-percent')
            .data('kendoProgressBar');

        // Reset message
        message.text(CONSTANTS.EMPTY);

        // Reset progress bars
        passProgressBar.value(0);
        percentProgressBar.value(0);
    },
};

/**
 * Default export
 */
export default feature;

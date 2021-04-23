/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires https://github.com/lynrin/cordova-plugin-buildinfo
// so window.BuildInfo is only available after deviceready event

/**
 * AppStore plugin
 */
const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return true;
    },

    /**
     * Request App Store rating
     * Note: https://github.com/pushandplay/cordova-plugin-apprate is a confirm dialog opening an InAppBrowser, so we can do that without a plugin
     * There is also another plugin at https://github.com/xmartlabs/cordova-plugin-market
     * There are several reasons for doing it this way:
     * - URLs change from time to time and plugins lag behind (
     * - Plugins do not surpport FireOS
     *
     * @see https://github.com/pushandplay/cordova-plugin-apprate/blob/master/www/AppRate.js
     * @see https://joshuawinn.com/adding-rate-button-to-cordova-based-mobile-app-android-ios-etc/
     * @private
     */
    requestAppStoreReview() {
        var platform = window.device && window.device.platform && window.device.platform.toLowerCase();
        var appStoreUrl = app.constants.appStoreUrl[platform];

        if (app.DEBUG && platform === 'browser') {
            // Note: browser platform has no appStoreUrl unless we give one here for testing
            appStoreUrl = 'http://www.kidoju.com';
        }

        if (appStoreUrl) {

            var dfd = $.Deferred();
            var reviewState = viewModel.get(VIEW_MODEL.USER.REVIEW_STATE);
            reviewState = reviewState || { counter: 0 };

            /*
            window.alert(
                'platform: ' + platform + '\n' +
                'inAppBrowser: ' + mobile.support.inAppBrowser + '\n' +
                'version: ' + reviewState.version + '\n' +
                'counter: ' + reviewState.counter
            );
            */

            // Never rate the same version twice + only ask every 5 times (this is called after signing in with a PIN, before redirecting to the categories tree)
            if ((reviewState.version !== app.version) && ((reviewState.counter + 1) % 5 === 0)) {

                var culture = i18n.culture.appStoreReview;

                logger.debug({
                    message: 'Requesting an app store review',
                    method: 'mobile._requestAppStoreReview',
                    data: { platform: platform }
                });

                mobile.dialogs.confirm(
                    kendo.format(culture.message, app.constants.appName),
                    function (buttonIndex) {
                        if (buttonIndex === 1) { // OK
                            logger.debug({
                                message: 'Opening the app store for review',
                                method: 'mobile._requestAppStoreReview',
                                data: { platform: platform }
                            });
                            // We are simply opening a custom url scheme and we do not need SafariViewController for that
                            // Note that this does not work in the Android Emulator because the play store app is missing
                            if (mobile.support.inAppBrowser) {
                                mobile.InAppBrowser.open(appStoreUrl, '_system', 'usewkwebview=yes');
                            } else {
                                window.open(appStoreUrl, '_system');
                            }
                            if (mobile.support.ga) {
                                mobile.ga.trackEvent(
                                    ANALYTICS.CATEGORY.GENERAL,
                                    ANALYTICS.ACTION.APP_REVIEW,
                                    platform
                                );
                            }
                            // In truth we do not really know whether the app has been reviewed or not, we just know that the browser has been opened to the app store
                            reviewState.version = app.version;
                            reviewState.counter = 0;
                        } else { // Cancel
                            reviewState.counter++;
                        }
                        dfd.resolve(reviewState);
                    },
                    kendo.format(culture.title, app.constants.appName),
                    [culture.buttons.ok.text, culture.buttons.cancel.text]
                );

            } else {
                reviewState.counter++;
                dfd.resolve(reviewState);
            }

            dfd.promise().done(function (reviewState) {
                // Update reviewState and save without notification
                // viewModel.set(VIEW_MODEL.USER.REVIEW_STATE, reviewState); // This won't set the dirty field to sync
                viewModel.get(VIEW_MODEL.USER._).set('reviewSteate', reviewState);
                viewModel.users.sync(false); // false hides notifications
            });
        }

    }
};

/**
 * Default export
 */
export default plugin;

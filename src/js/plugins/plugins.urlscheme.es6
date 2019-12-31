/**
 * Function to handle open Url
 * @param url
 */
function handleOpenURL(url) {
    if (url.startsWith(app.constants.appScheme + '://oauth')) {
        // The whole oAuth flow is documented at
        // https://medium.com/@jlchereau/stop-using-inappbrowser-for-your-cordova-phonegap-oauth-flow-a806b61a2dc5
        mobile._parseTokenAndLoadUser(url);
    } else if (RX_APP_SCHEME.test(url)) {
        var matches = RX_APP_SCHEME.exec(url);
        // Note: we have already tested the url, so we know there is a match
        var language = matches[1];
        var summaryId = matches[3];
        if (language === i18n.locale()) {
            mobile.application.navigate(HASH + VIEW.SUMMARY + '?language=' + encodeURIComponent(language) + '&summaryId=' +
                encodeURIComponent(summaryId));
        } else {
            app.notification.warning(i18n.culture.notifications.openUrlLanguage);
        }
    } else if (RX_HELP_URL.test(url) || RX_REVIEW_SCHEMES.test(url)) {
        // For whatever reason, calling help in mobile._openHelp triggers handleOpenUrl on iOS (but not on Android)
        // For whatever reason, calling review schemes in mobile._requestAppStoreReview triggers handleOpenUrl on iOS (but not on Android)
        $.noop();
    } else {
        logger.warn({
            message: 'App scheme called with unknown url',
            method: 'window.handleOpenURL',
            data: { url: url }
        });
        app.notification.warning(i18n.culture.notifications.openUrlUnknown);
    }
    // Trying to accelerate the hiding of the splash screen does not help
    // if (mobile.support.splashscreen) { mobile.splashscreen.hide(); }
}

/**
 * Event handler triggered when calling a url with the com.kidoju.mobile:// scheme
 * @param url
 */
window.handleOpenURL = function (url) {

    // Hide the SafariViewController in all circumstances
    // This has to be done before the setTimeout otherwise the SafariViewController does not close in iOS
    // mobile.support.safariViewController is iOS only until https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller/issues/51
    if (mobile.support.safariViewController) {
        try {
            mobile.SafariViewController.hide();
        } catch (ex) {
            // They say mobile.SafariViewController.hide is not implemented on Android
            // https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller/issues/62
        }
    }

    if (mobile.application instanceof kendo.mobile.Application && $.isPlainObject(i18n.culture)) {
        // iOS goes through this branch
        // browser apps use a simple redirection which does not require a custom url scheme
        setTimeout(function () { handleOpenURL(url); }, 0);
    } else {
        // Android creates a new intent to perform the task, triggering onDeviceReady and actually reloading the app
        // So we have added an APPINIT event which is triggered form the init event handler of kendo.mobile.Application
        // At this stage mobile.application and i18n.culture are available for any statement in handleOpenURL
        // TODO: Check that this is still going on since launchMode singleTask
        $(document).one(APPINIT, function () { handleOpenURL(url); });
    }
};

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.application';
import 'kendo.mobile.button';
import 'kendo.mobile.pane';
import 'kendo.mobile.view';
import 'kendo.mobile.scrollview';
import __ from '../app/app.i18n.es6';
import config from '../app/app.config.jsx';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import inAppBrowser from '../plugins/plugins.inappbrowser.es6';
import safariViewController from '../plugins/plugins.safariviewcontroller.es6';
import { getSignInUrl } from '../rapi/rapi.oauth.es6';
import { cleanHistory, parseToken } from '../rapi/rapi.util.es6';
import { MISC, VIEW, VIEW_MODEL } from './ui.constants.es6';
import { xhr2error } from '../data/data.util.es6';

const {
    attr,
    format,
    mobile: {
        Application,
        ui: { Button, Pane, ScrollView, View }
    },
    roleSelector
} = window.kendo;
const logger = new Logger('feature.signin');

/**
 * Layout feature
 */
const feature = {
    /**
     * Event handler triggered when initializing the signin view
     * @param e
     */
    onSigninViewInit(e) {
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
        const $scrollView = e.view.content.find(roleSelector('scrollview'));
        const scrollView = $scrollView.data('kendoMobileScrollView');
        if (scrollView instanceof ScrollView) {
            // Note: the change event occurs a little bit late to coordinate scrolling with titles and styles
            scrollView.bind(
                CONSTANTS.CHANGING,
                feature.onSigninScrollViewChange.bind(e.view)
            );
        }
    },

    /**
     * Event handler triggered when changing scrollView
     * @param e
     */
    onSigninScrollViewChange(e) {
        // Note: The user needs to scroll through pages for this event to be triggered
        // Especially, it is not triggered when showing the initial page, so page 0 has default values
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        assert.type(
            CONSTANTS.NUMBER,
            e.nextPage,
            assert.format(
                assert.messages.type.default,
                'e.nextPage',
                CONSTANTS.NUMBER
            )
        );
        assert.instanceof(
            ScrollView,
            e.sender,
            assert.format(
                assert.messages.instanceof.default,
                'e.sender',
                'kendo.mobile.ui.ScrollView'
            )
        );
        // const view = this; // we try to avoid the use of this in features
        const view$ = e.sender.element.closest(roleSelector('view'));
        const view = view$.data('kendoMobileView');
        if (e.nextPage === MISC.SIGNIN_PAGE) {
            app.controller.setNavBarTitle(view, __('signin.viewTitle2'));
            view.content.find('ol.k-pages.km-pages').addClass('no-background');
        } else {
            app.controller.setNavBarTitle(view);
            view.content
                .find('ol.k-pages.km-pages')
                .removeClass('no-background');
        }
    },

    /**
     * Event handler triggered when showing the signin view
     * @param e
     */
    onSigninViewShow(e) {
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

        const { controller, viewModel } = app;

        // Parse token (in browser)
        // if (!inAppBrowser.ready() && !safariViewController.ready()) {
        //     e.preventDefault();
        //     mobile._parseTokenAndLoadUser(window.location.href);
        // }

        // Set Navbar
        const { view } = e;
        controller.setNavBar(view);

        // Enable buttons according to provider
        const provider =
            view.params.userId === viewModel.get(VIEW_MODEL.USER.ID)
                ? viewModel.get(VIEW_MODEL.USER.PROVIDER)
                : CONSTANTS.EMPTY;
        feature.enableSigninButtons(provider || true);

        // Scroll to page if designated in e.view.params to set the view title
        const $scrollView = view.content.find(roleSelector('scrollview'));
        const scrollView = $scrollView.data('kendoMobileScrollView');
        // Scroll to page 0 unless there is a page in params
        if (scrollView instanceof ScrollView) {
            const page = parseInt(view.params.page, 10) || 0;
            scrollView.trigger(CONSTANTS.CHANGING, { nextPage: page });
            scrollView.scrollTo(page, true);
        }

        // mobile.onGenericViewShow(e);
        if (controller.application instanceof Application) {
            // mobile.application is not available on first view shown
            controller.application.hideLoading();
        }
    },

    /**
     * Enable/disable signin buttons (to prevent double-clicks)
     * @param enable
     */
    enableSigninButtons(enable) {
        // enable is either a boolean or a provider
        // If it is a provider, only enable the button corresponding to this provider
        const provider =
            $.type(enable) === CONSTANTS.STRING ? enable : CONSTANTS.EMPTY;
        const enabled = provider.length ? false : enable;

        $(CONSTANTS.HASH + VIEW.SIGNIN)
            .children(roleSelector('content'))
            .find(roleSelector('button'))
            .each((index, element) => {
                const $button = $(element);
                const buttonProvider = $button.attr(attr('provider'));
                const button = $button.data('kendoMobileButton');
                if (button instanceof Button) {
                    button.enable(enabled || buttonProvider === provider);
                }
            });
    },

    /**
     * Event handler triggered when clicking a button on the sign-in view
     * @param e
     */
    onSigninButtonClick(e) {
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

        // Disable buttons to avoid double clicks
        feature.enableSigninButtons(false);

        const provider = e.button.attr(attr('provider'));
        // In Phonegap, windows.location.href = "x-wmapp0:www/index.html" and Kidoju-Server cannot redirect the InAppBrowser to such location
        // The oAuth recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob" which sets the authorization code in the browser's title, however, we can't access the title of the InAppBrowser in Phonegap.
        // Several oAuth authentication providers do not support "http://localhost" (or preferably "kidoju://localhost") as a redirection url.
        // Several oAuth authentication providers require the creation and management of one application per web site root in addition to https://www.kidoju.com
        // The trick is to use a blank returnUrl at https://www.kidoju.com/api/blank with a CSP that does not allow the execution of any code
        // We can then access this returnUrl in the loadstart and loadstop events of the InAppBrowser.
        // So if we bind the loadstart event, we can find the access_token code and close the InAppBrowser after the user has granted access to their data.
        const returnUrl =
            safariViewController.ready() || inAppBrowser.ready()
                ? format(
                      config.uris.rapi.root +
                          config.uris.rapi.oauth.application,
                      config.constants.appId
                  )
                : `${window.location.protocol}//${window.location.host}/${CONSTANTS.HASH}${VIEW.SIGNIN}`;
        // When running in a browser via phonegap serve, the InAppBrowser turns into an iframe but authentication providers prevent running in an iframe by setting 'X-Frame-Options' to 'SAMEORIGIN'
        // So if the device platform is a browser, we need to keep the sameflow as Kidoju-WebApp with a redirectUrl that targets the user view
        getSignInUrl(provider, returnUrl)
            .done(signInUrl => {
                // Save provider to read in viewModel.loadUser
                localStorage.setItem('provider', provider); // TODO Manage errors
                logger.debug({
                    message: 'getSignInUrl',
                    method: 'onSigninButtonClick',
                    data: { provider, returnUrl, signInUrl }
                });
                // window.alert(mobile.support.safariViewController ? 'Yep' : 'Nope');
                if (safariViewController.ready()) {
                    // running in Phonegap, using SFSafariViewController
                    // requires https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller
                    // also requires https://github.com/EddyVerbruggen/Custom-URL-scheme
                    feature.signinWithSafariViewController(signInUrl);
                } else if (inAppBrowser.ready()) {
                    // running in Phonegap, using InAppBrowser
                    // requires https://github.com/apache/cordova-plugin-inappbrowser
                    feature.signinWithInAppBrowser(signInUrl, returnUrl);
                } else {
                    // Running in a browser, simply redirect to signInUrl
                    feature.signinWithinBrowser(signInUrl);
                }
            })
            .fail((xhr, status, errorThrown) => {
                app.notification.error(__('notifications.signinUrlFailure'));
                logger.error({
                    message: 'error obtaining a signin url',
                    method: 'onSigninButtonClick',
                    error: xhr2error(xhr, status, errorThrown),
                    data: { provider }
                });
            })
            .always(() => {
                feature.enableSigninButtons(true);
            });
    },

    /**
     * Sign in with SFSafariViewController
     * requires https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller
     * also requires https://github.com/EddyVerbruggen/Custom-URL-scheme
     *
     * Note: Parsing the token is done by mobile._parseTokenAndLoadUser in handleOpenURL (see custom url scheme)
     *
     * Now that Google has deprecated oAuth flows from web views, this is the preferred way to sign in
     * although this is only compatible with iOS 9 and above
     * See: https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html
     * There is also a huge benefit: social accounts are remembered and users do not have to re-enter their MFA codes each time they signin
     *
     * @param signInUrl
     * @private
     */
    signinWithSafariViewController(signInUrl) {
        logger.debug({
            message: 'opening signInUrl in SafariViewController',
            method: 'signinWithSafariViewController',
            data: { signInUrl }
        });
        safariViewController.show(
            {
                url: signInUrl
                // hidden: false,
                // animated: false, // default true, note that 'hide' will reuse this preference (the 'Done' button will always animate though)
                // transition: 'curl', // (this only works in iOS 9.1/9.2 and lower) unless animated is false you can choose from: curl, flip, fade, slide (default)
                // enterReaderModeIfAvailable: readerMode, // default false
                // tintColor: "#00ffff", // default is ios blue
                // barColor: "#0000ff", // on iOS 10+ you can change the background color as well
                // controlTintColor: "#ffffff" // on iOS 10+ you can override the default tintColor
            },
            // this success callback will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
            result => {
                // result has only one property, event which can take any value among 'opened', 'loaded' and 'closed'
                logger.debug({
                    message: 'safari/chrome successfully opened',
                    method: 'signinWithSafariViewController',
                    data: { event: result.event }
                });
            },
            // error callback
            msg => {
                logger.error({
                    message: 'safari/chrome failed to open',
                    method: 'signinWithSafariViewController',
                    error: new Error(msg)
                });
            }
        );
    },

    /**
     * Sign in with InAppBrowser
     * Requires https://github.com/apache/cordova-plugin-inappbrowser
     *
     * Note: Parsing the token is done here by mobile._parseTokenAndLoadUser
     *
     * This is the old way applicable to iOS8 and prior versions
     * This way has several limitations:
     * - InAppBrowser uses UIWebView, not WKWebView on iOS
     * - The oAuth flow is incompatible with WKWebView which has to be disabled to work - see https://github.com/kidoju/Kidoju-Mobile/issues/34
     * - Google has announced that as of April 2007 the oAuth flow with web views won't be supported - see https://github.com/kidoju/Kidoju-Mobile/issues/33
     *
     * @param signInUrl
     * @param returnUrl
     * @private
     */
    signinWithInAppBrowser(signInUrl, returnUrl) {
        let browser;
        let loadStart;
        let loadError;
        function close() {
            // Makes it idempotent in case it has already been called
            if (browser) {
                browser.removeEventListener('loadstart', loadStart);
                // browser.removeEventListener('loadstop', loadStop);
                browser.removeEventListener('loaderror', loadError);
                browser.close();
                browser = undefined;
                logger.debug({
                    message: 'closed InAppBrowser',
                    method: 'signinWithInAppBrowser'
                });
            }
        }
        loadStart = e => {
            // There is an incompatibility between InAppBrowser and WkWebView that prevents
            // the loadstart event to be triggered in an oAuth flow if cordova-plugin-wkwebview-engine is installed
            // See https://issues.apache.org/jira/browse/CB-10698
            // See https://issues.apache.org/jira/browse/CB-11136
            // Seems to have been fixed in https://github.com/apache/cordova-plugin-inappbrowser/pull/187
            // Has yet to be released - https://github.com/kidoju/Kidoju-Mobile/issues/34
            logger.debug({
                message: 'loadstart event of InAppBrowser',
                method: 'signinWithInAppBrowser',
                data: { url: e.url }
            });
            // Once https://github.com/apache/cordova-plugin-inappbrowser/pull/99 is fixed
            // we should be able to have the same flow as in SafariViewController
            if (e.url.startsWith(returnUrl)) {
                feature._parseTokenAndLoadUser(e.url).always(close);
            }
        };
        loadError = error => {
            // We have an issue with the InAppBrowser which raises an error when opening custom url schemes, e.g. com.kidoju.mobile://oauth
            // See https://github.com/apache/cordova-plugin-inappbrowser/pull/99
            // window.alert(JSON.stringify($.extend({}, error)));
            logger.error({
                message: 'loaderror event of InAppBrowser',
                method: 'signinWithInAppBrowser',
                error,
                data: { url: error.url }
            });
            // Close may have already been called in loadStart
            close();
        };
        browser = inAppBrowser.open(
            signInUrl,
            '_blank',
            'location=yes,clearsessioncache=yes,clearcache=yes,usewkwebview=yes'
        );
        // browser.addEventListener('exit', exit);
        browser.addEventListener('loadstart', loadStart);
        // browser.addEventListener('loadstop', loadStop);
        browser.addEventListener('loaderror', loadError);
        logger.debug({
            message: 'opening signInUrl in InAppBrowser',
            method: 'signinWithInAppBrowser',
            data: { signInUrl }
        });
    },

    /**
     * Sign in within the same browser as the application
     * @param signInUrl
     * @private
     */
    signinWithinBrowser(signInUrl) {
        logger.debug({
            message: 'opening signInUrl in browser',
            method: 'signinWithinBrowser',
            data: { signInUrl }
        });
        // Simply assign url and let the authentication provider redirect to the registered callback
        window.location.assign(signInUrl);
    },

    /**
     * Parse token and load user
     * @param url
     * @private
     */
    _parseTokenAndLoadUser(url) {
        const dfd = $.Deferred();
        // No need to clean the history when opening in InAppBrowser or SafariViewController
        // TODO if (!safariViewController.ready() && !inAppBrowser.ready()) {
        //    cleanHistory();
        // }
debugger;
        // parseToken sets the token in localStorage
        parseToken(url)
            .then(token => {
                if (token && token.error) {
                    app.notification.error(
                        __('notifications.oAuthTokenFailure')
                    );
                    logger.error({
                        message: token.error,
                        method: 'parseTokenAndLoadUser',
                        data: { url }
                    });
                    dfd.reject(new Error(token.error)); // TODO Make it an XHRError to match viewModel.loadUser
                    /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
                } else if (token && token.access_token) {
                    const { controller, viewModel } = app;
                    /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
                    // Load the remote mobile user (me) using the oAuth token
                    // We cannot navigate to a page here because the initial page is defined in the constructor of kendo.mobile.Application
                    viewModel
                        .loadUser()
                        .done(() => {
                            // Yield time for transition effects to complete, especially when testing in the browser
                            // Otherwise we get an exception on that.effect.stop in kendo.mobile.ViewContainer.show
                            // app.mobile.application.view().one('transitionEnd', function () {
                            setTimeout(() => {
                                if (viewModel.isNewUser$()) {
                                    // Save new user first
                                    controller.application.navigate(
                                        CONSTANTS.HASH + VIEW.USER
                                    );
                                } else {
                                    // Sync user data since we have a recent token
                                    controller.application.navigate(
                                        CONSTANTS.HASH + VIEW.SYNC
                                    );
                                }
                                dfd.resolve();
                            }, 0);
                        })
                        .fail(dfd.reject);
                }
            })
            .catch(error => {
                dfd.reject(error);
            });
        return dfd.promise();
    },

    /**
     * Fix title and notification on #signin view
     * Note: We need this because mobile.localize(...) is executed after onSigninViewShow, when signin is the initial page
     * @private
     */
    _fixSigninViewLocalization() {
        const { controller, viewModel } = app;
        if (
            controller.application instanceof Application &&
            controller.application.pane instanceof Pane
        ) {
            const view = controller.application.view();
            if (parseInt(view.params.page, 10) === MISC.SIGNIN_PAGE) {
                controller.setNavBarTitle(view, __('signin.viewTitle2'));
            }
            const provider =
                view.params.userId === viewModel.get(VIEW_MODEL.USER.ID)
                    ? viewModel.get(VIEW_MODEL.USER.PROVIDER)
                    : '';
            if (provider) {
                view.content
                    .find(
                        'div[data-role="page"]:eq(3) .k-notification-wrap>span.k-text'
                    )
                    .html(
                        format(
                            __('signin.welcome2'),
                            viewModel.get(VIEW_MODEL.USER.FIRST_NAME),
                            provider
                        )
                    );
            }
        }
    }
};

/**
 * Default export
 */
export default feature;

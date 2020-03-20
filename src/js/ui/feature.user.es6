/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.application';
import 'kendo.mobile.button';
import 'kendo.mobile.view';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import { MISC, VIEW, VIEW_MODEL } from './ui.constants.es6';

const {
    attr,
    mobile: {
        Application,
        ui: { Button, View }
    },
    roleSelector
} = window.kendo;
const SELECTORS = {
    PIN: '' // TODO
};

// TODO use kendo.KEYS

/**
 * User feature
 */
const feature = {
    /**
     * Event handler triggered when initializing the user view
     * @param e
     */
    onUserViewInit(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof(View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
        // Init pin textboxes if not already initialized
        // We have removed kendo.ui.MaskedTextBox because the experience was not great
        // especially because it always displays 4 password dots making the number of characters actually typed unclear
        e.view.element
            .off(`${CONSTANTS.FOCUS} ${CONSTANTS.INPUT} ${CONSTANTS.KEYDOWN} ${CONSTANTS.KEYPRESS}`, SELECTORS.PIN)
            .on(CONSTANTS.FOCUS, SELECTORS.PIN, e => {
                assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                assert.ok($(e.target).is(SELECTORS.PIN), '`e.target` should be a pin textbox');
                // Empty the pin input on focus
                $(e.target).val(CONSTANTS.EMPTY);
            })
            .on(CONSTANTS.INPUT, SELECTORS.PIN, e => {
                assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                assert.ok($(e.target).is(SELECTORS.PIN), '`e.target` should be a pin textbox');
                // Note: android does not trigger the keypress event, so we need the input event
                // Only keep the first 4 digits
                $(e.target).val($(e.target).val().replace(/\D+/g, '').substr(0, 4));
            })
            .on(CONSTANTS.KEYDOWN, SELECTORS.PIN, e => {
                assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                assert.ok($(e.target).is(SELECTORS.PIN), '`e.target` should be a pin textbox');
                if (e.which === 13) {
                    // This is a carriage return, so trigger the primary button
                    var $view = $(e.target).closest(kendo.roleSelector('view'));
                    var $button = $view.find(kendo.roleSelector('button') + '.km-primary:visible');
                    assert.equal(1, $button.length, assert.format(assert.messages.equal.default, '$button.length', '1'));
                    var button = $button.data('kendoMobileButton');
                    assert.instanceof(kendo.mobile.ui.Button, button, assert.format(assert.messages.instanceof.default, 'button', 'kendo.mobile.ui.Button'));
                    button.trigger(CONSTANTS.CLICK, { button: $button });
                }
            })
            .on(CONSTANTS.KEYPRESS, SELECTORS.PIN, e => {
                assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                assert.ok($(e.target).is(SELECTORS.PIN), '`e.target` should be a pin textbox');
                // Special characters including backspace, delete, end, home and arrows do not trigger the keypress event (they trigger keydown though)
                if (e.which < 48 || e.which > 57 || $(e.target).val().length > 3) {
                    e.preventDefault();
                }
            });

            /*
            // This was used for debugging user pictures
            e.view.element.find('img').on(CLICK, function (e) {
                window.alert($(e.target).attr('src'));
            });
            */
    },

    /**
     * Event handler triggered when showing the user view
     * BEWARE: Because #user is the initial view designated in the constructor of kendo.mobile.Application
     * this necessarily executes when loading the application
     * @param e
     */
    onUserViewShow(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof(View, e.view, assert.format(assert.messages.instanceof.default, 'e.view', 'kendo.mobile.ui.View'));
        const { controller, notification, viewModel } = app;
        controller.onGenericViewShow(e);
        // Display a notification
        if (viewModel.isSavedUser$()) {
            notification.info(__('notifications.pinValidationInfo'));
        } else {
            notification.info(__('notifications.pinSaveInfo'));
        }
        // Focus on PIN
        feature.enableUserButtons(true);
        e.view.element.find(SELECTORS.PIN).val(CONSTANTS.EMPTY).first().focus();
    },

    /**
     * Event handler when clicking the save button of the user view
     * @param e
     */
    onUserSaveClick(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

        // Disable buttons to avoid double clicks
        mobile.enableUserButtons(false);

        // Get user from viewModel
        var user = viewModel.get(VIEW_MODEL.USER);
        assert.instanceof(models.MobileUser, user, assert.format(assert.messages.instanceof.default, 'user', 'models.MobileUser'));
        var isNewUser = user.isNew();

        // Read pin values
        var $view = e.button.closest(kendo.roleSelector('view'));
        var pinElements = $view.find(SELECTORS.PIN);
        assert.equal(3, pinElements.length, assert.format(assert.messages.equal.default, 'pinElements.length', '3'));
        var pinValue = pinElements.eq(0).val();
        var newPinValue = pinElements.eq(1).val();
        var confirmValue = pinElements.eq(2).val();
        var isNew = user.isNew();
        if ((isNew && RX_PIN.test(newPinValue) && confirmValue === newPinValue) ||
            (!isNew && RX_PIN.test(newPinValue) && confirmValue === newPinValue && user.verifyPin(pinValue))) {

            // Update user with new pin
            user.addPin(newPinValue);
            viewModel.set(VIEW_MODEL.USER.LAST_USE, new Date());

            // Synchronize changes
            viewModel.syncUsers()
            .done(function () {
                app.notification.success(kendo.format(i18n.culture.notifications.userSignInSuccess, viewModel.user.fullName$()));
                if (isNewUser) {
                    mobile.application.navigate(CONSTANTS.HASH + VIEW.SYNC);
                } else {
                    var language = i18n.locale();
                    assert.equal(language, viewModel.get(VIEW_MODEL.LANGUAGE), assert.format(assert.messages.equal.default, 'viewModel.get("language")', language));
                    mobile.application.navigate(CONSTANTS.HASH + VIEW.CATEGORIES + '?language=' + encodeURIComponent(language));
                }
            })
            .always(function () {
                mobile.enableUserButtons(true);
                if (mobile.support.ga && isNew) {
                    mobile.ga.trackEvent(
                        ANALYTICS.CATEGORY.USER,
                        ANALYTICS.ACTION.SAVE,
                        viewModel.get(VIEW_MODEL.USER.PROVIDER)
                    );
                }
            });

        } else if (!isNew && RX_PIN.test(newPinValue) && confirmValue === newPinValue && !user.verifyPin(pinValue)) {

            app.notification.warning(i18n.culture.notifications.pinValidationFailure);
            mobile.enableUserButtons(true);

        } else {

            app.notification.warning(i18n.culture.notifications.pinSaveFailure);
            mobile.enableUserButtons(true);

        }
    },

    /**
     * Event handler for swiping over #user
     * @param e
     */
    onUserSwipe(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        $(document.activeElement).blur(); // Make sure we update the viewModel with current input
        if (e.direction === 'left') {
            app.viewModel.nextUser();
        } else if (e.direction === 'right') {
            app.viewModel.previousUser();
        }
    },

    /**
     * Event handler triggered when clicking the signin button of the user view
     * @param e
     */
    onUserSignInClick(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));

        // Disable buttons to avoid double clicks
        mobile.enableUserButtons(false);

        // Check the correct pin
        var view = e.button.closest(kendo.roleSelector('view'));
        var pinElement = view.find(SELECTORS.PIN + ':visible');
        assert.equal(1, pinElement.length, assert.format(assert.messages.equal.default, 'pinElement.length', '1'));
        var pinValue = pinElement.val();

        if (viewModel.user.verifyPin(pinValue)) {
            // Note: the following changes the value of viewModel.isSavedUser$, which changes UI layout
            viewModel.set(VIEW_MODEL.USER.LAST_USE, new Date());
            viewModel.syncUsers(false)
            .done(function () {
                app.notification.success(kendo.format(i18n.culture.notifications.userSignInSuccess, viewModel.user.fullName$()));
                mobile.application.navigate(`${CONSTANTS.HASH}${VIEW.CATEGORIES}?language=${encodeURIComponent(i18n.locale())}`);
                // Request an app store review
                mobile._requestAppStoreReview();
            })
            .always(function () {
                mobile.enableUserButtons(true);
                /* TODO analytics
                if (mobile.support.ga) {
                    mobile.ga.trackEvent(
                        ANALYTICS.CATEGORY.USER,
                        ANALYTICS.ACTION.SIGNIN,
                        viewModel.get(VIEW_MODEL.USER.PROVIDER)
                    );
                }
                */
            });

        } else {
            app.notification.warning(i18n.culture.notifications.pinValidationFailure);
            mobile.enableUserButtons(true);
        }
    },

    /**
     * Event handler triggered when clicking the new user button of the user view
     * @param e
     */
    onUserNewClick(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
        app.controller.application.navigate(`${CONSTANTS.HASH}${VIEW.SIGNIN}?page=${encodeURIComponent(SIGNIN_PAGE)}`);
    },

    /**
     * Event handler triggered when clicking the change pin button of the user view
     * @param e
     */
    onUserChangePin(e) {
        assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        assert.instanceof($, e.button, assert.format(assert.messages.instanceof.default, 'e.button', 'jQuery'));
        // Simply change a property to show the Save button considering declarative bindings based on viewModel.isSavedUser$()
        app.viewModel.set(VIEW_MODEL.USER.LAST_USE, new Date());
    },

    /**
     * Enable/disable user buttons and pin inputs (to prevent double-clicks)
     * @param enable
     */
    enableUserButtons(enable) {
        $(CONSTANTS.HASH + VIEW.USER).find(`li:has(${SELECTORS.PIN})`).css('visibility', enable ? '' : 'hidden');
        $(CONSTANTS.HASH + VIEW.USER).children(roleSelector('content')).find(roleSelector('button')).each(() => {
            const $button = $(this);
            const button = $button.data('kendoMobileButton');
            if (button instanceof Button) {
                button.enable(enable);
            }
        });
    }
};

/**
 * Default export
 */
export default feature;

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
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import { User, UserDataSource } from '../data/data.user.es6';
import { xhr2error } from '../data/data.util.es6';

const {
    attr,
    mobile: {
        Application,
        ui: { Button, View },
    },
    roleSelector,
} = window.kendo;
const logger = new Logger('ui.user');

const SELECTORS = {
    PIN: '', // TODO
};

// TODO use kendo.KEYS

/**
 * User feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'user',

    /**
     * View
     */
    VIEW: {
        USER: 'user',
    },

    /**
     * ViewModel
     */
    VIEW_MODEL: {
        USER: {
            _: 'user',
            ROOT_CATEGORY_ID: 'user.rootCategoryId',
            FIRST_NAME: 'user.firstName',
            ID: 'user.id',
            // LANGUAGE: 'user.language',
            LAST_NAME: 'user.lastName',
            LAST_SYNC: 'user.lastSync',
            LAST_USE: 'user.lastUse',
            PROVIDER: 'user.provider',
            REVIEW_STATE: 'user.reviewState',
            SID: 'user.sid',
            // THEME: 'user.theme'
        },
        USERS: 'users',
    },

    /**
     * Reset
     */
    reset() {
        this.resetUsers();
    },

    /**
     * Reset users
     */
    resetUsers() {
        this.set(this.VIEW_MODEL.USER._, new User());
        this[this.VIEW_MODEL.USERS] = new UserDataSource();
    },

    /**
     * Load
     */
    load() {
        // Load mobile users from localForage
        return this.loadUsers().then(() => {
            // Set user to most recent user
            if (this[this.VIEW_MODEL.USERS].total() > 0) {
                // because of the change event is bound, the following will call the reset function above
                this.set(
                    this.VIEW_MODEL.USER._,
                    this[this.VIEW_MODEL.USERS].at(0)
                );
            }
        });
    },

    /**
     * Load me from remote server
     * @returns {*}
     */
    loadUser() {
        const dfd = $.Deferred();
        // Search me in viewModel.users or create new viewModel.user and add it to viewModel.users
        app.cache.removeMe();
        app.cache
            .getMe()
            .done((me) => {
                assert.isNonEmptyPlainObject(
                    me,
                    assert.format(
                        assert.messages.isNonEmptyPlainObject.default,
                        'me'
                    )
                );
                assert.match(
                    CONSTANTS.RX_MONGODB_ID,
                    me.id,
                    assert.format(
                        assert.messages.match.default,
                        'me.id',
                        CONSTANTS.RX_MONGODB_ID
                    )
                );
                // Search for me in the users data source
                let user = this[this.VIEW_MODEL.USERS]
                    .data()
                    .find((item) => item.get('sid') === me.id);
                if (user instanceof User) {
                    // Update user picture (firstName and lastName are currently not editable)
                    // user.set('firstName', me.firstName);
                    // user.set('lastName', me.lastName);
                    user.set('picture', me.picture);
                } else {
                    // If not found, create a new user
                    user = new User({
                        // id: user.defaults.id, // Without default id, 'isNew' and 'sync' won't work
                        sid: me.id,
                        firstName: me.firstName,
                        lastName: me.lastName,
                        // lastSync: user.defaults.lastSync,
                        // lastUse: user.defaults.lastUse(),
                        // md5pin: user.defaults.md5pin,
                        picture: me.picture,
                        provider: localStorage.getItem('provider'), // Set in mobile.onSigninButtonClick // TODO Manage localStorage errors
                        // rootCategoryId: user.defaults.rootCategoryId()
                    });
                    this[this.VIEW_MODEL.USERS].add(user);
                }
                // Set default user
                this.set(this.VIEW_MODEL.USER._, user);
                // Remove provider from local storage
                localStorage.removeItem('provider'); // TODO: Manage localStorage errors
                // Note: At this stage user is not saved in database
                dfd.resolve(user);
            })
            .fail((xhr, status, errorThrown) => {
                dfd.reject(xhr, status, errorThrown);
                app.notification.error(__('notifications.userLoadFailure'));
                logger.error({
                    message: 'error loading user',
                    method: 'loadUser',
                    error: xhr2error(xhr, status, errorThrown),
                });
            });
        return dfd.promise();
    },

    /**
     * Load users
     * @returns {*}
     */
    loadUsers() {
        const dfd = $.Deferred();
        if (this[this.VIEW_MODEL.USERS].total() > 0) {
            dfd.resolve();
        } else {
            try {
                this[this.VIEW_MODEL.USERS]
                    .query({ sort: { field: 'lastUse', dir: 'desc' } })
                    .then(dfd.resolve)
                    .catch((xhr, status, errorThrown) => {
                        dfd.reject(xhr, status, errorThrown);
                        app.notification.error(
                            __('notifications.usersQueryFailure')
                        );
                        logger.error({
                            message: 'error loading users',
                            method: 'loadUsers',
                            error: xhr2error(xhr, status, errorThrown),
                        });
                    });
            } catch (e) {
                // TODO Error here
                debugger;
            }
        }
        return dfd.promise();
    },

    /**
     * Synchronize users
     * @param showSuccessMessage (true by default)
     * @returns {*}
     */
    syncUsers(showSuccessMessage) {
        // Synchronize
        return this[this.VIEW_MODEL.USERS]
            .sync()
            .then(() => {
                if (showSuccessMessage !== false) {
                    // Yield some time for #settings dropdown boxes to close
                    setTimeout(() => {
                        app.notification.success(
                            __('notifications.userSaveSuccess')
                        );
                    }, 10);
                }
            })
            .catch((xhr, status, errorThrown) => {
                app.notification.error(__('notifications.userSaveFailure'));
                logger.error({
                    message: 'error syncing users',
                    method: 'syncUsers',
                    // Note: status and errorThrown are undefined because of deferred.reject(response) in _promise method
                    // at https://github.com/telerik/kendo-ui-core/blob/master/src/kendo.data.js#L3195
                    error: xhr2error(xhr, status, errorThrown),
                });
            });
    },

    /**
     * Check first user
     */
    isFirstUser$() {
        const user = this.get(this.VIEW_MODEL.USER._);
        const index = this[this.VIEW_MODEL.USERS].indexOf(user);
        return !user.isNew() && index === 0;
    },

    /**
     * Check last user
     * @returns {boolean}
     */
    isLastUser$() {
        const user = this.get(this.VIEW_MODEL.USER._);
        const userDataSource = this.get(this.VIEW_MODEL.USERS);
        assert.instanceof(
            UserDataSource,
            userDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'userDataSource',
                'UserDataSource'
            )
        );
        const index = userDataSource.indexOf(user);
        return !user.isNew() && index === userDataSource.total() - 1;
    },

    /**
     * Current user is set and new
     */
    isNewUser$() {
        const user = this.get(this.VIEW_MODEL.USER._);
        return (
            user instanceof User &&
            user.isNew() &&
            this[this.VIEW_MODEL.USERS].indexOf(user) > -1
        );
    },

    /**
     * Current user set (and saved)
     */
    isSavedUser$() {
        const user = this.get(this.VIEW_MODEL.USER._);
        // The following ensures thet #user button bindings are refreshed when pressing "Change PIN" following mobile.onUserChangePin
        this.get(this.VIEW_MODEL.USER.LAST_USE);
        return (
            user instanceof User &&
            !user.isNew() &&
            !user.dirty &&
            this[this.VIEW_MODEL.USERS].indexOf(user) > -1
        );
    },

    /**
     * Current user saved and synced in the last 30 days
     */
    isSyncedUser$() {
        const user = this.get(this.VIEW_MODEL.USER._);
        return (
            user instanceof User && // models.MobileUser
            !user.isNew() &&
            this[this.VIEW_MODEL.USERS].indexOf(user) > -1 &&
            Date.now() <= user.lastSync.getTime() + 30 * 24 * 60 * 60 * 1000
        );
    },

    /**
     * The users's root category id
     */
    rootCategoryId$() {
        let ret;
        const id = this.get(this.VIEW_MODEL.USER.ROOT_CATEGORY_ID);
        const categories = this[this.VIEW_MODEL.CATEGORIES];
        if (categories && $.isFunction(categories.get)) {
            ret = (categories.get(id) || {}).name;
        }
        return ret;
    },

    /**
     * Select the previous page from viewModel.version.stream.pages
     */
    previousUser() {
        const user = this.get(this.VIEW_MODEL.USER._);
        const userDataSource = this.get(this.VIEW_MODEL.USERS);
        assert.instanceof(
            UserDataSource,
            userDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'userDataSource',
                'UserDataSource'
            )
        );
        const index = userDataSource.indexOf(user);
        if ($.type(index) === CONSTANTS.NUMBER && index > 0) {
            this.set(this.VIEW_MODEL.USER._, userDataSource.at(index - 1));
        }
    },

    /**
     * Select the next page from viewModel.version.stream.pages
     */
    nextUser() {
        const user = this.get(this.VIEW_MODEL.USER._);
        const userDataSource = this.get(this.VIEW_MODEL.USERS);
        assert.instanceof(
            UserDataSource,
            userDataSource,
            assert.format(
                assert.messages.instanceof.default,
                'userDataSource',
                'UserDataSource'
            )
        );
        const index = userDataSource.indexOf(user);
        if (
            $.type(index) === CONSTANTS.NUMBER &&
            index < userDataSource.total() - 1
        ) {
            this.set(this.VIEW_MODEL.USER._, userDataSource.at(index + 1));
        }
    },

    /**
     * Event handler triggered when initializing the user view
     * @param e
     */
    onUserViewInit(e) {
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
        // Init pin textboxes if not already initialized
        // We have removed kendo.ui.MaskedTextBox because the experience was not great
        // especially because it always displays 4 password dots making the number of characters actually typed unclear
        e.view.element
            .off(
                `${CONSTANTS.FOCUS} ${CONSTANTS.INPUT} ${CONSTANTS.KEYDOWN} ${CONSTANTS.KEYPRESS}`,
                SELECTORS.PIN
            )
            .on(CONSTANTS.FOCUS, SELECTORS.PIN, (e) => {
                assert.instanceof(
                    $.Event,
                    e,
                    assert.format(
                        assert.messages.instanceof.default,
                        'e',
                        'jQuery.Event'
                    )
                );
                assert.ok(
                    $(e.target).is(SELECTORS.PIN),
                    '`e.target` should be a pin textbox'
                );
                // Empty the pin input on focus
                $(e.target).val(CONSTANTS.EMPTY);
            })
            .on(CONSTANTS.INPUT, SELECTORS.PIN, (e) => {
                assert.instanceof(
                    $.Event,
                    e,
                    assert.format(
                        assert.messages.instanceof.default,
                        'e',
                        'jQuery.Event'
                    )
                );
                assert.ok(
                    $(e.target).is(SELECTORS.PIN),
                    '`e.target` should be a pin textbox'
                );
                // Note: android does not trigger the keypress event, so we need the input event
                // Only keep the first 4 digits
                $(e.target).val(
                    $(e.target).val().replace(/\D+/g, '').substr(0, 4)
                );
            })
            .on(CONSTANTS.KEYDOWN, SELECTORS.PIN, (e) => {
                assert.instanceof(
                    $.Event,
                    e,
                    assert.format(
                        assert.messages.instanceof.default,
                        'e',
                        'jQuery.Event'
                    )
                );
                assert.ok(
                    $(e.target).is(SELECTORS.PIN),
                    '`e.target` should be a pin textbox'
                );
                if (e.which === 13) {
                    // This is a carriage return, so trigger the primary button
                    const $view = $(e.target).closest(
                        kendo.roleSelector('view')
                    );
                    const $button = $view.find(
                        `${kendo.roleSelector('button')}.km-primary:visible`
                    );
                    assert.equal(
                        1,
                        $button.length,
                        assert.format(
                            assert.messages.equal.default,
                            '$button.length',
                            '1'
                        )
                    );
                    const button = $button.data('kendoMobileButton');
                    assert.instanceof(
                        kendo.mobile.ui.Button,
                        button,
                        assert.format(
                            assert.messages.instanceof.default,
                            'button',
                            'kendo.mobile.ui.Button'
                        )
                    );
                    button.trigger(CONSTANTS.CLICK, { button: $button });
                }
            })
            .on(CONSTANTS.KEYPRESS, SELECTORS.PIN, (e) => {
                assert.instanceof(
                    $.Event,
                    e,
                    assert.format(
                        assert.messages.instanceof.default,
                        'e',
                        'jQuery.Event'
                    )
                );
                assert.ok(
                    $(e.target).is(SELECTORS.PIN),
                    '`e.target` should be a pin textbox'
                );
                // Special characters including backspace, delete, end, home and arrows do not trigger the keypress event (they trigger keydown though)
                if (
                    e.which < 48 ||
                    e.which > 57 ||
                    $(e.target).val().length > 3
                ) {
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
        mobile.enableUserButtons(false);

        // Get user from viewModel
        const user = viewModel.get(this.VIEW_MODEL.USER._);
        assert.instanceof(
            models.MobileUser,
            user,
            assert.format(
                assert.messages.instanceof.default,
                'user',
                'models.MobileUser'
            )
        );
        const isNewUser = user.isNew();

        // Read pin values
        const $view = e.button.closest(kendo.roleSelector('view'));
        const pinElements = $view.find(SELECTORS.PIN);
        assert.equal(
            3,
            pinElements.length,
            assert.format(
                assert.messages.equal.default,
                'pinElements.length',
                '3'
            )
        );
        const pinValue = pinElements.eq(0).val();
        const newPinValue = pinElements.eq(1).val();
        const confirmValue = pinElements.eq(2).val();
        const isNew = user.isNew();
        if (
            (isNew &&
                RX_PIN.test(newPinValue) &&
                confirmValue === newPinValue) ||
            (!isNew &&
                RX_PIN.test(newPinValue) &&
                confirmValue === newPinValue &&
                user.verifyPin(pinValue))
        ) {
            // Update user with new pin
            user.addPin(newPinValue);
            viewModel.set(this.VIEW_MODEL.USER.LAST_USE, new Date());

            // Synchronize changes
            viewModel
                .syncUsers()
                .done(function () {
                    app.notification.success(
                        kendo.format(
                            i18n.culture.notifications.userSignInSuccess,
                            viewModel.user.fullName$()
                        )
                    );
                    if (isNewUser) {
                        mobile.application.navigate(
                            CONSTANTS.HASH + this.VIEW.SYNC
                        );
                    } else {
                        const language = i18n.locale();
                        assert.equal(
                            language,
                            viewModel.get(this.VIEW_MODEL.LANGUAGE),
                            assert.format(
                                assert.messages.equal.default,
                                'viewModel.get("language")',
                                language
                            )
                        );
                        mobile.application.navigate(
                            `${
                                CONSTANTS.HASH + this.VIEW.CATEGORIES
                            }?language=${encodeURIComponent(language)}`
                        );
                    }
                })
                .always(function () {
                    mobile.enableUserButtons(true);
                    if (mobile.support.ga && isNew) {
                        mobile.ga.trackEvent(
                            ANALYTICS.CATEGORY.USER,
                            ANALYTICS.ACTION.SAVE,
                            viewModel.get(this.VIEW_MODEL.USER.PROVIDER)
                        );
                    }
                });
        } else if (
            !isNew &&
            RX_PIN.test(newPinValue) &&
            confirmValue === newPinValue &&
            !user.verifyPin(pinValue)
        ) {
            app.notification.warning(
                i18n.culture.notifications.pinValidationFailure
            );
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
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
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
        mobile.enableUserButtons(false);

        // Check the correct pin
        const view = e.button.closest(kendo.roleSelector('view'));
        const pinElement = view.find(`${SELECTORS.PIN}:visible`);
        assert.equal(
            1,
            pinElement.length,
            assert.format(
                assert.messages.equal.default,
                'pinElement.length',
                '1'
            )
        );
        const pinValue = pinElement.val();

        if (viewModel.user.verifyPin(pinValue)) {
            // Note: the following changes the value of viewModel.isSavedUser$, which changes UI layout
            viewModel.set(this.VIEW_MODEL.USER.LAST_USE, new Date());
            viewModel
                .syncUsers(false)
                .done(function () {
                    app.notification.success(
                        kendo.format(
                            i18n.culture.notifications.userSignInSuccess,
                            viewModel.user.fullName$()
                        )
                    );
                    mobile.application.navigate(
                        `${CONSTANTS.HASH}${
                            this.VIEW.CATEGORIES
                        }?language=${encodeURIComponent(i18n.locale())}`
                    );
                    // Request an app store review
                    mobile._requestAppStoreReview();
                })
                .always(() => {
                    mobile.enableUserButtons(true);
                    /* TODO analytics
                if (mobile.support.ga) {
                    mobile.ga.trackEvent(
                        ANALYTICS.CATEGORY.USER,
                        ANALYTICS.ACTION.SIGNIN,
                        viewModel.get(this.VIEW_MODEL.USER.PROVIDER)
                    );
                }
                */
                });
        } else {
            app.notification.warning(
                i18n.culture.notifications.pinValidationFailure
            );
            mobile.enableUserButtons(true);
        }
    },

    /**
     * Event handler triggered when clicking the new user button of the user view
     * @param e
     */
    onUserNewClick(e) {
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
        app.controller.application.navigate(
            `${CONSTANTS.HASH}${this.VIEW.SIGNIN}?page=${encodeURIComponent(
                SIGNIN_PAGE
            )}`
        );
    },

    /**
     * Event handler triggered when clicking the change pin button of the user view
     * @param e
     */
    onUserChangePin(e) {
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
        // Simply change a property to show the Save button considering declarative bindings based on viewModel.isSavedUser$()
        app.viewModel.set(this.VIEW_MODEL.USER.LAST_USE, new Date());
    },

    /**
     * Enable/disable user buttons and pin inputs (to prevent double-clicks)
     * @param enable
     */
    enableUserButtons(enable) {
        $(CONSTANTS.HASH + this.VIEW.USER)
            .find(`li:has(${SELECTORS.PIN})`)
            .css('visibility', enable ? '' : 'hidden');
        $(CONSTANTS.HASH + this.VIEW.USER)
            .children(roleSelector('content'))
            .find(roleSelector('button'))
            .each(() => {
                const $button = $(this);
                const button = $button.data('kendoMobileButton');
                if (button instanceof Button) {
                    button.enable(enable);
                }
            });
    },
};

/**
 * Default export
 */
export default feature;

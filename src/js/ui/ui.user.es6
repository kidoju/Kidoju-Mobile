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
import 'kendo.mobile.listview';
import 'kendo.touch';
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import { sessionCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import Logger from '../common/window.logger.es6';
import {
    Me as User,
    MeDataSource as UserDataSource,
} from '../data/data.me.es6';
import { xhr2error } from '../data/data.util.es6';

const {
    format,
    keys,
    mobile: {
        ui: { Button, View },
    },
    roleSelector,
} = window.kendo;
const logger = new Logger('ui.user');
const RX_PIN = /^[\d]{4}$/;

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
        USER: {
            _: 'user',
            PIN: '.pin',
        },
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
            MD5_PIN: 'user.md5pin',
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
        app.viewModel.resetUsers();
    },

    /**
     * Reset users
     */
    resetUsers() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        viewModel.set(VIEW_MODEL.USER._, new User());
        viewModel[VIEW_MODEL.USERS] = new UserDataSource();
    },

    /**
     * Load
     */
    load() {
        // Load mobile users from localForage
        return this.loadUsers().then(() => {
            // Set user to most recent user
            if (this[this.VIEW_MODEL.USERS].total() > 0) {
                // because the change event is bound,
                // the following will call the reset function above
                debugger;
                // TODO Find me!!!!!!!
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
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        // Search me in viewModel.users or create new viewModel.user and add it to viewModel.users
        // TODO sessionCache.removeItem(CONSTANTS.ME);
        viewModel
            .get(VIEW_MODEL.USER._)
            .load()
            .then(dfd.resolve)
            .catch((xhr, status, errorThrown) => {
                dfd.reject(xhr, status, errorThrown);
                app.notification.error(
                    __('mobile.notifications.userLoadFailure')
                );
                logger.error({
                    message: 'error loading user',
                    method: 'loadUser',
                    error: xhr2error(xhr, status, errorThrown),
                });
            });
        /*
        app.cache
            .getMe()
            .then((me) => {
                debugger;
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
                        provider: localStorage.getItem('provider'), // Set in app.viewModel.onSigninButtonClick // TODO Manage localStorage errors
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
            .catch((xhr, status, errorThrown) => {
                dfd.reject(xhr, status, errorThrown);
                app.notification.error(__('mobile.notifications.userLoadFailure'));
                logger.error({
                    message: 'error loading user',
                    method: 'loadUser',
                    error: xhr2error(xhr, status, errorThrown),
                });
            });
        */
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
                            __('mobile.notifications.usersQueryFailure')
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
                            __('mobile.notifications.userSaveSuccess')
                        );
                    }, 10);
                }
            })
            .catch((xhr, status, errorThrown) => {
                app.notification.error(
                    __('mobile.notifications.userSaveFailure')
                );
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
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const user = viewModel.get(VIEW_MODEL.USER._);
        const users = viewModel.get(VIEW_MODEL.USERS);
        const index = users.indexOf(user);
        return !user.isNew() && index === 0;
    },

    /**
     * Check last user
     * @returns {boolean}
     */
    isLastUser$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const user = viewModel.get(VIEW_MODEL.USER._);
        const users = viewModel.get(VIEW_MODEL.USERS);
        const index = users.indexOf(user);
        return !user.isNew() && index === users.total() - 1;
    },

    /**
     * Current user is set and new
     */
    isNewUser$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const user = viewModel.get(VIEW_MODEL.USER._);
        const md5pin = viewModel.get(VIEW_MODEL.USER.MD5_PIN);
        const users = viewModel[VIEW_MODEL.USERS];
        return (
            user instanceof User &&
            // user.isNew() &&
            $.type(md5pin) !== CONSTANTS.STRING &&
            users.indexOf(user) > -1
        );
    },

    /**
     * Current user set (and saved)
     */
    isSavedUser$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const user = viewModel.get(VIEW_MODEL.USER._);
        const md5pin = viewModel.get(VIEW_MODEL.USER.MD5_PIN);
        const users = viewModel[VIEW_MODEL.USERS];
        // The following ensures that #user button bindings are refreshed
        // when pressing "Change PIN" following app.viewModel.onUserChangePin
        viewModel.get(VIEW_MODEL.USER.LAST_USE);
        return (
            user instanceof User &&
            // !user.isNew() &&
            $.type(md5pin) === CONSTANTS.STRING &&
            !user.dirty &&
            users.indexOf(user) > -1
        );
    },

    /**
     * Current user saved and synced in the last 30 days
     */
    isSyncedUser$() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const user = viewModel.get(VIEW_MODEL.USER._);
        const lastSync = viewModel.get(VIEW_MODEL.USER.LAST_SYNC);
        const md5pin = viewModel.get(VIEW_MODEL.USER.MD5_PIN);
        const users = viewModel[VIEW_MODEL.USERS];
        return (
            user instanceof User &&
            // !user.isNew() &&
            $.type(md5pin) === CONSTANTS.STRING &&
            users.indexOf(user) > -1 &&
            Date.now() <= lastSync.getTime() + 30 * 24 * 60 * 60 * 1000
        );
    },

    /**
     * The users's root category id
     */
    rootCategoryId$() {
        let ret;
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const id = viewModel.get(VIEW_MODEL.USER.ROOT_CATEGORY_ID);
        const categories = viewModel[VIEW_MODEL.CATEGORIES];
        if (categories && $.isFunction(categories.get)) {
            ret = (categories.get(id) || {}).name;
        }
        return ret;
    },

    /**
     * Select the previous user in viewModel.users
     */
    previousUser() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const user = viewModel.get(VIEW_MODEL.USER._);
        const users = viewModel[VIEW_MODEL.USERS];
        const index = users.indexOf(user);
        if ($.type(index) === CONSTANTS.NUMBER && index > 0) {
            viewModel.set(VIEW_MODEL.USER._, users.at(index - 1));
        }
    },

    /**
     * Select the next user in viewModel.users
     */
    nextUser() {
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        const user = viewModel.get(VIEW_MODEL.USER._);
        const users = viewModel[VIEW_MODEL.USERS];
        const index = users.indexOf(user);
        if ($.type(index) === CONSTANTS.NUMBER && index < users.total() - 1) {
            viewModel.set(VIEW_MODEL.USER._, users.at(index + 1));
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
        const {
            viewModel: { VIEW },
        } = app;
        // Init pin textboxes if not already initialized
        // We have removed kendo.ui.MaskedTextBox because the experience was not great
        // especially because it always displays 4 password dots making the number of characters actually typed unclear
        e.view.element
            .off(
                `${CONSTANTS.FOCUS} ${CONSTANTS.INPUT} ${CONSTANTS.KEYDOWN} ${CONSTANTS.KEYPRESS}`,
                VIEW.USER.PIN
            )
            .on(CONSTANTS.FOCUS, VIEW.USER.PIN, (evt) => {
                assert.instanceof(
                    $.Event,
                    evt,
                    assert.format(
                        assert.messages.instanceof.default,
                        'e',
                        'jQuery.Event'
                    )
                );
                assert.ok(
                    $(evt.target).is(VIEW.USER.PIN),
                    '`e.target` should be a pin textbox'
                );
                // Empty the pin input on focus
                $(evt.target).val(CONSTANTS.EMPTY);
            })
            .on(CONSTANTS.INPUT, VIEW.USER.PIN, (evt) => {
                assert.instanceof(
                    $.Event,
                    evt,
                    assert.format(
                        assert.messages.instanceof.default,
                        'e',
                        'jQuery.Event'
                    )
                );
                assert.ok(
                    $(evt.target).is(VIEW.USER.PIN),
                    '`e.target` should be a pin textbox'
                );
                // Note: android does not trigger the keypress event, so we need the input event
                // Only keep the first 4 digits
                $(evt.target).val(
                    $(evt.target).val().replace(/\D+/g, '').substr(0, 4)
                );
            })
            .on(CONSTANTS.KEYDOWN, VIEW.USER.PIN, (evt) => {
                assert.instanceof(
                    $.Event,
                    evt,
                    assert.format(
                        assert.messages.instanceof.default,
                        'e',
                        'jQuery.Event'
                    )
                );
                assert.ok(
                    $(evt.target).is(VIEW.USER.PIN),
                    '`e.target` should be a pin textbox'
                );
                if (evt.which === keys.ENTER) {
                    // This is a carriage return, so trigger the primary button
                    const $view = $(evt.target).closest(roleSelector('view'));
                    const $button = $view.find(
                        `${roleSelector('button')}.km-primary:visible`
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
                        Button,
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
            .on(CONSTANTS.KEYPRESS, VIEW.USER.PIN, (evt) => {
                assert.instanceof(
                    $.Event,
                    evt,
                    assert.format(
                        assert.messages.instanceof.default,
                        'e',
                        'jQuery.Event'
                    )
                );
                assert.ok(
                    $(evt.target).is(VIEW.USER.PIN),
                    '`e.target` should be a pin textbox'
                );
                // Special characters including backspace, delete, end, home and arrows do not trigger the keypress event (they trigger keydown though)
                if (
                    evt.which < 48 || // 0
                    evt.which > 57 || // 9
                    $(evt.target).val().length > 3
                ) {
                    evt.preventDefault();
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
        const {
            notification,
            viewModel,
            viewModel: { VIEW },
        } = app;
        viewModel.onGenericViewShow(e);
        // Display a notification
        if (viewModel.isSavedUser$()) {
            notification.info(__('mobile.notifications.pinValidationInfo'));
        } else {
            notification.info(__('mobile.notifications.pinSaveInfo'));
        }
        // Focus on PIN
        viewModel.enableUserButtons(true);
        e.view.element.find(VIEW.USER.PIN).val(CONSTANTS.EMPTY).first().focus();
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
        const {
            // i18n,
            notification,
            viewModel,
            viewModel: { VIEW, VIEW_MODEL },
        } = app;

        // Disable buttons to avoid double clicks
        viewModel.enableUserButtons(false);

        // Get user from viewModel
        const user = viewModel.get(VIEW_MODEL.USER._);
        assert.instanceof(
            User,
            user,
            assert.format(assert.messages.instanceof.default, 'user', 'User')
        );
        // const isNewUser = user.isNewUser();
        const md5pin = viewModel.get(VIEW_MODEL.USER.MD5_PIN);
        const isNewUser = $.type(md5pin) !== CONSTANTS.STRING;

        // Read pin values
        const $view = e.button.closest(roleSelector('view'));
        const pinElements = $view.find(VIEW.USER.PIN);
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
        if (
            (isNewUser &&
                RX_PIN.test(newPinValue) &&
                confirmValue === newPinValue) ||
            (!isNewUser &&
                RX_PIN.test(newPinValue) &&
                confirmValue === newPinValue &&
                user.verifyPin(pinValue))
        ) {
            // Update user with new pin
            user.addPin(newPinValue);
            viewModel.set(VIEW_MODEL.USER.LAST_USE, new Date());

            // Synchronize changes
            viewModel
                .syncUsers()
                .then(() => {
                    notification.success(
                        format(
                            __('mobile.notifications.userSignInSuccess'),
                            viewModel.user.fullName$()
                        )
                    );
                    if (isNewUser) {
                        debugger;
                        app.viewModel.application.navigate(
                            `${CONSTANTS.HASH}${VIEW.SYNC._}`
                        );
                    } else {
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
                        app.viewModel.application.navigate(
                            `${CONSTANTS.HASH}${
                                VIEW.CATEGORIES
                            }?language=${encodeURIComponent(language)}`
                        );
                    }
                })
                .always(() => {
                    app.viewModel.enableUserButtons(true);
                    /*
                    if (mobile.support.ga && isNewUser) {
                        mobile.ga.trackEvent(
                            ANALYTICS.CATEGORY.USER,
                            ANALYTICS.ACTION.SAVE,
                            viewModel.get(this.VIEW_MODEL.USER.PROVIDER)
                        );
                    }
                     */
                });
        } else if (
            !isNewUser &&
            RX_PIN.test(newPinValue) &&
            confirmValue === newPinValue &&
            !user.verifyPin(pinValue)
        ) {
            app.notification.warning(
                __('mobile.notifications.pinValidationFailure')
            );
            app.viewModel.enableUserButtons(true);
        } else {
            app.notification.warning(__('mobile.notifications.pinSaveFailure'));
            app.viewModel.enableUserButtons(true);
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
        const {
            notification,
            viewModel,
            viewModel: { VIEW, VIEW_MODEL },
        } = app;

        // Disable buttons to avoid double clicks
        viewModel.enableUserButtons(false);

        // Check the correct pin
        const view = e.button.closest(roleSelector('view'));
        const pinElement = view.find(`${VIEW.USER.PIN}:visible`);
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
            viewModel.set(VIEW_MODEL.USER.LAST_USE, new Date());
            viewModel
                .syncUsers(false)
                .then(() => {
                    debugger;
                    notification.success(
                        format(
                            __('mobile.notifications.userSignInSuccess'),
                            viewModel.user.fullName$()
                        )
                    );
                    viewModel.application.navigate(
                        `${CONSTANTS.HASH}${
                            VIEW.CATEGORIES._
                        }?language=${encodeURIComponent(__.locale)}`
                    );
                    // Request an app store review
                    // TODO viewModel._requestAppStoreReview();
                })
                .always(() => {
                    viewModel.enableUserButtons(true);
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
                __('mobile.notifications.pinValidationFailure')
            );
            viewModel.enableUserButtons(true);
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
        const {
            viewModel,
            viewModel: { VIEW },
        } = app;
        viewModel.application.navigate(
            `${CONSTANTS.HASH}${VIEW.SIGNIN._}?page=${encodeURIComponent(
                VIEW.SIGNIN.LAST_PAGE
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
        const {
            viewModel,
            viewModel: { VIEW_MODEL },
        } = app;
        // Simply change a property to show the Save button
        // considering declarative bindings based on viewModel.isSavedUser$()
        viewModel.set(VIEW_MODEL.USER.LAST_USE, new Date());
    },

    /**
     * Enable/disable user buttons and pin inputs (to prevent double-clicks)
     * @param enable
     */
    enableUserButtons(enable) {
        const {
            viewModel: { VIEW },
        } = app;
        $(`${CONSTANTS.HASH}${VIEW.USER._}`)
            .find(`li:has(${VIEW.USER.PIN})`)
            .css('visibility', enable ? '' : 'hidden');
        $(`${CONSTANTS.HASH}${VIEW.USER._}`)
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

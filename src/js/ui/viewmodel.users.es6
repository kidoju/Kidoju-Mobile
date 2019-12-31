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
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { User, UserDataSource } from '../data/data.user.es6';
import { xhr2error } from '../data/data.util.es6';
import { VIEW_MODEL } from './ui.constants.es6';

const { localStorage } = window;
const logger = new Logger('viewmodel.users');

/**
 * Extension
 */
const extension = {
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
        this.set(VIEW_MODEL.USER.$, new User()); // new models.MobileUser(),
        this[VIEW_MODEL.USERS] = new UserDataSource(); // new models.MobileUserDataSource(),
    },

    /**
     * Load
     */
    load() {
        // Load mobile users from localForage
        return this.loadUsers().then(() => {
            // Set user to most recent user
            if (this[VIEW_MODEL.USERS].total() > 0) {
                // because of the change event is bound, the following will call the reset function above
                this.set(VIEW_MODEL.USER.$, this[VIEW_MODEL.USERS].at(0));
            }
        });
    },

    /**
     * Load me from remote server
     * @returns {*}
     */
    loadUser() {
        const dfd = $.Deferred();
        debugger;
        // Search me in viewModel.users or create new viewModel.user and add it to viewModel.users
        app.cache.removeMe();
        app.cache
            .getMe()
            .done(me => {
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
                let user = this[VIEW_MODEL.USERS].data().find(item => {
                    return item.get('sid') === me.id;
                });
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
                        provider: localStorage.getItem('provider') // Set in mobile.onSigninButtonClick // TODO Manage localStorage errors
                        // rootCategoryId: user.defaults.rootCategoryId()
                    });
                    this[VIEW_MODEL.USERS].add(user);
                }
                // Set default user
                this.set(VIEW_MODEL.USER.$, user);
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
                    error: xhr2error(xhr, status, errorThrown)
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
        if (this[VIEW_MODEL.USERS].total() > 0) {
            dfd.resolve();
        } else {
            this[VIEW_MODEL.USERS]
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
                        error: xhr2error(xhr, status, errorThrown)
                    });
                });
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
        return this[VIEW_MODEL.USERS]
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
                    error: xhr2error(xhr, status, errorThrown)
                });
            });
    },

    /**
     * Check first user
     */
    isFirstUser$() {
        const user = this.get(VIEW_MODEL.USER.$);
        const index = this[VIEW_MODEL.USERS].indexOf(user);
        return !user.isNew() && index === 0;
    },

    /**
     * Check last user
     * @returns {boolean}
     */
    isLastUser$() {
        const user = this.get(VIEW_MODEL.USER.$);
        const userDataSource = this.get(VIEW_MODEL.USERS);
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
        const user = this.get(VIEW_MODEL.USER.$);
        return (
            user instanceof User &&
            user.isNew() &&
            this[VIEW_MODEL.USERS].indexOf(user) > -1
        );
    },

    /**
     * Current user set (and saved)
     */
    isSavedUser$() {
        const user = this.get(VIEW_MODEL.USER.$);
        // The following ensures thet #user button bindings are refreshed when pressing "Change PIN" following mobile.onUserChangePin
        this.get(VIEW_MODEL.USER.LAST_USE);
        return (
            user instanceof User &&
            !user.isNew() &&
            !user.dirty &&
            this[VIEW_MODEL.USERS].indexOf(user) > -1
        );
    },

    /**
     * Current user saved and synced in the last 30 days
     */
    isSyncedUser$() {
        const user = this.get(VIEW_MODEL.USER.$);
        return (
            user instanceof User && // models.MobileUser
            !user.isNew() &&
            this[VIEW_MODEL.USERS].indexOf(user) > -1 &&
            Date.now() <= user.lastSync.getTime() + 30 * 24 * 60 * 60 * 1000
        );
    },

    /**
     * The users's root category id
     */
    rootCategoryId$() {
        let ret;
        const id = this.get(VIEW_MODEL.USER.ROOT_CATEGORY_ID);
        const categories = this[VIEW_MODEL.CATEGORIES];
        if (categories && $.isFunction(categories.get)) {
            ret = (categories.get(id) || {}).name;
        }
        return ret;
    },

    /**
     * Select the previous page from viewModel.version.stream.pages
     */
    previousUser() {
        const user = this.get(VIEW_MODEL.USER.$);
        const userDataSource = this.get(VIEW_MODEL.USERS);
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
            this.set(VIEW_MODEL.USER.$, userDataSource.at(index - 1));
        }
    },

    /**
     * Select the next page from viewModel.version.stream.pages
     */
    nextUser() {
        const user = this.get(VIEW_MODEL.USER.$);
        const userDataSource = this.get(VIEW_MODEL.USERS);
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
            this.set(VIEW_MODEL.USER.$, userDataSource.at(index + 1));
        }
    }
};

/**
 * Default export
 */
export default extension;

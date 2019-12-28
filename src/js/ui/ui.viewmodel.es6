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
import 'kendo.binder';
// import config from './app.config.es6';
// import __ from './app.i18n.es6';
// import notification from './app.notification.es6';
// import Settings from './app.settings.es6';
// import themer from './app.themer.es6';
// import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
// import { LazyCategoryHierarchicalDataSource } from '../data/data.category.lazy.es6';
// import Me from '../data/data.me.es6';
import User from '../data/data.user.es6';
// import Search from '../data/data.search.es6';
// import { xhr2error } from '../data/data.util.es6';
import { VIEW_MODEL } from './ui.constants.es6';

const logger = new Logger('ui.viewmodel');
const { format, observable } = window.kendo;

/**
 * viewModel
 */
const viewModel = observable({
    /**
     * Reset
     */
    reset() {
        this.set(VIEW_MODEL.CATEGORIES, []);
        this.set(VIEW_MODEL.USER.$, {});
    },

    /**
     * Load
     */
    load() {
        this.reset();
        return $.Deferred()
            .resolve()
            .promise();
    },

    /**
     * Current user set (and saved)
     */
    isSavedUser$() {
        const user = this.get(VIEW_MODEL.USER.$);
        // The following ensures thet #user button bindings are refreshed when pressing "Change PIN" following mobile.onUserChangePin
        this.get(VIEW_MODEL.USER.LAST_USE);
        return (
            user instanceof User && // models.MobileUser
            !user.isNew() &&
            !user.dirty &&
            this[VIEW_MODEL.USERS].indexOf(user) > -1
        );
    },

    /**
     * Current user saved and synced in the last 30 days
     */
    isSyncedUser$() {
        const user = viewModel.get(VIEW_MODEL.USER.$);
        return (
            user instanceof User && // models.MobileUser
            !user.isNew() &&
            viewModel.users.indexOf(user) > -1 &&
            Date.now() <= user.lastSync.getTime() + 30 * 24 * 60 * 60 * 1000
        );
    }
});

/**
 * Default export
 */
export default viewModel;

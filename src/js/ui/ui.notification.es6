/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.view';
import notification from '../app/app.notification.es6';
import assert from '../common/window.assert.es6';
import app from '../common/window.global.es6';

const {
    mobile: {
        ui: { View },
    },
} = window.kendo;

// Assign notification to app
app.notification = notification;

/**
 * Feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'notification',

    /**
     * Reset notifications
     * Note: calls resizer below after adding feature to viewModel
     */
    resetNotifications() {
        // Erase pending notifications
        app.notification.getNotifications().each((idx, el) => {
            $(el).parent().remove();
        });
    },

    /**
     * Resize notifications
     */
    resize(e, view) {
        assert.instanceof(
            View,
            view,
            assert.format(
                assert.messages.instanceof.default,
                'view',
                'kendo.mobile.ui.View'
            )
        );
        app.notification.options.position.top = view.header.outerHeight() + 1;
    },
};

/**
 * Default export
 */
export default feature;

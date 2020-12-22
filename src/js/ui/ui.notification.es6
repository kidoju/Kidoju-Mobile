/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.notification';
// import notification from '../app/app.notification.es6'; // TODO merge
import assert from '../common/window.assert.es6';
// import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
// import Logger from '../common/window.logger.es6';

const {
    template,
    ui: { Notification },
} = window.kendo;
// const logger = new Logger('ui.notification');

/**
 * Feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'notification',

    /**
     * Initialize notifications
     * Note: calls resizer below after adding feature to viewModel
     */
    initNotifications() {
        app.viewModel._resizers.notification();
    },

    /**
     * Resize
     * Note: the navbar is not available for positioning notifications
     * before kendo.mobile.Application is initialized
     */
    resize(/* e, view */) {
        const element = $('#notification');
        assert.hasLength(
            element,
            assert.format(assert.messages.hasLength.default, '#notification')
        );
        if (app.notification instanceof Notification) {
            // Do not leave pending notifications
            app.notification.getNotifications().each((idx, el) => {
                $(el).parent().remove();
            });
            // Destroy before re-creating
            app.notification.destroy();
        }
        const header = element.closest('.km-header');
        app.notification = element
            .kendoNotification({
                // button: true, // only works with built-in templates
                position: {
                    left: 0,
                    // bottom: 2 // to allow for border
                    top: header.length ? header.outerHeight() : 0,
                },
                stacking: 'down', // 'up',
                width: $(window).width(), // - 2 is for borders as box-sizing on .k-notification-wrap does not help
            })
            .data('kendoNotification');
        assert.instanceof(
            Notification,
            app.notification,
            assert.format(
                assert.messages.instanceof.default,
                'app.notification',
                'kendo.ui.Notification'
            )
        );
        // Modify default TEMPLATE (see kendo.notification.js) to wrap text properly
        // var TEMPLATE = '<div class="k-notification-wrap">' + '<span class="k-icon k-i-#=typeIcon#">#=typeIcon#</span>' + '#=content#' + '<span class="k-icon k-i-close">Hide</span>' + '</div>';
        const TEMPLATE = `<div class="k-notification-wrap"><span class="k-icon k-i-#=typeIcon#">#=typeIcon#</span><span class="k-text">#=content#</span><span class="k-icon k-i-close">Hide</span></div>`;
        app.notification._defaultCompiled = template(TEMPLATE);
        app.notification._safeCompiled = template(
            TEMPLATE.replace('#=content#', '#:content#')
        );
    },
};

/**
 * Default export
 */
export default feature;

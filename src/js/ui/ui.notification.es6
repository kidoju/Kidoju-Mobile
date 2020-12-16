/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO merge with app.notification,es6

/**
 * Feature
 */
const feature = {
    _name: 'notification',

    resize(e) {
        var notification = $('#notification');
        assert.hasLength(notification, assert.format(assert.messages.hasLength.default, '#notification'));
        if (app && app.notification instanceof kendo.ui.Notification) {
            // Do not leave pending notifications
            var notifications = app.notification.getNotifications();
            notifications.each(function () {
                $(this).parent().remove();
            });
            // Destroy before re-creating
            app.notification.destroy();
        }
        // Note: the navbar is not available for notifications occurring before kendo.mobile.Application is initialized
        var navbar = $('.km-navbar');
        app.notification = notification.kendoNotification({
            // button: true, // only works with built-in templates
            position: {
                left: 0,
                // bottom: 2 // to allow for border
                top: navbar.length ? navbar.outerHeight() : 0 // navbar or splashscreen
            },
            stacking: 'down', // 'up',
            width: $(window).width() - 2 // - 2 is for borders as box-sizing on .k-notification-wrap does not help
        }).data('kendoNotification');
        assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
        // Modify default TEMPLATE (see kendo.notification.js) to wrap text properly
        // var TEMPLATE = '<div class="k-notification-wrap">' + '<span class="k-icon k-i-#=typeIcon#">#=typeIcon#</span>' + '#=content#' + '<span class="k-icon k-i-close">Hide</span>' + '</div>';
        var TEMPLATE = '<div class="k-notification-wrap">' + '<span class="k-icon k-i-#=typeIcon#">#=typeIcon#</span><span class="k-text">' + '#=content#' + '</span><span class="k-icon k-i-close">Hide</span>' + '</div>';
        app.notification._defaultCompiled = kendo.template(TEMPLATE);
        app.notification._safeCompiled = kendo.template(TEMPLATE.replace('#=content#', '#:content#'));
    }
};

/**
 * Default export
 */
export default feature;

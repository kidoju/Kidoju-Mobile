/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO Like network, we might want an observable object to trigger our events

// Note: requires cordova-plugin-network-information
// so network events are only available after deviceready event

/**
 * Network plugin
 */
const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return true;
    },

    /**
     * Init events
     */
    initEvents() {
        // The online event is triggered when swithcing from wifi to cell networks
        // although the connection never really went offline, so we need to keep track of the connection state
        let online = true;

        // online
        document.addEventListener(
            'online',
            () => {
                if (!online && mobile.application instanceof kendo.mobile.Application &&
                    mobile.application.pane instanceof kendo.mobile.ui.Pane) {
                    online = true;
                    app.notification.warning(i18n.culture.notifications.networkOnline);
                    var view = mobile.application.view();
                    if (view.id === HASH + VIEW.NETWORK) {
                        mobile.application.navigate(window.decodeURIComponent(view.params.url));
                    }
                }
            },
            false
        );

        // offline
        document.addEventListener(
            'offline',
            () => {
                online = false;
                if (mobile.application instanceof kendo.mobile.Application &&
                    mobile.application.pane instanceof kendo.mobile.ui.Pane) {
                    app.notification.warning(i18n.culture.notifications.networkOffline);
                    var view = mobile.application.view();
                    // Close opened action sheets
                    // view.element.find(kendo.roleSelector('actionsheet')).each(function (index, actionSheet) {
                    $(document).find(kendo.roleSelector('actionsheet')).each(function (index, actionSheet) {
                        var actionSheetWidget = $(actionSheet).data('kendoMobileActionSheet');
                        if (actionSheetWidget instanceof kendo.mobile.ui.ActionSheet) {
                            actionSheetWidget.close();
                        }
                    });
                    // Close opened drop down lists
                    view.element.find(kendo.roleSelector('dropdownlist')).each(function (index, dropDownList) {
                        var dropDownListWidget = $(dropDownList).data('kendoDropDownList');
                        if (dropDownListWidget instanceof kendo.ui.DropDownList) {
                            dropDownListWidget.close();
                        }
                    });
                    // Check network to redirect to #network view
                    var url = (view.id.substr(1) || VIEW.DEFAULT) + '?' + window.decodeURIComponent($.param(view.params));
                    mobile.checkNetwork({ preventDefault: $.noop, url: url });
                }
            },
            false
        );
    },

    /**
     * Check that the application is still online
     * and possibly redirect to the No-Network view
     * @param e
     */
    checkNetwork(e) {
        /*
        window.alert(
            'platform: ' + window.device.platform +
            '\nonLine: ' + window.navigator.onLine +
            '\ntype: ' + window.navigator.connection.type +
            // Note: there used to be window.navigator.network.isReachable function - @see https://www.neotericdesign.com/articles/2011/3/checking-the-online-status-with-phonegap-jquery
            // '\nreachable: ' + ($.isFunction(window.navigator.network.isReachable) ? window.navigator.network.isReachable() : 'N/A') +
            // '\neffective: ' + window.navigator.connection.effectiveType +
            '\nOffline test: ' + (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) || (window.device && window.device.platform === 'browser' && !window.navigator.onLine))
        );
        */

        // TODO Review when there is no user: the only page to restore in this case is the #signin page

        if (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) ||
            (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
            if (!RX_OFFLINE_PAGES.test(e.url)) { // Note: e.url might be ''
                e.preventDefault();
                var view = mobile.application.view();
                if (view.id !== HASH + VIEW.NETWORK) {
                    var url = window.encodeURIComponent((view.id.substr(1) || VIEW.DEFAULT) + '?' + window.decodeURIComponent($.param(view.params)));
                    mobile.application.navigate(HASH + VIEW.NETWORK + '?url=' + url);
                } else {
                    // No redirection if we are already on the #network view
                    var drawerWidget = $(kendo.roleSelector('drawer')).data('kendoMobileDrawer');
                    if (drawerWidget instanceof kendo.mobile.ui.Drawer) {
                        drawerWidget.hide();
                    }
                    mobile.application.hideLoading();
                }
                return false;
            }
        }
        return true;
    }
};

/**
 * Default export
 */
export default plugin;

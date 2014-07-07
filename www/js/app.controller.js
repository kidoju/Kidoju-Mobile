/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */

;(function (win, $, undefined) {

    'use strict';

    var kendo = win.kendo,
        app = win.app = win.app || {},
        FUNCTION = 'function',
        STRING = 'string',
        CHANGE = 'change',

        MODULE = 'app.controller.js: ',
        DEBUG = true;

    function log(message) {
        if(DEBUG && win.console && ($.type(win.console.log) === FUNCTION)){
            win.console.log(MODULE + message);
        }
    }

    app.model.bind(CHANGE, function(e) {
        log(e.field);
    });

    /**
     * The controller has all event handlers in the form: app.controller.eventHandler = function(e) {};
     * @type {{localize: localize}}
     */
    app.controller = {

        /**
         * Localize the application
         * TODO: load resources as per language
         */
        localize: function() {
            log('localizing ui...');

            //Main
            $('#main').attr('data-title', app.cultures.MAIN_VIEW_TITLE);

            //Search
            $('#search').attr('data-title', '\u00A0'); //Cannot hide title and keep navbar height + &nbsp; is escaped
            $('#search-input').attr('placeholder', app.cultures.SEARCH_INPUT_PLACEHOLDER);

            //Categories
            $('#categories').attr('data-title', app.cultures.CATEGORIES_VIEW_TITLE);

            //Activities
            $('#activities').attr('data-title', app.cultures.ACTIVITIES_VIEW_TITLE);

            //Settings
            $('#settings').attr('data-title', app.cultures.SETTINGS_VIEW_TITLE);
            $('label[for="settings-user"]').prepend(app.cultures.SETTINGS_USER_LABEL);
            $('label[for="settings-language"]').prepend(app.cultures.SETTINGS_LANGUAGE_LABEL);

            //Drawer
            $('#menu-drawer').attr('data-title', app.cultures.DRAWER_VIEW_TITLE);
            $('li#menu-drawer-main>a').html(app.cultures.MAIN_VIEW_TITLE);
            $('li#menu-drawer-search>a').html(app.cultures.SEARCH_VIEW_TITLE);
            $('li#menu-drawer-categories>a').html(app.cultures.CATEGORIES_VIEW_TITLE);
            $('li#menu-drawer-activities>a').html(app.cultures.ACTIVITIES_VIEW_TITLE);
            $('li#menu-drawer-settings>a').html(app.cultures.SETTINGS_VIEW_TITLE);
        },

        changeViewTitle: function(view, title) {
            if (!(view instanceof kendo.mobile.ui.View) || ($.type(title) !== STRING)) {
                throw new TypeError();
            }
            var navbar = view.header.find('.km-navbar').data('kendoMobileNavBar');
            if (navbar instanceof kendo.mobile.ui.NavBar) {
                navbar.title(title);
            }
        },

        switchNavBar: function(view) {
            if (!(view instanceof kendo.mobile.ui.View)) {
                throw new TypeError();
            }
            var navbar = view.header.find('.km-navbar').data('kendoMobileNavBar');
            if (navbar instanceof kendo.mobile.ui.NavBar) {
                if(view.id === '#search') {
                    navbar.element.find('#search-input').show();
                    //navbar.element.find('a[href="#search"]').hide(); //does not work when click it
                    navbar.element.find('a[data-icon="search"]').hide();
                } else {
                    navbar.element.find('#search-input').hide();
                    //navbar.element.find('a[href="#search"]').show();
                    navbar.element.find('a[data-icon="search"]').show();
                }
            }
        },

        /**
         * The onMainDataShow event handler is triggered when the main view is shown
         * @param e
         */
        onMainDataShow: function(e) {
            try {
                app.controller.switchNavBar(e.view);
            } catch(ex) {

            }
        },

        /**
         * The onSearchDataShow event handler is triggered when the search view is shown
         * @param e
         */
        onSearchDataShow: function(e) {
            try {
                app.controller.switchNavBar(e.view);
            } catch(ex) {

            }
        },

        /**
         * The onCategoriesDataShow event handler is triggered when the categories view is shown
         * @param e
         */
        onCategoriesDataShow: function(e) {
            try {
                app.controller.switchNavBar(e.view);
            } catch(ex) {

            }
        },

        /**
         * The onActivitiesDataShow event handler is triggered when the activities view is shown
         * @param e
         */
        onActivitiesDataShow: function(e) {
            try {
                app.controller.switchNavBar(e.view);
            } catch(ex) {

            }
        },

        /**
         * The onSettingsDataShow event handler is triggered when the settings view is shown
         * @param e
         */
        onSettingsDataShow: function(e) {
            try {
                app.controller.switchNavBar(e.view);
            } catch(ex) {

            }
        }
    };

}(this, jQuery));
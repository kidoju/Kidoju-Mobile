/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true */
/* jshint browser: true */

;(function(win, undefined) {

    'use strict';

    var app = win.app = win.app || {};

    app.culture = {
        LOCALE: 'en',
        LANGUAGES: [
            { code: 'en', language: 'English' },
            { code: 'fr', language: 'French' }
        ],

        //Layout


        //Drawer
        DRAWER_VIEW_TITLE: 'Menu',

        //MAIN (Home)
        MAIN_VIEW_TITLE: 'Home',

        //Search
        SEARCH_VIEW_TITLE: 'Search',
        SEARCH_INPUT_PLACEHOLDER: 'Search...',

        //Categories
        CATEGORIES_VIEW_TITLE: 'Categories',

        //Activities
        ACTIVITIES_VIEW_TITLE: 'Activities',

        //Settings
        SETTINGS_VIEW_TITLE: 'Settings',
        SETTINGS_USER_LABEL: 'User:',
        SETTINGS_LANGUAGE_LABEL: 'Language:',

        DUMMY: 'dummy'
    };

}(this));
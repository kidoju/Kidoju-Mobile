/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true */
/* jshint browser: true */

;(function() {

    'use strict';

    var fn = Function,
        global = fn('return this')(),
        app = global.app = global.app || {};

    app.cultures = {

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
        SETTINGS_LANGUAGE_LABEL: 'Language:'

    };

}());
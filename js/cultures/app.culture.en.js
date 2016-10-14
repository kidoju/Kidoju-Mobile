/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        '../vendor/kendo/cultures/kendo.culture.en-GB.js'
        // '../vendor/kendo/messages/kendo.messages.en-US.js',
        // '../messages/kidoju.messages.en.js'
    ], f);
})(function () {

    'use strict';

    (function () {
        var app = window.app = window.app || {};
        app.cultures = app.cultures || {};
        app.cultures.en = {
            versions: {
                draft: {
                    name: 'Draft'
                },
                published: {
                    name: 'Version {0}'
                }
            },
            // Activities view
            activities: {
                viewTitle: 'Activities'
            },
            // Categories view
            categories: {
                viewTitle: 'Explore'
            },
            // Drawer
            drawer: {
                activities: 'Activities',
                categories: 'Explore',
                favourites: 'Favourites',
                scan: 'QR Code',
                settings: 'Settings'
            },
            // Favourites view
            favourites: {
                viewTitle: 'Favourites'
            },
            // Player view
            player: {
                explanations: 'Explanations',
                instructions: 'Instructions',
                viewTitle: 'Page {0} of {1}'
            },
            // Settings view
            settings: {
                viewTitle: 'Settings',
                user: 'User',
                version: 'Version',
                language: 'Language',
                theme: 'Theme'
            },
            // Summaries view
            summaries: {
                viewTitle: 'Search',
                actionSheet: {
                    cancel: 'Cancel',
                    play: 'Play',
                    share: 'Share'
                }
            },
            // viewModel
            viewModel: {
                languages: [
                    { value: 'en', text: 'English' },
                    { value: 'fr', text: 'French' }
                ],
                themes: [
                    { value: 'fiori', text: 'Fiori' },
                    { value: 'flat', text: 'Flat' },
                    { value: 'material', text: 'Material' }, // TODO light and Dark themes?
                    // { value: '', text: 'Native' }, // TODO in the future but which theme for web widgets and kidoju widgets?
                    { value: 'nova', text: 'Nova' },
                    { value: 'office365', text: 'Office 365' }
                ]
            }
        };
        window.kendo.culture('en-GB');
    }());

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

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
                    { text: 'Android Dark', name: 'android.dark', platform: 'android' },
                    { text: 'Android Light', name: 'android.light', platform: 'android' },
                    { text: 'Blackberry', name: 'blackberry', platform: 'blackberry' },
                    { text: 'Fiori', name: 'fiori', skin: 'fiori' },
                    { text: 'Flat', name: 'flat', skin: 'flat' },
                    { text: 'iOS 6', name: 'ios', platform: 'ios', majorVersion: 6 },
                    { text: 'iOS 7+', name: 'ios7', platform: 'ios', majorVersion: 7 },
                    { text: 'Material', name: 'material', skin: 'material' },
                    { text: 'Nova', name: 'nova', skin: 'nova' },
                    { text: 'Office 365', name: 'office365', skin: 'office365' },
                    { text: 'Windows Phone', name: 'wp8', platform: 'wp' }
                ]
            }
        };
        window.kendo.culture('en-GB');
    }());

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

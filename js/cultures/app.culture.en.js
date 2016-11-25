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
            notification: {
                error: 'Error',
                info: 'Information',
                ok: 'OK',
                success: 'Success',
                warning: 'Warning'
            },
            /*
            secureStorage: {
                success: 'With screen lock enabled, you benefit from confidential data encryption.',
                warning: 'Screen lock is disabled. Sorry, but our app cannot store confidential data without it.'
            },
            */
            versions: {
                draft: {
                    name: 'Draft'
                },
                published: {
                    name: 'Version {0}'
                }
            },
            // Main layout
            layout: {
                back: 'Back'
            },
            // Activities view
            activities: {
                viewTitle: 'Activities',
                // Grid
                grid: {
                    columns: {
                        date: 'Date',
                        score: 'Score',
                        title: 'Title'
                    }
                }
            },
            // Categories view
            categories: {
                viewTitle: 'Explore'
            },
            // Correction view
            correction: {
                viewTitle: 'Page {0} of {1}',
                // Labels
                explanations: 'Explanations'
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
            // Finder view
            finder: {
                viewTitle: 'Search',
                actionSheet: {
                    cancel: 'Cancel',
                    play: 'Play',
                    share: 'Share'
                }
            },
            // Notification messages
            notifications: {
                networkOffline: 'You are disconnected from the Internet',
                settingsLoadFailure: 'There was an error loading settings.',
                signinUrlFailure: 'There has been an error obtaining a sign-in url.',
                summariesQueryFailure: 'There was an error querying our remote servers.',
                summaryLoadFailure: 'There was an error loading summary data.',
                userLoadFailure: 'There was an error loading user data.',
                userQueryFailure: 'There was an error loading the user list.',
                versionLoadFailure: 'There was an error loading version data.',
                versionsLoadFailure: 'There was an error loading versions.'
            },
            // Player view
            player: {
                viewTitle: 'Page {0} of {1}',
                // Labels
                instructions: 'Instructions'
            },
            // Progress view
            progress: {
                viewTitle: 'Synchronization'
            },
            // Score view
            score: {
                viewTitle: 'Score',
                // Grid
                grid: {
                    columns: {
                        description: 'Question',
                        page: 'Page',
                        result: 'Result'
                    }
                }
            },
            // Settings view
            settings: {
                viewTitle: 'Settings',
                // Labels
                user: 'User',
                version: 'Version',
                language: 'Language',
                theme: 'Theme',
                // Buttons
                switch: 'Switch User'
            },
            // Sign-in view
            signin: {
                viewTitle: 'Sign in',
                // Notification
                welcome: 'Please select an authentication provider.'
            },
            // Summary view
            summary: {
                viewTitle: 'Details',
                // Labels
                categories: 'Categories',
                description: 'Description',
                tags: 'Tags',
                title: 'Title',
                // Buttons
                go: 'Go'
            },
            // User view
            user: {
                viewTitle: 'User',
                // Labels
                firstName: 'First Name',
                lastName: 'Last Name',
                lastUse: 'Last Use',
                pin: 'PIN',
                confirm: 'Confirm',
                // Buttons
                save: 'Save',
                signIn: 'Sign In',
                newUser: 'New User'
            },
            // viewModel
            viewModel: {
                languages: [
                    { value: 'en', text: 'English' },
                    { value: 'fr', text: 'French' }
                ],
                themes: [
                    // We need andark and anlight because webpack does not cope with dash or dot
                    // TODO: check regular expressions in webpack.config.js
                    { text: 'Android Dark', name: 'andark', skin: 'android-dark' },
                    { text: 'Android Light', name: 'anlight', skin: 'android-light' },
                    { text: 'Blackberry', name: 'blackberry', skin: 'blackberry' },
                    { text: 'Fiori', name: 'fiori', skin: 'fiori' },
                    { text: 'Flat', name: 'flat', skin: 'flat' },
                    { text: 'iOS 6', name: 'ios', skin: 'ios' },
                    { text: 'iOS 7+', name: 'ios7', skin: 'ios7' },
                    { text: 'Material', name: 'material', skin: 'material' },
                    { text: 'Nova', name: 'nova', skin: 'nova' },
                    { text: 'Office 365', name: 'office365', skin: 'office365' },
                    { text: 'Windows Phone', name: 'wp', skin: 'wp' }
                ]
            }
        };
        window.kendo.culture('en-GB');
    }());

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        '../vendor/kendo/cultures/kendo.culture.en-GB.js',
        '../vendor/kendo/messages/kendo.messages.en-GB.js',
        '../messages/kendo.mobile.en.es6',
        '../messages/kidoju.messages.en.es6'
    ], f);
})(function () {

    'use strict';

    (function () {
        var app = window.app = window.app || {};
        app.cultures = app.cultures || {};
        app.cultures.en = {
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
                viewTitle: 'History',
                buttonGroup: {
                    chart: 'Chart',
                    list: 'List'
                },
                listView: {
                    groups: {
                        today: 'Today',
                        yesterday: 'Yesterday',
                        startOfWeek: 'This Week',
                        startOfMonth: 'This Month'
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
            // Dialogs and alerts
            dialogs: {
                buttons: {
                    cancel: {
                        text: 'Cancel',
                        icon: 'close'
                    },
                    ok: {
                        text: 'OK',
                        icon: 'ok'
                    }
                },
                confirm: 'Confirm',
                error: 'Error',
                info: 'Information',
                success: 'Success',
                warning: 'Warning'
            },
            appStoreReview: {
                title: 'Would you mind rating {0}?',
                message: 'If you enjoy {0}, it won’t take more than a minute to encourage our development effort. Thanks for your help!',
                buttons: {
                    cancel: {
                        text: 'Remind Me Later'
                    },
                    ok: {
                        text: 'Rate It Now'
                    }
                }
            },
            // Drawer
            drawer: {
                activities: 'History',
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
                viewTitle: 'Search'
            },
            // Network connection view
            network: {
                viewTitle: 'Connection',
                title: 'No Network'
                // message: ''
            },
            // Notification messages
            notifications: {
                activitiesQueryFailure: 'There was an error loading activities.',
                appVersionFailure: 'You are running an old version which might raise compatibility issues. Please upgrade.',
                batteryCritical: 'Battery level is critical. Recharge now!',
                batteryLow: 'Battery level is low. Recharge soon!',
                clickSubmitInfo: 'Press <i class="kf kf-submit"></i> to calculate your score.',
                confirmSubmit: 'Do you really want to submit to calculate your score?',
                dbMigrationFailure: 'The mobile database migration failed during the upgrade.',
                networkOffline: 'You are disconnected from the Internet',
                networkOnline: 'Your Internet connection is back.',
                oAuthTokenFailure: 'The authentication service has returned an error.',
                openUrlUnknown: 'There was an error opening an unknown url.',
                openUrlLanguage: 'Please switch language to open this url.',
                pageNavigationInfo: 'Press <i class="kf kf-previous"></i> and <i class="kf kf-next"></i> to navigate pages.',
                pinSaveFailure: 'The 4 digit pins do not match.',
                pinSaveInfo: 'Please enter and confirm your 4-digit pin before saving.',
                pinValidationFailure: 'Wrong pin.',
                pinValidationInfo: 'Please enter your pin to sign in.',
                scanFailure: 'Scan failure. Check the app is authorized to use the camera.',
                scanLanguageWarning: 'Change language settings to scan this QR code.',
                scanMatchWarning: 'This QR code does not match.',
                scanPrompt: 'Place a QR code inside the scan area.',
                scoreCalculationFailure: 'There was an error calculating your score.',
                scoreSaveFailure: 'There was an error saving your score.',
                scoreSaveSuccess: 'Score saved successfully.',
                settingsLoadFailure: 'There was an error loading settings.',
                sharingFailure: 'There was an error sharing this quiz.',
                sharingSuccess: 'This quiz has been successfully shared.',
                showScoreInfo: 'Press <i class="kf kf-score"></i> to go back to your score.',
                signinUrlFailure: 'There was an error obtaining a sign-in url for an authentication provider.',
                summariesQueryFailure: 'There was an error querying our remote servers.',
                summaryLoadFailure: 'There was an error loading summary data.',
                summaryViewInfo: 'Press the button at the bottom of the page.',
                syncBandwidthLow: 'You cannot synchronize with low bandwidth.',
                syncBatteryLow: 'You cannot synchronize with low batteries.',
                syncFailure: 'There has been an error syncing your data.',
                syncSuccess: 'Mobile data successfully synchronized with remote servers.',
                syncUnauthorized: 'You are unauthorised to synchronize. Please signin with an authentication provider.',
                unknownError: 'There has been an unknown error. Please restart the app.',
                userLoadFailure: 'There was an error loading your user profile.',
                userSaveFailure: 'There was an error saving your user profile.',
                userSaveSuccess: 'User profile successfully saved.',
                userSignInSuccess: 'Signed in as {0}.',
                usersQueryFailure: 'There was an error loading users.',
                versionLoadFailure: 'There was an error loading version data.',
                versionsLoadFailure: 'There was an error loading versions.'
            },
            osNotifications: {
                title: 'It’s been a while...',
                text: 'What about running {0} to assess your progress?'
            },
            // Player view
            player: {
                viewTitle: 'Page {0} of {1}',
                // Labels
                instructions: 'Instructions'
            },
            // Score view
            score: {
                viewTitle: 'Score {0:p0}',
                listView: {
                    groups: 'Page {0}',
                    answer: 'Answer',
                    solution: 'Solution'
                }
            },
            // Settings view
            settings: {
                viewTitle: 'Settings',
                // Labels
                category: 'Curriculum',
                language: 'Language',
                theme: 'Theme',
                user: 'User',
                version: 'Version',
                // Buttons
                switch: 'Switch user',
                tour: 'Take the tour',
                // Copyright
                copyright: 'Copyright &copy; 2013-2018 Memba&reg; Sarl'
            },
            // Sign-in view
            signin: {
                viewTitle: 'Walkthrough',
                viewTitle2: 'Sign in',
                // Onboarding
                page0: 'Browse and search assessments, practice tests and quizzes organized by subject categories.',
                page1: 'Play questions, give answers and let the app compute your score.',
                page2: 'Track and measure your progresses.',
                // Notification
                welcome: 'Please select an authentication provider. We shall never use it to post on your behalf.',
                welcome2: '{0}, please select the {1} authentication provider to renew your credentials or press <i class="kf kf-user"></i>.'
            },
            // Summary view
            summary: {
                viewTitle: 'Details',
                // Labels
                author: 'Author',
                category: 'Category',
                description: 'Description',
                metrics: '',
                published: 'Published on',
                tags: 'Tags',
                title: 'Title',
                // Buttons
                go: 'Go',
                // ActionSheet
                actionSheet: {
                    cancel: 'Cancel',
                    feedback: 'Feedback',
                    play: 'Play',
                    share: 'Share'
                },
                // Social Sharing
                socialSharing: {
                    chooserTitle: 'Select an application',
                    // message: 'Assess your knowledge on Kidoju.\n\nTitle:\t{0}\nLink:\t{1}\nDescription:\t{2}',
                    message: 'Assess your knowledge with Kidoju.\n\n{0}\n{1}',
                    subject: 'Answer \u201C{0}\u201D?'
                }
            },
            // Sync view
            sync: {
                viewTitle: 'Synchronization',
                title: 'Progress',
                message: {
                    activities: 'Syncing activities',
                    complete: 'Synchronization complete'
                },
                pass: {
                    remote: 'Remote',
                    local: 'Local'
                },
                buttons: {
                    continue: 'Continue'
                }
            },
            // User view
            user: {
                viewTitle: 'User',
                // Labels
                firstName: 'First Name',
                lastName: 'Last Name',
                lastUse: 'Last Use',
                pin: 'PIN',
                newPIN: 'New PIN',
                confirm: 'Confirm',
                // Buttons
                save: 'Save',
                signIn: 'Sign In',
                newUser: 'New User',
                changePIN: 'Change PIN'
            },
            // viewModel
            viewModel: {
                languages: [
                    { value: 'en', text: 'English' },
                    { value: 'fr', text: 'French' }
                ],
                themes: [
                    { value: 'android-dark', text: 'Android Dark' },
                    { value: 'android-light', text: 'Android Light' },
                    { value: 'blackberry', text: 'Blackberry' },
                    { value: 'fiori', text: 'Fiori' },
                    { value: 'flat', text: 'Flat' },
                    { value: 'ios', text: 'iOS 6' },
                    { value: 'ios7', text: 'iOS 7+' },
                    { value: 'material-dark', text: 'Material Dark' },
                    { value: 'material-light', text: 'Material Light' },
                    { value: 'meego', text: 'Meego' },
                    { value: 'nova', text: 'Nova' },
                    { value: 'office365', text: 'Office 365' }
                    // { value: 'wp-dark', text: 'Windows Dark' },
                    // { value: 'wp-light', text: 'Windows light' }
                ]
            }
        };
        window.kendo.culture('en-GB');
    }());

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

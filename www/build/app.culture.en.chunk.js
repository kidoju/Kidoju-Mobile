/*! Copyright ©2013-2016 Memba® Sarl. All rights reserved. - Version 0.2.74 dated 12/6/2016 */
webpackJsonp([1],{

/***/ 401:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
	 * Sources at https://github.com/Memba
	 */
	
	/* jshint browser: true */
	/* globals define: false */
	
	(function (f, define) {
	    'use strict';
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	        __webpack_require__(402)
	        // '../vendor/kendo/messages/kendo.messages.en-US.js',
	        // '../messages/kidoju.messages.en.js'
	    ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
	                    },
	                    noRecords: 'No activities'
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
	                activitiesQueryFailure: 'There was an error loading activities.',
	                networkOffline: 'You are disconnected from the Internet',
	                oAuthTokenFailure: 'The authentication service has returned an error.',
	                pinSaveFailure: 'The 4 digit pins do not match.',
	                pinSaveInfo: 'Please enter and confirm your 4-digit pin before saving.',
	                pinValidationFailure: 'Wrong pin.',
	                pinValidationInfo: 'Please enter your pin to sign in.',
	                scoreCalculationFailure: 'There was an error calculating your score.',
	                scoreSaveFailure: 'There was an error saving your score.',
	                scoreSaveSuccess: 'Score saved successfully.',
	                settingsLoadFailure: 'There was an error loading settings.',
	                signinUrlFailure: 'There was an error obtaining a sign-in url.',
	                summariesQueryFailure: 'There was an error querying our remote servers.',
	                summaryLoadFailure: 'There was an error loading summary data.',
	                userLoadFailure: 'There was an error loading your user profile.',
	                userSaveFailure: 'There was an error saving your user profile.',
	                userSaveSuccess: 'User profile successfully saved.',
	                userSignInSuccess: 'Signed in as {0}.',
	                usersQueryFailure: 'There was an error loading the users.',
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
	                viewTitle: 'Score {0:p0}',
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
	
	}, __webpack_require__(308));


/***/ },

/***/ 402:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/** 
	 * Kendo UI v2016.3.1118 (http://www.telerik.com/kendo-ui)                                                                                                                                              
	 * Copyright 2016 Telerik AD. All rights reserved.                                                                                                                                                      
	 *                                                                                                                                                                                                      
	 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
	 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
	 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	
	*/
	
	(function(f){
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(315)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        f();
	    }
	}(function(){
	(function( window, undefined ) {
	    kendo.cultures["en-GB"] = {
	        name: "en-GB",
	        numberFormat: {
	            pattern: ["-n"],
	            decimals: 2,
	            ",": ",",
	            ".": ".",
	            groupSize: [3],
	            percent: {
	                pattern: ["-n%","n%"],
	                decimals: 2,
	                ",": ",",
	                ".": ".",
	                groupSize: [3],
	                symbol: "%"
	            },
	            currency: {
	                name: "Pound Sterling",
	                abbr: "GBP",
	                pattern: ["-$n","$n"],
	                decimals: 2,
	                ",": ",",
	                ".": ".",
	                groupSize: [3],
	                symbol: "£"
	            }
	        },
	        calendars: {
	            standard: {
	                days: {
	                    names: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	                    namesAbbr: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
	                    namesShort: ["Su","Mo","Tu","We","Th","Fr","Sa"]
	                },
	                months: {
	                    names: ["January","February","March","April","May","June","July","August","September","October","November","December"],
	                    namesAbbr: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
	                },
	                AM: ["AM","am","AM"],
	                PM: ["PM","pm","PM"],
	                patterns: {
	                    d: "dd/MM/yyyy",
	                    D: "dd MMMM yyyy",
	                    F: "dd MMMM yyyy HH:mm:ss",
	                    g: "dd/MM/yyyy HH:mm",
	                    G: "dd/MM/yyyy HH:mm:ss",
	                    m: "d MMMM",
	                    M: "d MMMM",
	                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
	                    t: "HH:mm",
	                    T: "HH:mm:ss",
	                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
	                    y: "MMMM yyyy",
	                    Y: "MMMM yyyy"
	                },
	                "/": "/",
	                ":": ":",
	                firstDay: 1
	            }
	        }
	    }
	})(this);
	}));

/***/ }

});
//# sourceMappingURL=app.culture.en.chunk.js.map?v=0.2.74
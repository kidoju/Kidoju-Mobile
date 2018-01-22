webpackJsonp([15],{

/***/ 229:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(296),
        __webpack_require__(297),
        __webpack_require__(298),
        __webpack_require__(299)
    ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
                viewTitle: 'Activities',
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
                usersQueryFailure: 'There was an error loading the users.',
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

}, __webpack_require__(0));


/***/ }),

/***/ 296:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * Kendo UI v2018.1.117 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2018 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/

(function(f){
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
                name: "British Pound",
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

/***/ }),

/***/ 297:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * Kendo UI v2018.1.117 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2018 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/

(function(f){
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        f();
    }
}(function(){
(function ($, undefined) {
/* FlatColorPicker messages */

if (kendo.ui.FlatColorPicker) {
kendo.ui.FlatColorPicker.prototype.options.messages =
$.extend(true, kendo.ui.FlatColorPicker.prototype.options.messages,{
  "apply": "Apply",
  "cancel": "Cancel",
  "noColor": "no colour",
  "clearColor": "Clear colour"
});
}

/* ColorPicker messages */

if (kendo.ui.ColorPicker) {
kendo.ui.ColorPicker.prototype.options.messages =
$.extend(true, kendo.ui.ColorPicker.prototype.options.messages,{
  "apply": "Apply",
  "cancel": "Cancel",
  "noColor": "no colour",
  "clearColor": "Clear colour"
});
}

/* ColumnMenu messages */

if (kendo.ui.ColumnMenu) {
kendo.ui.ColumnMenu.prototype.options.messages =
$.extend(true, kendo.ui.ColumnMenu.prototype.options.messages,{
  "sortAscending": "Sort Ascending",
  "sortDescending": "Sort Descending",
  "filter": "Filter",
  "columns": "Columns",
  "done": "Done",
  "settings": "Column Settings",
  "lock": "Lock",
  "unlock": "Unlock"
});
}

/* Editor messages */

if (kendo.ui.Editor) {
kendo.ui.Editor.prototype.options.messages =
$.extend(true, kendo.ui.Editor.prototype.options.messages,{
  "bold": "Bold",
  "italic": "Italic",
  "underline": "Underline",
  "strikethrough": "Strikethrough",
  "superscript": "Superscript",
  "subscript": "Subscript",
  "justifyCenter": "Center text",
  "justifyLeft": "Align text left",
  "justifyRight": "Align text right",
  "justifyFull": "Justify",
  "insertUnorderedList": "Insert unordered list",
  "insertOrderedList": "Insert ordered list",
  "indent": "Indent",
  "outdent": "Outdent",
  "createLink": "Insert hyperlink",
  "unlink": "Remove hyperlink",
  "insertImage": "Insert image",
  "insertFile": "Insert file",
  "insertHtml": "Insert HTML",
  "viewHtml": "View HTML",
  "fontName": "Select font family",
  "fontNameInherit": "(inherited font)",
  "fontSize": "Select font size",
  "fontSizeInherit": "(inherited size)",
  "formatBlock": "Format",
  "formatting": "Format",
  "foreColor": "Colour",
  "backColor": "Background colour",
  "style": "Styles",
  "emptyFolder": "Empty Folder",
  "uploadFile": "Upload",
  "overflowAnchor": "More tools",
  "orderBy": "Arrange by:",
  "orderBySize": "Size",
  "orderByName": "Name",
  "invalidFileType": "The selected file \"{0}\" is not valid. Supported file types are {1}.",
  "deleteFile": 'Are you sure you want to delete "{0}"?',
  "overwriteFile": 'A file with name "{0}" already exists in the current directory. Do you want to overwrite it?',
  "directoryNotFound": "A directory with this name was not found.",
  "imageWebAddress": "Web address",
  "imageAltText": "Alternate text",
  "imageWidth": "Width (px)",
  "imageHeight": "Height (px)",
  "fileWebAddress": "Web address",
  "fileTitle": "Title",
  "linkWebAddress": "Web address",
  "linkText": "Text",
  "linkToolTip": "ToolTip",
  "linkOpenInNewWindow": "Open link in new window",
  "dialogUpdate": "Update",
  "dialogInsert": "Insert",
  "dialogButtonSeparator": "or",
  "dialogCancel": "Cancel",
  "cleanFormatting": "Clean formatting",
  "createTable": "Create table",
  "addColumnLeft": "Add column on the left",
  "addColumnRight": "Add column on the right",
  "addRowAbove": "Add row above",
  "addRowBelow": "Add row below",
  "deleteRow": "Delete row",
  "deleteColumn": "Delete column",
  "dialogOk": "Ok",
  "tableWizard": "Table Wizard",
  "tableTab": "Table",
  "cellTab": "Cell",
  "accessibilityTab": "Accessibility",
  "caption": "Caption",
  "summary": "Summary",
  "width": "Width",
  "height": "Height",
  "units": "Units",
  "cellSpacing": "Cell Spacing",
  "cellPadding": "Cell Padding",
  "cellMargin": "Cell Margin",
  "alignment": "Alignment",
  "background": "Background",
  "cssClass": "CSS Class",
  "id": "ID",
  "border": "Border",
  "borderStyle": "Border Style",
  "collapseBorders": "Collapse borders",
  "wrapText": "Wrap text",
  "associateCellsWithHeaders": "Associate cells with headers",
  "alignLeft": "Align Left",
  "alignCenter": "Align Center",
  "alignRight": "Align Right",
  "alignLeftTop": "Align Left Top",
  "alignCenterTop": "Align Center Top",
  "alignRightTop": "Align Right Top",
  "alignLeftMiddle": "Align Left Middle",
  "alignCenterMiddle": "Align Center Middle",
  "alignRightMiddle": "Align Right Middle",
  "alignLeftBottom": "Align Left Bottom",
  "alignCenterBottom": "Align Center Bottom",
  "alignRightBottom": "Align Right Bottom",
  "alignRemove": "Remove Alignment",
  "columns": "Columns",
  "rows": "Rows",
  "selectAllCells": "Select All Cells"
});
}

/* FileBrowser messages */

if (kendo.ui.FileBrowser) {
kendo.ui.FileBrowser.prototype.options.messages =
$.extend(true, kendo.ui.FileBrowser.prototype.options.messages,{
  "uploadFile": "Upload",
  "orderBy": "Arrange by",
  "orderByName": "Name",
  "orderBySize": "Size",
  "directoryNotFound": "A directory with this name was not found.",
  "emptyFolder": "Empty Folder",
  "deleteFile": 'Are you sure you want to delete "{0}"?',
  "invalidFileType": "The selected file \"{0}\" is not valid. Supported file types are {1}.",
  "overwriteFile": "A file with name \"{0}\" already exists in the current directory. Do you want to overwrite it?",
  "dropFilesHere": "drop file here to upload",
  "search": "Search"
});
}

/* FilterCell messages */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.messages =
$.extend(true, kendo.ui.FilterCell.prototype.options.messages,{
  "isTrue": "is true",
  "isFalse": "is false",
  "filter": "Filter",
  "clear": "Clear",
  "operator": "Operator"
});
}

/* FilterCell operators */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.operators =
$.extend(true, kendo.ui.FilterCell.prototype.options.operators,{
  "string": {
    "eq": "Is equal to",
    "neq": "Is not equal to",
    "startswith": "Starts with",
    "contains": "Contains",
    "doesnotcontain": "Does not contain",
    "endswith": "Ends with",
    "isnull": "Is null",
    "isnotnull": "Is not null",
    "isempty": "Is empty",
    "isnotempty": "Is not empty"
  },
  "number": {
    "eq": "Is equal to",
    "neq": "Is not equal to",
    "gte": "Is greater than or equal to",
    "gt": "Is greater than",
    "lte": "Is less than or equal to",
    "lt": "Is less than",
    "isnull": "Is null",
    "isnotnull": "Is not null"
  },
  "date": {
    "eq": "Is equal to",
    "neq": "Is not equal to",
    "gte": "Is after or equal to",
    "gt": "Is after",
    "lte": "Is before or equal to",
    "lt": "Is before",
    "isnull": "Is null",
    "isnotnull": "Is not null"
  },
  "enums": {
    "eq": "Is equal to",
    "neq": "Is not equal to",
    "isnull": "Is null",
    "isnotnull": "Is not null"
  }
});
}

/* FilterMenu messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.messages =
$.extend(true, kendo.ui.FilterMenu.prototype.options.messages,{
  "info": "Show items with value that:",
  "isTrue": "is true",
  "isFalse": "is false",
  "filter": "Filter",
  "clear": "Clear",
  "and": "And",
  "or": "Or",
  "selectValue": "-Select value-",
  "operator": "Operator",
  "value": "Value",
  "cancel": "Cancel"
});
}

/* FilterMenu operator messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.operators =
$.extend(true, kendo.ui.FilterMenu.prototype.options.operators,{
  "string": {
    "eq": "Is equal to",
    "neq": "Is not equal to",
    "startswith": "Starts with",
    "contains": "Contains",
    "doesnotcontain": "Does not contain",
    "endswith": "Ends with",
    "isnull": "Is null",
    "isnotnull": "Is not null",
    "isempty": "Is empty",
    "isnotempty": "Is not empty"
  },
  "number": {
    "eq": "Is equal to",
    "neq": "Is not equal to",
    "gte": "Is greater than or equal to",
    "gt": "Is greater than",
    "lte": "Is less than or equal to",
    "lt": "Is less than",
    "isnull": "Is null",
    "isnotnull": "Is not null"
  },
  "date": {
    "eq": "Is equal to",
    "neq": "Is not equal to",
    "gte": "Is after or equal to",
    "gt": "Is after",
    "lte": "Is before or equal to",
    "lt": "Is before",
    "isnull": "Is null",
    "isnotnull": "Is not null"
  },
  "enums": {
    "eq": "Is equal to",
    "neq": "Is not equal to",
    "isnull": "Is null",
    "isnotnull": "Is not null"
  }
});
}

/* FilterMultiCheck messages */

if (kendo.ui.FilterMultiCheck) {
kendo.ui.FilterMultiCheck.prototype.options.messages =
$.extend(true, kendo.ui.FilterMultiCheck.prototype.options.messages,{
  "checkAll": "Select All",
  "clear": "Clear",
  "filter": "Filter",
  "search": "Search"
});
}

/* Gantt messages */

if (kendo.ui.Gantt) {
kendo.ui.Gantt.prototype.options.messages =
$.extend(true, kendo.ui.Gantt.prototype.options.messages,{
  "actions": {
    "addChild": "Add Child",
    "append": "Add Task",
    "insertAfter": "Add Below",
    "insertBefore": "Add Above",
    "pdf": "Export to PDF"
  },
  "cancel": "Cancel",
  "deleteDependencyWindowTitle": "Delete dependency",
  "deleteTaskWindowTitle": "Delete task",
  "destroy": "Delete",
  "editor": {
    "assingButton": "Assign",
    "editorTitle": "Task",
    "end": "End",
    "percentComplete": "Complete",
    "resources": "Resources",
    "resourcesEditorTitle": "Resources",
    "resourcesHeader": "Resources",
    "start": "Start",
    "title": "Title",
    "unitsHeader": "Units"
  },
  "save": "Save",
  "views": {
    "day": "Day",
    "end": "End",
    "month": "Month",
    "start": "Start",
    "week": "Week",
    "year": "Year"
  }
});
}

/* Grid messages */

if (kendo.ui.Grid) {
kendo.ui.Grid.prototype.options.messages =
$.extend(true, kendo.ui.Grid.prototype.options.messages,{
  "commands": {
    "cancel": "Cancel changes",
    "canceledit": "Cancel",
    "create": "Add new record",
    "destroy": "Delete",
    "edit": "Edit",
    "excel": "Export to Excel",
    "pdf": "Export to PDF",
    "save": "Save changes",
    "select": "Select",
    "update": "Update"
  },
  "editable": {
    "cancelDelete": "Cancel",
    "confirmation": "Are you sure you want to delete this record?",
    "confirmDelete": "Delete"
  },
  "noRecords": "No records available."
});
}

/* Groupable messages */

if (kendo.ui.Groupable) {
kendo.ui.Groupable.prototype.options.messages =
$.extend(true, kendo.ui.Groupable.prototype.options.messages,{
  "empty": "Drag a column header and drop it here to group by that column"
});
}

/* NumericTextBox messages */

if (kendo.ui.NumericTextBox) {
kendo.ui.NumericTextBox.prototype.options =
$.extend(true, kendo.ui.NumericTextBox.prototype.options,{
  "upArrowText": "Increase value",
  "downArrowText": "Decrease value"
});
}

/* MediaPlayer messages */

if (kendo.ui.MediaPlayer) {
kendo.ui.MediaPlayer.prototype.options.messages =
$.extend(true, kendo.ui.MediaPlayer.prototype.options.messages,{
  "pause": "Pause",
  "play": "Play",
  "mute": "Mute",
  "unmute": "Unmute",
  "quality": "Quality",
  "fullscreen": "Full Screen"
});
}

/* Pager messages */

if (kendo.ui.Pager) {
kendo.ui.Pager.prototype.options.messages =
$.extend(true, kendo.ui.Pager.prototype.options.messages,{
  "allPages": "All",
  "display": "{0} - {1} of {2} items",
  "empty": "No items to display",
  "page": "Page",
  "of": "of {0}",
  "itemsPerPage": "items per page",
  "first": "Go to the first page",
  "previous": "Go to the previous page",
  "next": "Go to the next page",
  "last": "Go to the last page",
  "refresh": "Refresh",
  "morePages": "More pages"
});
}

/* PivotGrid messages */

if (kendo.ui.PivotGrid) {
kendo.ui.PivotGrid.prototype.options.messages =
$.extend(true, kendo.ui.PivotGrid.prototype.options.messages,{
  "measureFields": "Drop Data Fields Here",
  "columnFields": "Drop Column Fields Here",
  "rowFields": "Drop Rows Fields Here"
});
}

/* PivotFieldMenu messages */

if (kendo.ui.PivotFieldMenu) {
kendo.ui.PivotFieldMenu.prototype.options.messages =
$.extend(true, kendo.ui.PivotFieldMenu.prototype.options.messages,{
  "info": "Show items with value that:",
  "filterFields": "Fields Filter",
  "filter": "Filter",
  "include": "Include Fields...",
  "title": "Fields to include",
  "clear": "Clear",
  "ok": "Ok",
  "cancel": "Cancel",
  "operators": {
    "contains": "Contains",
    "doesnotcontain": "Does not contain",
    "startswith": "Starts with",
    "endswith": "Ends with",
    "eq": "Is equal to",
    "neq": "Is not equal to"
  }
});
}

/* RecurrenceEditor messages */

if (kendo.ui.RecurrenceEditor) {
kendo.ui.RecurrenceEditor.prototype.options.messages =
$.extend(true, kendo.ui.RecurrenceEditor.prototype.options.messages,{
  "frequencies": {
    "never": "Never",
    "hourly": "Hourly",
    "daily": "Daily",
    "weekly": "Weekly",
    "monthly": "Monthly",
    "yearly": "Yearly"
  },
  "hourly": {
    "repeatEvery": "Repeat every: ",
    "interval": " hour(s)"
  },
  "daily": {
    "repeatEvery": "Repeat every: ",
    "interval": " day(s)"
  },
  "weekly": {
    "interval": " week(s)",
    "repeatEvery": "Repeat every: ",
    "repeatOn": "Repeat on: "
  },
  "monthly": {
    "repeatEvery": "Repeat every: ",
    "repeatOn": "Repeat on: ",
    "interval": " month(s)",
    "day": "Day "
  },
  "yearly": {
    "repeatEvery": "Repeat every: ",
    "repeatOn": "Repeat on: ",
    "interval": " year(s)",
    "of": " of "
  },
  "end": {
    "label": "End:",
    "mobileLabel": "Ends",
    "never": "Never",
    "after": "After ",
    "occurrence": " occurrence(s)",
    "on": "On "
  },
  "offsetPositions": {
    "first": "first",
    "second": "second",
    "third": "third",
    "fourth": "fourth",
    "last": "last"
  },
  "weekdays": {
    "day": "day",
    "weekday": "weekday",
    "weekend": "weekend day"
  }
});
}

/* Scheduler messages */

if (kendo.ui.Scheduler) {
kendo.ui.Scheduler.prototype.options.messages =
$.extend(true, kendo.ui.Scheduler.prototype.options.messages,{
  "allDay": "all day",
  "date": "Date",
  "event": "Event",
  "time": "Time",
  "showFullDay": "Show full day",
  "showWorkDay": "Show business hours",
  "today": "Today",
  "save": "Save",
  "cancel": "Cancel",
  "destroy": "Delete",
  "deleteWindowTitle": "Delete event",
  "ariaSlotLabel": "Selected from {0:t} to {1:t}",
  "ariaEventLabel": "{0} on {1:D} at {2:t}",
  "editable": {
    "confirmation": "Are you sure you want to delete this event?"
  },
  "views": {
    "day": "Day",
    "week": "Week",
    "workWeek": "Work Week",
    "agenda": "Agenda",
    "month": "Month",
    "timeline": "Timeline"
  },
  "recurrenceMessages": {
    "deleteWindowTitle": "Delete Recurring Item",
    "deleteWindowOccurrence": "Delete current occurrence",
    "deleteWindowSeries": "Delete the series",
    "editWindowTitle": "Edit Recurring Item",
    "editWindowOccurrence": "Edit current occurrence",
    "editWindowSeries": "Edit the series",
    "deleteRecurring": "Do you want to delete only this event occurrence or the whole series?",
    "editRecurring": "Do you want to edit only this event occurrence or the whole series?"
  },
  "editor": {
    "title": "Title",
    "start": "Start",
    "end": "End",
    "allDayEvent": "All day event",
    "description": "Description",
    "repeat": "Repeat",
    "timezone": " ",
    "startTimezone": "Start timezone",
    "endTimezone": "End timezone",
    "separateTimezones": "Use separate start and end time zones",
    "timezoneEditorTitle": "Timezones",
    "timezoneEditorButton": "Time zone",
    "timezoneTitle": "Time zones",
    "noTimezone": "No timezone",
    "editorTitle": "Event"
  }
});
}

/* Spreadsheet messages */

if (kendo.spreadsheet && kendo.spreadsheet.messages.borderPalette) {
kendo.spreadsheet.messages.borderPalette =
$.extend(true, kendo.spreadsheet.messages.borderPalette,{
  "allBorders": "All borders",
  "insideBorders": "Inside borders",
  "insideHorizontalBorders": "Inside horizontal borders",
  "insideVerticalBorders": "Inside vertical borders",
  "outsideBorders": "Outside borders",
  "leftBorder": "Left border",
  "topBorder": "Top border",
  "rightBorder": "Right border",
  "bottomBorder": "Bottom border",
  "noBorders": "No border",
  "reset": "Reset colour",
  "customColor": "Custom colour...",
  "apply": "Apply",
  "cancel": "Cancel"
});
}

if (kendo.spreadsheet && kendo.spreadsheet.messages.dialogs) {
kendo.spreadsheet.messages.dialogs =
$.extend(true, kendo.spreadsheet.messages.dialogs,{
  "apply": "Apply",
  "save": "Save",
  "cancel": "Cancel",
  "remove": "Remove",
  "retry": "Retry",
  "revert": "Revert",
  "okText": "OK",
  "formatCellsDialog": {
    "title": "Format",
    "categories": {
      "number": "Number",
      "currency": "Currency",
      "date": "Date"
      }
  },
  "fontFamilyDialog": {
    "title": "Font"
  },
  "fontSizeDialog": {
    "title": "Font size"
  },
  "bordersDialog": {
    "title": "Borders"
  },
  "alignmentDialog": {
    "title": "Alignment",
    "buttons": {
     "justtifyLeft": "Align left",
     "justifyCenter": "Center",
     "justifyRight": "Align right",
     "justifyFull": "Justify",
     "alignTop": "Align top",
     "alignMiddle": "Align middle",
     "alignBottom": "Align bottom"
    }
  },
  "mergeDialog": {
    "title": "Merge cells",
    "buttons": {
      "mergeCells": "Merge all",
      "mergeHorizontally": "Merge horizontally",
      "mergeVertically": "Merge vertically",
      "unmerge": "Unmerge"
    }
  },
  "freezeDialog": {
    "title": "Freeze panes",
    "buttons": {
      "freezePanes": "Freeze panes",
      "freezeRows": "Freeze rows",
      "freezeColumns": "Freeze columns",
      "unfreeze": "Unfreeze panes"
    }
  },
  "validationDialog": {
    "title": "Data Validation",
    "hintMessage": "Please enter a valid {0} value {1}.",
    "hintTitle": "Validation {0}",
    "criteria": {
      "any": "Any value",
      "number": "Number",
      "text": "Text",
      "date": "Date",
      "custom": "Custom Formula",
      "list": "List"
    },
    "comparers": {
      "greaterThan": "greater than",
      "lessThan": "less than",
      "between": "between",
      "notBetween": "not between",
      "equalTo": "equal to",
      "notEqualTo": "not equal to",
      "greaterThanOrEqualTo": "greater than or equal to",
      "lessThanOrEqualTo": "less than or equal to"
    },
    "comparerMessages": {
      "greaterThan": "greater than {0}",
      "lessThan": "less than {0}",
      "between": "between {0} and {1}",
      "notBetween": "not between {0} and {1}",
      "equalTo": "equal to {0}",
      "notEqualTo": "not equal to {0}",
      "greaterThanOrEqualTo": "greater than or equal to {0}",
      "lessThanOrEqualTo": "less than or equal to {0}",
      "custom": "that satisfies the formula: {0}"
    },
    "labels": {
      "criteria": "Criteria",
      "comparer": "Comparer",
      "min": "Min",
      "max": "Max",
      "value": "Value",
      "start": "Start",
      "end": "End",
      "onInvalidData": "On invalid data",
      "rejectInput": "Reject input",
      "showWarning": "Show warning",
      "showHint": "Show hint",
      "hintTitle": "Hint title",
      "hintMessage": "Hint message",
      "ignoreBlank": "Ignore blank"
    },
    "placeholders": {
      "typeTitle": "Type title",
      "typeMessage": "Type message"
    }
  },
  "exportAsDialog": {
    "title": "Export...",
    "labels": {
      "fileName": "File name",
      "saveAsType": "Save as type",
      "exportArea": "Export",
      "paperSize": "Paper size",
      "margins": "Margins",
      "orientation": "Orientation",
      "print": "Print",
      "guidelines": "Guidelines",
      "center": "Center",
      "horizontally": "Horizontally",
      "vertically": "Vertically"
    }
  },
  "modifyMergedDialog": {
    "errorMessage": "Cannot change part of a merged cell."
  },
  "useKeyboardDialog": {
    "title": "Copying and pasting",
    "errorMessage": "These actions cannot be invoked through the menu. Please use the keyboard shortcuts instead:",
    "labels": {
      "forCopy": "for copy",
      "forCut": "for cut",
      "forPaste": "for paste"
    }
  },
  "unsupportedSelectionDialog": {
    "errorMessage": "That action cannot be performed on multiple selection."
  }
});
}

if (kendo.spreadsheet && kendo.spreadsheet.messages.filterMenu) {
kendo.spreadsheet.messages.filterMenu =
$.extend(true, kendo.spreadsheet.messages.filterMenu,{
  "sortAscending": "Sort range A to Z",
  "sortDescending": "Sort range Z to A",
  "filterByValue": "Filter by value",
  "filterByCondition": "Filter by condition",
  "apply": "Apply",
  "search": "Search",
  "addToCurrent": "Add to current selection",
  "clear": "Clear",
  "blanks": "(Blanks)",
  "operatorNone": "None",
  "and": "AND",
  "or": "OR",
  "operators": {
    "string": {
      "contains": "Text contains",
      "doesnotcontain": "Text does not contain",
      "startswith": "Text starts with",
      "endswith": "Text ends with"
    },
    "date": {
      "eq":  "Date is",
      "neq": "Date is not",
      "lt":  "Date is before",
      "gt":  "Date is after"
    },
    "number": {
      "eq": "Is equal to",
      "neq": "Is not equal to",
      "gte": "Is greater than or equal to",
      "gt": "Is greater than",
      "lte": "Is less than or equal to",
      "lt": "Is less than"
    }
  }
});
}

if (kendo.spreadsheet && kendo.spreadsheet.messages.colorPicker) {
kendo.spreadsheet.messages.colorPicker =
$.extend(true, kendo.spreadsheet.messages.colorPicker,{
  "reset": "Reset color",
  "customColor": "Custom color...",
  "apply": "Apply",
  "cancel": "Cancel"
});
}

if (kendo.spreadsheet && kendo.spreadsheet.messages.toolbar) {
kendo.spreadsheet.messages.toolbar =
$.extend(true, kendo.spreadsheet.messages.toolbar,{
  "addColumnLeft": "Add column left",
  "addColumnRight": "Add column right",
  "addRowAbove": "Add row above",
  "addRowBelow": "Add row below",
  "alignment": "Alignment",
  "alignmentButtons": {
    "justtifyLeft": "Align left",
    "justifyCenter": "Center",
    "justifyRight": "Align right",
    "justifyFull": "Justify",
    "alignTop": "Align top",
    "alignMiddle": "Align middle",
    "alignBottom": "Align bottom"
  },
  "backgroundColor": "Background",
  "bold": "Bold",
  "borders": "Borders",
  "colorPicker": {
    "reset": "Reset colour",
    "customColor": "Custom colour..."
  },
  "copy": "Copy",
  "cut": "Cut",
  "deleteColumn": "Delete column",
  "deleteRow": "Delete row",
  "excelImport": "Import from Excel...",
  "filter": "Filter",
  "fontFamily": "Font",
  "fontSize": "Font size",
  "format": "Custom format...",
  "formatTypes": {
    "automatic": "Automatic",
    "number": "Number",
    "percent": "Percent",
    "financial": "Financial",
    "currency": "Currency",
    "date": "Date",
    "time": "Time",
    "dateTime": "Date time",
    "duration": "Duration",
    "moreFormats": "More formats..."
  },
  "formatDecreaseDecimal": "Decrease decimal",
  "formatIncreaseDecimal": "Increase decimal",
  "freeze": "Freeze panes",
  "freezeButtons": {
    "freezePanes": "Freeze panes",
    "freezeRows": "Freeze rows",
    "freezeColumns": "Freeze columns",
    "unfreeze": "Unfreeze panes"
  },
  "italic": "Italic",
  "merge": "Merge cells",
  "mergeButtons": {
    "mergeCells": "Merge all",
    "mergeHorizontally": "Merge horizontally",
    "mergeVertically": "Merge vertically",
    "unmerge": "Unmerge"
  },
  "open": "Open...",
  "paste": "Paste",
  "quickAccess": {
    "redo": "Redo",
    "undo": "Undo"
  },
  "saveAs": "Save As...",
  "sort": "Sort",
  "sortAsc": "Sort ascending",
  "sortDesc": "Sort descending",
  "sortButtons": {
    "sortSheetAsc": "Sort sheet A to Z",
    "sortSheetDesc": "Sort sheet Z to A",
    "sortRangeAsc": "Sort range A to Z",
    "sortRangeDesc": "Sort range Z to A"
  },
  "textColor": "Text Colour",
  "textWrap": "Wrap text",
  "underline": "Underline",
  "validation": "Data validation..."
});
}

if (kendo.spreadsheet && kendo.spreadsheet.messages.view) {
kendo.spreadsheet.messages.view =
$.extend(true, kendo.spreadsheet.messages.view,{
  "nameBox": "Name Box",
  "errors": {
    "shiftingNonblankCells": "Cannot insert cells due to data loss possibility. Select another insert location or delete the data from the end of your worksheet.",
    "filterRangeContainingMerges": "Cannot create a filter within a range containing merges",
    "validationError": "The value that you entered violates the validation rules set on the cell."
  },
  "tabs": {
    "home": "Home",
    "insert": "Insert",
    "data": "Data"
  }
});
}

/* Slider messages */

if (kendo.ui.Slider) {
kendo.ui.Slider.prototype.options =
$.extend(true, kendo.ui.Slider.prototype.options,{
  "increaseButtonTitle": "Increase",
  "decreaseButtonTitle": "Decrease"
});
}

/* TreeList messages */

if (kendo.ui.TreeList) {
kendo.ui.TreeList.prototype.options.messages =
$.extend(true, kendo.ui.TreeList.prototype.options.messages,{
  "noRows": "No records to display",
  "loading": "Loading...",
  "requestFailed": "Request failed.",
  "retry": "Retry",
  "commands": {
      "edit": "Edit",
      "update": "Update",
      "canceledit": "Cancel",
      "create": "Add new record",
      "createchild": "Add child record",
      "destroy": "Delete",
      "excel": "Export to Excel",
      "pdf": "Export to PDF"
  }
});
}

if (kendo.ui.TreeList) {
kendo.ui.TreeList.prototype.options.columnMenu =
$.extend(true, kendo.ui.TreeList.prototype.options.columnMenu, {
    "messages": {
        "columns": "Choose columns",
        "filter": "Apply filter",
        "sortAscending": "Sort (asc)",
        "sortDescending": "Sort (desc)"
    }
});
}

/* TreeView messages */

if (kendo.ui.TreeView) {
kendo.ui.TreeView.prototype.options.messages =
$.extend(true, kendo.ui.TreeView.prototype.options.messages,{
  "loading": "Loading...",
  "requestFailed": "Request failed.",
  "retry": "Retry"
});
}

/* Upload messages */

if (kendo.ui.Upload) {
kendo.ui.Upload.prototype.options.localization=
$.extend(true, kendo.ui.Upload.prototype.options.localization,{
  "select": "Select files...",
  "cancel": "Cancel",
  "retry": "Retry",
  "remove": "Remove",
  "uploadSelectedFiles": "Upload files",
  "dropFilesHere": "drop files here to upload",
  "statusUploading": "uploading",
  "statusUploaded": "uploaded",
  "statusWarning": "warning",
  "statusFailed": "failed",
  "headerStatusUploading": "Uploading...",
  "headerStatusUploaded": "Done"
});
}

/* Validator messages */

if (kendo.ui.Validator) {
kendo.ui.Validator.prototype.options.messages =
$.extend(true, kendo.ui.Validator.prototype.options.messages,{
  "required": "{0} is required",
  "pattern": "{0} is not valid",
  "min": "{0} should be greater than or equal to {1}",
  "max": "{0} should be smaller than or equal to {1}",
  "step": "{0} is not valid",
  "email": "{0} is not valid email",
  "url": "{0} is not valid URL",
  "date": "{0} is not valid date",
  "dateCompare": "End date should be greater than or equal to the start date"
});
}

/* Dialog */

if (kendo.ui.Dialog) {
kendo.ui.Dialog.prototype.options.messages =
$.extend(true, kendo.ui.Dialog.prototype.options.localization, {
  "close": "Close"
});
}

/* Alert */

if (kendo.ui.Alert) {
kendo.ui.Alert.prototype.options.messages =
$.extend(true, kendo.ui.Alert.prototype.options.localization, {
  "okText": "OK"
});
}

/* Confirm */

if (kendo.ui.Confirm) {
kendo.ui.Confirm.prototype.options.messages =
$.extend(true, kendo.ui.Confirm.prototype.options.localization, {
  "okText": "OK",
  "cancel": "Cancel"
});
}

/* Prompt */
if (kendo.ui.Prompt) {
kendo.ui.Prompt.prototype.options.messages =
$.extend(true, kendo.ui.Prompt.prototype.options.localization, {
  "okText": "OK",
  "cancel": "Cancel"
});
}

})(window.kendo.jQuery);
}));

/***/ }),

/***/ 298:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f){
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        f();
    }
}(function(){

    'use strict';

    (function ($, undefined) {

        var kendo = window.kendo;
        var ui = kendo.mobile.ui;

        /* ListView messages */
        if (ui.ListView) {
            // Beware: this makes all mobile list views filterable by default
            // So non-filterable list views need to have filterable explicitly set to false
            ui.ListView.prototype.options.filterable =
                $.extend(true, ui.ListView.prototype.options.filterable,{
                    placeholder: 'Search...'
                });
            ui.ListView.prototype.options.messages =
                $.extend(true, ui.ListView.prototype.options.messages,{
                    loadMoreText: 'Press to load more'
                });
        }

    })(window.kendo.jQuery);
}));


/***/ }),

/***/ 299:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(function () {

    'use strict';

    var kendo = window.kendo;
    var ui = kendo.ui;
    var options;

    /*  This function has too many statements. */
    /* jshint -W071 */

    /*  This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

    (function ($, undefined) {

        /* kidoju.widgets.assetmanager */
        if (ui.AssetManager) {
            options = ui.AssetManager.prototype.options;
            options.messages = $.extend(true, options.messages, {
                toolbar: {
                    upload: 'Upload',
                    delete: 'Delete',
                    filter: 'Collection: ',
                    search: 'Search'
                },
                tabs: {
                    default: 'Project'
                },
                data: {
                    defaultName: 'Uploading...',
                    defaultImage: '' // TODO
                }
            });
        }

        /* kidoju.widgets.codeeditor */
        if (ui.CodeEditor) {
            options = ui.CodeEditor.prototype.options;
            options.messages = $.extend(true, options.messages, {
                formula: 'Formula:',
                notApplicable: 'N/A',
                solution: 'Solution:',
                value: 'Value:',
                test: 'Test',
                success: 'Success',
                failure: 'Failure',
                omit: 'Omit',
                error: 'Error',
                ajaxError: 'Error loading worker library.',
                jsonError: 'Error parsing value as json. Wrap strings in double quotes.',
                timeoutError: 'The execution of a web worker has timed out.'
            });
        }

        /* kidoju.widgets.codeinput */
        /*
         if (ui.CodeInput) {
             options = ui.CodeInput.prototype.options;
             options.messages = $.extend(true, options.messages, {
                // TODO
            });
         }
         */

        /* kidoju.widgets.explorer */
        if (ui.Explorer) {
            options = ui.Explorer.prototype.options;
            options.messages = $.extend(true, options.messages, {
                empty: 'No item to display'
            });
        }

        /* kidoju.widgets.imagelist */
        if (ui.ImageList) {
            options = ui.ImageList.prototype.options;
            options.messages = $.extend(true, options.messages, {
                toolbar: {
                    add: 'Add'
                },
                validation: {
                    image: 'An image url is required.',
                    text: 'Some text is required.'
                }
            });
        }

        /* kidoju.widgets.markeditor */
        if (ui.MarkEditor) {
            options = ui.MarkEditor.prototype.options;
            options.messages = $.extend(true, options.messages, {
                image: 'An undescribed image',
                link: 'Click here'
            });
        }
        if (kendo.markeditor && kendo.markeditor.messages.dialogs) {
            kendo.markeditor.messages.dialogs =
                $.extend(true, kendo.markeditor.messages.dialogs, {
                    cancel: '<img alt="icon" src="https://cdn.kidoju.com/images/o_collection/svg/office/close.svg" class="k-image">Cancel',
                    okText: '<img alt="icon" src="https://cdn.kidoju.com/images/o_collection/svg/office/ok.svg" class="k-image">OK',
                    headingsDialog: {
                        title: 'Start Cap',
                        buttons: {
                            h1: 'Heading 1',
                            h2: 'Heading 2',
                            h3: 'Heading 3',
                            h4: 'Heading 4',
                            h5: 'Heading 5',
                            h6: 'Heading 6'
                        }
                    },
                    linkDialog: {
                        title: 'Hyperlink',
                        labels: {
                            text: 'Url'
                        }
                    },
                    imageDialog: {
                        title: 'Image',
                        labels: {
                            url: 'Url'
                        }
                    },
                    latexDialog: {
                        title: 'Mathematic Expression',
                        labels: {
                            display: 'Display',
                            inline: 'inline'
                        }
                    },
                    previewDialog: {
                        title: 'Preview'
                    }
                });
        }
        if (kendo.markeditor && kendo.markeditor.messages.toolbar) {
            kendo.markeditor.messages.toolbar =
                $.extend(true, kendo.markeditor.messages.toolbar, {
                    undo: 'Undo',
                    redo: 'Redo',
                    headings: 'Headings',
                    headingsButtons: {
                        h1: 'Heading 1',
                        h2: 'Heading 2',
                        h3: 'Heading 3',
                        h4: 'Heading 4',
                        h5: 'Heading 5',
                        h6: 'Heading 6'
                    },
                    bold: 'Bold',
                    italic: 'Italic',
                    bulleted: 'Bulleted List',
                    numbered: 'Numbered List',
                    blockquote: 'Blockquote',
                    hrule: 'Horizontal Rule',
                    link: 'Hyperlink',
                    image: 'Image',
                    code: 'Code',
                    latex: 'Mathematic Expression',
                    preview: 'Preview in New Window'
                });
        }

        /* kidoju.widgets.mathinput */
        if (kendo.mathinput && kendo.mathinput.messages.dialogs) {
            kendo.mathinput.messages.dialogs =
                $.extend(true, kendo.mathinput.messages.dialogs, {
                    keypad: {
                        title: 'KeyPad',
                        buttons: {
                            comma: ',',
                            stop: '.',
                            n0: '0',
                            n1: '1',
                            n2: '2',
                            n3: '3',
                            n4: '4',
                            n5: '5',
                            n6: '6',
                            n7: '7',
                            n8: '8',
                            n9: '9',
                            a: 'a',
                            b: 'b',
                            c: 'c',
                            i: 'i',
                            j: 'j',
                            k: 'k',
                            n: 'n',
                            p: 'p',
                            q: 'q',
                            x: 'x',
                            y: 'y',
                            z: 'z',
                            pi: 'Pi',
                            infty: 'Infinity',
                            space: 'Space',
                            subscript: 'Subscript'
                        }
                    },
                    basic: {
                        title: 'Basic',
                        buttons: {
                            // WARNING: Make sure mathjs can calculate all these functions
                            equal: 'Equal',
                            plus: 'Plus',
                            minus: 'Minus',
                            cdot: 'Times',
                            times: 'Times',
                            div: 'Divide',
                            pleft: 'Left parenthesis (',
                            pright: 'Right parenthesis )',
                            frac: 'Fraction',
                            sqrt: 'Square root',
                            pow2: 'Power of 2',
                            pow3: 'Power of 3',
                            sin: 'Sine',
                            cos: 'Cosine',
                            tan: 'Tangent'
                        }
                    },
                    greek: {
                        title: 'Greek',
                        buttons: {
                            // Note: upper case and lower case share the same values
                            alpha: 'Alpha',
                            beta: 'Beta',
                            gamma: 'Gamma',
                            delta: 'Delta',
                            epsilon: 'Epsilon', // varepsilon
                            zeta: 'Zeta',
                            eta: 'Eta',
                            theta: 'Theta', // vartheta
                            iota: 'Iota',
                            kappa: 'Kappa', // varkappa
                            lambda: 'Lambda',
                            mu: 'Mu',
                            nu: 'Nu',
                            xi: 'Xi',
                            omicron: 'Omicron',
                            pi: 'Pi', // varpi
                            rho: 'Rho', // varrho
                            sigma: 'Sigma', // varsigma
                            tau: 'Tau',
                            upsilon: 'Upsilon',
                            phi: 'Phi', // varphi
                            chi: 'Chi',
                            psi: 'Psi',
                            omega: 'Omega'
                        }
                    },
                    operators: {
                        title: 'Operators',
                        buttons: {
                            equal: 'Equal',
                            plus: 'Plus',
                            minus: 'Minus',
                            cdot: 'Times',
                            times: 'Times',
                            div: 'Divide',
                            pleft: 'Left parenthesis (',
                            pright: 'Right parenthesis )',
                            bleft: 'Left square bracket [',
                            bright: 'Right square bracket ]',
                            cleft: 'Left curly bracket {',
                            cright: 'Right curly bracket }',
                            vleft: 'Left vertical line |',
                            vright: 'Right vertical line |',
                            lt: 'Lower than',
                            le: 'Lower than or equal',
                            gt: 'Greater than',
                            ge: 'Greater than or equal',
                            neq: 'Not equal',
                            approx: 'Approximate',
                            propto: 'Proportional',
                            plusminus: 'Plus-Minus',
                            percent: 'Percent',
                            not: 'Not',
                            and: 'And',
                            or: 'Or',
                            circ: 'Composition',
                            nabla: 'Nabla'
                        }
                    },
                    expressions: {
                        title: 'Functions',
                        buttons: {
                            sqrt: 'Square root',
                            cubert: 'Cube root',
                            nthroot: 'Nth root',
                            pow2: 'Power of 2',
                            pow3: 'Power of 3',
                            pow: 'Power',
                            log: 'Logarithm',
                            log10: 'Logarithm base 10',
                            ln: 'Naperian logarithm',
                            sin: 'Sine',
                            cos: 'Cosine',
                            tan: 'Tangent',
                            arcsin: 'Arc sine',
                            arccos: 'Arc cosine',
                            arctan: 'Arc tangent',
                            deriv: 'Derivative',
                            partial: 'Partial derivative',
                            int: 'Integral',
                            oint: 'Contour integral',
                            sum: 'Sum',
                            prod: 'Product',
                            lim: 'Limit'
                        }
                    },
                    sets: {
                        title: 'Sets',
                        buttons: {
                            cset: 'Complexes',
                            pset: 'Primes',
                            nset: 'Naturals',
                            qset: 'Rationals',
                            rset: 'Reals',
                            zset: 'Integers',
                            emptyset: 'Empty set',
                            forall: 'For all',
                            exists: 'Exists',
                            nexists: 'Not exists',
                            in: 'In',
                            nin: 'Not in',
                            subset: 'Subset',
                            supset: 'Superset',
                            nsubset: 'Not subset',
                            nsupset: 'Not superset',
                            intersection: 'Intersection',
                            union: 'Union',
                            to: 'To',
                            implies: 'Implies',
                            impliedby: 'Implied by',
                            nimplies: 'Not implies',
                            iff: 'Equivalent to'
                        }
                    },
                    matrices: {
                        title: 'Matrices',
                        buttons: {
                            vector: 'Vector',
                            widehat: 'Widehat (angle)',
                            matrix: 'Matrix',
                            pmatrix: 'Matrix with parentheses',
                            bmatrix: 'Matrix with square brackets',
                            bbmatrix: 'Matrix with curly braces',
                            vmatrix: 'Matrix with vertical lines',
                            vvmatrix: 'Matrix with double vertical lines',
                            column: 'Add column',
                            row: 'Add row'
                        }
                    },
                    statistics: {
                        title: 'Statistics',
                        buttons: {
                            factorial: 'Factorial',
                            binomial: 'Binomial',
                            overline: 'Overline (mean)'
                        }
                    }
                    /*
					units: {
						title: 'Units',
						buttons: {}
					},
					chemistry: {
						title: 'Chemistry',
						buttons: {}
					}
					*/
                });
        }
        if (kendo.mathinput && kendo.mathinput.messages.toolbar) {
            kendo.mathinput.messages.toolbar =
                $.extend(true, kendo.mathinput.messages.toolbar, {
                    field: {
                        title: 'Field'
                    },
                    backspace: {
                        title: 'Backspace'
                    },
                    keypad: {
                        title: 'KeyPad',
                        buttons: {
                            comma: ',',
                            stop: '.',
                            n0: '0',
                            n1: '1',
                            n2: '2',
                            n3: '3',
                            n4: '4',
                            n5: '5',
                            n6: '6',
                            n7: '7',
                            n8: '8',
                            n9: '9',
                            a: 'a',
                            b: 'b',
                            c: 'c',
                            i: 'i',
                            j: 'j',
                            k: 'k',
                            n: 'n',
                            p: 'p',
                            q: 'q',
                            x: 'x',
                            y: 'y',
                            z: 'z',
                            pi: 'Pi',
                            infty: 'Infinity',
                            space: 'Space',
                            subscript: 'Subscript'
                        }
                    },
                    basic: {
                        title: 'Basic',
                        buttons: {
                            // WARNING: Make sure mathjs can calculate all these functions
                            equal: 'Equal',
                            plus: 'Plus',
                            minus: 'Minus',
                            cdot: 'Times',
                            times: 'Times',
                            div: 'Divide',
                            pleft: 'Left parenthesis (',
                            pright: 'Right parenthesis )',
                            frac: 'Fraction',
                            sqrt: 'Square root',
                            pow2: 'Power of 2',
                            pow3: 'Power of 3',
                            sin: 'Sine',
                            cos: 'Cosine',
                            tan: 'Tangent'
                        }
                    },
                    greek: {
                        title: 'Greek',
                        buttons: {
                            alpha: 'Alpha',
                            beta: 'Beta',
                            gamma: 'Gamma',
                            delta: 'Delta',
                            epsilon: 'Epsilon', // varepsilon
                            zeta: 'Zeta',
                            eta: 'Eta',
                            theta: 'Theta', // vartheta
                            iota: 'Iota',
                            kappa: 'Kappa', // varkappa
                            lambda: 'Lambda',
                            mu: 'Mu',
                            nu: 'Nu',
                            xi: 'Xi',
                            omicron: 'Omicron',
                            pi: 'Pi', // varpi
                            rho: 'Rho', // varrho
                            sigma: 'Sigma', // varsigma
                            tau: 'Tau',
                            upsilon: 'Upsilon',
                            phi: 'Phi', // varphi
                            chi: 'Chi',
                            psi: 'Psi',
                            omega: 'Omega'
                        }
                    },
                    operators: {
                        title: 'Operators',
                        buttons: {
                            equal: 'Equal',
                            plus: 'Plus',
                            minus: 'Minus',
                            cdot: 'Times',
                            times: 'Times',
                            div: 'Divide',
                            pleft: 'Left parenthesis (',
                            pright: 'Right parenthesis )',
                            bleft: 'Left square bracket [',
                            bright: 'Right square bracket ]',
                            cleft: 'Left curly bracket {',
                            cright: 'Right curly bracket }',
                            vleft: 'Left vertical line |',
                            vright: 'Right vertical line |',
                            lt: 'Lower than',
                            le: 'Lower than or equal',
                            gt: 'Greater than',
                            ge: 'Greater than or equal',
                            neq: 'Not equal',
                            approx: 'Approximate',
                            propto: 'Proportional',
                            plusminus: 'Plus-Minus',
                            percent: 'Percent',
                            not: 'Not',
                            and: 'And',
                            or: 'Or',
                            circ: 'Composition',
                            nabla: 'Nabla'
                        }
                    },
                    expressions: {
                        title: 'Functions',
                        buttons: {
                            sqrt: 'Square root',
                            cubert: 'Cube root',
                            nthroot: 'Nth root',
                            pow2: 'Power of 2',
                            pow3: 'Power of 3',
                            pow: 'Power',
                            log: 'Logarithm',
                            log10: 'Logarithm base 10',
                            ln: 'Naperian logarithm',
                            sin: 'Sine',
                            cos: 'Cosine',
                            tan: 'Tangent',
                            arcsin: 'Arc sine',
                            arccos: 'Arc cosine',
                            arctan: 'Arc tangent',
                            deriv: 'Derivative',
                            partial: 'Partial derivative',
                            int: 'Integral',
                            oint: 'Contour integral',
                            sum: 'Sum',
                            prod: 'Product',
                            lim: 'Limit'
                        }
                    },
                    sets: {
                        title: 'Sets',
                        buttons: {
                            cset: 'Complexes',
                            pset: 'Primes',
                            nset: 'Naturals',
                            qset: 'Rationals',
                            rset: 'Reals',
                            zset: 'Integers',
                            emptyset: 'Empty set',
                            forall: 'For all',
                            exists: 'Exists',
                            nexists: 'Not exists',
                            in: 'In',
                            nin: 'Not in',
                            subset: 'Subset',
                            supset: 'Superset',
                            nsubset: 'Not subset',
                            nsupset: 'Not superset',
                            intersection: 'Intersection',
                            union: 'Union',
                            to: 'To',
                            implies: 'Implies',
                            impliedby: 'Implied by',
                            nimplies: 'Not implies',
                            iff: 'Equivalent to'
                        }
                    },
                    matrices: {
                        title: 'Matrices',
                        buttons: {
                            vector: 'Vector',
                            widehat: 'Widehat (angle)',
                            matrix: 'Matrix',
                            pmatrix: 'Matrix with parentheses',
                            bmatrix: 'Matrix with square brackets',
                            bbmatrix: 'Matrix with curly braces',
                            vmatrix: 'Matrix with vertical lines',
                            vvmatrix: 'Matrix with double vertical lines',
                            column: 'Add column',
                            row: 'Add row'
                        }
                    },
                    statistics: {
                        title: 'Statistics',
                        buttons: {
                            factorial: 'Factorial',
                            binomial: 'Binomial',
                            overline: 'Overline (mean)'
                        }
                    }
                    /*
					units: {
						title: 'Units',
						buttons: {}
					},
					chemistry: {
						title: 'Chemistry',
						buttons: {}
					}
					*/
                });
        }

        /* kidoju.widgets.mediaplayer */
        if (ui.MediaPlayer) {
            options = ui.MediaPlayer.prototype.options;
            options.messages = $.extend(true, options.messages, {
                play: 'Play/Pause',
                mute: 'Mute/Unmute',
                full: 'Full Screen',
                notSupported: 'Media not supported'
            });
        }

        /* kidoju.widgets.multiinput */
        if (ui.MultiInput) {
            options = ui.MultiInput.prototype.options;
            options.messages = $.extend(true, options.messages, {
                delete: 'Delete'
            });
        }

        /* kidoju.widgets.multiquiz */
        if (ui.MultiQuiz) {
            options = ui.MultiQuiz.prototype.options;
            options.messages = $.extend(true, options.messages, {
                placeholder: 'Select...'
            });
        }

        /* kidoju.widgets.navigation */
        if (ui.Navigation) {
            options = ui.Navigation.prototype.options;
            options.messages = $.extend(true, options.messages, {
                empty: 'No item to display'
            });
        }

        /* kidoju.widgets.playbar */
        if (ui.PlayBar) {
            options = ui.PlayBar.prototype.options;
            options.messages = $.extend(true, options.messages, {
                empty: 'No page to display',
                page: 'Page',
                of: 'of {0}',
                first: 'Go to the first page',
                previous: 'Go to the previous page',
                next: 'Go to the next page',
                last: 'Go to the last page',
                refresh: 'Refresh',
                morePages: 'More pages'
            });
        }

        /* kidoju.widgets.propertygrid */
        if (ui.PropertyGrid) {
            options = ui.PropertyGrid.prototype.options;
            options.messages = $.extend(true, options.messages, {
                property: 'Property',
                value: 'Value'
            });
        }

        /* kidoju.widgets.quiz */
        if (ui.Quiz) {
            options = ui.Quiz.prototype.options;
            options.messages = $.extend(true, options.messages, {
                optionLabel: 'Select...'
            });
        }

        /* kidoju.widgets.rating */
        /*
        if (ui.Rating) {
             options = ui.Rating.prototype.options;
             options.messages = $.extend(true, options.messages, {
                // TODO
            });
        }
        */

        /* kidoju.widgets.social */
        if (ui.Social) {
            options = ui.Social.prototype.options;
            options.messages = $.extend(true, options.messages, {
                classroom: 'Share to Google Classroom',
                facebook: 'Share to Facebook',
                google: 'Share to Google+',
                linkedin: 'Share to LinkedIn',
                pinterest: 'Share to Pinterest',
                twitter: 'Share to Twitter'
            });
        }

        /* kidoju.widgets.stage */
        if (ui.Stage) {
            options = ui.Stage.prototype.options;
            options.messages = $.extend(true, options.messages, {
                contextMenu: {
                    delete: 'Delete',
                    duplicate: 'Duplicate'
                },
                noPage: 'Please add or select a page'
            });
        }

        /* kidoju.widgets.styleeditor */
        if (ui.StyleEditor) {
            options = ui.StyleEditor.prototype.options;
            options.messages = $.extend(true, options.messages, {
                columns: {
                    name: 'Name',
                    value: 'Value'
                },
                toolbar: {
                    create: 'New Style',
                    destroy: 'Delete'
                },
                validation: {
                    name: 'Name is required',
                    value: 'Value is required'
                }
            });
        }

        /* kidoju.widgets.toolbox */
        /*
        if (ui.ToolBox) {
             options = ui.ToolBox.prototype.options;
             options.messages = $.extend(true, options.messages, {
                // TODO
            });
        }
        */

        /**
         * kidoju.data & kidoju.tools
         */

        if (window.kidoju) {

            var kidoju = window.kidoju;
            var adapters = kidoju.adapters;
            var data = kidoju.data;
            var tools = kidoju.tools;
            var Tool = kidoju.Tool;
            var attributes;
            var properties;

            if (adapters && adapters.CharGridAdapter) {
                adapters.CharGridAdapter.prototype.messages = {
                    layout: '<h3>Design the grid layout</h3><p>Any character you enter in the grid is locked and cannot be changed in play mode.</p><p>Use `{0}` to blank out empty cells.</p>',
                    solution: '<h3>Enter the solution</h3><p>Use any whitelisted character, i.e. `{0}`.</p>'
                };
            }

            /*
             if (data && data.PageComponent) {
                data.PageComponent.prototype.messages = {
                }
             }
             */

            if (data && data.Page) {
                data.Page.prototype.messages = {
                    emptyPage: 'Page {0} cannot be empty.',
                    minConnectors: 'At least {0} Connectors are required to make a question on page {1}.',
                    missingDraggable: 'Draggable Labels or Images are required for a Drop Zone on page {0}.',
                    missingDropZone: 'A Drop Zone is required for draggable Labels or Images on page {0}.',
                    missingLabel: 'A Label is recommended on page {0}.',
                    missingMultimedia: 'A multimedia element (Image, Audio, Video) is recommended on page {0}.',
                    missingQuestion: 'A question is recommended on page {0}.',
                    missingInstructions: 'Instructions are recommended on page {0}.',
                    missingExplanations: 'Explanations are recommended on page {0}.'
                };
            }

            if (data && data.Stream) {
                data.Stream.prototype.messages = {
                    duplicateNames: 'Delete components using the same name `{0}` on pages {1}',
                    minPages: 'At least {0} pages are required to be allowed to publish.',
                    minQuestions: 'At least {0} questions are required to be allowed to publish.',
                    typeVariety: 'The use of at least {0} types of questions (Multiple Choice, TextBox, Connector or else) is recommended.',
                    qtyVariety: 'More variety is recommended because {0:p0} of questions are of type {1}.'
                };
            }

            // if (kidoju.Tool instanceof Function) {
            if (Tool && Tool.constructor && Tool.constructor.name === 'Function') {
                Tool.prototype.i18n = $.extend(true, Tool.prototype.i18n, {
                    tool: {
                        top: { title: 'Top' },
                        left: { title: 'Left' },
                        height: { title: 'Height' },
                        width: { title: 'Width' },
                        rotate: { title: 'Rotate' }
                    },
                    dialogs: {
                        ok: { text: '<img alt="icon" src="https://cdn.kidoju.com/images/o_collection/svg/office/ok.svg" class="k-image">OK' },
                        cancel: { text: '<img alt="icon" src="https://cdn.kidoju.com/images/o_collection/svg/office/close.svg" class="k-image">Cancel' }
                    },
                    messages: {
                        invalidAltText: 'A(n) {0} on page {1} requires some alternate text in display attributes.',
                        invalidAudioFile: 'A(n) {0} on page {1} requires an mp3 file in display attributes.',
                        invalidColor: 'A(n) {0} on page {1} has an invalid color in display attributes.',
                        invalidData: 'A(n) {0} on page {1} requires values in display attributes.',
                        invalidDescription: 'A(n) {0} named `{1}` on page {2} requires a question in test logic.',
                        invalidDropValue: 'A(n) {0} on page {1} requires a drop value in test logic.',
                        invalidFailure: 'A(n) {0} named `{1}` on page {2} has a failure score higher than the omit score or zero in test logic.',
                        invalidFormula: 'A(n) {0} on page {1} requires a formula in display attributes.',
                        invalidImageFile: 'A(n) {0} on page {1} requires an image file in display attributes.',
                        invalidName: 'A(n) {0} named `{1}` on page {2} has an invalid name.',
                        invalidSolution: 'A(n) {0} named `{1}` on page {2} requires a solution in test logic.',
                        invalidStyle: 'A(n) {0} on page {1} has an invalid style in display attributes.',
                        invalidSuccess: 'A(n) {0} named `{1}` on page {2} has a success score lower than the omit score or zero in test logic.',
                        invalidText: 'A(n) {0} on page {1} requires some text in display attributes.',
                        invalidValidation: 'A(n) {0} named `{1}` on page {2} requires a validation formula in test logic.',
                        invalidVideoFile: 'A(n) {0} on page {1} requires an mp4 file in display attributes.'
                    }
                });
            }

            if (tools instanceof kendo.Observable) {

                if (tools.audio instanceof Tool) {
                    // Description
                    tools.audio.constructor.prototype.description = 'Audio Player';
                    // Attributes
                    attributes = tools.audio.constructor.prototype.attributes;
                    attributes.autoplay.title = 'Autoplay';
                    attributes.mp3.title = 'MP3 File';
                    attributes.ogg.title = 'OGG File';
                }

                if (tools.chart instanceof Tool) {
                    // Description
                    tools.chart.constructor.prototype.description = 'Chart';
                    // Attributes
                    attributes = tools.chart.constructor.prototype.attributes;
                    attributes.type.title = 'Type';
                    attributes.title.title = 'Title';
                    attributes.categories.title = 'Categories';
                    attributes.values.title = 'Values';
                    attributes.legend.title = 'Legend';
                    attributes.data.title = 'Data';
                    attributes.style.title = 'Style';
                }

                if (tools.chargrid instanceof Tool) {
                    // Description
                    tools.chargrid.constructor.prototype.description = 'Character Grid';
                    // Attributes
                    attributes = tools.chargrid.constructor.prototype.attributes;
                    attributes.blank.title = 'Blank';
                    attributes.columns.title = 'Columns';
                    attributes.layout.title = 'Layout';
                    attributes.rows.title = 'Rows';
                    attributes.whitelist.title = 'Whitelist';
                    attributes.gridFill.title = 'Grid Fill';
                    attributes.gridStroke.title = 'Grid Stroke';
                    // blankFill = gridStroke
                    attributes.selectedFill.title = 'Selection Fill';
                    attributes.lockedFill.title = 'Locked Fill';
                    // lockedColor = valueColor = fontColor
                    attributes.fontColor.title = 'Font Color';
                    // Properties
                    properties = tools.chargrid.constructor.prototype.properties;
                    properties.name.title = 'Name';
                    properties.question.title = 'Question';
                    properties.solution.title = 'Solution';
                    properties.validation.title = 'Validation';
                    properties.success.title = 'Success';
                    properties.failure.title = 'Failure';
                    properties.omit.title = 'Omit';
                }

                if (tools.connector instanceof Tool) {
                    // Description
                    tools.connector.constructor.prototype.description = 'Connector';
                    // Attributes
                    attributes = tools.connector.constructor.prototype.attributes;
                    attributes.color.title = 'Color';
                    // Properties
                    properties = tools.connector.constructor.prototype.properties;
                    properties.name.title = 'Name';
                    properties.question.title = 'Question';
                    properties.solution.title = 'Solution';
                    properties.validation.title = 'Validation';
                    properties.success.title = 'Success';
                    properties.failure.title = 'Failure';
                    properties.omit.title = 'Omit';
                    properties.disabled.title = 'Disabled';
                }

                if (tools.dropzone instanceof Tool) {
                    // Description
                    tools.dropzone.constructor.prototype.description = 'Drop Zone';
                    // Attributes
                    attributes = tools.dropzone.constructor.prototype.attributes;
                    attributes.center.title = 'Centre';
                    attributes.text.defaultValue = false;
                    attributes.style.title = 'Style';
                    attributes.text.title = 'Text';
                    attributes.text.defaultValue = 'Please drop here.';
                    // Properties
                    properties = tools.dropzone.constructor.prototype.properties;
                    properties.name.title = 'Name';
                    properties.question.title = 'Question';
                    properties.solution.title = 'Solution';
                    properties.validation.title = 'Validation';
                    properties.success.title = 'Success';
                    properties.failure.title = 'Failure';
                    properties.omit.title = 'Omit';
                    properties.disabled.title = 'Disable';
                }

                if (tools.image instanceof Tool) {
                    // Description
                    tools.image.constructor.prototype.description = 'Image';
                    // Attributes
                    attributes = tools.image.constructor.prototype.attributes;
                    attributes.alt.title = 'Text';
                    attributes.alt.defaultValue = 'Image';
                    attributes.src.title = 'Source';
                    attributes.src.defaultValue = 'cdn://images/o_collection/svg/office/painting_landscape.svg';
                    attributes.style.title = 'Style';
                    // Properties
                    properties = tools.image.constructor.prototype.properties;
                    properties.draggable.title = 'Draggable';
                    properties.dropValue.title = 'Value';
                }

                if (tools.imageset instanceof Tool) {
                    // Description
                    tools.imageset.constructor.prototype.description = 'Image';
                    // Attributes
                    attributes = tools.imageset.constructor.prototype.attributes;
                    attributes.style.title = 'Style';
                    attributes.data.title = 'Images';
                    attributes.data.defaultValue = [{ text: 'Image set', image: 'cdn://images/o_collection/svg/office/photos.svg' }];
                    // Properties
                    properties = tools.imageset.constructor.prototype.properties;
                    properties.name.title = 'Name';
                    properties.question.title = 'Question';
                    properties.solution.title = 'Solution';
                    properties.validation.title = 'Validation';
                    properties.success.title = 'Success';
                    properties.failure.title = 'Failure';
                    properties.omit.title = 'Omit';
                }

                if (tools.label instanceof Tool) {
                    // Description
                    tools.label.constructor.prototype.description = 'Label';
                    // Attributes
                    attributes = tools.label.constructor.prototype.attributes;
                    attributes.style.title = 'Style';
                    attributes.text.title = 'Text';
                    attributes.text.defaultValue = 'Label';
                    // Properties
                    properties = tools.label.constructor.prototype.properties;
                    properties.draggable.title = 'Draggable';
                    properties.dropValue.title = 'Value';
                }

                if (tools.mathexpression instanceof Tool) {
                    // Description
                    tools.mathexpression.constructor.prototype.description = 'Mathematic Expression';
                    // Attributes
                    attributes = tools.mathexpression.constructor.prototype.attributes;
                    attributes.formula.title = 'Formula';
                    attributes.formula.defaultValue = '\\sum_{n=1}^{\\infty}2^{-n}=1';
                    attributes.inline.title = 'Inline';
                    attributes.inline.defaultValue = false;
                    attributes.style.title = 'Style';
                }

                if (tools.multiquiz instanceof Tool) {
                    // Description
                    tools.multiquiz.constructor.prototype.description = 'MultiQuiz';
                    // Attributes
                    attributes = tools.multiquiz.constructor.prototype.attributes;
                    attributes.data.title = 'Values';
                    attributes.data.defaultValue = [{ text: 'Option 1', image: 'cdn://images/o_collection/svg/office/hand_count_one.svg' }, { text: 'Option 2', image: 'cdn://images/o_collection/svg/office/hand_point_up.svg' }];
                    attributes.groupStyle.title = 'Group Style';
                    attributes.itemStyle.title = 'Item Style';
                    attributes.mode.title = 'Mode';
                    attributes.selectedStyle.title = 'Select. Style';
                    attributes.shuffle.title = 'Shuffle';
                    // Properties
                    properties = tools.multiquiz.constructor.prototype.properties;
                    properties.name.title = 'Name';
                    properties.question.title = 'Question';
                    properties.solution.title = 'Solution';
                    properties.validation.title = 'Validation';
                    properties.success.title = 'Success';
                    properties.failure.title = 'Failure';
                    properties.omit.title = 'Omit';
                }

                if (tools.quiz instanceof Tool) {
                    // Description
                    tools.quiz.constructor.prototype.description = 'Quiz';
                    // Attributes
                    attributes = tools.quiz.constructor.prototype.attributes;
                    attributes.data.title = 'Values';
                    attributes.data.defaultValue = [{ text: 'True', image: 'cdn://images/o_collection/svg/office/ok.svg' }, { text: 'False', image: 'cdn://images/o_collection/svg/office/error.svg' }];
                    attributes.groupStyle.title = 'Group Style';
                    attributes.itemStyle.title = 'Item Style';
                    attributes.mode.title = 'Mode';
                    attributes.selectedStyle.title = 'Select. Style';
                    attributes.shuffle.title = 'Shuffle';
                    // Properties
                    properties = tools.quiz.constructor.prototype.properties;
                    properties.name.title = 'Name';
                    properties.question.title = 'Question';
                    properties.solution.title = 'Solution';
                    properties.validation.title = 'Validation';
                    properties.success.title = 'Success';
                    properties.failure.title = 'Failure';
                    properties.omit.title = 'Omit';
                }

                if (tools.selector instanceof Tool) {
                    // Description
                    tools.selector.constructor.prototype.description = 'Selector';
                    // Attributes
                    attributes = tools.selector.constructor.prototype.attributes;
                    attributes.color.title = 'Color';
                    attributes.shape.title = 'Shape';
                    // Properties
                    properties = tools.selector.constructor.prototype.properties;
                    properties.name.title = 'Name';
                    properties.question.title = 'Question';
                    properties.solution.title = 'Solution';
                    properties.validation.title = 'Validation';
                    properties.success.title = 'Success';
                    properties.failure.title = 'Failure';
                    properties.omit.title = 'Omit';
                    properties.disabled.title = 'Disable';
                }

                if (tools.table instanceof Tool) {
                    // Description
                    tools.table.constructor.prototype.description = 'Static Table';
                    // Attributes
                    attributes = tools.table.constructor.prototype.attributes;
                    attributes.columns.title = 'Columns';
                    attributes.rows.title = 'Rows';
                    attributes.data.title = 'Data';
                }

                if (tools.textarea instanceof Tool) {
                    // Description
                    tools.textarea.constructor.prototype.description = 'TextArea';
                    // Attributes
                    attributes = tools.textarea.constructor.prototype.attributes;
                    attributes.style.title = 'Style';
                    // Properties
                    properties = tools.textarea.constructor.prototype.properties;
                    properties.name.title = 'Name';
                    properties.question.title = 'Question';
                    properties.solution.title = 'Solution';
                    properties.validation.title = 'Validation';
                    properties.success.title = 'Success';
                    properties.failure.title = 'Failure';
                    properties.omit.title = 'Omit';
                }

                if (tools.textbox instanceof Tool) {
                    // Description
                    tools.textbox.constructor.prototype.description = 'TextBox';
                    // Attributes
                    attributes = tools.textbox.constructor.prototype.attributes;
                    attributes.mask.title = 'Mask';
                    attributes.style.title = 'Style';
                    // Properties
                    properties = tools.textbox.constructor.prototype.properties;
                    properties.name.title = 'Name';
                    properties.question.title = 'Question';
                    properties.solution.title = 'Solution';
                    properties.validation.title = 'Validation';
                    properties.success.title = 'Success';
                    properties.failure.title = 'Failure';
                    properties.omit.title = 'Omit';
                    properties.disabled.title = 'Disable';
                }

                if (tools.video instanceof Tool) {
                    // Description
                    tools.video.constructor.prototype.description = 'Video Player';
                    // Attributes
                    attributes = tools.video.constructor.prototype.attributes;
                    attributes.autoplay.title = 'Autoplay';
                    attributes.toolbarHeight.title = 'Toolbar Height';
                    attributes.mp4.title = 'MP4 File';
                    attributes.ogv.title = 'OGV File';
                    attributes.wbem.title = 'Fichier WBEM';
                }
            }

        }

    })(window.kendo.jQuery);

    /* jshint +W074 */
    /* jshint +W071 */

    return window.kendo;

}, __webpack_require__(0));


/***/ })

});
//# sourceMappingURL=app.culture.en.chunk.js.map?v=0.3.4
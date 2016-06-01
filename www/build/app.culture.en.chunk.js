/*! Copyright ©2013-2016 Memba® Sarl. All rights reserved. - Version 0.2.17 dated 6/1/2016 */
webpackJsonp([1],{

/***/ 325:
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
	        __webpack_require__(326)
	        // '../vendor/kendo/messages/kendo.messages.en-US.js',
	        // '../messages/kidoju.messages.en.js'
	    ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
	                settings: 'Settings'
	            },
	            // Favourites view
	            favourites: {
	                viewTitle: 'Favourites'
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
	                viewTitle: 'Search'
	            }
	        };
	        window.kendo.culture('en-GB');
	    }());
	
	    return window.app;
	
	}, __webpack_require__(271));


/***/ },

/***/ 326:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/** 
	 * Kendo UI v2016.2.504 (http://www.telerik.com/kendo-ui)                                                                                                                                               
	 * Copyright 2016 Telerik AD. All rights reserved.                                                                                                                                                      
	 *                                                                                                                                                                                                      
	 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
	 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
	 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	                                                                                                                                                                                                       
	
	*/
	
	(function(f){
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(276)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
//# sourceMappingURL=app.culture.en.chunk.js.map?v=0.2.17
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        './window.assert',
        './window.logger',
        './app.logger',
        './app.rapi'
    ], f);
})(function () {

    'use strict';

    /* This function has too many statements. */
    /* jshint: -W071 */

    (function (undefined) {

        var app = window.app = window.app || {};
        app.constants = {
            ajaxTimeout: 5000
        };

    }());

    /* jshint: +W071 */

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });


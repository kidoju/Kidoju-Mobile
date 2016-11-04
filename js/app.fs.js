/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */


(function (f, define) {
    'use strict';
    define([
        './window.assert',
        './window.logger'
    ], f);
})(function (lf) {

    'use strict';

    (function ($, undefined) {

        var app = window.app = window.app || {};
        var mobile = app.mobile = app.mobile || {};
        var NUMBER = 'number';
        var OBJECT = 'object';
        var STRING = 'string';
        var UNDEFINED = 'undefined';
        var STORAGE_SIZE = 5 * 1024 * 1024;
        // The following allows ROOT[window.TEMPORARY] and ROOT[window.PERSISTENT];
        var ROOT = ['cdvfile://localhost/temporary/', 'cdvfile://localhost/persistent/'];

        /**
         * The FileSystem prototype
         * @constructor
         */
        mobile.FileSystem = function () {};

        /**
         * Initialization
         * @param type
         */
        mobile.FileSystem.prototype.init = function (type) {
            var that = this;
            var dfd = $.Deferred();
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
            if (window.requestFileSystem && $.type(window.TEMPORARY) === NUMBER) {
                if ($.type(that._fs) === UNDEFINED) {
                    // see https://www.html5rocks.com/en/tutorials/file/filesystem/#toc-requesting
                    window.requestFileSystem(
                        window.TEMPORARY, // window.PERSISTENT
                        STORAGE_SIZE,
                        function (fs) {
                            that._fs = fs;
                            dfd.resolve(fs);
                        },
                        function (fileError) {
                            dfd.reject(fileError);
                        }
                    );
                } else {
                    dfd.resolve(that._fs);
                }
            } else {
                dfd.reject(new Error('HTML 5 FileSystem API not supported'));
            }
            return dfd.promise();
        };

        /**
         * Make directory
         * @param path (from that._fs.root)
         */
        mobile.FileSystem.prototype.makeDir = function (path) {

            function makeDir(root, folders) {
                // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
                if (folders[0] == '.' || folders[0] == '') {
                    folders = folders.slice(1);
                }
                root.getDirectory(
                    folders[0],
                    { create: true },
                    function (dirEntry) {
                        // Recursively add the new subfolder (if we still have another to create).
                        if (folders.length) {
                            makeDir(dirEntry, folders.slice(1));
                        }
                        // TODO: dfd.resolve
                    },
                    function (fileError) {
                        dfd.reject(fileError);
                    }
                );
            }

            var that = this;
            var dfd = $.Deferred();
            if (that._fs) {
                makeDir(fs.root, path.split('/'));
            } else {
                dfd.reject(new Error('initialize FileSystem'));
            }
            return dfd.promise();
        };

        /**
         * Create directory
         */
        mobile.FileSystem.prototype.createFile = function (path) {

        };

        /**
         * File download
         * @param source
         * @param target
         */
        mobile.FileSystem.prototype.download = function (source, target) {
            var that = this;
            var dfd = $.Deferred();
            if (that._fs) {

            } else {
                dfd.reject(new Error('initialize FileSystem'));
            }
            return dfd.promise();
        };

        /**
         * File upload
         * @param source
         * @param target
         */
        // mobile.FileSystem.prototype.upload = function (source, target) {};

    }(window.jQuery));

    return pongodb.Database;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

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
})(function () {

    'use strict';

    (function ($, undefined) {

        var app = window.app = window.app || {};
        var mobile = app.mobile = app.mobile || {};
        var STRING = 'string';
        var OBJECT = 'object';
        var FUNCTION = 'function';
        var UNDEFINED = 'undefined';
        var STORAGE_SIZE = 100 * 1024 * 1024; // 100 MB
        // The following allows FS_ROOT[window.TEMPORARY] and FS_ROOT[window.PERSISTENT];
        // var FS_ROOT = ['cdvfile://localhost/temporary/', 'cdvfile://localhost/persistent/'];

        /**
         * The FileSystem prototype
         * @constructor
         */
        mobile.FileSystem = function () {};

        /**
         * Initialize the temporary file system
         * @private
         */
        mobile.FileSystem.prototype._initTemporary = function () {
            var that = this;
            var dfd = $.Deferred();
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
            window.storageInfo = window.storageInfo || window.webkitStorageInfo;
            if (window.requestFileSystem && window.storageInfo && $.type(window.TEMPORARY) !== UNDEFINED) {
                if ($.type(that._temporary) === UNDEFINED) {
                    // see https://www.html5rocks.com/en/tutorials/file/filesystem/#toc-requesting
                    // TODO use window.navigator.webkitTemporaryStorage
                    window.storageInfo.requestQuota(
                        window.TEMPORARY,
                        STORAGE_SIZE,
                        function(grantedBytes) {
                            window.requestFileSystem(
                                window.TEMPORARY,
                                grantedBytes,
                                function (temporary) {
                                    that._temporary = temporary;
                                    dfd.resolve(temporary);
                                },
                                dfd.reject
                            );
                        },
                        dfd.reject
                    );
                } else {
                    dfd.resolve(that._temporary);
                }
            } else {
                dfd.reject(new Error('HTML 5 FileSystem API not supported'));
            }
            return dfd.promise();
        };

        /**
         * Initialize the persistent file system
         * @private
         */
        mobile.FileSystem.prototype._initPersistent = function () {
            var that = this;
            var dfd = $.Deferred();
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
            window.storageInfo = window.storageInfo || window.webkitStorageInfo;
            if (window.requestFileSystem && window.storageInfo && $.type(window.PERSISTENT) !== UNDEFINED) {
                if ($.type(that._persistent) === UNDEFINED) {
                    // see https://www.html5rocks.com/en/tutorials/file/filesystem/#toc-requesting
                    // TODO use window.navigator.webkitPersistentStorage
                    window.storageInfo.requestQuota(
                        window.PERSISTENT,
                        STORAGE_SIZE,
                        function(grantedBytes) {
                            window.requestFileSystem(
                                window.PERSISTENT,
                                grantedBytes,
                                function (persistent) {
                                    that._persistent = persistent;
                                    dfd.resolve(persistent);
                                },
                                dfd.reject
                            );
                        },
                        dfd.reject
                    );
                } else {
                    dfd.resolve(that._persistent);
                }
            } else {
                dfd.reject(new Error('HTML 5 FileSystem API not supported'));
            }
            return dfd.promise();
        };

        /**
         * Get the underlying file system
         * @param type
         * @returns {*}
         * @private
         */
        mobile.FileSystem.prototype._getFileSystem = function (type) {
            if (type === window.PERSISTENT) {
                return this._persistent;
            } else {
                return this._temporary; // Temporary by default
            }
        };

        /**
         * Initialization of FileSystem
         */
        mobile.FileSystem.prototype.init = function () {
            var that = this;
            return $.when(
                that._initTemporary(),  // Temporary by default
                that._initPersistent()
            )
        };

        /**
         * Get directory entry
         * @see https://www.html5rocks.com/en/tutorials/file/filesystem/#toc-dir
         * @param path (from that._fs.root)
         * @param type
         */
        mobile.FileSystem.prototype.getDirectoryEntry = function (path, type) {
            type = type || window.TEMPORARY;
            assert.type(STRING, path, assert.format(assert.messages.type.default, 'path', STRING));
            assert.ok(type === window.TEMPORARY || type === window.PERSISTENT, '`type` should either be window.TEMPORARY or window.PERSISTENT');

            function makeDir(root, folders) {
                // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
                if (folders[0] === '.' || folders[0] === '') {
                    folders = folders.slice(1);
                }
                root.getDirectory(
                    folders[0],
                    { create: true },
                    function (directoryEntry) {
                        // Recursively add the new subfolder (if we still have another to create).
                        if (folders.length) {
                            makeDir(directoryEntry, folders.slice(1));
                        } else {
                            dfd.resolve(directoryEntry);
                        }
                    },
                    dfd.reject
                );
            }

            var that = this;
            var dfd = $.Deferred();
            var fs = that._getFileSystem(type);
            if ($.type(fs) !== UNDEFINED) {
                // assert.instanceof(window.DirectoryEntry, fs.root, assert.format(assert.messages.instanceof.default, 'fs.root', 'window.DirectoryEntry'));
                makeDir(fs.root, path.split('/'));
            } else {
                dfd.reject(new Error('FileSystem has not been initialized'));
            }
            return dfd.promise();
        };

        /**
         * Create file
         * @param directoryEntry (determines file storage type)
         * @param fileName
         */
        mobile.FileSystem.prototype.getFileEntry = function (directoryEntry, fileName) {
            assert.type(OBJECT, directoryEntry, assert.format(assert.messages.type.default, 'directoryEntry', OBJECT));
            assert.type(FUNCTION, directoryEntry.getFile, assert.format(assert.messages.type.default, 'directoryEntry.getFile', FUNCTION));
            assert.type(STRING, fileName, assert.format(assert.messages.type.default, 'fileName', STRING));
            var dfd = $.Deferred();
            directoryEntry.getFile(
                fileName,
                { create: true, exclusive: false },
                dfd.resolve,
                dfd.reject
            );
            return dfd.promise();
        };

        /**
         * File download
         * @see https://github.com/apache/cordova-plugin-file-transfer#download-a-binary-file-to-the-application-cache-
         * @param remoteUrl
         * @param fileEntry
         * @param headers
         */
        mobile.FileSystem.prototype.download = function (remoteUrl, fileEntry, headers) {
            assert.type(STRING, remoteUrl, assert.format(assert.messages.type.default, 'remoteUrl', STRING));
            assert.type(OBJECT, fileEntry, assert.format(assert.messages.type.default, 'fileEntry', OBJECT));
            assert.isOptionalObject(headers, assert.format(assert.messages.isOptionalObject.default, 'headers'));

            var dfd = $.Deferred();
            var fileTransfer = new window.FileTransfer();
            var fileURL = fileEntry.toURL();

            fileTransfer.download(
                remoteUrl,
                fileURL,
                dfd.resolve,
                dfd.reject,
                false, //trustAllHosts
                $.isPlainObject(headers) ? { headers: headers } : {}
            );

            return dfd.promise();
        };

        /**
         * File upload
         * @see https://github.com/apache/cordova-plugin-file-transfer#upload-a-file-
         * @param fileEntry
         * @param remoteUrl
         */
        // mobile.FileSystem.prototype.upload = function (fileEntry, remoteUrl) {};

        /**
         * File saveAS
         * See https://eligrey.com/blog/saving-generated-files-on-the-client-side/
         */

    }(window.jQuery));

    // return mobile;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

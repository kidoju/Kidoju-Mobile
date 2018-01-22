/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
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
        var assert = window.assert;
        var logger = new window.Logger('app.fs');
        var STRING = 'string';
        var OBJECT = 'object';
        var UNDEFINED = 'undefined';
        var DOT_TEMP = '.tmp';
        var PERSISTENT_STORAGE_SIZE = 100 * 1024 * 1024; // 100 MB
        var TEMPORARY_STORAGE_SIZE = 10 * 1024 * 1024; // 10 MB
        // The following allows FS_ROOT[window.TEMPORARY] and FS_ROOT[window.PERSISTENT];
        // var FS_ROOT = ['cdvfile://localhost/temporary/', 'cdvfile://localhost/persistent/'];
        var FS_ERROR_MISSING_API = 'HTML 5 FileSystem API not supported';
        var FS_ERROR_INIT = 'FileSystem has not been initialized';

        /**
         * The FileSystem prototype
         * @constructor
         */
        var FileSystem = app.FileSystem = function () {};

        /**
         * File error codes
         * @see https://developer.mozilla.org/en-US/docs/Web/API/FileError
         * @see https://github.com/apache/cordova-plugin-file/blob/master/README.md#list-of-error-codes-and-meanings
         * @returns {*}
         * @private
         */
        FileSystem.FileErrorCodes = {
            NOT_FOUND_ERR: 1,
            SECURITY_ERR: 2,
            ABORT_ERR: 3,
            NOT_READABLE_ERR: 4,
            ENCODING_ERR: 5,
            NO_MODIFICATION_ALLOWED_ERR: 6,
            INVALID_STATE_ERR: 7,
            SYNTAX_ERR: 8,
            INVALID_MODIFICATION_ERR: 9,
            QUOTA_EXCEEDED_ERR: 10,
            TYPE_MISMATCH_ERR: 11,
            PATH_EXISTS_ERR: 12
        };

        /**
         * FileTransfer error codes
         * @see https://github.com/apache/cordova-plugin-file-transfer#filetransfererror
         * @returns {*}
         * @private
         */
        FileSystem.FileTransferErrorCodes = {
            FILE_NOT_FOUND_ERR: 1,
            INVALID_URL_ERR: 2,
            CONNECTION_ERR: 3,
            ABORT_ERR: 4,
            NOT_MODIFIED_ERR: 5
        };

        /**
         * Initialize the temporary file system
         * @private
         */
        FileSystem.prototype._initTemporary = function () {
            var that = this;
            var dfd = $.Deferred();
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
            window.storageInfo = window.storageInfo || window.webkitStorageInfo; // Check window.navigator.webkitTemporaryStorage;
            logger.debug({
                message: 'Initializing temporary file system',
                method: 'FileSystem.prototype._initTemporary',
                data: { requestFileSystem: $.type(window.requestFileSystem) !== UNDEFINED, storageInfo: $.type(window.storageInfo) !== UNDEFINED }
            });
            window.storageInfo = window.storageInfo || {
                // Stub requestQuota for systems that do not implement/require it, including iOS Cordova
                requestQuota: function (type, requestedBytes, successCallback, errorCallback) {
                    // @see https://github.com/apache/cordova-plugin-file#create-a-temporary-file
                    // @see https://www.html5rocks.com/en/tutorials/file/filesystem/#toc-requesting
                    successCallback(requestedBytes);
                }
            };
            if (window.requestFileSystem && $.type(window.TEMPORARY) !== UNDEFINED) {
                if ($.type(that._temporary) === UNDEFINED) {
                    window.storageInfo.requestQuota(
                        window.TEMPORARY,
                        TEMPORARY_STORAGE_SIZE,
                        function (grantedBytes) {
                            window.requestFileSystem(
                                window.TEMPORARY,
                                grantedBytes,
                                function (temporary) {
                                    that._temporary = temporary;
                                    dfd.resolve(temporary);
                                    logger.debug({
                                        message: 'Temporary file system granted',
                                        method: 'FileSystem.prototype._initTemporary',
                                        data: { grantedBytes: grantedBytes }
                                    });
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
                dfd.reject(new Error(FS_ERROR_MISSING_API));
            }
            return dfd.promise();
        };

        /**
         * Initialize the persistent file system
         * @private
         */
        FileSystem.prototype._initPersistent = function () {
            var that = this;
            var dfd = $.Deferred();
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem; // Check window.navigator.webkitPersistentStorage;
            window.storageInfo = window.storageInfo || window.webkitStorageInfo;
            logger.debug({
                message: 'Initializing persistent file system',
                method: 'FileSystem.prototype._initPersistent',
                data: { requestFileSystem: $.type(window.requestFileSystem) !== UNDEFINED, storageInfo: $.type(window.storageInfo) !== UNDEFINED }
            });
            window.storageInfo = window.storageInfo || {
                // Stub requestQuota for systems that do not implement/require it, including iOS Cordova
                requestQuota: function (type, requestedBytes, successCallback, errorCallback) {
                    // @see https://github.com/apache/cordova-plugin-file#create-a-persistent-file-
                    // @see https://www.html5rocks.com/en/tutorials/file/filesystem/#toc-requesting
                    successCallback(requestedBytes);
                }
            };
            if (window.requestFileSystem && $.type(window.PERSISTENT) !== UNDEFINED) {
                if ($.type(that._persistent) === UNDEFINED) {
                    window.storageInfo.requestQuota(
                        window.PERSISTENT,
                        PERSISTENT_STORAGE_SIZE,
                        function (grantedBytes) {
                            window.requestFileSystem(
                                window.PERSISTENT,
                                grantedBytes,
                                function (persistent) {
                                    that._persistent = persistent;
                                    dfd.resolve(persistent);
                                    logger.debug({
                                        message: 'Persistent file system granted',
                                        method: 'FileSystem.prototype._initPersistent',
                                        data: { grantedBytes: grantedBytes }
                                    });
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
                dfd.reject(new Error(FS_ERROR_MISSING_API));
            }
            return dfd.promise();
        };

        /**
         * Get the underlying file system
         * @param type
         * @returns {*}
         * @private
         */
        FileSystem.prototype._getFileSystem = function (type) {
            if (type === window.PERSISTENT) {
                return this._persistent;
            } else {
                return this._temporary; // Temporary by default
            }
        };

        /**
         * Initialization of FileSystem
         */
        FileSystem.prototype.init = function () {
            var that = this;
            return $.when(
                that._initTemporary(),  // Temporary by default
                that._initPersistent()
            );
        };

        /**
         * Get directory entry
         * @see https://www.html5rocks.com/en/tutorials/file/filesystem/#toc-dir
         * @param path (from that._fs.root)
         * @param type
         */
        FileSystem.prototype.getDirectoryEntry = function (path, type) {
            type = type || window.TEMPORARY;
            assert.type(STRING, path, assert.format(assert.messages.type.default, 'path', STRING));
            assert.ok(type === window.TEMPORARY || type === window.PERSISTENT, '`type` should either be window.TEMPORARY or window.PERSISTENT');

            logger.debug({
                message: 'Getting directory',
                method: 'FileSystem.prototype.getDirectoryEntry',
                data: { path: path, type: type }
            });

            function makeDir(root, folders) {
                assert.type(OBJECT, root, assert.format(assert.messages.type.default, 'root', OBJECT));
                assert.ok(root.isDirectory, 'root should be a DirectoryEntry and therefore return directoryEntry.isDirectory === true');
                assert.isArray(folders, assert.format(assert.messages.isArray.default, 'folders'));

                // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
                if (folders[0] === '.' || folders[0] === '') {
                    folders = folders.slice(1);
                }
                if (folders.length === 0) {
                    return dfd.resolve(root);
                }

                // Note: cdvfile urls do not work in the browser and in WKWebViewEngine - https://issues.apache.org/jira/browse/CB-10141
                // To test WKWebView against UIWebView, check https://stackoverflow.com/questions/28795476/detect-if-page-is-loaded-inside-wkwebview-in-javascript
                // var rootURL = window.cordova && window.device && window.device.platform !== 'browser' && !window.indexedDB  ?
                // var rootURL = window.cordova && window.device && window.device.platform !== 'browser' && !(window.webkit && window.webkit.messageHandlers) ?
                //     root.toInternalURL() : root.toURL();
                var rootURL = root.toURL();

                logger.debug({
                    message: 'Calling DirectoryEntry.getDirectory',
                    method: 'FileSystem.prototype.getDirectoryEntry',
                    data: { rootURL: rootURL, folder: folders[0] }
                });

                root.getDirectory(
                    folders[0],
                    { create: true },
                    function (directoryEntry) {
                        // Recursively add the new subfolder (if we still have another to create).
                        if (folders.length > 1) {
                            makeDir(directoryEntry, folders.slice(1));
                        } else {
                            dfd.resolve(directoryEntry);
                        }
                    },
                    dfd.reject
                );
            }

            var dfd = $.Deferred();
            var fs = this._getFileSystem(type);
            if ($.type(fs) !== UNDEFINED) {
                // assert.instanceof(window.DirectoryEntry, fs.root, assert.format(assert.messages.instanceof.default, 'fs.root', 'window.DirectoryEntry'));
                makeDir(fs.root, path.split('/'));
            } else {
                dfd.reject(new Error(FS_ERROR_INIT));
            }
            return dfd.promise();
        };

        /**
         * Create file
         * @param directoryEntry (determines file storage type)
         * @param fileName
         */
        FileSystem.prototype.getFileEntry = function (directoryEntry, fileName) {
            assert.type(OBJECT, directoryEntry, assert.format(assert.messages.type.default, 'directoryEntry', OBJECT));
            assert.ok(directoryEntry.isDirectory, 'directoryEntry should be a DirectoryEntry and therefore return directoryEntry.isDirectory === true');
            assert.type(STRING, fileName, assert.format(assert.messages.type.default, 'fileName', STRING));

            // Note: cdvfile urls do not work in the browser and in WKWebViewEngine - https://issues.apache.org/jira/browse/CB-10141
            // To test WKWebView against UIWebView, check https://stackoverflow.com/questions/28795476/detect-if-page-is-loaded-inside-wkwebview-in-javascript
            // var directoryURL = window.cordova && window.device && window.device.platform !== 'browser' && !window.indexedDB  ?
            // var directoryURL = window.cordova && window.device && window.device.platform !== 'browser' && !(window.webkit && window.webkit.messageHandlers) ?
            //    directoryEntry.toInternalURL() : directoryEntry.toURL();
            var directoryURL = directoryEntry.toURL();

            logger.debug({
                message: 'Getting file entry',
                method: 'FileSystem.prototype.getFileEntry',
                data: { directoryURL: directoryURL, fileName: fileName }
            });

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
        FileSystem.prototype.download = function (remoteUrl, fileEntry, headers) {
            assert.type(STRING, remoteUrl, assert.format(assert.messages.type.default, 'remoteUrl', STRING));
            assert.ok(fileEntry.isFile, 'fileEntry should be a FileEntry and therefore return fileEntry.isFile === true');
            assert.isOptionalObject(headers, assert.format(assert.messages.isOptionalObject.default, 'headers'));

            var dfd = $.Deferred();

            /*
            var fileTransfer = new window.FileTransfer();

            // Note: cdvfile urls do not work in the browser and in WKWebViewEngine - https://issues.apache.org/jira/browse/CB-10141
            // To test WKWebView against UIWebView, check https://stackoverflow.com/questions/28795476/detect-if-page-is-loaded-inside-wkwebview-in-javascript
            var fileURL = window.cordova && window.device && window.device.platform !== 'browser' && !(window.webkit && window.webkit.messageHandlers) ?
                fileEntry.toInternalURL() : fileEntry.toURL();

            logger.debug({
                message: 'Downloading a file',
                method: 'FileSystem.prototype.download',
                data: { remoteUrl: remoteUrl, fileURL: fileURL, headers: JSON.stringify(headers) }
            });

            fileTransfer.onProgress = dfd.notify; // Consider reviewing event parameter passed to dfd.notify without formatting

            // An error (especially no connection) erases the existing file instead of updating
            // @see https://issues.apache.org/jira/browse/CB-7073
            // So we download with DOT_TMP extension and rename (moveTo) without DOT_TMP upon successful download
            fileTransfer.download(
                remoteUrl,
                fileURL + DOT_TEMP,
                function (fileEntry) {
                    fileEntry.getParent(
                        function (directoryEntry) {
                            fileEntry.moveTo(
                                directoryEntry,
                                fileEntry.name.slice(0, -DOT_TEMP.length),
                                dfd.resolve,
                                dfd.reject
                            );
                            dfd.resolve(fileEntry);
                        },
                        dfd.reject
                    );
                },
                dfd.reject,
                false, // trustAllHosts
                $.isPlainObject(headers) ? { headers: headers } : {}
            );
            */

            /*******************************************************************************************************
             * cordova-plugin-filetransfer is now deprecated
             * @see https://cordova.apache.org/blog/2017/10/18/from-filetransfer-to-xhr2.html
             *******************************************************************************************************/

            var xhr = new window.XMLHttpRequest();

            // Make sure you add the domain name to the Content-Security-Policy <meta> element.
            xhr.open('GET', remoteUrl, true);

            // Define how you want the XHR data to come back
            xhr.responseType = 'blob';

            // Set request headers
            if ($.isPlainObject(headers)) {
                for (var header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header, headers[header]);
                    }
                }
            }

            // Save file when loaded
            xhr.onload = function (e) {
                var blob = xhr.response; // Note: not xhr.responseText
                if (blob) {
                    fileEntry.createWriter(
                        function (fileWriter) {
                            fileWriter.onwriteend = dfd.resolve;
                            fileWriter.onerror = dfd.reject;
                            fileWriter.write(blob);
                        },
                        dfd.reject
                    );
                } else {
                    dfd.reject(new Error('XMLHttpRequest missing body'));
                }
            };

            // Report download progress
            xhr.onprogress = dfd.notify;
            // Report errors
            xhr.onerror = function (e) {
                // e is an XMLHttpRequestProgressEvent
                dfd.reject(new Error('XMLHttpRequest error'));
            };

            // Report cancellation
            xhr.onabort = function () {
                // e is an XMLHttpRequestProgressEvent
                dfd.reject(new Error('XMLHttpRequest aborted'));
            };

            logger.debug({
                message: 'Downloading a file',
                method: 'FileSystem.prototype.download',
                data: { remoteUrl: remoteUrl, headers: JSON.stringify(headers) }
            });

            // Send the request
            xhr.send(null);

            return dfd.promise();
        };

        /**
         * File upload
         * @see https://github.com/apache/cordova-plugin-file-transfer#upload-a-file-
         * @param fileEntry
         * @param remoteUrl
         */
        // FileSystem.prototype.upload = function (fileEntry, remoteUrl) {};

    }(window.jQuery));

    // return app.FileSystem;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

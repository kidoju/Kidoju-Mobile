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
        './window.logger',
        './kidoju.tools',
        './app.logger',
        './app.i18n',
        './app.rapi'
    ], f);
})(function () {

    'use strict';

    /**
     * IMPORTANT
     * Since AssetManager is a Kidoju widget, this could have been in kidoju.data.js
     * but kidoju.data.js has no idea of our S3 infrastructure or the way we store file uris using custom schemes
     *
     * Therefore preferably, this could have been in app.models.js
     * but the transport is dependant upon the tool (set by a component selection) and the summaryId (set by the page url)
     * when app.models is a wrapper for rapi calls which neither know the tool or the summaryId
     * Maybe this could be parameterized but then it would have to be feeded into the AssetManager.
     */

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        var kendo = window.kendo;
        var kidoju = window.kidoju;
        var app = window.app;
        var i18n = app.i18n;
        var rapi = app.rapi;
        var assert = window.assert;
        var logger = new window.Logger('app.assets');
        var STRING = 'string';
        var NUMBER = 'number';
        var ARRAY = 'array';
        var VERSION_HIDDEN_FIELD = 'input[type="hidden"][name="version"]';
        var DATA_SCHEME = 'data://';
        var RX_DATA_URL = /^data:\/\/s\/([^\/]+)\/([^\/]+)\/([^\/]+)$/;

        // Ensure app.assets have been loaded from app.config.jsx
        assert.isPlainObject(app.assets, kendo.format(assert.messages.isPlainObject.default, 'app.assets'));

        /**
         * Set the dataSource transport
         * @type {{create: transport.create, read: transport.read, update: transport.update, destroy: transport.destroy}}
         * Note: When we will organizations, we might consider a summaryTransport and an organizationTransport to fill two separate tabs from an AssetManager
         */
        function transport(tool) {
            return {
                create: function (options) {
                    debugger;
                    // TODO prevent adding duplicates
                    var locale = i18n.locale();
                    var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
                    var data = options.data;
                    assert.instanceof(window.File, data.file, kendo.format(assert.messages.instanceof.default, 'data.file', 'File'));
                    assert.type(NUMBER, data.size, kendo.format(assert.messages.type.default, 'data.size', NUMBER));
                    logger.debug({
                        message: 'getting a secure upload url',
                        method: tool + '.transport.create',
                        data: { language: locale, summaryId: params.summaryId, tool: tool }
                    });
                    rapi.v1.content.getUploadUrl(locale, params.summaryId, data.file)
                        .done(function (uploadUrl) {
                            logger.debug({
                                message: 'uploading to secure url',
                                method: tool + '.transport.create',
                                data: { language: locale, summaryId: params.summaryId, tool: tool, uploadUrl: uploadUrl }
                            });
                            rapi.v1.content.uploadFile(uploadUrl, data.file)
                                .progress(function (e) {
                                    debugger;
                                    if (e.lengthComputable) {
                                        var p = e.loaded / e.total;
                                        debugger;
                                    }
                                })
                                .done(function (response) {
                                    assert.isPlainObject(response, kendo.format(assert.messages.isPlainObject.default, 'response'));
                                    assert.type(STRING, response.name, kendo.format(assert.messages.type.default, 'response.name', STRING));
                                    assert.type(NUMBER, response.size, kendo.format(assert.messages.type.default, 'response.size', NUMBER));
                                    assert.type(STRING, response.type, kendo.format(assert.messages.type.default, 'response.type', STRING));
                                    assert.type(STRING, response.url, kendo.format(assert.messages.type.default, 'response.url', STRING));
                                    response.url = response.url.replace(kidoju.assets[tool].schemes.data, DATA_SCHEME);
                                    logger.debug({
                                        message: 'new file uploaded',
                                        method: tool + '.transport.create',
                                        data: $.extend({ language: locale, summaryId: params.summaryId, tool: tool }, response)
                                    });
                                    options.success({ data: [response], total: 1 });
                                    assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                    app.notification.success(i18n.culture.editor.notifications.fileCreateSuccess);
                                })
                                .fail(function (xhr, status, error) {
                                    logger.error({
                                        message: 'file storage upload error',
                                        method: tool + '.transport.create',
                                        data: { status: status, error: error, response: xhr.responseText }
                                    });
                                    options.error(xhr, status, error);
                                    assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                    app.notification.error(i18n.culture.editor.notifications.fileCreateFailure);
                                });
                        })
                        .fail(function (xhr, status, error) {
                            logger.error({
                                message: 'secure upload url error',
                                method: tool + '.transport.create',
                                data: { status: status, error: error, reponse: xhr.responseText }
                            });
                            options.error(xhr, status, error);
                            assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                            app.notification.error(i18n.culture.editor.notifications.uploadUrlFailure);
                        });
                },
                read: function (options) {
                    var locale = i18n.locale();
                    var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
                    rapi.v1.content.getAllSummaryFiles(locale, params.summaryId)
                        .done(function (response) {
                            assert.isPlainObject(response, kendo.format(assert.messages.isPlainObject.default, 'response'));
                            assert.type(ARRAY, response.data, kendo.format(assert.messages.type.default, 'response.data', ARRAY));
                            assert.type(NUMBER, response.total, kendo.format(assert.messages.type.default, 'response.total', NUMBER));
                            var path = kidoju.assets[tool].schemes.data;
                            $.each(response.data, function (index, data) {
                                assert.isPlainObject(data, kendo.format(assert.messages.isPlainObject.default, 'data'));
                                assert.type(STRING, data.url, kendo.format(assert.messages.type.default, 'data.url', STRING));
                                data.url = data.url.replace(path, DATA_SCHEME);
                            });
                            options.success(response);
                        })
                        .fail(function (xhr, status, error) {
                            logger.error({
                                message: 'file storage read error',
                                method: tool + '.transport.read',
                                data: { status: status, error: error, reponse: xhr.responseText }
                            });
                            options.error(xhr, status, error);
                            assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                            app.notification.error(i18n.culture.editor.notifications.filesLoadFailure);
                        });
                },
                update: function (options) {
                    // Should not be used...
                    options.success(options.data);
                },
                destroy: function (options) {
                    var locale = i18n.locale();
                    var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
                    var data = options.data;
                    assert.isPlainObject(data, kendo.format(assert.messages.isPlainObject.default, 'data'));
                    assert.type(STRING, data.url, kendo.format(assert.messages.type.default, 'data.url', STRING));
                    var matches = data.url.match(RX_DATA_URL);
                    assert.equal(4, matches.length, kendo.format(assert.messages.equal.default, 'matches.length', 4));
                    assert.equal(locale, matches[1], kendo.format(assert.messages.equal.default, 'matches[1]', locale));
                    assert.equal(params.summaryId, matches[2], kendo.format(assert.messages.equal.default, 'matches[2]', params.summaryId));
                    rapi.v1.content.deleteFile(matches[1], matches[2], matches[3])
                        .done(function (response) {
                            logger.debug({
                                message: 'file deleted',
                                method: tool + '.transport.create',
                                data: $.extend({ language: locale, summaryId: params.summaryId, tool: tool }, response)
                            });
                            options.success({ data: [data], total: 1 });
                            assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                            app.notification.success(i18n.culture.editor.notifications.fileDeleteSuccess);
                        })
                        .fail(function (xhr, status, error) {
                            logger.error({
                                message: 'file storage deletion error',
                                method: tool + '.transport.destroy',
                                data: { status: status, error: error, reponse: xhr.responseText }
                            });
                            options.error(xhr, status, error);
                            assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                            app.notification.error(i18n.culture.editor.notifications.fileDeleteFailure);
                        });
                }
            };
        }

        // Note: ./webapp/config.default.json is read by ./web_modules/app.config.jsx to produce app.assets

        // Build audio tool assets
        var audio = app.assets.audio;
        assert.isPlainObject(audio, kendo.format(assert.messages.isPlainObject.default, 'app.assets.audio'));
        kidoju.assets.audio = new kidoju.ToolAssets($.extend(audio, { transport: transport('audio') }));

        // Build icon assets
        var icon = app.assets.icon;
        assert.isPlainObject(icon, kendo.format(assert.messages.isPlainObject.default, 'app.assets.icon'));
        kidoju.assets.icon = new kidoju.ToolAssets($.extend(icon, { transport: null }));

        // Build image tool assets
        var image = app.assets.image;
        assert.isPlainObject(image, kendo.format(assert.messages.isPlainObject.default, 'app.assets.image'));
        kidoju.assets.image = new kidoju.ToolAssets($.extend(image, { transport: transport('image') }));

        // Build video tool assets
        var video = app.assets.video;
        assert.isPlainObject(video, kendo.format(assert.messages.isPlainObject.default, 'app.assets.video'));
        kidoju.assets.video = new kidoju.ToolAssets($.extend(video, { transport: transport('video') }));

        // Log readiness
        logger.debug({
            message: 'Assets configured'
        });

    }(window.jQuery));

    /* jshint +W071 */

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

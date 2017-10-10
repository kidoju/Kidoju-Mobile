/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
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
        './kidoju.widgets.vectordrawing.toolbar', // For the image editor template
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
     *
     * Note that app.assets is built by config.jsx and is a set of config options for asset collections
     * kidoju.assets are the actual assets to be used in kidoju.widgets.assetmanager
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
        var deepExtend = kendo.deepExtend;
        var STRING = 'string';
        var NUMBER = 'number';
        var OBJECT = 'object';
        var VERSION_HIDDEN_FIELD = 'input[type="hidden"][name="version"]';
        // var DATA_SCHEME = 'data://';
        var RX_DATA_URL = /^data:\/\/s\/([^\/]+)\/([^\/]+)\/([^\/]+)$/;

        // Ensure app.assets have been loaded from app.config.jsx
        assert.isPlainObject(app.assets, kendo.format(assert.messages.isPlainObject.default, 'app.assets'));
        assert.isPlainObject(app.assets.audio, kendo.format(assert.messages.isPlainObject.default, 'app.assets.audio'));
        assert.isPlainObject(app.assets.icon, kendo.format(assert.messages.isPlainObject.default, 'app.assets.icon'));
        assert.isPlainObject(app.assets.image, kendo.format(assert.messages.isPlainObject.default, 'app.assets.image'));
        assert.isPlainObject(app.assets.video, kendo.format(assert.messages.isPlainObject.default, 'app.assets.video'));

        /**
         * Editor configurations
         * @type {{}}
         */
        var editors = {

            // audio: { /* TODO */ },

            image: {
                // Open kendo.dataviz.ui.VectorDrawing without New and Open tools
                template: '<div data-role="vectordrawing" data-bind="events: { command: onCommand, dialog: onDialog }" data-toolbar="' + kendo.htmlEncode(JSON.stringify({ resizable: true, tools: kendo.ui.VectorDrawingToolBar.fn.options.tools.slice(2) })) + '"></div>',
                maximize: true, // Maximize window when opening
                openImageDialog: function () {
                    assert.instanceof(kendo.dataviz.ui.VectorDrawing, this, kendo.format(assert.messages.instanceof.default, 'this', 'kendo.dataviz.ui.VectorDrawing'));
                    var vectorDrawingWidget = this;
                    // We discard some tools to avoid nesting editors and asset managers indefinitely
                    var tools = kidoju.assets.image.collections[0].tools;
                    kidoju.assets.image.collections[0].tools = tools.filter(function (tool) {
                        return tool !== 'create' && tool !== 'edit';
                    });
                    // Show a nested asset manager dialog without creating and editing
                    app.dialogs.showAssetManager(
                        kidoju.assets.image,
                        '', // We are not replacing an existing image but adding a new image, so the url is blank
                        { title: 'Insert image' }, // TODO i18n
                        // Event handler when clicking the OK button
                        function (e) {
                            // Restore assets tools
                            kidoju.assets.image.collections[0].tools = tools;
                            var url = e.sender.viewModel.get('url');
                            // Replace scheme
                            var schemes = kidoju.assets.image.schemes;
                            for (var scheme in kidoju.assets.image.schemes) {
                                url = url.replace(scheme + '://', schemes[scheme]);
                            }
                            // Import image into drawing
                            vectorDrawingWidget.import(url)
                                .fail(function () {
                                    if (app.notification && $.isFunction(app.notification.error)) {
                                        app.notification.error('Could not load image ' + url);  // TODO i18n
                                    }
                                });
                        }
                    );
                },
                // Note: onCommand is defined in the viewModel set in _editSelected of kidoju.widgets.assetmanager and onCommand calls openUrl and saveAs
                openUrl: function (url) {
                    assert.instanceof(kendo.ui.Window, this, kendo.format(assert.messages.instanceof.default, 'this', 'kendo.ui.Window'));
                    var vectorDrawingWidget = this.element.find(kendo.roleSelector('vectordrawing')).data('kendoVectorDrawing');
                    url = $('<a/>').attr('href', url).get(0).href; // Note: a simple way to resolve a relative url
                    return vectorDrawingWidget.open(url); // TODO promise????? app.notification of errors ????
                },
                resize: function (e) {
                    assert.instanceof(kendo.ui.Window, this, kendo.format(assert.messages.instanceof.default, 'this', 'kendo.ui.Window'));
                    var vectorDrawingWidget = this.element.find(kendo.roleSelector('vectordrawing')).data('kendoVectorDrawing');
                    var container = e.sender.element;
                    vectorDrawingWidget.element
                        .outerWidth(container.width())
                        .outerHeight(container.height());
                    vectorDrawingWidget.resize();
                },
                saveAs: function (name, assetManager) {
                    assert.instanceof(kendo.dataviz.ui.VectorDrawing, this, kendo.format(assert.messages.instanceof.default, 'this', 'kendo.dataviz.ui.VectorDrawing'));
                    assert.type(STRING, name, kendo.format(assert.messages.type.default, 'name', STRING));
                    assert.instanceof(kendo.ui.AssetManager, assetManager, kendo.format(assert.messages.instanceof.default, 'assetManager', 'kendo.ui.AssetManager'));
                    var exportFile = name.toLowerCase().endsWith('.svg') ? this.exportSVG : this.exportImage;
                    exportFile.bind(this)({ json: true })
                        .done(function (dataUri) {
                            var blob = assetManager._dataUri2Blob(dataUri);
                            blob.name = name;
                            assetManager._uploadFile(blob)
                                .done(function (a) {
                                    debugger; // TODO
                                })
                                .fail(function (err) {
                                    debugger; // TODO
                                });
                        })
                        .fail(function (error) {
                            debugger; // TODO
                        });
                }
            }

            // video: { /* TODO */ }

        };

        /**
         * DataSource options for custom collection types defined in config files, especially default.json
         * @type {{websearch: websearch, summary: summary, organisation: organisation}}
         */
        var collectionSources = {

            /**
             * Creates a web search collection for a search provider
             * @type audio, image, video
             * @param params including provider (google, bing, ...) and type (image, video, ... but not a complete mime type)
             * @returns {{}}
             */
            websearch: function (type, params) {
                assert.type(STRING, 'type', kendo.format(assert.messages.type.default, 'type', STRING));
                assert.isPlainObject(params, kendo.format(assert.messages.isPlainObject.default, 'params'));
                return deepExtend({
                    name: 'Google', // unfortunately i18n.culture is not yet available
                    pageSize: params.pageSize, // Google returns a maximum of 10 items
                    serverPaging: true,
                    serverFiltering: true,
                    transport: {
                        read: function (options) {
                            var qs = options.data;
                            // options.data.filter is built by the assetmanager search box
                            qs.q = (qs.filter && qs.filter.logic === 'and' && qs.filter.filters && qs.filter.filters[1] && qs.filter.filters[1].field === 'url' && qs.filter.filters[1].value) || '';
                            qs.type = params.searchType;
                            qs.language = i18n.locale();
                            qs.filter = undefined; // filter is replaced by q
                            app.rapi.web.search(params.provider, qs)
                                .done(options.success) // response items have mime, size and url
                                .fail(options.error);
                        }
                    }
                }, params);
            },

            /**
             * Creates an editable collection for a summary/project
             * @param type
             * @param params
             */
            summary: function (type, params) {
                assert.type(STRING, 'type', kendo.format(assert.messages.type.default, 'type', STRING));
                assert.type(OBJECT, params, kendo.format(assert.messages.type.default, 'params', OBJECT));
                return deepExtend({
                    name: 'Project', // TODO i18n.culture.assets.collections.summary,
                    tools: ['upload', 'create', 'edit', 'destroy'],
                    editor: editors[type],
                    // pageSize: 12,
                    // serverPaging: false,
                    // serverFiltering: false,
                    transport: {

                        /**
                         * Create transport
                         * @param options
                         */
                        create: function(options) {
                            debugger;
                        },

                        /**
                         * Destroy transport
                         * @param options
                         */
                        destroy: function(options) {
                            var locale = i18n.locale();
                            var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
                            var data = options.data;
                            assert.isPlainObject(data, kendo.format(assert.messages.isPlainObject.default, 'data'));
                            assert.type(STRING, data.url, kendo.format(assert.messages.type.default, 'data.url', STRING));
                            var matches = data.url.match(RX_DATA_URL);
                            assert.equal(4, matches.length, kendo.format(assert.messages.equal.default, 'matches.length', 4));
                            assert.equal(locale, matches[1], kendo.format(assert.messages.equal.default, 'matches[1]', locale));
                            assert.equal(params.summaryId, matches[2], kendo.format(assert.messages.equal.default, 'matches[2]', params.summaryId));
                            // Delete file
                            rapi.v1.content.deleteFile(matches[1], matches[2], matches[3])
                                .done(function (response) {
                                    logger.debug({
                                        message: 'file deleted',
                                        method: 'summary.transport.destroy',
                                        data: deepExtend({ language: locale, summaryId: params.summaryId, url: data.url }, response)
                                    });
                                    options.success({ data: [data], total: 1 });
                                    assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                    app.notification.success(i18n.culture.editor.notifications.fileDeleteSuccess); // TODO
                                })
                                .fail(function (xhr, status, error) {
                                    logger.error({
                                        message: 'file deletion error',
                                        method: 'summary.transport.destroy',
                                        data: { status: status, error: error, reponse: xhr.responseText }
                                    });
                                    options.error(xhr, status, error);
                                    assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                    app.notification.error(i18n.culture.editor.notifications.fileDeleteFailure); // TODO
                                });
                        },

                        /**
                         * Read transport
                         * @param options
                         */
                        read: function(options) {
                            var locale = i18n.locale();
                            var params = JSON.parse(
                                $(VERSION_HIDDEN_FIELD).val());
                            rapi.v1.content.getAllSummaryFiles(locale,
                                params.summaryId).done(function(response) {
                                assert.isPlainObject(response, kendo.format(assert.messages.isPlainObject.default, 'response'));
                                assert.isArray(response.data, kendo.format(assert.messages.isArray.default, 'response.data'));
                                assert.type(NUMBER, response.total, kendo.format(assert.messages.type.default, 'response.total', NUMBER));
                                options.success(response);

                                // TODO Compute total storage size to display in a progress bar

                            }).fail(function(xhr, status, error) {
                                logger.error({
                                    message: 'file list read error',
                                    method: 'summary.transport.read',
                                    data: { status: status, error: error, reponse: xhr.responseText }
                                });
                                options.error(xhr, status, error);
                                assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                app.notification.error(i18n.culture.editor.notifications.filesLoadFailure); // TODO
                            });
                        },

                        /**
                         * Update transport
                         * @param options
                         */
                        update: function(options) {
                            throw new Error('Should not be used');
                        },

                        /**
                         * Import transport
                         * Note: Import is not really a kendo.data.DataSource transport but we make it available in the DataSource as transport.import
                         * to import web search images designated by urls into this summary collection
                         * @param options
                         */
                        //
                        import: function (options) {
                            debugger;
                        },

                        /**
                         * Upload transport
                         * Note: Upload is not really a kendo.data.DataSource transport but we make it available in the DataSource as transport.upload
                         * @param options
                         */
                        upload: function (options) {
                            var locale = i18n.locale();
                            var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
                            var data = options.data;
                            // Note a window.File is a sort of window.Blob with a name
                            // assert.instanceof(window.File, data.file, kendo.format(assert.messages.instanceof.default, 'data.file', 'window.File'));
                            assert.instanceof(window.Blob, data.file, kendo.format(assert.messages.instanceof.default, 'data.file', 'window.Blob'));
                            assert.type(STRING, data.file.name, kendo.format(assert.messages.type.default, 'data.file.name', STRING));
                            logger.debug({
                                message: 'getting a signed url from aws',
                                method: 'summary.transport.upload',
                                data: { language: locale, summaryId: params.summaryId }
                            });
                            // Get a signed upload url from Amazon S3
                            rapi.v1.content.getUploadUrl(locale, params.summaryId, data.file)
                                .done(function (uploadUrl) {
                                    logger.debug({
                                        message: 'uploading file/blob to signed url',
                                        method: 'summary.transport.upload',
                                        data: { language: locale, summaryId: params.summaryId, uploadUrl: uploadUrl }
                                    });
                                    // Upload to that signed url
                                    rapi.v1.content.uploadFile(uploadUrl, data.file)
                                        .progress(function (e) {
                                            if (e.lengthComputable) { // TODO trigger progress on dataSource
                                                $(document).trigger('progress.kendoAssetManager', [e.loaded / e.total, 'progress']);
                                            }
                                        })
                                        .done(function (response) {
                                            assert.isPlainObject(response, kendo.format(assert.messages.isPlainObject.default, 'response'));
                                            assert.type(STRING, response.name, kendo.format(assert.messages.type.default, 'response.name', STRING));
                                            assert.type(NUMBER, response.size, kendo.format(assert.messages.type.default, 'response.size', NUMBER));
                                            assert.type(STRING, response.type, kendo.format(assert.messages.type.default, 'response.type', STRING));
                                            assert.type(STRING, response.url, kendo.format(assert.messages.type.default, 'response.url', STRING));
                                            logger.debug({
                                                message: 'new file/blob uploaded',
                                                method: 'summary.transport.upload',
                                                data: deepExtend({ language: locale, summaryId: params.summaryId }, response)
                                            });
                                            options.success({ data: [response], total: 1 });
                                            $(document).trigger('progress.kendoAssetManager', [1, 'complete']); // TODO trigger progress on dataSource
                                            assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                            app.notification.success(i18n.culture.editor.notifications.fileCreateSuccess); // TODO
                                        })
                                        .fail(function (xhr, status, error) {
                                            logger.error({
                                                message: 'file/blob upload error',
                                                method: 'summary.transport.upload',
                                                data: { status: status, error: error, response: xhr.responseText }
                                            });
                                            options.error(xhr, status, error);
                                            assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                            app.notification.error(i18n.culture.editor.notifications.fileCreateFailure); // TODO
                                        });
                                })
                                .fail(function (xhr, status, error) {
                                    logger.error({
                                        message: 'erro getting a signed upload url',
                                        method: 'summary.transport.create',
                                        data: { status: status, error: error, reponse: xhr.responseText }
                                    });
                                    options.error(xhr, status, error);
                                    assert.instanceof(kendo.ui.Notification, app.notification, kendo.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                    app.notification.error(i18n.culture.editor.notifications.uploadUrlFailure); // TODO
                                });
                        }
                    }
                }, params);
            }

            /**
             * Creates an editable collection for an organisation
             * Note: should be disabled or hidden when user/summary does not belong to an organization
             */
            // organisation: function (type, params) { }

        };

        /**
         * Parses an asset configuration (audio, image, video)
         * @param config
         */
        function parseConfiguration(type) {
            assert.type(STRING, type, assert.format(assert.messages.type.default, 'type', STRING));
            assert.isPlainObject(app.assets[type], assert.format(assert.messages.isPlainObject.default, 'app.assets.' + type));
            var clone = JSON.parse(JSON.stringify(app.assets[type]));
            for (var i = 0, length = clone.collections.length; i < length; i++) {
                var collection = clone.collections[i];
                if (collection.source && $.isFunction(collectionSources[collection.source])) {
                    // collection = collectionSources[collection.type](collection.params);
                    clone.collections[i] = collectionSources[collection.source](type, collection.params || {});
                }
            }
            return clone;
        }

        /**
         * ./webapp/config/default.json is read by ./web_modules/app.config.jsx to produce app.assets, a configuration of read-only collections
         * We need extend app.assets into kidoju.assets used by kidoju.widgets, with project/organization editable collections and Google search
         */
        // Build audio tool assets
        kidoju.assets.audio = new kidoju.ToolAssets(parseConfiguration('audio'));
        // Build icon assets
        kidoju.assets.icon = new kidoju.ToolAssets(parseConfiguration('icon'));
        // Build image tool assets
        kidoju.assets.image = new kidoju.ToolAssets(parseConfiguration('image'));
        // Build video tool assets
        kidoju.assets.video = new kidoju.ToolAssets(parseConfiguration('video'));

        // Log readiness
        logger.debug({
            message: 'Assets configured'
        });

    }(window.jQuery));

    /* jshint +W071 */

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

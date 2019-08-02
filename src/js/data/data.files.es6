/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

const transport = {
    /**
     * Create transport
     * @param options
     */
    create: function (options) {
        throw new Error('Use upload transport');
    },

    /**
     * Destroy transport
     * @param options
     */
    destroy: function (options) {
        var locale = __.locale;
        var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
        var data = options.data;

        assert.isNonEmptyPlainObject(data, assert.format(assert.messages.isNonEmptyPlainObject.default, 'data'));
        assert.type(STRING, data.url, assert.format(assert.messages.type.default, 'data.url', STRING));
        var matches = data.url.match(RX_DATA_URL);
        assert.equal(4, matches.length, assert.format(assert.messages.equal.default, 'matches.length', 4));
        assert.equal(locale, matches[1], assert.format(assert.messages.equal.default, 'matches[1]', locale));
        assert.equal(params.summaryId, matches[2], assert.format(assert.messages.equal.default, 'matches[2]', params.summaryId));

        // Delete file
        rapi.v1.content.deleteFile(locale, params.summaryId, matches[3])
        .done(function (response) {
            logger.debug({
                message: 'file deleted',
                method: 'summary.transport.destroy',
                data: deepExtend({ language: locale, summaryId: params.summaryId, url: data.url }, response)
            });
            options.success({ data: [data], total: 1 });
            assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
            app.notification.success(__('webapp.editor.notifications.fileDeleteSuccess'));
        })
        .fail(function (xhr, status, error) {
            logger.error({
                message: 'file deletion error',
                method: 'summary.transport.destroy',
                error: xhr2error(xhr, status, errorThrown)
            });
            options.error(xhr, status, error);
            assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
            app.notification.error(__('webapp.editor.notifications.fileDeleteFailure'));
        });
    },

    /**
     * Read transport
     * @param options
     */
    read: function (options) {
        var locale = __.locale;
        var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
        assert.match(RX_LANGUAGE, locale, assert.format(assert.messages.match.default, 'locale', RX_LANGUAGE));
        assert.match(RX_MONGODB_ID, params.summaryId, assert.format(assert.messages.match.default, params.summaryId, RX_MONGODB_ID));

        // Get all project files
        rapi.v1.content.getAllSummaryFiles(locale, params.summaryId).done(function (response) {
            assert.isNonEmptyPlainObject(response, assert.format(assert.messages.isNonEmptyPlainObject.default, 'response'));
            assert.isArray(response.data, assert.format(assert.messages.isArray.default, 'response.data'));
            assert.type(NUMBER, response.total, assert.format(assert.messages.type.default, 'response.total', NUMBER));

            // The asset manager takes care of filtering assets by type
            options.success(response);

        }).fail(function (xhr, status, error) {
            logger.error({
                message: 'file list read error',
                method: 'summary.transport.read',
                error: xhr2error(xhr, status, errorThrown)
            });
            options.error(xhr, status, error);
            assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
            app.notification.error(__('webapp.editor.notifications.filesLoadFailure'));
        });
    },

    /**
     * Update transport
     * @param options
     */
    update: function (options) {
        throw new Error('Use upload transport');
    },

    /**
     * Upload transport for create and update
     * Note: Upload is not a kendo.data.DataSource CRUD transport but we make it available in the DataSource as transport.upload
     * Important: Upload is called from the kendo.ui.AssetManager upon clicking the upload button or dropping files
     * @param options
     */
    upload: function (options) {
        var locale = __.locale;
        var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
        var data = options.data;

        assert.match(RX_LANGUAGE, locale, assert.format(assert.messages.match.default, 'locale', RX_LANGUAGE));
        assert.match(RX_MONGODB_ID, params.summaryId, assert.format(assert.messages.match.default, params.summaryId, RX_MONGODB_ID));
        // Note a window.File is a sort of window.Blob with a name
        // assert.instanceof(window.File, data.file, assert.format(assert.messages.instanceof.default, 'data.file', 'File'));
        assert.instanceof(window.Blob, data.file, assert.format(assert.messages.instanceof.default, 'data.file', 'Blob'));
        assert.type(STRING, data.file.name, assert.format(assert.messages.type.default, 'data.file.name', STRING));
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
                assert.isNonEmptyPlainObject(response, assert.format(assert.messages.isNonEmptyPlainObject.default, 'response'));
                assert.type(STRING, response.name, assert.format(assert.messages.type.default, 'response.name', STRING));
                assert.type(NUMBER, response.size, assert.format(assert.messages.type.default, 'response.size', NUMBER));
                assert.type(STRING, response.type, assert.format(assert.messages.type.default, 'response.type', STRING));
                assert.type(STRING, response.url, assert.format(assert.messages.type.default, 'response.url', STRING));
                logger.debug({
                    message: 'new file/blob uploaded',
                    method: 'summary.transport.upload',
                    data: deepExtend({ language: locale, summaryId: params.summaryId }, response)
                });
                options.success({ data: [response], total: 1 });
                $(document).trigger('progress.kendoAssetManager', [1, 'complete']); // TODO trigger progress on dataSource
                assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                app.notification.success(__('webapp.editor.notifications.fileCreateSuccess'));
            })
            .fail(function (xhr, status, error) {
                logger.error({
                    message: 'file/blob upload error',
                    method: 'summary.transport.upload',
                    error: xhr2error(xhr, status, errorThrown)
                });
                options.error(xhr, status, error);
                assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                app.notification.error(__('webapp.editor.notifications.fileCreateFailure'));
            });
        })
        .fail(function (xhr, status, error) {
            logger.error({
                message: 'erro getting a signed upload url',
                method: 'summary.transport.create',
                error: xhr2error(xhr, status, errorThrown)
            });
            options.error(xhr, status, error);
            assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
            app.notification.error(__('webapp.editor.notifications.uploadUrlFailure'));
        });
    },

    /**
     * Import transport
     * Note: Import is not a kendo.data.DataSource CRUD transport but we make it available in the DataSource as transport.import
     * Important: Import is called from kidoju.dialogs upon clicking the OK button of the asset manager dialog, when the url starts with http(s)://,
     * that is when the url is not from amazon s3
     * @param options
     */
    import: function (options) {
            var locale = __.locale;
            var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
            var data = options.data;

            assert.match(RX_LANGUAGE, locale, assert.format(assert.messages.match.default, 'locale', RX_LANGUAGE));
            assert.match(RX_MONGODB_ID, params.summaryId, assert.format(assert.messages.match.default, params.summaryId, RX_MONGODB_ID));
            assert.match(RX_URL, data.url, assert.format(assert.messages.match.default, data.url, RX_URL));

            window.app.rapi.v1.content.importFile(locale, params.summaryId, data.url)
            .done(function (response) {
                assert.isNonEmptyPlainObject(response, assert.format(assert.messages.isNonEmptyPlainObject.default, 'response'));
                assert.type(STRING, response.name, assert.format(assert.messages.type.default, 'response.name', STRING));
                assert.type(NUMBER, response.size, assert.format(assert.messages.type.default, 'response.size', NUMBER));
                assert.type(STRING, response.type, assert.format(assert.messages.type.default, 'response.type', STRING));
                assert.type(STRING, response.url, assert.format(assert.messages.type.default, 'response.url', STRING));
                logger.debug({
                    message: 'url imported',
                    method: 'summary.transport.import',
                    data: deepExtend({ language: locale, summaryId: params.summaryId }, response)
                });
                options.success({ data: [response], total: 1 });
                assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                app.notification.success(__('webapp.editor.notifications.urlImportSuccess'));
            })
            .fail(function (xhr, status, error) {
                logger.error({
                    message: 'url import error',
                    method: 'summary.transport.import',
                    error: xhr2error(xhr, status, errorThrown)
                });
                options.error(xhr, status, error);
                assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                app.notification.error(__('webapp.editor.notifications.urlImportFailure'));
            });
        }
};

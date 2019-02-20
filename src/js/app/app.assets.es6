/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxWebSearch from '../rapi/rapi.websearch.es6';
import ToolAssets from '../tools/util.assets.es6';
import config from './app.config.jsx';
// import i18n from './app.i18n.es6';

/*
'../common/window.logger.es6',
'../kidoju.tools',
'../kidoju.image',
'../widgets/widgets.vectordrawing.toolbar.es6', // For the image editor template
'../dialogs/dialogs.assetmanager.es6',
'./app.logger.es6',
'../app.rapi'
*/

/**
 * TODO Review comment
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

const { deepExtend, roleSelector } = window.kendo;

// const i18n = app.i18n;
// const rapi = app.rapi;
// const logger = new window.Logger('app.assets'); // TODO remove window.
// const VERSION_HIDDEN_FIELD = 'input[type="hidden"][name="version"]';
// var DATA_SCHEME = 'data://';
// const RX_DATA_URL = /^data:\/\/s\/([^\/]+)\/([^\/]+)\/([^\/]+)$/;

/**
 * Editor configurations
 * @type {{}}
 */
/*
const editors = {
    // audio: {},

    image: {
        // Open kendo.dataviz.ui.VectorDrawing without New and Open tools
        template: `<div data-${kendo.ns}role="vectordrawing" data-${
            kendo.ns
        }bind="events: { command: onCommand, dialog: onDialog }" data-${
            kendo.ns
        }toolbar="${kendo.htmlEncode(
            JSON.stringify({
                resizable: true,
                tools: kendo.ui.VectorDrawingToolBar.fn.options.tools.slice(2)
            })
        )}"></div>`,
        maximize: true, // Maximize window when opening
        openImageDialog() {
            assert.instanceof(
                kendo.dataviz.ui.VectorDrawing,
                this,
                assert.format(
                    assert.messages.instanceof.default,
                    'this',
                    'kendo.dataviz.ui.VectorDrawing'
                )
            );
            const vectorDrawingWidget = this;
            // We discard some tools to avoid nesting editors and asset managers indefinitely
            const tools = kidoju.assets.image.collections[0].tools;
            kidoju.assets.image.collections[0].tools = tools.filter(function(
                tool
            ) {
                return tool !== 'create' && tool !== 'edit';
            });
            // Show a nested asset manager dialog without creating and editing
            kidoju.dialogs
                .openAssetManager({
                    title: 'Insert image', // TODO i18n
                    assets: kidoju.assets.image
                })
                .then(function(result) {
                    if (
                        result.action ===
                        kendo.ui.BaseDialog.fn.options.messages.actions.ok
                            .action
                    ) {
                        // Restore assets tools
                        kidoju.assets.image.collections[0].tools = tools;
                        let url = result.data.value;
                        // Replace scheme
                        const schemes = kidoju.assets.image.schemes;
                        for (const scheme in schemes) {
                            if (
                                Object.prototype.hasOwnProperty.call(
                                    schemes,
                                    scheme
                                )
                            ) {
                                url = url.replace(
                                    `${scheme}://`,
                                    schemes[scheme]
                                );
                            }
                        }
                        // Import image into drawing
                        vectorDrawingWidget.import(url).fail(function(error) {
                            if (
                                notification &&
                                $.isFunction(notification.error)
                            ) {
                                notification.error(
                                    `Could not load image ${url}`
                                ); // TODO i18n
                                logger.error({
                                    message:
                                        'vectorDrawingWidget.import failed',
                                    method: 'editors.image.openImageDialog',
                                    data: { url },
                                    error
                                });
                            }
                        });
                    }
                });
            // TODO fail
        },
        // Note: onCommand is defined in the viewModel set in _editSelected of kidoju.widgets.assetmanager and onCommand calls openUrl and saveAs
        openUrl(url) {
            assert.instanceof(
                kendo.ui.Window,
                this,
                assert.format(
                    assert.messages.instanceof.default,
                    'this',
                    'kendo.ui.Window'
                )
            );
            const vectorDrawingWidget = this.element
                .find(kendo.roleSelector('vectordrawing'))
                .data('kendoVectorDrawing');
            url = $('<a/>')
                .attr('href', url)
                .get(0).href; // Note: a simple way to resolve a relative url
            return vectorDrawingWidget.open(url).fail(function(error) {
                if (notification && $.isFunction(notification.error)) {
                    notification.error(
                        `Could not load image ${url.split('/').pop()}`
                    ); // TODO i18n
                    logger.error({
                        message: 'vectorDrawingWidget.open failed',
                        method: 'editors.image.openUrl',
                        data: { url },
                        error
                    });
                }
            });
        },
        resize(e) {
            assert.instanceof(
                kendo.ui.Window,
                this,
                assert.format(
                    assert.messages.instanceof.default,
                    'this',
                    'kendo.ui.Window'
                )
            );
            const vectorDrawingWidget = this.element
                .find(kendo.roleSelector('vectordrawing'))
                .data('kendoVectorDrawing');
            const container = e.sender.element;
            vectorDrawingWidget.element
                .outerWidth(container.width())
                .outerHeight(container.height());
            vectorDrawingWidget.resize();
        },
        saveAs(name, assetManager) {
            assert.instanceof(
                kendo.dataviz.ui.VectorDrawing,
                this,
                assert.format(
                    assert.messages.instanceof.default,
                    'this',
                    'kendo.dataviz.ui.VectorDrawing'
                )
            );
            assert.type(
                CONSTANTS.STRING,
                name,
                assert.format(
                    assert.messages.type.default,
                    'name',
                    CONSTANTS.STRING
                )
            );
            assert.instanceof(
                kendo.ui.AssetManager,
                assetManager,
                assert.format(
                    assert.messages.instanceof.default,
                    'assetManager',
                    'kendo.ui.AssetManager'
                )
            );
            const that = this;
            const pos = name.lastIndexOf('.');
            assert.ok(pos > 0, '`name` should have an extension');
            let extension = name.substr(pos + 1).toLowerCase();
            name = name.substr(0, pos);
            let json = false;
            if (extension.endsWith('+')) {
                json = true;
                extension = extension.slice(0, -1);
            }
            const exportFile =
                extension === 'jpg' || extension === 'png'
                    ? that.exportImage
                    : that.exportSVG;
            logger.debug({
                message: 'Saving file',
                method: 'editors.image.saveAs',
                data: { name, ext: extension }
            });
            exportFile
                .bind(that)({ json }) // json: true only applies to exportSVG
                .done(function(dataUri) {
                    // Important: dataUri is actually the result of getImageData for exportImage and it needs to be encoded to make a dataUri
                    // Beware any error here will be caught in the try/catch of kendo.drawing.canvas.Surface.prototype.getImageData defined in kidoju.widgets.vectordrawing.js
                    if (extension === 'jpg') {
                        // Default quality is 50 which is a bit low
                        dataUri = kidoju.image.jpegEncode(dataUri, 70);
                    } else if (extension === 'png') {
                        // We do our own encoding because canvas.toDataURL does no compression
                        dataUri = kidoju.image.pngEncode(dataUri);
                    }
                    const blob = kidoju.image.dataUri2Blob(dataUri);
                    blob.name = `${name}.${extension}`;
                    logger.debug({
                        message: 'exporFile successful',
                        method: 'editors.image.saveAs',
                        data: { name, ext: extension }
                    });
                    // Note: _uploadFile calls transport.upload which triggers notifications for success/error
                    assetManager._uploadFile(blob).done(function() {
                        // Update source, so that save dialog will remember the name
                        that._source = `${name}.${extension}`;
                        // Also update the dialog title
                        const windowWidget = that.element
                            .closest(kendo.roleSelector('window'))
                            .data('kendoWindow');
                        if (windowWidget instanceof kendo.ui.Window) {
                            windowWidget.title(that._source);
                        }
                    });
                })
                .fail(function(error) {
                    if (
                        notification &&
                        $.isFunction(notification.error)
                    ) {
                        notification.error(
                            `Could not export ${extension} file.`
                        ); // TODO i18n
                        logger.error({
                            message: 'exportFile failed',
                            method: 'editors.image.saveAs',
                            data: { name, ext: extension },
                            error
                        });
                    }
                });
        }
    }

    // video: {}
};
*/

/**
 * DataSource options for custom collection types defined in config files, especially default.json
 * @type {{websearch: websearch, summary: summary, organisation: organisation}}
 */
const collectionSources = {
    /**
     * Creates a web search collection for a search provider
     * @param type audio, image, video
     * @param params including provider (google, bing, ...) and type (image, video, ... but not a complete mime type)
     * @returns {{}}
     */
    websearch(type, params) {
        assert.type(
            CONSTANTS.STRING,
            'type',
            assert.format(
                assert.messages.type.default,
                'type',
                CONSTANTS.STRING
            )
        );
        assert.isNonEmptyPlainObject(
            params,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'params'
            )
        );
        return deepExtend(
            {
                name: 'Google', // Unfortunately i18n.culture is not yet available
                pageSize: params.pageSize, // Google returns a maximum of 10 items
                serverFiltering: true,
                serverPaging: true,
                // serverSorting: true,
                transport: {
                    // Read transport
                    read(options) {
                        new AjaxWebSearch({
                            provider: params.provider,
                            searchType: params.searchType
                        })
                            .read(options.data)
                            .then(options.success)
                            .catch(options.error);
                    }
                }
            },
            params
        );
    }

    /**
     * Creates an editable collection for a summary/project
     * @param type
     * @param params
     */
    /*
    summary(type, params) {
        assert.type(
            CONSTANTS.STRING,
            'type',
            assert.format(
                assert.messages.type.default,
                'type',
                CONSTANTS.STRING
            )
        );
        assert.type(
            CONSTANTS.OBJECT,
            params,
            assert.format(
                assert.messages.type.default,
                'params',
                CONSTANTS.OBJECT
            )
        );
        return deepExtend(
            {
                name: 'Project', // TODO i18n.culture.assets.collections.summary, but i18n is not yet loaded
                // TODO tools: ['upload', 'create', 'edit', 'destroy'],
                // TODO editor: editors[type],
                // pageSize: 12,
                // serverFiltering: false,
                // serverPaging: false,
                // serverSorting: false,
                transport: {}
            },
            params
        );
    }
    */

    /**
     * Creates an editable collection for an organisation
     * Note: should be disabled or hidden when user/summary does not belong to an organization
     */
    // organisation: function (type, params) { }
};

/**
 * Parses an asset configuration (audio, image, video)
 * @param type
 */
function parseConfiguration(type) {
    assert.type(
        CONSTANTS.STRING,
        type,
        assert.format(assert.messages.type.default, 'type', CONSTANTS.STRING)
    );
    assert.isNonEmptyPlainObject(
        config.assets[type],
        assert.format(
            assert.messages.isNonEmptyPlainObject.default,
            `app.assets.${type}`
        )
    );
    // const clone = JSON.parse(JSON.stringify(config.assets[type]));
    const clone = Object.assign({}, config.assets[type]);
    for (let i = clone.collections.length; i > 0; i--) {
        const collection = clone.collections[i - 1];
        if (collection.source) {
            if ($.isFunction(collectionSources[collection.source])) {
                // collection = collectionSources[collection.type](collection.params);
                clone.collections[i - 1] = collectionSources[collection.source](
                    type,
                    collection.params || {}
                );
            } else {
                // Remove collection if there is no method corresponding to source name
                clone.collections.splice(i - 1, 1);
            }
        }
    }
    return clone;
}

/**
 * ./webapp/config/default.json is read by ./web_modules/app.config.jsx to produce app.assets, a configuration of read-only collections
 * We need extend app.assets into kidoju.assets used by kidoju.widgets, with project/organization editable collections and Google search
 */

/**
 * Application assets
 * @type {{audio, image, video}}
 */
const assets = {
    // Assets for the audio tool
    audio: new ToolAssets(parseConfiguration('audio')),
    // Assets for icon selection
    icon: new ToolAssets(parseConfiguration('icon')),
    // Assets for the image tool
    image: new ToolAssets(parseConfiguration('image')),
    // Assets for the video tool
    video: new ToolAssets(parseConfiguration('video'))
};

/**
 * Default export
 */
export default assets;

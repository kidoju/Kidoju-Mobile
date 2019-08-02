/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
import assets from '../app/app.assets.es6';
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import AssetAdapter from './adapters.asset.es6';
import BooleanAdapter from './adapters.boolean.es6';
import NumberAdapter from './adapters.number.es6';
import { BaseTool } from './tools.base.es6';
import ToolAssets from './util.assets.es6';
import TOOLS from './util.constants';

const { format, ns, roleSelector } = window.kendo;
const TEMPLATE = `<div data-${ns}role="mediaplayer" data-${ns}mode="video" data-${ns}autoplay="#: attributes.autoplay #" data-${ns}files="#: files$() #" data-${ns}toolbar-height="#: attributes.toolbarHeight #"></div>`;

/**
 * VideoTool
 * @class VideoTool
 * @extends BaseTool
 */
const VideoTool = BaseTool.extend({
    id: 'video',
    childSelector: `${CONSTANTS.DIV}${roleSelector('mediaplayer')}`,
    height: 300,
    width: 600,
    // menu: [],
    templates: {
        default: TEMPLATE
    },
    attributes: {
        autoplay: new BooleanAdapter({
            title: __('tools.video.attributes.autoplay.title'),
            defaultValue: false
        }),
        toolbarHeight: new NumberAdapter({
            title: __('tools.video.attributes.toolbarHeight.title'),
            defaultValue: 48
        }),
        mp4: new AssetAdapter({
            title: __('tools.video.attributes.mp4.title')
        }),
        ogv: new AssetAdapter({
            title: __('tools.video.attributes.ogv.title')
        }),
        wbem: new AssetAdapter({
            title: __('tools.video.attributes.wbem.title')
        })
    },

    /**
     * Get Html or jQuery content
     * @method getHtmlContent
     * @param component
     * @param mode
     * @returns {*}
     */
    getHtmlContent(component, mode) {
        assert.instanceof(
            ToolAssets,
            assets.video,
            assert.format(
                assert.messages.instanceof.default,
                'assets.video',
                'ToolAssets'
            )
        );
        $.extend(component, {
            // The files$ function resolves urls with schemes like cdn://video.mp4 and returns a stringified array
            files$() {
                let mp4 = component.attributes.get('mp4');
                let ogv = component.attributes.get('ogv');
                let wbem = component.attributes.get('wbem');
                const files = [];
                mp4 = assets.video.scheme2http(mp4);
                if (TOOLS.RX_HTTP_S.test(mp4)) {
                    files.push(mp4);
                }
                ogv = assets.video.scheme2http(ogv);
                if (TOOLS.RX_HTTP_S.test(ogv)) {
                    files.push(ogv);
                }
                wbem = assets.video.scheme2http(wbem);
                if (TOOLS.RX_HTTP_S.test(wbem)) {
                    files.push(wbem);
                }

                // Adding a space is a workaround to https://github.com/telerik/kendo-ui-core/issues/2849
                // return ` ${JSON.stringify(files)}`;
                return JSON.stringify(files);
            }
        });
        return BaseTool.fn.getHtmlContent.call(this, component, mode);
    },

    /**
     * Component validation
     * @param component
     * @param pageIdx
     */
    validate(component, pageIdx) {
        const ret = BaseTool.fn.validate.call(this, component, pageIdx);
        const {
            description,
            i18n: { messages }
        } = this; // tool description
        if (
            !component.attributes ||
            !TOOLS.RX_VIDEO.test(component.attributes.mp4)
        ) {
            ret.push({
                type: CONSTANTS.ERROR,
                index: pageIdx,
                message: format(
                    messages.invalidVideoFile,
                    description,
                    pageIdx + 1
                )
            });
        }
        // Note: we are not testing for an ogv or wbem file
        return ret;
    }
});

/**
 * Default eport
 */
export default VideoTool;

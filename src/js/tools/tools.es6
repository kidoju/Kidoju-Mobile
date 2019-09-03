/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* globals __NODE_ENV__: false */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.binder';
import __ from '../app/app.i18n.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import { BaseTool, StubTool } from './tools.base.es6';
import PointerTool from './tools.pointer.es6';
import TOOLS from './util.constants.es6';

const { observable } = window.kendo;
const logger = new Logger('tools');

let _tools;

/**
 * tools
 * We need a function to access tools
 * otherwise i18n resources might not be loaded
 * amd _(...) might return empty strings
 * @function tools
 * @param id
 * @returns {*}
 */
function tools(id) {
    assert.typeOrUndef(
        CONSTANTS.STRING,
        id,
        assert.format(
            assert.messages.typeOrUndef.default,
            'id',
            CONSTANTS.STRING
        )
    );

    if ($.type(_tools) === CONSTANTS.UNDEFINED) {
        logger.info({
            method: 'tools',
            message: 'Initializing tools with stubs'
        });

        /**
         * Registry of tools
         * @type {{register: Function}}
         */
        _tools = observable({
            /**
             * The active tool
             */
            active: null,

            /**
             * Load
             * @param toolId
             * @returns {*}
             */
            load(toolId) {
                assert.type(
                    CONSTANTS.STRING,
                    toolId,
                    assert.format(
                        assert.messages.type.default,
                        'toolId',
                        CONSTANTS.STRING
                    )
                );
                assert.hasLength(
                    CONSTANTS.STRING,
                    toolId,
                    assert.format(assert.messages.hasLength.default, 'toolId')
                );

                const dfd = $.Deferred();
                const tool = this[toolId];
                if (tool instanceof BaseTool) {
                    // The tool is already loaded
                    dfd.resolve();
                } else if (tool instanceof StubTool) {
                    // The tool is not loaded
                    logger.debug({
                        method: 'load',
                        message: `Loading ${toolId}`
                    });
                    import(
                        /* webpackMode: "lazy" */
                        /* webpackChunkName: "[request]" */
                        `./tools.${toolId}.es6`
                    )
                        .then(module => {
                            assert.extends(
                                BaseTool,
                                module.default,
                                assert.format(
                                    assert.messages.extends.default,
                                    'module.default',
                                    'BaseTool'
                                )
                            );
                            const Tool = module.default;
                            this[toolId] = new Tool({
                                description: tool.description,
                                help: tool.help,
                                icon: tool.icon,
                                name: tool.name
                            });
                            logger.debug({
                                method: 'load',
                                message: `Loaded ${toolId}`
                            });
                            dfd.resolve();
                        })
                        .catch(dfd.reject);
                } else {
                    // This is not a tool
                    dfd.reject(new Error(`Cannot load tool ${toolId}`));
                }
                return dfd.promise();
            }
        });

        /**
         * Pointer
         */
        _tools[TOOLS.POINTER] = new PointerTool({
            description: __('tools.pointer.description'),
            help: __('tools.pointer.help'),
            icon: __('tools.pointer.icon'),
            name: __('tools.pointer.name')
        });
        _tools.set(TOOLS.ACTIVE, TOOLS.POINTER);

        /* ***************************************************
         * BEWARE! The following order defines the order
         * in which tools are displayed in the toolbar
         * ************************************************ */

        /**
         * Label
         */
        _tools.label = new StubTool({
            description: __('tools.label.description'),
            help: __('tools.label.help'),
            icon: __('tools.label.icon'),
            name: __('tools.label.name')
        });

        /**
         * Image
         */
        _tools.image = new StubTool({
            description: __('tools.image.description'),
            help: __('tools.image.help'),
            icon: __('tools.image.icon'),
            name: __('tools.image.name')
        });

        /**
         * TextBox
         */
        _tools.textbox = new StubTool({
            description: __('tools.textbox.description'),
            help: __('tools.textbox.help'),
            icon: __('tools.textbox.icon'),
            name: __('tools.textbox.name')
        });

        /**
         * Quiz
         */
        _tools.quiz = new StubTool({
            description: __('tools.quiz.description'),
            help: __('tools.quiz.help'),
            icon: __('tools.quiz.icon'),
            name: __('tools.quiz.name')
        });

        /**
         * MultiQuiz
         */
        _tools.multiquiz = new StubTool({
            description: __('tools.multiquiz.description'),
            help: __('tools.multiquiz.help'),
            icon: __('tools.multiquiz.icon'),
            name: __('tools.multiquiz.name')
        });

        /**
         * Line
         */
        _tools.line = new StubTool({
            description: __('tools.line.description'),
            help: __('tools.line.help'),
            icon: __('tools.line.icon'),
            name: __('tools.line.name')
        });

        /**
         * Audio
         */
        _tools.audio = new StubTool({
            description: __('tools.audio.description'),
            help: __('tools.audio.help'),
            icon: __('tools.audio.icon'),
            name: __('tools.audio.name')
        });

        /**
         * Video
         */
        _tools.video = new StubTool({
            description: __('tools.video.description'),
            help: __('tools.video.help'),
            icon: __('tools.video.icon'),
            name: __('tools.video.name')
        });

        /**
         * Dummy tool for tests
         */
        try {
            // Code is packaged via WebPack
            $.noop(__NODE_ENV__);
        } catch (ex) {
            // ReferenceError: __NODE_ENV__ is not defined
            if (window.DEBUG) {
                _tools.dummy = new StubTool({
                    description: __('tools.dummy.description'),
                    help: __('tools.dummy.help'),
                    icon: __('tools.dummy.icon'),
                    name: __('tools.dummy.name')
                });
            }
        }
    }

    let ret;
    if ($.type(id) === CONSTANTS.UNDEFINED) {
        ret = _tools;
    } else if (
        $.type(id) === CONSTANTS.STRING &&
        id.length &&
        _tools[id] instanceof StubTool
    ) {
        // Note: the tool returned might not be loaded
        ret = _tools[id];
    }
    return ret;
}

/**
 * Load a tool designated by its id
 * @function load
 * @param id
 */
tools.load = function load(id) {
    return tools().load(id);
};

/**
 * Define tools.active
 */
Object.defineProperty(tools, TOOLS.ACTIVE, {
    /**
     * Get the active tools
     * @returns {*}
     */
    get() {
        return tools().get(TOOLS.ACTIVE);
    },
    /**
     * Set the active tool
     * @param id
     */
    set(id) {
        assert.type(
            CONSTANTS.STRING,
            id,
            assert.format(assert.messages.type.default, 'id', CONSTANTS.STRING)
        );
        assert.hasLength(
            CONSTANTS.STRING,
            id,
            assert.format(assert.messages.hasLength.default, 'id')
        );
        if (tools(id) instanceof StubTool) {
            tools().set(TOOLS.ACTIVE, id);
        } else {
            throw new Error(`${id} is not a registered tool`);
        }
    },
    enumerable: true
});

/**
 * Default export
 */
export default tools;

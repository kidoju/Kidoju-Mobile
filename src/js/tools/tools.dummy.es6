/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import PageComponent from '../data/models.pagecomponent.es6';
import tools from './tools.es6';
import BaseTool from './tools.base.es6';

/**
 * Dummy square tool for testing
 * @class Square
 * @extends BaseTool
 */
const Square = BaseTool.extend({
    id: 'square',
    cursor: 'progress',
    description: 'Square',
    icon: 'shapes',
    // menu
    name: 'Square',
    templates: {
        play: '<div style="background-color:#00FF00;">PLAY</div>',
        design: '<div style="background-color:#0000FF;">DESIGN</div>',
        review: '<div style="background-color:#FF0000;">REVIEW</div>'
    },
    height: 300,
    width: 300,
    // attributes: {},
    // properties: {},

    /**
     * getHtmlContent
     * @method getHtmlContent
     * @param component
     * @param mode
     * @returns {jQuery|HTMLElement}
     */
    getHtmlContent(component, mode) {
        assert.instanceof(
            Square,
            this,
            assert.format(assert.messages.instanceof.default, 'this', 'Square')
        );
        assert.instanceof(
            PageComponent,
            component,
            assert.format(
                assert.messages.instanceof.default,
                'component',
                'PageComponent'
            )
        );
        assert.enum(
            Object.values(CONSTANTS.STAGE_MODES),
            mode,
            assert.format(
                assert.messages.enum.default,
                'mode',
                Object.values(CONSTANTS.STAGE_MODES)
            )
        );
        return $(this.templates[mode]);
    },

    /**
     * onEnable
     * @method onEnable
     * @param e
     * @param component
     * @param enabled
     */
    onEnable(e, component, enabled) {
        const stageElement = $(e.currentTarget);
        if (stageElement.is(CONSTANTS.ELEMENT_CLASS)) {
            const content = stageElement.children('div');
            assert.ok(
                content.length === 1,
                'Square elements are expected to be constituted of a single div'
            );
            content.off('click');
            if (enabled) {
                content.on('click', () => {
                    window.alert(`Hello from ${component.uid}`);
                });
            }
        }
    },

    /**
     * onResize
     * @method onResize
     * @param e
     * @param component
     */
    onResize(e, component) {
        const stageElement = $(e.currentTarget);
        if (
            stageElement.is(CONSTANTS.ELEMENT_CLASS) &&
            component instanceof PageComponent
        ) {
            const content = stageElement.children(CONSTANTS.DIV);
            if ($.type(component.width) === CONSTANTS.NUMBER) {
                content.width(component.width);
            }
            if ($.type(component.height) === CONSTANTS.NUMBER) {
                content.height(component.height);
            }
            // prevent any side effect
            e.preventDefault();
            // prevent event to bubble on stage
            e.stopPropagation();
        }
    }
});

/**
 * Registration
 */
tools.register(Square);

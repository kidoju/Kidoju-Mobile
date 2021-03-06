/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import 'kendo.binder';
import CONSTANTS from '../common/window.constants.es6';

const {
    destroy,
    ui: { plugin, Widget },
} = window.kendo;
const NS = '.kendoGridLayout';
const WIDGET_CLASS = 'k-widget kj-grid-layout';

/**
 * GridLayout
 * @class GridLayout
 * @extends Widget
 */
const GridLayout = Widget.extend({
    /**
     * Constructor
     * @constructor init
     * @param element
     * @param options
     */
    init(element, options) {
        Widget.fn.init.call(this, element, options);
        this._render();
        this.setOptions({
            enabled: this.element.prop('disabled')
                ? false
                : this.options.enabled,
            value: this.options.value,
        });
    },

    /**
     * Events
     * @property events
     */
    events: [CONSTANTS.CHANGE],

    /**
     * Options
     * @property options
     */
    options: {
        name: 'GridLayout',
        enabled: true,
        rows: [
            {
                cells: [
                    {
                        class: 'col-3',
                        // style: '',
                    },
                    {
                        class: 'col-9',
                        // style: '',
                    },
                ],
                class: 'row',
                style: 'min-height: 400px',
            },
        ],
        items: [
            {
                header: '',
                editable: true,
                visible: true,
                template: '',
                position: [0, 0, 1],
            },
            {
                header: '',
                editable: true,
                visible: true,
                template: '',
                position: [0, 1, 1],
            },
            {
                header: '',
                editable: true,
                visible: true,
                template: '',
                position: [0, 0, 1],
            },
        ],
    },

    /**
     * setOptions
     * @method setOptions
     * @param options
     */
    setOptions(options) {
        this.enable(options.enabled);
    },

    /**
     * _render
     * @private
     */
    _render() {
        this.wrapper = this.element;
        this.element.addClass(WIDGET_CLASS);
    },

    _renderGrid() {


    },

    _renderItems() {

    },

    /**
     * Refresh
     * @method refresh
     */
    refresh() {
        this.element.text(this._value);
    },

    /**
     * Enable
     * @method enable
     * @param enable
     */
    enable(enable) {
        const enabled =
            $.type(enable) === CONSTANTS.UNDEFINED ? true : !!enable;
        const { element } = this;
        element.off(NS);
        element.css('cursor', 'default');
        if (enabled) {
            element.on(CONSTANTS.CLICK + NS, this._onClick.bind(this));
            element.css('cursor', 'pointer');
        }
    },

    /**
     * _onClick
     * @method _onClick
     * @private
     */
    _onClick() {
        this.trigger(CONSTANTS.CHANGE);
    },

    /**
     * Destroy
     * @method destroy
     */
    destroy() {
        Widget.fn.destroy.call(this);
        destroy(this.element);
    },
});

/**
 * Registration
 */
plugin(GridLayout);

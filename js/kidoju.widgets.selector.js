/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        './window.assert',
        './window.logger',
        './vendor/kendo/kendo.binder',
        './vendor/kendo/kendo.color',
        './vendor/kendo/kendo.drawing',
        './vendor/kendo/kendo.toolbar',
        './kidoju.util'
    ], f);
})(function () {

    'use strict';

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        var kendo = window.kendo;
        var data = kendo.data;
        var drawing = kendo.drawing;
        var geometry = kendo.geometry;
        var Color = kendo.Color;
        var DataSource = data.DataSource;
        var Surface = drawing.Surface;
        var Widget = kendo.ui.Widget;
        var ToolBar = kendo.ui.ToolBar;
        var assert = window.assert;
        var logger = new window.Logger('kidoju.widgets.selection');
        var util = window.kidoju.util;
        var NUMBER = 'number';
        var OBJECT = 'object';
        var STRING = 'string';
        // var NULL = 'null';
        var UNDEFINED = 'undefined';
        var DOT = '.';
        var HASH = '#';
        var WIDGET = 'kendoSelector';
        var NS = DOT + WIDGET;
        var CHANGE = 'change';
        var ENABLE = 'enable';
        var MOUSEDOWN = 'mousedown' + NS + ' ' + 'touchstart' + NS;
        var MOUSEMOVE = 'mousemove' + NS + ' ' + 'touchmove' + NS;
        var MOUSEUP = 'mouseup' + NS + ' ' + 'touchend' + NS;
        var TOGGLE = 'toggle';
        var DIV = '<div/>';
        var ROLE = 'selector';
        var ID = 'id';
        var WIDGET_CLASS = 'kj-selector';
        var SURFACE_CLASS = WIDGET_CLASS + '-surface';
        var INTERACTIVE_CLASS = 'kj-interactive';
        var DATA_TYPE = 'selection';
        var RADIUS = 15;

        /*********************************************************************************
         * SelectorToolBar Widget
         *********************************************************************************/

        var SelectorToolBar = ToolBar.extend({

            /**
             * Initializes the widget
             * @param element
             * @param options
             */
            init: function (element, options) {
                var that = this;
                options = options || {};
                ToolBar.fn.init.call(that, element, options);
                logger.debug({ method: 'init', message: 'toolbar initialized' });
                that.bind(TOGGLE, that._onToggle);
                kendo.notify(that);
            },

            /**
             * Widget options
             */
            options: {
                name: 'SelectorToolBar',
                iconSize: 16,
                resizable: false
            },

            /**
             * Add a color to the toolbar
             * @param color
             */
            addColor: function (color) {
                var that = this;
                // k-button-group in kendo.ui & km-buttongroup (wo second -) in kendo.mobile.ui
                var buttonGroup = this.element.children('.k-button-group, .km-buttongroup');
                var toolBarColors = buttonGroup.children('.k-toggle-button').map(function () {
                    return HASH + $(this).attr('id');
                });
                var buttons = [];
                // Rebuild previous buttons;
                for (var i = 0, length = toolBarColors.length; i < length; i++) {
                    buttons.push({
                        type: 'button',
                        group: 'selectorColors',
                        id: toolBarColors[i].substr(1), // removes the hashtag
                        imageUrl: that._createImageUrl(toolBarColors[i]),
                        showText: 'overflow',
                        text: toolBarColors[i],
                        togglable: true
                    });
                }
                // Parse color for what is actually a color
                color = kendo.parseColor(color).toCss(); // might raise an exception
                // Do not add a color that already exists
                var found = buttons.find(function (button) {
                    return button.text === color;
                });
                // Create button
                if ($.type(found) === UNDEFINED) {
                    buttons.push({
                        type: 'button',
                        group: 'selectorColors',
                        id: color.substr(1), // removes the hashtag
                        imageUrl: that._createImageUrl(color),
                        showText: 'overflow',
                        text: color,
                        togglable: true
                    });
                }
                if (buttonGroup.length) {
                    that.remove(buttonGroup);
                }
                that.add({ type: 'buttonGroup', buttons: buttons });
                if (buttons.length) {
                    that.toggle(HASH + buttons[0].id, true);
                    that._onToggle({ id: buttons[0].id });
                }
                that.wrapper.toggle(buttons.length > 1);
            },

            /**
             * Create toolbar icon
             * @param: color
             * @private
             */
            _createImageUrl: function (color) {
                var canvas = document.createElement('canvas');
                canvas.height = this.options.iconSize;
                canvas.width = this.options.iconSize;
                var ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.arc(
                    this.options.iconSize / 2,  // center.x
                    this.options.iconSize / 2,  // center.y
                    this.options.iconSize / 2,  // radius
                    0,                          // start angle
                    2 * Math.PI                 // end angle
                );
                ctx.strokeStyle = 'black';
                ctx.fillStyle = color;
                ctx.stroke();
                ctx.fill();
                return canvas.toDataURL();
            },

            /**
             * Register corresponding selector surface, the surface the selected color applies to
             */
            registerSelectorSurface: function (selectorSurface) {
                assert.instanceof(SelectorSurface, selectorSurface, assert.format(assert.messages.instanceof.default, 'selectorSurface', 'kendo.ui.SelectorSurface'));
                this.selectorSurface = selectorSurface;
            },

            /**
             * Button toggle event handler
             * @private
             */
            _onToggle: function (e) {
                assert.isPlainObject(e, assert.format(assert.messages.isPlainObject.default, 'e'));
                assert.instanceof(SelectorSurface, this.selectorSurface, assert.format(assert.messages.instanceof.default, 'this.selectorSurface', 'kendo.ui.SelectorSurface'));
                this.selectorSurface.color(HASH + e.id);
            },

            /**
             * Destroy widget
             */
            destroy: function () {
                var that = this;
                var element = that.element;
                ToolBar.fn.destroy.call(that);
                kendo.destroy(element);
            }

        });

        kendo.ui.plugin(SelectorToolBar);

        /*********************************************************************************
         * SelectorSurface Widget
         *********************************************************************************/

        /**
         * SelectorSurface
         * Note: SelectorSurface does not extend drawing.Surface because drawing surfaces are created using drawing.Surface.create
         */
        var SelectorSurface = Widget.extend({

            /**
             * Initializes the widget
             * @param element
             * @param options
             */
            init: function (element, options) {
                Widget.fn.init.call(this, element, options);
                logger.debug('surface initialized');
                this._layout();
                kendo.notify(this);
            },

            /**
             * Options
             */
            options: {
                name: 'SelectorSurface'
            },

            /**
             * Layout
             * @private
             */
            _layout: function () {
                var element = this.wrapper = this.element;
                element
                    .addClass(SURFACE_CLASS)
                    .attr(ID, util.randomId()); // Set an id to filter mouse events
                this.drawingSurface = Surface.create(element);
            },

            /**
             * Register a selector
             * @param selector
             * @private
             */
            registerSelector: function (selector) {
                assert.instanceof(Selector, selector, assert.format(assert.messages.instanceof.default, 'selector', 'Selector'));
                if (!Array.isArray(this.selectors)) {
                    this.selectors = [];
                }
                if (this.selectors.indexOf(selector) === -1) {
                    this.selectors.push(selector);
                    selector.bind(ENABLE, this._initMouseEvents.bind(this));
                    if (!(this.activeSelector instanceof Selector)) {
                        this.activeSelector = selector;
                    }
                }
            },

            /**
             * Unregister selector with surface
             * @param selector
             */
            unregisterSelector: function (selector) {
                // TODO: Review because we cannot draw without selectors
                assert.instanceof(Selector, selector, assert.format(assert.messages.instanceof.default, 'selector', 'Selector'));
                if (Array.isArray(this.selectors)) {
                    var index = this.selectors.indexOf(selector);
                    if (index > -1) {
                        this.selectors.splice(index, 1);
                        selector.unbind(ENABLE);
                        if (this.activeSelector === selector) {
                            this.activeSelector = this.selectors[0];
                        }
                    }
                }
            },

            /**
             * Return true if at least one selector is enabled
             * @returns {boolean}
             */
            enabled: function () {
                var selectors = this.selectors;
                var enabled = false;
                if ($.isArray(selectors)) {
                    for (var i = 0, length = selectors.length; i < length; i++) {
                        enabled = enabled || selectors[i]._enabled;
                    }
                }
                return enabled;
            },

            /**
             * Init mouse event handlers to draw on surface
             * Note: this handler is executed when a selector triggers the ENABLE event
             * @private
             */
            _initMouseEvents: function () {
                // IMPORTANT
                // We can have several widgets for selections on a page
                // But we only have one set of event handlers shared across all selections
                // So we cannot use `this` within handlers, which is specific to this selector surface
                var id = HASH + this.element.attr(ID);
                var data = {}; // We need an object so that data is passed by reference between handlers

                $(document)
                    .off(NS, id);

                if (this.enabled()) {
                    // We cannot filter on SURFACE_CLASS in case there are several surfaces on a page
                    $(document)
                        .on(MOUSEDOWN, id, data, this._onMouseDown.bind(this))
                        .on(MOUSEMOVE, id, data, this._onMouseMove.bind(this))
                        .on(MOUSEUP, id, data, this._onMouseUp.bind(this));
                }
            },

            /**
             * Get surface point from mouse event
             * @param e
             * @private
             */
            _getSurfacePoint: function (e) {
                assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                assert.instanceof(SelectorSurface, this, assert.format(assert.messages.instanceof.default, 'this', 'kendo.ui.SelectorSurface'));
                assert.instanceof(Selector, this.activeSelector, assert.format(assert.messages.instanceof.default, 'this.activeSelector', 'kendo.ui.Selector'));
                var activeSelector = this.activeSelector;
                var container = $(e.currentTarget).closest(activeSelector.options.container);
                assert.hasLength(container, assert.format(assert.messages.hasLength.default, 'container'));
                var scaler = container.closest(activeSelector.options.scaler);
                var scale = scaler.length ? util.getTransformScale(scaler) : 1;
                var mouse = util.getMousePosition(e, container);
                var point = new geometry.Point(mouse.x / scale, mouse.y / scale);
                return point;
            },

            /**
             * Mouse down event handler
             * @param e
             * @private
             */
            _onMouseDown: function  (e) {
                assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                assert.instanceof(SelectorSurface, this, assert.format(assert.messages.instanceof.default, 'this', 'kendo.ui.SelectorSurface'));
                assert.instanceof(Surface, this.drawingSurface, assert.format(assert.messages.instanceof.default, 'this.drawingSurface', 'kendo.drawing.Surface'));
                assert.instanceof(Selector, this.activeSelector, assert.format(assert.messages.instanceof.default, 'this.activeSelector', 'kendo.ui.Selector'));
                e.preventDefault(); // prevents from selecting
                var point = this._getSurfacePoint(e);
                var pulled = this._pullSelections(this.activeSelector, point);
                if (Array.isArray(pulled) && pulled.length === 0) {
                    var stroke = this.activeSelector.options.stroke;
                    var path = new drawing.Path({ stroke: stroke });
                    path.moveTo(point);
                    this.drawingSurface.draw(path);
                    e.data.path = path;
                    logger.debug({
                        method: '_onMouseDown',
                        message: 'Started new selection',
                        data: stroke
                    });
                }
            },

            /**
             * Mouse move event handler
             * @param e
             * @private
             */
            _onMouseMove: function  (e) {
                assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                assert.instanceof(SelectorSurface, this, assert.format(assert.messages.instanceof.default, 'this', 'kendo.ui.SelectorSurface'));
                var path = e.data && e.data.path;
                if (path instanceof kendo.drawing.Path) {
                    var point = this._getSurfacePoint(e);
                    path.lineTo(point);
                }
            },

            /**
             * Mouse up event handler
             * @param e
             * @private
             */
            _onMouseUp: function  (e) {
                assert.instanceof($.Event, e, assert.format(assert.messages.instanceof.default, 'e', 'jQuery.Event'));
                assert.instanceof(SelectorSurface, this, assert.format(assert.messages.instanceof.default, 'this', 'kendo.ui.SelectorSurface'));
                assert.instanceof(Selector, this.activeSelector, assert.format(assert.messages.instanceof.default, 'this.activeSelector', 'kendo.ui.Selector'));
                var path = e.data && e.data.path;
                if (path instanceof drawing.Path) {
                    var rect = path.bbox();
                    this._pushSelection(this.activeSelector, rect);
                }
                e.data.path = undefined;
            },

            /**
             * Get data item from selector
             * @param selector
             * @private
             */
            _getDataItem: function (selector) {
                assert.instanceof(Selector, selector, assert.format(assert.messages.instanceof.default, 'selector', 'kendo.ui.Selector'));
                assert.type(STRING, selector.options.id, assert.format(assert.messages.type.default, 'selector.options.id', STRING));
                assert.instanceof(DataSource, selector.dataSource, assert.format(assert.messages.instanceof.default, 'selector.dataSource', 'kendo.data.DataSource'));
                var items = selector.dataSource.view().filter(function (dataItem) {
                    return dataItem.type === DATA_TYPE && dataItem.id === selector.options.id;
                });
                assert.ok(items.length <= 1, 'There should be no more than one dataItem per selector');
                return items[0];
            },

            /**
             * Create a new data item from selector
             * @param selector
             * @private
             */
            _createDataItem: function (selector) {
                assert.instanceof(Selector, selector, assert.format(assert.messages.instanceof.default, 'selector', 'kendo.ui.Selector'));
                assert.type(STRING, selector.options.id, assert.format(assert.messages.type.default, 'selector.options.id', STRING));
                return {
                    id: selector.options.id,
                    type: DATA_TYPE,
                    data: {
                        // Remember shape and stroke in case author makes changes in a new version
                        shape: selector.options.shape,
                        stroke: selector.options.stroke,
                        selections: []
                    }
                };
            },

            /**
             * Check that a data item is empty
             * @param dataItem
             * @returns {boolean}
             * @private
             */
            _isEmptyDataItem: function (dataItem) {
                return !dataItem || !dataItem.data || !Array.isArray(dataItem.data.selections) || (dataItem.data.selections.length === 0)
            },

            /**
             * Check small rect selection to discard
             * @param rect
             * @private
             */
            _isSmallSelection: function (selector, rect) {
                assert.instanceof(Selector, selector, assert.format(assert.messages.instanceof.default, 'selector', 'kendo.ui.Selector'));
                assert.instanceof(geometry.Rect, rect, assert.format(assert.messages.instanceof.default, 'rect', 'kendo.geometry.Rect'));
                var radius = parseInt(selector.options.radius, 10) || RADIUS;
                return Math.sqrt(Math.pow(rect.size.height, 2) + Math.pow(rect.size.width, 2)) <= 2 * Math.sqrt(2) * radius;
            },

            /**
             * Push new selection to selector data item in data source
             * @param selector
             * @param rect
             * @private
             */
            _pushSelection: function (selector, rect) {
                assert.instanceof(geometry.Rect, rect, assert.format(assert.messages.instanceof.default, 'rect', 'kendo.geometry.Rect'));
                assert.instanceof(Selector, selector, assert.format(assert.messages.instanceof.default, 'selector', 'kendo.ui.Selector'));
                assert.instanceof(DataSource, selector.dataSource, assert.format(assert.messages.instanceof.default, 'selector.dataSource', 'kendo.data.DataSource'));
                var dataSource = selector.dataSource;
                // Discard small selection that anyone will struggle to see on mobile
                if (!this._isSmallSelection(selector, rect)) {
                    // Find the dataItem corresponding to the selector
                    var dataItem = this._getDataItem(selector);
                    var found = true;
                    if ($.type(dataItem) === UNDEFINED) {
                        found = false;
                        dataItem = this._createDataItem(selector);
                    }
                    // Round the origin and size to spare storage space
                    var origin = [Math.round(rect.origin.x), Math.round(rect.origin.y)];
                    var size = [Math.round(rect.size.width), Math.round(rect.size.height)];
                    // Add the origin and size to the dataItem corresponding to the selector
                    dataItem.data.selections.push({ origin: origin, size: size });
                    if (!found) {
                        dataSource.add(dataItem);
                    }
                    logger.debug({
                        method: '_pushSelection',
                        message: 'Added new selection',
                        data: { origin: origin, size: size }
                    });
                } else {
                    // Remove the small path
                    this.refresh();
                }
            },

            /**
             * Pull rects containing point from selector data item in data source
             * @param selector
             * @param point
             * @returns {{type: string, data: {color, origin: {x: number, y: number}, shape: *, size: {height: number, width: number}}}}
             * @private
             */
            _pullSelections: function (selector, point) {
                assert.instanceof(geometry.Point, point, assert.format(assert.messages.instanceof.default, 'point', 'kendo.geometry.Point'));
                assert.instanceof(Selector, selector, assert.format(assert.messages.instanceof.default, 'selector', 'kendo.ui.Selector'));
                assert.instanceof(DataSource, selector.dataSource, assert.format(assert.messages.instanceof.default, 'selector.dataSource', 'kendo.data.DataSource'));
                var ret = [];
                var dataSource = selector.dataSource;
                // Find the dataItem corresponding to the selector
                var dataItem = this._getDataItem(selector);
                // Check and remove selections containing point
                if ($.type(dataItem) !== UNDEFINED) {
                    // We take a slice to avoid several change events on the dataSource as we splice
                    var selections = dataItem.data.selections.slice();
                    // We need to start with the highest index otherwise indexes change as we splice
                    for (var idx = selections.length - 1; idx >= 0; idx--) {
                        var rect = new geometry.Rect(selections[idx].origin, selections[idx].size);
                        if (rect.containsPoint(point)) {
                            ret.push(selections.splice(idx, 1));
                        }
                    }
                    if (selections.length === 0) {
                        // Remove will now trigger a change event to redraw
                        dataSource.remove(dataItem);
                    } else if (ret.length > 0) {
                        // Set will now trigger a change event to redraw
                        dataItem.set('data.selections', selections);
                    }
                }
                return ret;
            },

            /**
             * Create a rect
             * @param dataItem
             * @param stroke
             * @private
             */
            _createRectPath: function (rect, stroke) {
                assert.instanceof(geometry.Rect, rect, kendo.format(assert.messages.instanceof.default, 'rect', 'kendo.geometry.Rect'));
                assert.isPlainObject(stroke, kendo.format(assert.messages.isPlainObject.default, 'stroke'));
                var RECT_RADIUS = 10;
                var path = new drawing.Path({ stroke: stroke });
                var x = rect.origin.x;
                var y = rect.origin.y;
                var height = rect.size.height;
                var width = rect.size.width;
                path.moveTo(x + width - RECT_RADIUS, y)
                    .curveTo([x + width, y], [x + width, y], [x + width, y + RECT_RADIUS])
                    .lineTo([x + width, y + height - RECT_RADIUS])
                    .curveTo([x + width, y + height], [x + width, y + height], [x + width - RECT_RADIUS, y + height])
                    .lineTo([x + RECT_RADIUS, y + height])
                    .curveTo([x, y + height], [x, y + height], [x, y + height - RECT_RADIUS])
                    .lineTo(x, y + RECT_RADIUS)
                    .curveTo([x, y], [x, y], [x + RECT_RADIUS, y])
                    .close();
                return path;
            },

            /**
             * Create a circle
             * @param rect
             * @param stroke
             * @private
             */
            _createCirclePath: function (rect, stroke) {
                assert.instanceof(geometry.Rect, rect, kendo.format(assert.messages.instanceof.default, 'rect', 'kendo.geometry.Rect'));
                assert.isPlainObject(stroke, kendo.format(assert.messages.isPlainObject.default, 'stroke'));
                var arcGeometry = new geometry.Arc(
                    [rect.origin.x + rect.size.width / 2, rect.origin.y + rect.size.height / 2], // center
                    {
                        radiusX: rect.size.width / 2,
                        radiusY: rect.size.height / 2,
                        startAngle: 0,
                        endAngle: 360,
                        anticlockwise: false
                    }
                );
                // We need to deepExtend stroke to remove all observable wrapping from dataSource
                return new drawing.Arc(arcGeometry, { stroke: stroke });
            },

            /**
             * Create a cross
             * @param rect
             * @param stroke
             * @private
             */
            _createCrossPath: function (rect, stroke) {
                assert.instanceof(geometry.Rect, rect, kendo.format(assert.messages.instanceof.default, 'rect', 'kendo.geometry.Rect'));
                assert.isPlainObject(stroke, kendo.format(assert.messages.isPlainObject.default, 'stroke'));
                var CROSS_CURVE = 0.5;
                var path = new drawing.Path({ stroke: stroke });
                var x = rect.origin.x;
                var y = rect.origin.y;
                var height = rect.size.height;
                var width = rect.size.width;
                path.moveTo(x + width, y)
                    .lineTo(x + CROSS_CURVE * width, y + (1 - CROSS_CURVE) * height)
                    .curveTo(
                        [x, y + height],
                        [x, y + height],
                        [x, y + (1 - CROSS_CURVE) * height]
                    )
                    .lineTo(x, y + CROSS_CURVE * height)
                    .curveTo(
                        [x, y],
                        [x, y],
                        [x + CROSS_CURVE * width, y + CROSS_CURVE * height]
                    )
                    .lineTo(x + width, y + height);
                return path;
            },

            /**
             * Draw the selector group of selections from dataItem
             * @param dataItem
             * @private
             */
            _createSelectorGroup: function (dataItem) {
                assert.type(OBJECT, dataItem, assert.format(assert.messages.type.default, 'dataItem', OBJECT));
                assert.type(STRING, dataItem.id, assert.format(assert.messages.type.default, 'dataItem.id', STRING));
                assert.equal(DATA_TYPE, dataItem.type, assert.format(assert.messages.type.default, 'dataItem.type', DATA_TYPE));
                assert.type(OBJECT, dataItem.data, assert.format(assert.messages.type.default, 'dataItem.data', OBJECT));
                var selections = dataItem.data.selections;
                var group = new drawing.Group();
                // We need a plain object for stroke
                var stroke = dataItem.data.stroke instanceof kendo.data.ObservableObject ? dataItem.data.stroke.toJSON() : (dataItem.data.stroke || {});
                // Iterate over selections to draw all shapes in group
                for (var idx = 0, length = selections.length; idx < length; idx++) {
                    var rect = new geometry.Rect(selections[idx].origin, selections[idx].size);
                    switch (dataItem.data.shape) {
                        case Selector.fn.shapes.circle:
                            group.append(this._createCirclePath(rect, stroke));
                            break;
                        case Selector.fn.shapes.cross:
                            group.append(this._createCrossPath(rect, stroke));
                            break;
                        case Selector.fn.shapes.rect:
                            group.append(this._createRectPath(rect, stroke));
                            break;
                    }
                }
                return group;
            },

            /**
             * Refresh handler to redraw selections
             */
            refresh: function (e) {
                assert.instanceof(SelectorSurface, this, assert.format(assert.messages.instanceof.default, 'this', 'kendo.ui.SelectorSurface'));
                assert.instanceof(Surface, this.drawingSurface, assert.format(assert.messages.instanceof.default, 'this.drawingSurface', 'kendo.drawing.Surface'));
                // Collect hash of all data items
                var dataItems = {};
                for (var i = 0, length = (this.selectors || []).length; i < length; i++) {
                    this.selectors[i].dataSource.view().forEach(function (item) {
                        dataItems[item.id] = item;
                    })
                }
                // Clear the surface
                this.drawingSurface.clear();
                // Draw all groups
                for (var id in dataItems) {
                    if (dataItems.hasOwnProperty(id)) {
                        var group = this._createSelectorGroup(dataItems[id]);
                        this.drawingSurface.draw(group);
                    }
                }
            },

            /**
             * Destroy the widget
             * @method destroy
             */
            destroy: function () {
                var that = this;
                var element = that.element;
                // unbind document events
                that._initMouseEvents();
                // unbind dataSource
                if ($.isFunction(that._refreshHandler)) {
                    that.dataSource.unbind(CHANGE, that._refreshHandler);
                }
                // destroy toolbar
                if (that.toolbar instanceof SelectorToolBar) {
                    that.toolbar.destroy();
                    that.toolbar.wrapper.remove();
                    that.toolbar = undefined;
                }
                // Release references
                that.surface = undefined;
                that.selectors = undefined;
                // Destroy kendo
                Widget.fn.destroy.call(that);
                kendo.destroy(element);
                // Remove widget class
                element.removeClass(WIDGET_CLASS);
            }
        });

        kendo.ui.plugin(SelectorSurface);

        /*********************************************************************************
         * Selector Widget
         *********************************************************************************/

        /**
         * Selector
         * @class Selector Widget (kendoSelector)
         */
        var Selector = Widget.extend({

            /**
             * Initializes the widget
             * @param element
             * @param options
             */
            init: function (element, options) {
                var that = this;
                Widget.fn.init.call(this, element, options);
                logger.debug({ method: 'init', message: 'widget initialized' });
                this._layout();
                this._dataSource();
                this.enable(this.options.enable);
                // this.value() ??????
                kendo.notify(that);
            },

            /**
             * Widget options
             * @property options
             */
            options: {
                name: 'Selector',
                id: null,
                autoBind: true,
                dataSource: null,
                scaler: 'div.kj-stage',
                container: 'div.kj-stage>div[data-' + kendo.ns + 'role="stage"]',
                toolbar: '', // This points to a container div for including the toolbar
                radius: RADIUS,
                shape: 'circle',
                stroke: { // strokeOptions
                    color: '#FF0000',
                    dashType: 'solid',
                    opacity: 1,
                    width: 8
                },
                enable: true
            },

            /**
             * Widget events
             * @property events
             */
            events: [
                CHANGE
            ],

            /**
             * Enumeration of possible shapes
             */
            shapes: {
                circle: 'circle',
                cross: 'cross',
                rect: 'rect'
            },

            /**
             * Value for MVVM binding
             * - If there is no selection of the corresponding options.shapeStroke.color, value returns undefined
             * - If there are more selections than the number of widgets of the same shape and color, value returns 0
             * - If there is no selection of corresponding shape and color within the widget placeholder, value returns 0
             * - If there is a selection of corresponding shape and color within the widget placeholder, value returns 1
             * @param value
             */
            value: function () {
                var element = this.element;
                var options = this.options;
                var container = element.closest(options.container);
                var scaler = container.closest(options.scaler);
                var scale = scaler.length ? util.getTransformScale(scaler) : 1;
                var boundingRect = element.get(0).getBoundingClientRect(); // boundingRect includes transformations, meaning it is scaled
                var ownerDocument = $(container.get(0).ownerDocument);
                var stageOffset = container.offset();
                var elementRect = new geometry.Rect(
                    [(boundingRect.left - stageOffset.left + ownerDocument.scrollLeft()) / scale, (boundingRect.top - stageOffset.top + ownerDocument.scrollTop()) / scale],
                    [boundingRect.width / scale, boundingRect.height / scale] // getBoundingClientRect includes borders
                );
                var dataSource = this.dataSource;
                var matchingSelections = dataSource.view().filter(function (selection) {
                    return selection.type === DATA_TYPE && // This one might not be useful considering dataSource should already be filtered
                        selection.data.shape === options.shape &&
                        kendo.parseColor(selection.data.color).equals(options.shapeStroke.color);
                });
                if ($.isArray(matchingSelections) && matchingSelections.length) {
                    var similarSelectorElements = container.find(kendo.roleSelector(ROLE)).filter(function (index, element) {
                        var selectorWidget = $(element).data('kendoSelector');
                        if (selectorWidget instanceof kendo.ui.Selector) {
                            return selectorWidget.options.shape === options.shape &&
                                selectorWidget.options.shapeStroke.color === options.shapeStroke.color;
                        }
                        return false;
                    });
                    // If we have more matching selections (same shape, same color) than similar widgets (same shape, same color)
                    // We cannot consider we have a match and the widget value is 0 (it would be too easy to multiply selections in hope of getting a match by mere luck)
                    if (matchingSelections.length > similarSelectorElements.length) {
                        return 0;
                    }
                    // If we have less matching selections than similar widgets, we are good to test
                    // all selections to check whether one fits within the current widget
                    var found = 0;
                    for (var i = 0, length = matchingSelections.length; i < length; i++) {
                        var selectionRect = new geometry.Rect(
                            [matchingSelections[i].data.origin.x, matchingSelections[i].data.origin.y],
                            [matchingSelections[i].data.size.width, matchingSelections[i].data.size.height]
                        );
                        if (
                            // Check that the selection rect fits within the element bounding box
                            selectionRect.origin.x >= elementRect.origin.x &&
                            selectionRect.origin.x <= elementRect.origin.x + elementRect.size.width &&
                            selectionRect.origin.y >= elementRect.origin.y &&
                            selectionRect.origin.y <= elementRect.origin.y + elementRect.size.height &&
                            // Also check the distance from center to center
                            new geometry.Point(selectionRect.origin.x + selectionRect.size.width / 2, selectionRect.origin.y + selectionRect.size.height / 2)
                                .distanceTo(new geometry.Point(elementRect.origin.x + elementRect.size.width / 2, elementRect.origin.y + elementRect.size.height / 2)) < MIN_DIAGONAL
                        ) {

                            found++;
                        }
                    }
                    // Two or more selections within the widgets boundaries count as 1
                    return found ? 1 : 0;
                }
            },

            /**
             * Builds the widget layout
             * @private
             */
            _layout: function () {
                var element = this.wrapper = this.element;
                // touch-action: 'none' is for Internet Explorer - https://github.com/jquery/jquery/issues/2987
                // INTERACTIVE_CLASS (which might be shared with other widgets) is used to position any drawing surface underneath interactive widgets
                element.addClass(WIDGET_CLASS);
                this._initSurface();
                // this._initToolBar(); // TODO
            },

            /**
             * Init drawing surface
             * @private
             */
            _initSurface: function () {
                var options = this.options;
                var container = this.element.closest(options.container);
                assert.hasLength(container, assert.format(assert.messages.hasLength.default, options.container));
                var surfaceElement = container.find(DOT + SURFACE_CLASS);
                if (!surfaceElement.length) {
                    assert.isUndefined(this.selectorSurface, assert.format(assert.messages.isUndefined.default, 'this.selectorSurface'));
                    var firstInteractiveElement = container.children().has(DOT + INTERACTIVE_CLASS).first();
                    surfaceElement = $(DIV)
                        .addClass(SURFACE_CLASS)
                        .css({ position: 'absolute', top: 0, left: 0 })
                        .height(container.height())
                        .width(container.width());
                    if (firstInteractiveElement.length) {
                        surfaceElement.insertBefore(firstInteractiveElement);
                    } else {
                        surfaceElement.appendTo(container);
                    }
                    surfaceElement.kendoSelectorSurface({});   // TODO Toolbar!!!
                }
                this.selectorSurface = surfaceElement.data('kendoSelectorSurface');
            },

            /**
             * Init toolbar
             * @private
             */
            _initToolBar: function () {
                var that = this;
                var toolbarContainer = $(that.options.toolbar);
                // TODO: test that toolbar does not already exist
                if (toolbarContainer.length) {
                    var toolbarElement = $(DIV).appendTo(toolbarContainer);
                    that.toolbar = toolbarElement.kendoSelectorToolBar().data('kendoSelectorToolBar');
                    that.toolbar.registerSelectorSurface(this);
                }
            },

            /**
             * _dataSource function to bind the refresh handler to the change event
             * @private
             */
            _dataSource: function () {
                var that = this;

                // returns the datasource OR creates one if using array or configuration
                that.dataSource = DataSource.create(that.options.dataSource);
                // Note: without that.dataSource, source bindings won't work


                // bind to the reset event to reset the dataSource
                if (that._refreshHandler) {
                    that.dataSource.unbind(CHANGE, that._refreshHandler);
                }
                that._refreshHandler = $.proxy(that.refresh, that);
                that.dataSource.bind(CHANGE, that._refreshHandler);

                // trigger a read on the dataSource if one hasn't happened yet
                if (that.options.autoBind) {
                    // that.dataSource.fetch();
                    that.dataSource.filter({ field: 'type', operator: 'eq', value: DATA_TYPE });
                }
            },

            /**
             * Sets the dataSource for source binding
             * @param dataSource
             */
            setDataSource: function (dataSource) {
                var that = this;
                // set the internal datasource equal to the one passed in by MVVM
                that.options.dataSource = dataSource;
                // rebuild the datasource if necessary, or just reassign
                that._dataSource();
            },

            /**
             * Enable/disable user interactivity on container
             */
            enable: function (enable) {
                assert.instanceof(SelectorSurface, this.selectorSurface, assert.format(assert.messages.instanceof.default, 'this.selectorSurface', 'kendo.ui.SelectorSurface'));
                enable = $.type(enable) === UNDEFINED ? true : !!enable;
                // TODO Register/unregister selector with surface and toolbar
                if (this._enabled !== enable) {
                    this._enabled = enable;
                    if (this._enabled) {
                        this.selectorSurface.registerSelector(this);
                    } else {
                        this.selectorSurface.unregisterSelector(this);
                    }
                    this.trigger(ENABLE);
                }
            },

            /**
             * Refresh event handler for the dataSource
             * @param e
             */
            refresh: function (e) {
                assert.instanceof(SelectorSurface, this.selectorSurface, assert.format(assert.messages.instanceof.default, 'this.selectorSurface', 'kendo.ui.SelectorSurface'));
                // Set the sender to the selector
                if ($.isPlainObject(e)) {
                    e.sender = this;
                }
                // Delegate to the surface
                this.selectorSurface.refresh.bind(this.selectorSurface)(e);
            },

            /**
             * Destroys the widget
             * @method destroy
             */
            destroy: function () {
                var that = this;
                // unbind dataSource
                if ($.isFunction(that._refreshHandler)) {
                    that.dataSource.unbind(CHANGE, that._refreshHandler);
                }
                // dereference selectors
                var selectorSurface = that.selectorSurface;
                if (selectorSurface instanceof SelectorSurface) {
                    selectorSurface.unregisterSelector(this);
                    that.selectorSurface = undefined;
                }
                // Destroy kendo
                Widget.fn.destroy.call(that);
                kendo.destroy(that.element);
            }
        });

        kendo.ui.plugin(Selector);

    }(window.jQuery));

    /* jshint +W071 */

    return window.kendo;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

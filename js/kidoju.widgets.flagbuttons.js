/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        './window.assert',
        './window.logger',
        './vendor/kendo/kendo.binder'
    ], f);
})(function () {

    'use strict';

    // TODO: check touch interfaces
    // TODO: Add tooltip with value and/or description
    // TODO: Display half stars
    // TODO: Should we bind to the DOM change event to be notified when input value changes?????
    // TODO: https://developers.google.com/structured-data/rich-snippets/reviews

    (function ($, undefined) {

        // shorten references to variables for uglification
        // var fn = Function;
        // var global = fn('return this')();
        var kendo = window.kendo;
        var ui = kendo.ui;
        var Widget = ui.Widget;
        // var assert = window.assert,
        var logger = new window.Logger('kidoju.widgets.flagbuttons');
        var NUMBER = 'number';
        var STATE_ACTIVE = 'k-state-active km-state-active';
        // var STATE_DISABLED = 'k-state-disabled';
        var NS = '.kendoFlagButtons';
        var CLICK = 'click' + NS;
        var BUTTON_TEMPLATE = '<li class="k-button km-button" data-value="{0}"><span class="k-text km-text">{1}</span></li>';
        var UL_CLASS = 'km-widget km-buttongroup k-widget k-button-group';
        var CHANGE = 'change';

        /*********************************************************************************
         * Helpers
         *********************************************************************************/

        /**
         * rounding numbers for the star flagbuttons widget
         * @method round
         * @param value {Number}
         * @return {Number}
         */
        function round(value) {
            value = parseFloat(value);
            var power = Math.pow(10, PRECISION || 0);
            return Math.round(value * power) / power;
        }

        /*******************************************************************************************
         * FlagButtons
         * SEE: http://css-tricks.com/star-flagbuttonss/
         * SEE: http://www.fyneworks.com/jquery/star-flagbuttons/
         * SEE: http://www.enfew.com/5-best-jquery-star-flagbuttons-plugins-tutorials/
         *******************************************************************************************/

        /**
         * FlagButtons (kendoFlagButtons)
         * @class FlagButtons
         * @extend Widget
         */
        var FlagButtons = Widget.extend({

            /**
             * Initializes the widget
             * @method init
             * @param element
             * @param options
             */
            init: function (element, options) {
                var that = this;
                var input = $(element);
                input.type = NUMBER;
                that.ns = NS;
                options = $.extend({
                    value: parseFloat(input.attr('value') || RATING_MIN),
                    disabled: input.prop('disabled'),
                    readonly: input.prop('readonly')
                }, options);
                Widget.fn.init.call(that, element, options);
                logger.debug({ method: 'init', message: 'widget initialized' });
                that._layout();
                that.value(options.value);
                that.refresh();
                kendo.notify(that);
            },

            /**
             * Widget events
             * @property events
             */
            events: [
                CHANGE // Changing the flagbuttons value by clicking a star raises the change event
            ],

            /**
             * Widget options
             * @property options
             */
            options: {
                name: 'FlagButtons',
                value: null,
                buttons: [
                    { text: 'Group 1', value: 1 },
                    { text: 'Group 2', value: 2 },
                    { text: 'Group 3', value: 4 },
                    { text: 'Group 4', value: 8 }
                ]
            },

            /**
             * Gets a sets the flagbuttons value
             * @method value
             * @param value
             * @return {*}
             */
            value: function (value) {
                var that = this;
                var input = that.element;
                var options = that.options;
                value = parseFloat(value);
                if (isNaN(value)) {
                    return parseFloat(input.val());
                } else if (value >= options.min && value <= options.max) {
                    if (parseFloat(input.val()) !== value) {
                        // update input element
                        input.val(value);
                        // also trigger the DOM change event so any subscriber gets notified
                        // http://stackoverflow.com/questions/4672505/why-does-the-jquery-change-event-not-trigger-when-i-set-the-value-of-a-select-us
                        input.trigger(CHANGE + NS);
                    }
                } else {
                    throw new RangeError(kendo.format('Expecting a number between {0} and {1}', options.min, options.max));
                }
            },

            /**
             * Builds the widget layout
             * @method _layout
             * @private
             */
            _layout: function () {
                var that = this;
                var element = that.element;
                var options = that.options;
                var buttons = that.options.buttons;
                if (element.is('ul')) {
                    that.ul = that.element;
                } else if (element.is('input')) {
                    // TODO button?
                } else {
                    that.ul = $('ul').appendTo(that.element);
                }
                that.ul.addClass(UL_CLASS);
                for (var i = 0, length = buttons.length; i < length; i++) {
                    that.ul.append(kendo.format(BUTTON_TEMPLATE, buttons[i].value, buttons[i].text))
                }
            },

            /**
             * Toggles between enabled and readonly modes
             * @private
             */
            _editable: function (options) {
                /*
                var that = this;
                var disabled = options.disabled;
                var readonly = options.readonly;
                var wrapper = that.wrapper;
                wrapper.find(STAR_SELECTOR).off(NS);
                if (!readonly && !disabled) {
                    wrapper.removeClass(STATE_DISABLED);
                    wrapper.find(STAR_SELECTOR)
                        .on(HOVEREVENTS, $.proxy(that._toggleHover, that))
                        .on(CLICK, $.proxy(that._onStarClick, that));
                } else {
                    wrapper.addClass(STATE_DISABLED);
                }
                */
            },

            /**
             * Function called by the enabled/disabled bindings
             * @param enable
             */
            enable: function (enable) {
                this._editable({
                    readonly: false,
                    disabled: !(enable = enable === undefined ? true : enable)
                });
            },

            /**
             * Refreshes the widget
             * @method refresh
             */
            refresh: function () {
                var that = this;
                var options = that.options;
                if (that.wrapper) {
                    var i = round((that.value() - options.min) / options.step);
                    $.each(that.wrapper.find(STAR_SELECTOR), function (index, element) {
                        var star = $(element);
                        if (parseFloat(star.attr(kendo.attr(STAR))) <= i) {
                            star.html(STAR_P).addClass(STATE_SELECTED);
                        } else {
                            star.html(STAR_O).removeClass(STATE_SELECTED);
                        }
                    });
                }
            },

            /**
             * Event handler for clicking/tapping a button
             * @param e
             * @private
             */
            _onButtonClick: function (e) {
                var that = this;
                var options = that.options;
                var i = parseFloat($(e.currentTarget).attr(kendo.attr(STAR)));
                var value = options.min + i * options.step;
                e.preventDefault();
                that.value(value);
            },

            /**
             * Destroys the widget
             * @method destroy
             */
            destroy: function () {
                var that = this;
                Widget.fn.destroy.call(that);
                kendo.destroy(that.element);
            }
        });

        ui.plugin(FlagButtons);

    } (window.jQuery));

    return window.kendo;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

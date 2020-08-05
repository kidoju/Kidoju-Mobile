/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// TODO Check https://github.com/arnog/mathlive
// TODO Fix add matrix row/column - https://github.com/kidoju/Kidoju-Widgets/issues/232
// TODO Add algorithms to compare math expressions - https://github.com/kidoju/Kidoju-Widgets/issues/221
// TODO i18n issues - https://github.com/kidoju/Kidoju-Widgets/issues/203
// TODO Allow \\MathQuillMathField in the MathInput - https://github.com/kidoju/Kidoju-Widgets/issues/195
// TODO add chemical formulas- https://github.com/kidoju/Kidoju-Widgets/issues/193
// TODO add autocomplete (optional) - https://github.com/kidoju/Kidoju-Widgets/issues/188
// TODO convert multiply key to \\times - https://github.com/kidoju/Kidoju-Widgets/issues/180
// TODO whitelist/blacklist authorized latex directives and filter toolbar accordingly - https://github.com/kidoju/Kidoju-Widgets/issues/179
// TODO add text formatting commands - https://github.com/kidoju/Kidoju-Widgets/issues/178

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';
import mq from '../vendor/mathquill/mathquill';
import './widgets.mathinput.toolbar.es6';

const {
    data: { ObservableArray },
    destroy,
    // htmlEncode,
    notify,
    roleSelector,
    ui: { MathInputToolBar, plugin, Widget },
    unbind,
} = window.kendo;
const logger = new Logger('widgets.mathinput');
const WIDGET = 'kendoMathInput';
const NS = CONSTANTS.DOT + WIDGET;
const WIDGET_CLASS = 'kj-mathinput'; // 'k-widget kj-mathinput';

const MQ = mq.getInterface(mq.getInterface.MAX);

const RX_CHARACTER = /^[\s[\]{}()|]$/;
const RX_SIMPLE_COMMAND = /^\\[a-z]+$/; // These are simple LaTeX commands
const RX_COMPLEX_COMMAND = /^\\mathbb{[^}]+}$/; // These are commands with parameters which should be passed to mathField.command instead of mathField.write
// const RX_PARAMS = /[\(\[\{][^\}\]\)]*[\}\]\)]/g;
const RX_INNERFIELD = /\\MathQuillMathField/; // or /\\MathQuillMathField{[\}]*}/
const KEYSTROKES = {
    BACKSPACE: 'Backspace',
    LEFT: 'Left',
    RIGHT: 'Right',
    SPACE: 'Spacebar',
};
const TOOLBAR = [
    'backspace',
    'field',
    'keypad',
    'basic',
    'greek',
    'operators',
    'expressions',
    'sets',
    'matrices',
    'statistics',
    // 'units',
    // 'chemistry'
];

/**
 * MathInput
 * @class MathInput
 * @extends Widget
 */
const MathInput = Widget.extend({
    /**
     * Init
     * @param element
     * @param options
     */
    init(element, options = {}) {
        Widget.fn.init.call(this, element, options);
        logger.debug({ method: 'init', message: 'Widget initialized' });
        // We need to set tools otherwise the options.toolbar.tools array is simply pasted over the TOOLBAR array, which creates duplicates in the overflow
        this.options.toolbar.tools = (options.toolbar || {}).tools || TOOLBAR;
        this._enabled = this.element.prop('disabled')
            ? false
            : this.options.enable;
        // that.bind(CONSTANTS.CHANGE, that.refresh.bind(that));
        this._render();
        this.value(this.options.value);
        this.enable(this._enabled);
        // see http://www.telerik.com/forums/kendo-notify()
        notify(this);
    },

    /**
     * Options
     * @property options
     */
    options: {
        name: 'MathInput',
        value: null, // which is either converted to '' or [] depending on inner fields
        enable: true,
        errorColor: '#cc0000',
        mathquill: {
            // See http://docs.mathquill.com/en/latest/Config/
            spaceBehavesLikeTab: false, // Otherwise formulas cannot contain spaces
            leftRightIntoCmdGoes: 'up',
            restrictMismatchedBrackets: false,
            sumStartsWithNEquals: true,
            supSubsRequireOperand: true,
            charsThatBreakOutOfSupSub: '+-=<>',
            autoSubscriptNumerals: false, // Otherwise non-isolated numbers are subscript (true is good for chemistry)
            autoCommands: 'int pi sqrt sum', // The ones you can type without \ in addition to autoOperatorNames
            autoOperatorNames:
                'arccos arcsin arctan cos deg det dim exp lim log ln sin tan', // Otherwise BuiltInOpNames like sin are not converted to \sin
            // arg deg det dim exp gcd hom inf ker lg lim ln log max min sup limsup liminf injlim projlim Pr
            // sin cos tan arcsin arccos arctan sinh cosh tanh sec cosec cotan csc cot coth ctg // why coth but not sech and csch, LaTeX?
            substituteTextarea() {
                return document.createElement('textarea');
            },
            mouseEvents: true, // TODO
        },
        toolbar: {
            container: '',
            resizable: true,
            tools: TOOLBAR,
        },
    },

    /**
     * Events
     * @property events
     */
    events: [CONSTANTS.CHANGE],

    /**
     * Value for MVVM binding
     * @param value
     */
    value(value) {
        if (this._hasInnerFields()) {
            return this._arrayValue(value);
        }
        return this._stringValue(value);
    },

    /**
     * Checks when value should be an array
     * @returns {boolean}
     * @private
     */
    _hasInnerFields() {
        // Make sure RX_INNERFIELD does not have the /g option
        return RX_INNERFIELD.test(this.innerHTML);
    },

    /**
     * Handles value as an array
     * @param value
     * @returns {Array}
     * @private
     */
    _arrayValue(value) {
        const that = this;
        let ret;
        let i;
        let length;
        if (Array.isArray(value) || value instanceof ObservableArray) {
            for (i = 0, length = that.mathFields.length; i < length; i++) {
                if (
                    that.mathFields[i] instanceof MQ.MathField &&
                    that.mathFields[i].latex() !==
                        (value[i] || that.defaults[i])
                ) {
                    logger.debug({
                        method: 'value',
                        message: 'Setting value',
                        data: { value },
                    });
                    if ($.type(value[i]) === CONSTANTS.STRING) {
                        that.mathFields[i].latex(value[i]);
                    } else {
                        that.mathFields[i].latex(that.defaults[i]);
                    }
                }
            }
        } else if ($.type(value) === CONSTANTS.NULL) {
            that._arrayValue([]);
        } else if ($.type(value) === CONSTANTS.UNDEFINED) {
            ret = that.mathFields.map((mathField) => {
                return mathField.latex();
            });
            let isDefault = true;
            for (i = 0, length = ret.length; i < length; i++) {
                if (ret[i] !== that.defaults[i]) {
                    isDefault = false;
                    break;
                }
            }
            if (isDefault) {
                ret = [];
            }
        } else {
            throw new TypeError(
                '`value` is expected to be an array if not undefined'
            );
        }
        return ret;
    },

    /**
     * Handles value as string
     * @param value
     * @private
     */
    _stringValue(value) {
        // We should only update if value has changed because this triggers _onEdit and a CONSTANTS.CHANGE event
        // which breaks that.trigger(DATABOUND); in widgets.stage
        let ret;
        const latex = this.mathFields[0].latex();
        if ($.type(value) === CONSTANTS.STRING) {
            if (value !== latex) {
                this.mathFields[0].latex(value);
            }
        } else if ($.type(value) === CONSTANTS.NULL) {
            this._stringValue('');
        } else if ($.type(value) === CONSTANTS.UNDEFINED) {
            ret = latex;
        } else {
            throw new TypeError(
                '`value` is expected to be a string if not undefined'
            );
        }
        return ret;
    },

    /**
     * Builds the widget layout
     * @private
     */
    _render() {
        this.wrapper = this.element
            .addClass(WIDGET_CLASS)
            .addClass(CONSTANTS.INTERACTIVE_CLASS);
        this._initMathInput();
        this._initToolBar();
    },

    /**
     * Sets MQ configuration
     * Note: it would have been nice to set handler globally on the MQ object but we need to play nice we others
     * @see http://docs.mathquill.com/en/latest/Api_Methods/#mqconfigconfig
     * @see http://docs.mathquill.com/en/latest/Config/
     * @private
     */
    _getConfig() {
        // We cannot build return that.config for all MathFields because MathQuill modifies it and it cannot be reused.
        // Se we keep track of a single instance of handlers and return a new config object at each request.
        const that = this;
        const { options } = that;

        // Cache handlers
        if ($.type(that._handlers) === CONSTANTS.UNDEFINED) {
            that._handlers = {
                deleteOutOf: that._onOutOf.bind(that),
                downOutOf: that._onOutOf.bind(that),
                edit: that._onEdit.bind(that),
                enter: that._onEnter.bind(that),
                moveOutOf: that._onOutOf.bind(that),
                selectOutOf: that._onOutOf.bind(that),
                upOutOf: that._onOutOf.bind(that),
            };
        }

        // Return a fresh config that MathQuill can modify
        const config = $.extend({}, options.mathquill);
        config.substituteTextarea = options.mathquill.substituteTextarea;
        config.handlers = that._handlers;
        return config;
    },

    /**
     * Initialize
     * @private
     */
    _initMathInput() {
        const { element } = this;
        // Get initial layout within <div></div> or <span></span>
        this.innerHTML = element.text().trim();
        if (this._hasInnerFields()) {
            // If the initial layout contains embedded fields
            this.staticMath = MQ.StaticMath(element.get(0));
            this.mathFields = this.staticMath.innerFields;
            // Named fields are listed as innerFields[name] in addition to innerField[#num]
            // Considering we do versioning, using field names has no benefit especially if naming cannot be enforced
        } else {
            // If the initial layout does not contain embedded fields
            this.mathFields = [MQ.MathField(element.get(0))];
        }
        // Gather defaults
        this.defaults = this.mathFields.map((mathField) => {
            return mathField.latex();
        });
    },

    /**
     * Initialize handlers
     * @private
     */
    _initHandlers() {
        const { element, mathFields } = this;

        // Set config handlers on each field
        for (let i = 0, { length } = mathFields; i < length; i++) {
            mathFields[i].config(this._enabled ? this._getConfig() : {});
            // mathFields[i].__controller.editable = this._enabled;
        }
        // Enabled/Disable textareas
        element.find('textarea').each(() => {
            $(this).prop('disabled', !this._enabled);
        });

        // TODO Check interesting code at https://github.com/mathquill/mathquill/blob/master/test/visual.html#L456
        /*
         MQ.MathField($('#disable-typing')[0], {
             substituteKeyboardEvents: function (textarea, handlers) {
                 return MQ.saneKeyboardEvents(textarea, $.extend({}, handlers, {
                     cut: $.noop,
                     paste: $.noop,
                     keystroke: $.noop,
                     typedText: $.noop
             }));
             }
         });
         */

        // Add focusin and focusout event handlers
        element.off(NS);
        // $(document).off(NS);
        if (this._enabled) {
            element
                .on(`${CONSTANTS.FOCUSIN}${NS}`, this._onFocusIn.bind(this))
                .on(`${CONSTANTS.FOCUSOUT}${NS}`, this._onFocusOut.bind(this));
            // $(document).on(CONSTANTS.FOCUS + NS, this._onFocusOut.bind(this));
        }
    },

    /**
     * Event handler triggered when MQ content has changed
     * @see http://docs.mathquill.com/en/latest/Config/#editmathfield
     * @private
     */
    _onEdit(/* mathField */) {
        this.trigger(CONSTANTS.CHANGE);
        logger.debug({ method: '_onEdit', message: 'Edit' });
    },

    /**
     * Event handler triggered when pressing the enter key
     * @see http://docs.mathquill.com/en/latest/Config/#entermathfield
     * @private
     */
    _onEnter(/* mathField */) {
        this.trigger(CONSTANTS.CHANGE);
        logger.debug({ method: '_onEnter', message: 'Enter' });
    },

    /**
     * Event handler triggered when losing focus
     * @see http://docs.mathquill.com/en/latest/Config/#outof-handlers
     * @private
     */
    _onOutOf(/* direction, mathField */) {
        logger.debug({ method: '_onOutOf', message: 'Not implemented' });
    },

    /**
     * Event handler for focusing into the widget element (or any of its MathFields)
     * @private
     */
    _onFocusIn(e) {
        const { mathFields, options, toolBar } = this;
        // Record MathField with focus
        this._activeField = undefined;
        for (let i = 0, { length } = mathFields; i < length; i++) {
            // if (!mathFields[i].__controller.blurred) {
            if (mathFields[i].__controller.textarea.is(e.target)) {
                this._activeField = mathFields[i];
            }
        }
        // Hide all toolbars
        const container = $(options.toolbar.container);
        if (container.length) {
            // $(document).find(roleSelector('mathinputtoolbar')).hide();
            container.children(roleSelector('mathinputtoolbar')).hide();
            // Show widget's toolbar
            if (
                this._activeField instanceof MQ.MathField &&
                toolBar instanceof MathInputToolBar
            ) {
                setTimeout(() => {
                    // Without setTimeout, iOS does not show the toolbar
                    toolBar.wrapper.show();
                });
            }
        }
        if (toolBar instanceof MathInputToolBar) {
            toolBar.resize();
        }
        logger.debug({ method: '_onFocusIn', message: 'Focus in' });
    },

    /**
     * Event handler for focusing out of the widget element (or any of its MathFields)
     * @private
     */
    _onFocusOut() {
        const { options, toolBar } = this;
        const container = $(options.toolbar.container);
        if (container.length) {
            // This is how kendo.editor does it at L#698
            setTimeout(() => {
                // Check whether we are interacting with the toolbar
                if (
                    toolBar instanceof MathInputToolBar &&
                    toolBar.wrapper.has(document.activeElement).length === 0 && // Prevents the toolbar from hiding when clicking buttons
                    !$(document.activeElement).is('.kj-floating')
                ) {
                    // Prevents the toolbar from hiding when moving the floating toolbar container
                    toolBar.wrapper.hide();
                }
            }, 10);
        }
        logger.debug({ method: '_onFocusOut', message: 'Focus out' });
    },

    /**
     * Initialize toolbar
     * Note: let us make this a toolbar for now because it is easier considering existing kendo ui widgets
     * but ultimately we migh need a custom keyboard like http://khan.github.io/math-input/custom.html.
     * Alternatively focusing a math input on mobile devices might bring up a dialog where the toolbar
     * popups have more space to expand like a keyboard.
     * @private
     */
    _initToolBar() {
        const { element, options } = this;
        const container = $(options.toolbar.container);
        if (container.length) {
            this.toolBar = $(`<${CONSTANTS.DIV}/>`)
                .appendTo(container)
                .kendoMathInputToolBar({
                    tools: options.toolbar.tools,
                    resizable: options.toolbar.resizable,
                    action: this._onToolBarAction.bind(this),
                    dialog: this._onToolBarDialog.bind(this),
                })
                .data('kendoMathInputToolBar');
            this.toolBar.wrapper.hide();
        } else if (!options.toolbar.container) {
            this.wrapper = element
                .wrap(`<${CONSTANTS.DIV}/>`)
                .parent()
                .addClass('kj-mathinput-wrap');
            this.toolBar = $(`<${CONSTANTS.DIV}/>`)
                .prependTo(this.wrapper)
                .kendoMathInputToolBar({
                    tools: options.toolbar.tools,
                    resizable: options.toolbar.resizable,
                    action: this._onToolBarAction.bind(this),
                    dialog: this._onToolBarDialog.bind(this),
                })
                .data('kendoMathInputToolBar');
        }
    },

    /**
     * Event handler for triggering an action event from the toolbar
     * @param e
     * @private
     */
    _onToolBarAction(e) {
        switch (e.command) {
            case 'ToolbarBackspaceCommand':
                this._activeField.keystroke(KEYSTROKES.BACKSPACE);
                break;
            case 'ToolbarFieldCommand':
                // Note: MathQuillFields can be named as in \\MathQuillMathField[name]{}
                // see https://github.com/mathquill/mathquill/issues/741
                this._activeField.write('\\MathQuillMathField{}');
                break;
            default:
            case 'ToolbarKeyPadCommand':
            case 'ToolbarBasicCommand':
            case 'ToolbarGreekCommand':
            case 'ToolbarOperatorsCommand':
            case 'ToolbarExpressionsCommand':
            case 'ToolbarSetsCommand':
            case 'ToolbarMatricesCommand':
            case 'ToolbarStatisticsCommand':
            case 'ToolbarUnitsCommand':
            case 'ToolbarChemistryCommand':
                // MathQuill has `keystroke`, `typeText`, `write` and `cmd` methods
                // see http://docs.mathquill.com/en/latest/Api_Methods/#editable-mathfield-methods
                // `keystroke` is for special keys especially navigation keys and backspaces
                // `typedText` is for non-latex text especially single characters
                // Any latex should be passed to MathQuill using `write`
                // `cmd` is actually a macro, for example
                // this._activeField.cmd('\\sum');
                //    is equivalent to
                // this._activeField.write('\\sum_{}^{}');
                if (RX_CHARACTER.test(e.params.value)) {
                    // Especially to type spaces
                    this._activeField.typedText(e.params.value);
                } else if (
                    RX_SIMPLE_COMMAND.test(e.params.value) ||
                    RX_COMPLEX_COMMAND.test(e.params.value)
                ) {
                    this._activeField.cmd(e.params.value);
                    // With `cmd`, the cursor is positioned as expected

                    // } else if (/^\\text/.test(e.params.value)) {
                    //     // Currently commented out because this requires a double backspace to delete
                    //     this._activeField.write(e.params.value);
                    //     this._activeField.keystroke(KEYSTROKES.RIGHT);
                } else if ($.type(e.params.value) === CONSTANTS.STRING) {
                    this._activeField.write(e.params.value);
                    // With `write`, the cursor is positioned at the end
                    /*
                    var matches = e.params.value.match(RX_PARAMS);
                    // TODO: Note _ and ^ might need to be counted too - see log_{}() which requires 3 keystrokes instead of 2
                    if (Array.isArray(matches)) {
                        for (var i = 0, length = matches.length; i < length; i++) {
                            var content = matches[i].replace(/\\[a-z]+/g, '').replace(/\s/g, '');
                            if (content.length === 2) {
                                this._activeField.keystroke(KEYSTROKES.LEFT);
                            }
                        }
                    }
                    */
                }
        }
        // In case of focus issues, it might be worth considering implementing the mousedown event
        // on the toolbar to be able to cancel the click so as to keep the focus on the mathquill input
        this._activeField.focus();
    },

    /**
     * Event handler for triggering a dialog event from the toolbar
     * @param e
     * @private
     */
    _onToolBarDialog(e) {
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        this._openDialog(e.name, e.options);
    },

    /**
     *
     * @param name
     * @param options
     * @returns {name}
     * @private
     */
    _openDialog(name, options) {
        const dialog = window.kendo.mathinput.dialogs.create(name, options);
        if (!Array.isArray(this._dialogs)) {
            this._dialogs = [];
        }
        let ret;
        if (dialog) {
            dialog.bind('action', this._onToolBarAction.bind(this));
            dialog.bind('deactivate', this._destroyDialog.bind(this));
            this._dialogs.push(dialog);
            dialog.open();
            ret = dialog;
        }
        return ret;
    },

    /**
     *
     * @private
     */
    _destroyDialog() {
        this._dialogs.pop();
    },

    /**
     * Enable
     * @param enabled
     */
    enable(enabled) {
        const { toolBar } = this;
        this._enabled =
            $.type(enabled) === CONSTANTS.UNDEFINED ? true : !!enabled;
        this._initHandlers();
        if (toolBar instanceof MathInputToolBar) {
            toolBar.element.children('a.k-button').each((index, button) => {
                toolBar.enable(button, enabled);
            });
        }
        // TODO: Consider hiding the toolbar when floating
        // Also Consider removing the cursor
    },

    /**
     * Refresh
     */
    refresh() {
        logger.debug({ method: 'refresh', message: 'Widget refreshed' });
    },

    /**
     * Return latex as text, especially for mathjs
     */
    text() {
        const { mathFields, staticMath } = this;
        let ret;
        if (staticMath instanceof MQ.StaticMath) {
            ret = staticMath.text();
        } else if (
            Array.isArray(mathFields) &&
            mathFields.length === 1 &&
            mathFields[0] instanceof MQ.MathField
        ) {
            ret = mathFields[0].text();
        }
        return ret;
    },

    /**
     * Destroy
     * @method destroy
     */
    destroy() {
        const that = this;
        const { wrapper } = that;
        // Unbind events
        that.enable(false);
        unbind(wrapper);
        // Release references
        if (that.toolBar instanceof MathInputToolBar) {
            that.toolBar.destroy();
            that.toolBar.wrapper.remove();
            that.toolBar = undefined;
        }
        // http://docs.mathquill.com/en/latest/Api_Methods/#revert
        if (that.staticMath instanceof MQ.StaticMath) {
            that.staticMath.revert();
            that.staticMath = undefined;
        } else if (
            Array.isArray(that.mathFields) &&
            that.mathFields.length === 1 &&
            that.mathFields[0] instanceof MQ.MathField
        ) {
            that.mathFields[0].revert();
            that.mathFields = undefined;
        }
        // Destroy kendo
        Widget.fn.destroy.call(that);
        destroy(wrapper);
        // Remove widget class
        // wrapper.removeClass(WIDGET_CLASS);
        logger.debug({ method: 'destroy', message: 'widget destroyed' });
    },
});

/**
 * Registration
 */
if (!Object.prototype.hasOwnProperty.call(window.kendo.ui, 'MathInput')) {
    // Prevents loading several times in karma
    plugin(MathInput);
}

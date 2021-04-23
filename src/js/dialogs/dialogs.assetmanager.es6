/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import 'kendo.core';
import __ from '../app/app.i18n.es6';
// import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import '../widgets/widgets.assetmanager.es6';
import './widgets.basedialog.es6';

const {
    bind,
    ns,
    resize,
    roleSelector,
    ui: { BaseDialog },
} = window.kendo;

/**
 * A shortcut function to display a dialog with a kendo.ui.AssetManager
 * @param options
 * @returns {*}
 */
function openAssetManager(options = {}) {
    /*
    assert.instanceof(
        kidoju.ToolAssets,
        assets,
        assert.format(
            assert.messages.instanceof.default,
            'assets',
            'kidoju.ToolAssets'
        )
    );
    */

    const dfd = $.Deferred();

    // Find or create the DOM element
    const $dialog = BaseDialog.getElement(options.cssClass);
    $dialog.css({ padding: 0 }).addClass('k-tabstrip k-header');

    // Create the dialog
    const dialog = $dialog
        .kendoBaseDialog({
            title: __('dialogs.assetmanager.title'),
            content: `<div data-${ns}role="assetmanager" data-${ns}bind="value:value"></div>`,
            data: { value: '' },
            actions: [
                BaseDialog.fn.options.messages.actions.ok,
                BaseDialog.fn.options.messages.actions.cancel,
            ],
            width: 860,
            ...options,
        })
        .data('kendoBaseDialog');

    // Rebind the initOpen event considering the kendo.ui.AssetManager widget requires assets which cannot be bound via a viewModel
    dialog.unbind(CONSTANTS.INITOPEN);
    dialog.one(CONSTANTS.INITOPEN, (e) => {
        // Designate assets
        e.sender.element
            .find(roleSelector('assetmanager'))
            .kendoAssetManager(e.sender.options.assets);
        // Bind viewModel
        bind(e.sender.element.children(), e.sender.viewModel);
    });

    // Bind the show event to resize once opened
    dialog.one(CONSTANTS.SHOW, (e) => {
        resize(e.sender.element);
    });

    // Bind the click event
    dialog.bind(CONSTANTS.CLICK, (e) => {
        // assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isNonEmptyPlainObject.default, 'e'));
        // assert.instanceof(kendo.ui.Dialog, e.sender, assert.format(assert.messages.instanceof.default, 'e.sender', 'kendo.ui.Dialog'));
        const url = e.sender.viewModel.get('value');
        let hasScheme = false;
        Object.keys(options.assets.schemes).some((scheme) => {
            hasScheme = url.startsWith(`${scheme}://`);
            return hasScheme;
        });
        if (hasScheme) {
            // This is an asset selected from our library of images or from the project
            dfd.resolve({
                action: e.action,
                data: e.sender.viewModel.toJSON(),
            });
        } else if (
            CONSTANTS.RX_URL.test(url) &&
            e.action === BaseDialog.fn.options.messages.actions.ok.action &&
            options.assets.collections.length > 0 &&
            options.assets.collections[0].transport &&
            $.type(options.assets.collections[0].transport.import) ===
                CONSTANTS.FUNCTION
        ) {
            // This is a web asset that needs importing
            options.assets.collections[0].transport.import({
                data: { url },
                success(response) {
                    // At this stage, the dialog is closed and e.sender.viewModel has been reset to undefined.
                    // e.sender.viewModel.set('value', response.data[0].url); won't work
                    // We need to pass the url directly to dfd resolve
                    dfd.resolve({
                        action: e.action,
                        data: {
                            value: response.data[0].url,
                        },
                    });
                },
                error: dfd.reject,
            });
        } else if (
            CONSTANTS.RX_URL.test(url) &&
            e.action !== BaseDialog.fn.options.messages.actions.ok.action
        ) {
            // This is a web asset that would have needed importing but user pressed cancel
            dfd.resolve({
                action: e.action,
                data: {
                    value: '',
                },
            });
        } else {
            // We do not know how to handle that url
            dfd.reject(new Error('Unknown url scheme')); // TODO i18n
        }
    });

    // Bind the close event
    dialog.one(CONSTANTS.CLOSE, (e) => {
        e.sender.element.removeClass('k-tabstrip k-header');
    });

    // Display the message dialog
    dialog.open();

    return dfd.promise();
}

/**
 * Default export
 */
export default openAssetManager;

/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.view';
import 'kendo.mobile.scroller';
import assert from '../common/window.assert.es6';

const {
    mobile: {
        ui: { Scroller, View }
    },
    roleSelector
} = window.kendo;

/**
 * Layout feature
 */
const feature = {
    onLayoutViewShow(e) {
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        assert.instanceof(
            View,
            e.view,
            assert.format(
                assert.messages.instanceof.default,
                'e.view',
                'kendo.mobile.ui.View'
            )
        );
        // Reset view scroller
        if (e.view.scroller instanceof Scroller) {
            // Stretched view like #correction and #player do not have a scroller
            e.view.scroller.reset();
        }
        // Reset other scrollers including markdown scrollers
        e.view.element
            .find(roleSelector('scroller'))
            .each((index, scroller) => {
                const scrollerWidget = $(scroller).data('kendoMobileScroller');
                if (scrollerWidget instanceof Scroller) {
                    scrollerWidget.reset();
                }
            });
    }
};

/**
 * Default export
 */
export default feature;

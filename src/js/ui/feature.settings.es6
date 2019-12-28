/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.mobile.application';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import app from '../common/window.global.es6';
import { VIEW } from './ui.constants.es6';

/**
 * Settings feature
 */
const feature = {
    /**
     * Event handler triggered when showing the Settings view
     * Note: the view event is triggered each time the view is requested
     * @param e
     */
    onSettingsViewShow(e) {
        return app.controller.onGenericViewShow(e);
    },

    /**
     * Event handler triggered when clicking the Switch button of the Settings view
     * @param e
     */
    onSettingsSwitchClick(e) {
        assert.isNonEmptyPlainObject(
            e,
            assert.format(assert.messages.isNonEmptyPlainObject.default, 'e')
        );
        assert.instanceof(
            $,
            e.button,
            assert.format(
                assert.messages.instanceof.default,
                'e.button',
                'jQuery'
            )
        );
        // Navigate to the user view
        app.controller.application.navigate(CONSTANTS.HASH + VIEW.USER);
    }
};

/**
 * Default export
 */
export default feature;

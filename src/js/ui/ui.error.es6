/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import app from '../common/window.global.es6';
// import Logger from '../common/window.logger.es6';

// const logger = new Logger('ui.error');

/**
 * Error feature
 */
const feature = {
    /**
     * Name
     */
    _name: 'error',

    /**
     * View
     */
    VIEW: {
        ERROR: {
            _: 'error',
        },
        DEFAULT: 'error', // <---------- url is '/'
    },

    /**
     * Event handler triggered when showing the Error view
     * Note: the view event is triggered each time the view is requested
     * @param e
     */
    onErrorViewShow(e) {
        return app.viewModel.onGenericViewShow(e);
    },
};

/**
 * Default export
 */
export default feature;

/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import BaseDataSource from './datasources.base.es6';
import LazyCategory from './models.category.lazy.es6';
import LazyCategoryTransport from './transports.category.lazy.es6';

/**
 * LazyCategoryDataSource
 * A readonly datasource of flattened categories
 * @type {kendo.data.DataSource}
 */
const LazyCategoryDataSource = BaseDataSource.extend({
    init(options = {}) {
        BaseDataSource.fn.init.call(
            this,
            Object.assign(options, {
                transport: new LazyCategoryTransport(),
                schema: {
                    data: 'data',
                    total: 'total',
                    errors: 'error',
                    modelBase: LazyCategory,
                    model: LazyCategory
                }
            })
        );
    }
});

/**
 * Default export
 */
export default LazyCategory;

/**
 * Legacy code
 * @type {assert}
 */
window.app = window.app || {};
window.app.models = window.app.models || {};
window.app.models.LazyCategoryDataSource = LazyCategoryDataSource;

/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';

const {
    mobile: { ui }
} = window.kendo;

/* ListView messages */
if (ui.ListView) {
    // Beware: this makes all mobile list views filterable by default
    // So non-filterable list views need to have filterable explicitly set to false
    ui.ListView.prototype.options.filterable = $.extend(
        true,
        ui.ListView.prototype.options.filterable,
        {
            placeholder: 'Rechercher...'
        }
    );
    ui.ListView.prototype.options.messages = $.extend(
        true,
        ui.ListView.prototype.options.messages,
        {
            loadMoreText: 'Plus de résultats'
        }
    );
}

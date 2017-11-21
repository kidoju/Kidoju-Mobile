(function(f){
    if (typeof define === 'function' && define.amd) {
        define(['kendo.core'], f);
    } else {
        f();
    }
}(function(){

    'use strict';

    (function ($, undefined) {

        var kendo = window.kendo;
        var ui = kendo.mobile.ui;

        /* ListView messages */
        if (ui.ListView) {
            // Beware: this makes all mobile list views filterable by default
            // So non-filterable list views need to have filterable explicitly set to false
            ui.ListView.prototype.options.filterable =
                $.extend(true, ui.ListView.prototype.options.filterable,{
                    placeholder: 'Search...'
                });
            ui.ListView.prototype.options.messages =
                $.extend(true, ui.ListView.prototype.options.messages,{
                    loadMoreText: 'Press to load more'
                });
        }

    })(window.kendo.jQuery);
}));

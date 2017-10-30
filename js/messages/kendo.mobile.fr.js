(function(f){
    if (typeof define === 'function' && define.amd) {
        define(['kendo.core'], f);
    } else {
        f();
    }
}(function(){
    (function ($, undefined) {

        var kendo = window.kendo;
        var ui = kendo.mobile.ui;

        /* ListView messages */
        if (ui.ListView) {
            ui.ListView.prototype.options.filterable =
                $.extend(true, ui.ListView.prototype.options.filterable,{
                    placeholder: 'Rechercher...'
                });
            ui.ListView.prototype.options.messages =
                $.extend(true, ui.ListView.prototype.options.messages,{
                    loadMoreText: 'Plus de résultats'
                });
        }

    })(window.kendo.jQuery);
}));

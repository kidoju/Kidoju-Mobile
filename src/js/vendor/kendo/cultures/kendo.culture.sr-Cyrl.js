/** 
 * Kendo UI v2021.1.119 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2021 Progress Software Corporation and/or one of its subsidiaries or affiliates. All rights reserved.                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/

(function(f){
    if (typeof define === 'function' && define.amd) {
        define(["kendo.core"], f);
    } else {
        f();
    }
}(function(){
(function( window, undefined ) {
    kendo.cultures["sr-Cyrl"] = {
        name: "sr-Cyrl",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": ".",
            ".": ",",
            groupSize: [3],
            percent: {
                pattern: ["-n%","n%"],
                decimals: 2,
                ",": ".",
                ".": ",",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                name: "",
                abbr: "",
                pattern: ["-n $","n $"],
                decimals: 2,
                ",": ".",
                ".": ",",
                groupSize: [3],
                symbol: "дин."
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["недеља","понедељак","уторак","среда","четвртак","петак","субота"],
                    namesAbbr: ["нед.","пон.","ут.","ср.","чет.","пет.","суб."],
                    namesShort: ["не","по","ут","ср","че","пе","су"]
                },
                months: {
                    names: ["јануар","фебруар","март","април","мај","јун","јул","август","септембар","октобар","новембар","децембар"],
                    namesAbbr: ["јан.","феб.","март","апр.","мај","јун","јул","авг.","септ.","окт.","нов.","дец."]
                },
                AM: [""],
                PM: [""],
                patterns: {
                    d: "dd.MM.yyyy.",
                    D: "d. MMMM yyyy.",
                    F: "d. MMMM yyyy. H:mm:ss",
                    g: "dd.MM.yyyy. H:mm",
                    G: "dd.MM.yyyy. H:mm:ss",
                    m: "d. MMMM",
                    M: "d. MMMM",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "H:mm",
                    T: "H:mm:ss",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM yyyy.",
                    Y: "MMMM yyyy."
                },
                "/": ".",
                ":": ":",
                firstDay: 1
            }
        }
    }
})(this);
}));
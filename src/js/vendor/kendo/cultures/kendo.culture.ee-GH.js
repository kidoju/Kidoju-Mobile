/** 
 * Kendo UI v2021.2.616 (http://www.telerik.com/kendo-ui)                                                                                                                                               
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
    kendo.cultures["ee-GH"] = {
        name: "ee-GH",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": ",",
            ".": ".",
            groupSize: [3],
            percent: {
                pattern: ["-n%","n%"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                name: "Ghanaian Cedi",
                abbr: "GHS",
                pattern: ["-$n","$n"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "GH₵"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["kɔsiɖa","dzoɖa","blaɖa","kuɖa","yawoɖa","fiɖa","memleɖa"],
                    namesAbbr: ["kɔs","dzo","bla","kuɖ","yaw","fiɖ","mem"],
                    namesShort: ["kɔs","dzo","bla","kuɖ","yaw","fiɖ","mem"]
                },
                months: {
                    names: ["dzove","dzodze","tedoxe","afɔfĩe","dama","masa","siamlɔm","deasiamime","anyɔnyɔ","kele","adeɛmekpɔxe","dzome"],
                    namesAbbr: ["dzv","dzd","ted","afɔ","dam","mas","sia","dea","any","kel","ade","dzm"]
                },
                AM: ["ŋdi","ŋdi","ŊDI"],
                PM: ["ɣetrɔ","ɣetrɔ","ƔETRƆ"],
                patterns: {
                    d: "M/d/yyyy",
                    D: "dddd, MMMM d 'lia' yyyy",
                    F: "dddd, MMMM d 'lia' yyyy tt 'ga' h:mm:ss",
                    g: "M/d/yyyy tt 'ga' h:mm",
                    G: "M/d/yyyy tt 'ga' h:mm:ss",
                    m: "MMMM d 'lia'",
                    M: "MMMM d 'lia'",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "tt 'ga' h:mm",
                    T: "tt 'ga' h:mm:ss",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM yyyy",
                    Y: "MMMM yyyy"
                },
                "/": "/",
                ":": ":",
                firstDay: 1
            }
        }
    }
})(this);
}));
/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */

'use strict';

(function ($) {

    var uuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            /* jshint -W016 */
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            /* jshint +W016 */
            return v.toString(16);
        });
    };
    var objectId = function() {
        return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, function(c) {
            /* jshint -W016 */
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            /* jshint +W016 */
            return v.toString(16);
        });
    };

    /**
     * Test data
     * @type {{users: *[]}}
     */
    window.testData = {

        /**
         * Mobile users
         */
        users: [
            {
                id: objectId(),
                firstName: 'Peter',
                lastName: 'Parker',
                picture: '',
                pin: '0000'
            },
            {
                id: objectId(),
                firstName: 'Bruce',
                lastName: 'Whayne',
                picture: '',
                pin: '1111'
            }
        ]


    };

}(window.jQuery));

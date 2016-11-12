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

        pins: [
            '1111',
            '1234'
        ],
        /**
         * Mobile users
         */
        users: [
            {
                // This is a user as we would have in the database
                id: objectId(),
                sid: objectId(),
                firstName: 'Peter',
                lastName: 'Parker',
                lastSync: new Date(),
                lastUse: new Date(),
                md5pin: '7ae6c1927bd0854ab818407de7323042',
                picture: 'http://vignette1.wikia.nocookie.net/marvelmovies/images/b/bc/Peter_Parker_AG_thumb.jpg/revision/latest?cb=20120705122015'
            },
            {
                // This is a user as we would get it from our remote server
                id: null,
                sid: objectId(),
                firstName: 'Bruce',
                lastName: 'Whayne',
                // lastUse: new Date(),
                // md5pin: '4f935727fe450f3971e6666db6d85c22',
                picture: 'http://images6.fanpop.com/image/photos/36000000/Bruce-Wayne-image-bruce-wayne-36050167-392-379.jpg'
            }
        ]


    };

}(window.jQuery));

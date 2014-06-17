/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true */
/* jshint browser: true */

(function ($, undefined) {

    'use strict';

    var fn = Function,
        global = fn('return this')(),
        app = global.app = global.app || {},

        DB_NAME = 'KidojuDB',

        DEBUG = true,
        MODULE = 'app.db.js: ';

    //See http://nparashuram.com/trialtool/index.html#example=/IndexedDB/jquery/demo/trialtool.html
    //See http://nparashuram.com/jquery-indexeddb/example/
    //See https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

    app.db = {

        log: function(message){
            if(DEBUG && global.console && ($.type(global.console.log) === 'function')){
                global.console.log(MODULE + message);
            }
        },

        /**
         * Open the database after creating it of necessary
         * @returns {*} - a jQuery promise
         */
        open: function() {
            return $.indexedDB(DB_NAME, {
                'schema': {
                    '1': function(versionTransaction){
                        var contents = versionTransaction.createObjectStore('contents', {
                            'autoIncrement': false,
                            'keyPath': 'id'
                        });
                        //contents.createIndex("timestamp");
                        var activities = versionTransaction.createObjectStore('activities', {
                            'autoIncrement': false,
                            'keyPath': 'id'
                        });
                        //activities.createIndex("timestamp");
                    }
                    // Continue with the following versions of the site
                    // '2': function(versionTransaction){}
                }
            });
        },

        /**
         * Drop the database
         * @returns {*} - a jQuery promise
         */
        drop: function() {
            app.db.log('drop database');
            return $.indexedDB(DB_NAME).deleteDatabase();
        },

        /**
         * Returns a collection with methods to find, insert, update, remove records"
         * @param table
         * @returns {{clear: clear}}
         */
        collection: function(table) {
            return {
                /**
                 * Clear a collection/table
                 * @param table
                 * @returns {*} - a jQuery promise
                 */
                clear: function () {
                    app.db.log('clear ' + table);
                    return $.indexedDB(DB_NAME).objectStore(table).clear();
                },

                /**
                 * Insert a new record
                 * @param record
                 * @returns {*} - a jQuery promise
                 */
                insert: function (record) {
                    app.db.log('insert ' + table + ' record');
                    return $.indexedDB(DB_NAME).objectStore(table).add(record); //(value, key)
                },

                /**
                 * find a record by its id
                 * @param id
                 * @returns {*} - a jQuery promise
                 */
                find: function (id) {
                    app.db.log('get ' + table + ' record');
                    return $.indexedDB(DB_NAME).objectStore(table).get(id);
                },

                /**
                 * Update an existing record
                 * @param record
                 * @returns {*} - a jQuery promise
                 */
                update: function (record) {
                    app.db.log('update ' + table + ' record');
                    return $.indexedDB(DB_NAME).objectStore(table).put(record); //(value, key)
                },

                /**
                 * remove a record by its id
                 * @param id
                 * @returns {*} - a jQuery promise
                 */
                remove: function (id) {
                    app.db.log('remove ' + table + ' record');
                    return $.indexedDB(DB_NAME).objectStore(table)['delete'](id);
                },

                /**
                 * Iterate through records with/without an index key
                 * Can be called as iterator(callback) to iterate without index
                 * or as iterator(index, callback) to use an index key
                 * @param index
                 * @param callback
                 * @returns {*} - a jQuery promise
                 */
                each: function (index, callback) {
                    app.db.log('iterate over ' + table + ' records');
                    if ($.type(index) === 'function' && callback === undefined) {
                        callback = index;
                        return $.indexedDB(DB_NAME).objectStore(table).each(callback);
                    } else {
                        return $.indexedDB(DB_NAME).objectStore(table).index(index).each(callback);
                    }
                },

                /**
                 * count the number of records in the objectStore
                 * @param callback
                 * @returns {*}
                 */
                count: function(callback) {
                    app.db.log('count ' + table + ' records');
                    return $.indexedDB(DB_NAME).objectStore(table).count(callback);
                }
            };
        }
    };

}(jQuery));
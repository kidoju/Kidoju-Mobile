/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */


(function (f, define) {
    'use strict';
    define([
        // './vendor/localForage/localforage.js'
        // localforage without promises performs better
        // also promises in localforage display strange behaviours with jQuery deferred
        // and deferreds are better because they can notify progress callbacks for long operations like sync
        './vendor/localForage/localforage.nopromises.js',
        './window.assert',
        './window.logger'
    ], f);
})(function (lf) {

    /**
     * We will be closely monitoring browser database projects like
     * - https://github.com/Irrelon/ForerunnerDB
     * - https://github.com/techfort/LokiJS
     * - https://github.com/typicaljoe/taffydb
     * - https://pouchdb.com/ (more or less related to couchdb, not mongodb)
     * - http://brian.io/lawnchair/ (obsolete)
     *
     * My opinion at this stage is most of these projects are overkill for a couple of collections, e.g ForerunnerDB is 1MB+
     * and they provide no solution for the complex part which is the synchronization with mongoDB.
     * For anything serious the SQL-Lite cordova plugin is a better option unless one of these libraries finally provides synchronization with mongoDB out of the box.
     */

    'use strict';

    var localForage = lf || window.localforage;
    var pongodb = window.pongodb = window.pongodb || {};

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        var assert = window.assert;
        var logger = new window.Logger('app.db'); // TODO : use ir
        var OBJECT = 'object';
        var STRING = 'string';
        var UNDEFINED = 'undefined';
        var MACHINE_POS = 8;
        var MACHINE_ID = '000000';
        var RX_MONGODB_ID = /^[0-9a-f]{24}$/;
        var ERROR = {
            XHR: undefined,
            STATUS: 'error'
        };
        var NOT_IMPLEMENTED = 'Not yet implemented';

        /* Blocks are nested too deeply. */
        /* jshint -W073 */

        /*  This function's cyclomatic complexity is too high.  */
        /* jshint -W074 */

        /**
         * Match a doc to a query
         * @param query
         * @param doc
         */
        var match = function (query, doc) {
            assert.typeOrUndef(OBJECT, query, assert.format(assert.messages.typeOrUndef.default, 'query', OBJECT));
            assert.type(OBJECT, doc, assert.format(assert.messages.type.default, 'doc', OBJECT));
            var match = true;
            if ($.type(query) === OBJECT) {
                for (var prop in query) {
                    if (prop && query.hasOwnProperty(prop)) {
                        var path = prop.split('.');
                        var value = doc;
                        while (path.length > 0) {
                            value = value && value[path[0]];
                            path.shift();
                        }
                        var criterion = query[prop];
                        if (criterion instanceof RegExp) {
                            match = match && criterion.test(value);
                        } else if ($.type(criterion) === OBJECT) {
                            for (var operator in criterion) {
                                if (criterion.hasOwnProperty(operator)) {
                                    // @see http://docs.mongodb.org/manual/reference/operator/query/
                                    switch (operator) {
                                        case '$eq':
                                            match = match && (value === criterion[operator]);
                                            break;
                                        case '$gt':
                                            match = match && (value > criterion[operator]);
                                            break;
                                        case '$gte':
                                            match = match && (value >= criterion[operator]);
                                            break;
                                        case '$lt':
                                            match = match && (value < criterion[operator]);
                                            break;
                                        case '$lte':
                                            match = match && (value <= criterion[operator]);
                                            break;
                                        case '$ne':
                                            match = match && (value !== criterion[operator]);
                                            break;
                                        case '$regex':
                                            match = match && criterion[operator].test(value);
                                            break;
                                    }
                                }
                            }
                        } else {
                            match = match && (value === criterion);
                        }
                    }
                    if (!match) {
                        break;
                    }
                }
            }
            return match;
        };

        /* jshint +W074 */
        /* jshint +W073 */

        /**
         * An ObjectId like MongoDB
         * @see https://docs.mongodb.com/manual/reference/method/ObjectId/
         * @param id
         * @constructor
         */
        var ObjectId = pongodb.ObjectId = function (id) {
            assert.ok($.type(id) === UNDEFINED || RX_MONGODB_ID.test(id), '`id` is expected to be an hexadecimal string with a length of 24 characters or undefined');
            /* jshint -W016 */
            function makeOne() {
                var epoch = (new Date().getTime() / 1000 | 0).toString(16);
                // Note: we are not using a processID, so random ID is 10 bytes instead of 6 bytes
                return epoch + MACHINE_ID + 'xxxxxxxxxx'.replace(/x/g, function () {
                        return (Math.random() * 16 | 0).toString(16);
                    }).toLowerCase();
            }
            /* jshint +W016 */
            this._id = id || makeOne();
        };

        /**
         * Convert a server id (sid) into a mobile id
         * @returns {boolean}
         */
        ObjectId.prototype.toMobileId = function () {
            return this._id.substr(0, MACHINE_POS) + MACHINE_ID + this._id.substr(MACHINE_POS + MACHINE_ID.length);
        };

        /**
         * Test whether the ObjectId is a mobile id (as opposed to a mongodb server id)
         * @returns {boolean}
         */
        ObjectId.prototype.isMobileId = function () {
            return this._id.substr(MACHINE_POS, MACHINE_ID.length) === MACHINE_ID;
        };

        /**
         * Get the ObjectId timestamp
         * @returns {Date}
         */
        ObjectId.prototype.getTimestamp = function () {
            return new Date(1000 * parseInt(this._id.substr(0, 8), 16));
        };

        /**
         * Get the 24-char hexadecimal value of the ObjectId
         * @returns {*}
         */
        ObjectId.prototype.toString = function () {
            return this._id;
        };

        /**
         * Collection
         * @param options
         * @constructor
         */
        var Collection = pongodb.Collection = function (options) {
            assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
            assert.instanceof(Database, options.db, assert.format(assert.messages.instanceof.default, 'options.db', 'pongodb.Database'));
            assert.type(STRING, options.name, assert.format(assert.messages.isPlainObject.default, 'options.name', STRING));
            this._db = options.db;
            this._name = options.name;
            this._collection = localForage.createInstance({
                name: this._db._options.name, // Database name
                storeName: options.name // Collection name
            });
        };

        /**
         * Find (returns an array instead of a cursor in mongoDB)
         * Note: The order is determined by ObjectId which is random
         * @see https://docs.mongodb.com/manual/reference/method/db.collection.find/
         * @param query
         * @param projection // not implemented, for future use
         * @param breakOnFirst
         */
        Collection.prototype.find = function (query, projection, breakOnFirst) {
            assert.typeOrUndef(OBJECT, query, assert.format(assert.messages.typeOrUndef.default, 'query', OBJECT));
            var that = this;
            var idField = that._db._idField;
            var dfd = $.Deferred();
            if ($.type(query) === OBJECT && $.type(query[idField]) === STRING) {
                // We have an id to get straight to the document
                // https://localforage.github.io/localForage/#data-api-getitem
                that._collection.getItem(query[idField], function (err, item) {
                    if (err) {
                        dfd.reject(err);
                    } else if (item) {
                        // If found, check that the entire query matches
                        if (!match(query, item)) {
                            item = null;
                        }
                        dfd.resolve(item ? [item] : []);
                    } else {
                        dfd.resolve([]);
                    }
                });
            } else {
                // Without an id, we need to iterate
                // https://localforage.github.io/localForage/#data-api-length
                that._collection.length(function (err, length) {
                    if (err) {
                        dfd.reject(err);
                    } else if (!length) {
                        // Without length, no need to iterate
                        dfd.resolve([]);
                    } else {
                        var found = [];
                        // https://localforage.github.io/localForage/#data-api-iterate
                        that._collection.iterate(
                            function (item, key, index) {
                                if (match(query, item)) {
                                    found.push(item);
                                }
                                if (breakOnFirst) {
                                    // return something to stop iterating
                                    return item;
                                }
                                dfd.notify({ percent: index / length }); // length > 0 otherwise we would not be in this branch
                            },
                            function (err) {
                                if (err) {
                                    dfd.reject(err);
                                } else {
                                    dfd.resolve(found);
                                }
                            }
                        );
                    }
                });
            }
            return dfd.promise();
        };

        /**
         * FindOne
         * @see https://docs.mongodb.com/manual/reference/method/db.collection.findOne/
         * @param query
         * @param projection // not implemented, for future use
         */
        Collection.prototype.findOne = function (query, projection) {
            var dfd = $.Deferred();
            this.find(query, projection, true)
                .done(function (results) {
                    assert.isArray(results, assert.format(assert.messages.isArray.default, 'results'));
                    assert.ok(results.length === 1, '`results` should have a length of 1');
                    dfd.resolve(results[0]);
                })
                .fail(dfd.reject);
            return dfd.promise();
        };

        /**
         * Count
         * @see https://docs.mongodb.com/manual/reference/method/db.collection.count/
         * @param query
         */
        Collection.prototype.count = function (query) {
            assert.typeOrUndef(OBJECT, query, assert.format(assert.messages.typeOrUndef.default, 'query', OBJECT));
            var that = this;
            var idField = that._db._idField;
            var count = 0;
            var dfd = $.Deferred();
            if ($.type(query) === OBJECT && $.type(query[idField]) === STRING) {
                // We have an id to get straight to the document
                // https://localforage.github.io/localForage/#data-api-getitem
                that._collection.getItem(query[idField], function (err, item) {
                    if (err) {
                        dfd.reject(err);
                    } else if (item) {
                        // If found, check that the entire query matches
                        if (match(query, item)) {
                            count++;
                        }
                        dfd.resolve(count); // 1
                    } else {
                        dfd.resolve(count); // 0
                    }
                });
            } else {
                // Without an id, we need to iterate
                // https://localforage.github.io/localForage/#data-api-length
                that._collection.length(function (err, length) {
                    if (err) {
                        dfd.reject(err);
                    } else if (!length) {
                        // Without length, no need to iterate
                        dfd.resolve(count); // 0
                    } else {
                        // https://localforage.github.io/localForage/#data-api-iterate
                        that._collection.iterate(
                            function (item, key, index) {
                                if (match(query, item)) {
                                    count++;
                                }
                                dfd.notify({ percent: index / length }); // length > 0 otherwise we would not be in this branch
                            },
                            function (err) {
                                if (err) {
                                    dfd.reject(err);
                                } else {
                                    dfd.resolve(count);
                                }
                            }
                        );
                    }
                });
            }
            return dfd.promise();
        };

        /**
         * Insert a document
         * @see https://docs.mongodb.com/manual/reference/method/db.collection.insert/
         * @param doc
         */
        Collection.prototype.insert = function (doc) {
            assert.type(OBJECT, doc, assert.format(assert.messages.type.default, 'doc', OBJECT));
            var that = this;
            var idField = that._db._idField;
            var dfd = $.Deferred();
            if ($.type(doc[idField]) !== STRING) {
                // Insertion without an id requires that we create one
                doc[idField] = (new ObjectId()).toString();
                // https://localforage.github.io/localForage/#data-api-setitem
                that._collection.setItem(doc[idField], doc, function (err, item) {
                    if (err) {
                        dfd.reject(err);
                    } else {
                        dfd.resolve(item);
                    }
                });
            } else {
                // Insertion with an id requires that we check it does not already exist
                // https://localforage.github.io/localForage/#data-api-getitem
                that._collection.getItem(doc[idField], function (err, item) {
                    if (err) {
                        dfd.reject(err);
                    } else if (item) {
                        dfd.reject(ERROR.XHR, ERROR.STATUS, 'Cannot insert a document with an ' + idField + ' `' + doc[idField] + '` which already exists.');
                    } else {
                        // https://localforage.github.io/localForage/#data-api-setitem
                        that._collection.setItem(doc[idField], doc, function (err, item) {
                            if (err) {
                                dfd.reject(err);
                            } else {
                                dfd.resolve(item);
                            }
                        });
                    }
                });
            }
            return dfd.promise();
        };

        /**
         * Update a set of documents
         * TODO: Manage upserts
         * @see https://docs.mongodb.com/manual/reference/method/db.collection.update/
         * @param query
         * @param update
         */
        Collection.prototype.update = function (query, update) {
            assert.typeOrUndef(OBJECT, query, assert.format(assert.messages.typeOrUndef.default, 'query', OBJECT));
            assert.type(OBJECT, update, assert.format(assert.messages.type.default, 'update', OBJECT));
            var that = this;
            var idField = that._db._idField;
            var dfd = $.Deferred();
            if ($.type(update[idField]) !== UNDEFINED) {
                dfd.reject(ERROR.XHR, ERROR.STATUS, idField + 'cannot be updated');
            } else if ($.type(query) === OBJECT && RX_MONGODB_ID.test(query[idField])) {
                // We have an id to get straight to the document
                // https://localforage.github.io/localForage/#data-api-getitem
                that._collection.getItem(query[idField], function (err, item) {
                    if (err) {
                        dfd.reject(err);
                    } else if (item) {
                        // If found, check that the entire query matches
                        if (match(query, item)) {
                            // https://localforage.github.io/localForage/#data-api-setitem
                            // TODO: consider what to do with update fields explicitly set to undefined, which $.extend ignores
                            that._collection.setItem(item[idField], $.extend(true, item, update), function (err, item) {
                                if (err) {
                                    dfd.reject(err);
                                } else {
                                    dfd.resolve({ nMatched: 1, nUpserted: 0, nModified: 1 });
                                }
                            });
                        } else {
                            // if not found simply return 0 modified documents
                            dfd.resolve({ nMatched: 0, nUpserted: 0, nModified: 0 });
                        }
                    } else {
                        // If not found
                        dfd.resolve({ nMatched: 0, nUpserted: 0, nModified: 0 });
                    }
                });
            } else {
                // Without an id, we need to iterate
                // https://localforage.github.io/localForage/#data-api-length
                that._collection.length(function (err, length) {
                    if (err) {
                        dfd.reject(err);
                    } else if (!length) {
                        // Without length, no need to iterate
                        dfd.resolve({ nMatched: 0, nUpserted: 0, nModified: 0 });
                    } else {
                        var updates = {};
                        // https://localforage.github.io/localForage/#data-api-iterate
                        that._collection.iterate(
                            function (item, key, index) {
                                if (match(query, item)) {
                                    // https://localforage.github.io/localForage/#data-api-setitem
                                    // TODO: consider what to do with update fields explicitly set to undefined, which $.extend ignores
                                    updates[key] = $.Deferred();
                                    that._collection.setItem(item[idField], $.extend(true, item, update), function (err) { // }, doc) {
                                        if (err) {
                                            return err; // return something to stop iterating
                                        }
                                        updates[key].resolve();
                                    });
                                }
                                dfd.notify({ percent: index / length }); // length > 0 otherwise we would not be in this branch
                            },
                            function (err) {
                                if (err) {
                                    dfd.reject(err);
                                }
                                // Note: we need the updates hash and the promises array
                                // because this success callback is executed before some
                                // of the setItem callbacks in the iterate method
                                // These promises and $.when ensure all updates are completed
                                // before we return a count of updated items
                                // TODO Write concern errors - https://docs.mongodb.com/manual/reference/method/db.collection.update/#write-concern-errors
                                // In other words how many items have been removed before an error occurred?
                                var count = Object.keys(updates).length;
                                var promises = [];
                                for (var key in updates) {
                                    if (updates.hasOwnProperty(key)) {
                                        promises.push(updates[key].promise());
                                    }
                                }
                                $.when(promises)
                                    .done(function () {
                                        dfd.resolve({ nMatched: count, nUpserted: 0, nModified: count });
                                    });
                            }
                        );
                    }
                });
            }
            return dfd.promise();
        };

        /**
         * Remove a set of documents
         * @see https://docs.mongodb.com/manual/reference/method/db.collection.remove/
         * @param query
         */
        Collection.prototype.remove = function (query) {
            // Note: if query is undefined, use Collection.prototype.clear
            // TODO: What if query is an empty object {}?
            assert.type(OBJECT, query, assert.format(assert.messages.type.default, 'query', OBJECT));
            var that = this;
            var idField = that._db._idField;
            var dfd = $.Deferred();
            if ($.type(query) === OBJECT && $.type(query[idField]) === STRING) {
                // We have an id to get straight to the document
                // RemoveItem is always successful even if the key is missing
                that._collection.getItem(query[idField], function (err, item) {
                    if (err) {
                        dfd.reject(err);
                    } else if (item) {
                        // https://localforage.github.io/localForage/#data-api-removeitem
                        that._collection.removeItem(query[idField], function (err, item) {
                            if (err) {
                                dfd.reject(err);
                            } else {
                                dfd.resolve({ nRemoved: 1 });
                            }
                        });
                    } else {
                        dfd.resolve({ nRemoved: 0 });
                    }
                });
            } else {
                // Without an id, we need to iterate
                // https://localforage.github.io/localForage/#data-api-length
                that._collection.length(function (err, length) {
                    if (err) {
                        dfd.reject(err);
                    } else if (!length) {
                        // Without length, no need to iterate
                        dfd.resolve({ nRemoved : 0 });
                    } else {
                        var removals = {};
                        // https://localforage.github.io/localForage/#data-api-iterate
                        that._collection.iterate(
                            function (item, key, index) {
                                if (match(query, item)) {
                                    removals[key] = $.Deferred();
                                    // https://localforage.github.io/localForage/#data-api-removeitem
                                    that._collection.removeItem(item[idField], function (err) {
                                        if (err) {
                                            return err; // return something to stop iterating
                                        }
                                        removals[key].resolve();
                                    });
                                }
                                dfd.notify({ percent: index / length }); // length > 0 otherwise we would not be in this branch
                            },
                            function (err) {
                                if (err) {
                                    dfd.reject(err);
                                }
                                // Note: we need the removals hash and the promises array
                                // because this success callback is executed before some
                                // of the removeItem callbacks in the iterate method
                                // These promises and $.when ensure all removals are completed
                                // before we return a count of removed items
                                // TODO: write concern errors - https://docs.mongodb.com/manual/reference/method/db.collection.remove/#write-concern-errors
                                // In other words how many items have been removed before an error occurred?
                                var count = Object.keys(removals).length;
                                var promises = [];
                                for (var key in removals) {
                                    if (removals.hasOwnProperty(key)) {
                                        promises.push(removals[key].promise());
                                    }
                                }
                                $.when(promises)
                                    .done(function () {
                                        dfd.resolve({ nRemoved: count });
                                    });
                            }
                        );
                    }
                });
            }
            return dfd.promise();
        };

        /**
         * Clear a collection
         * Note: not a mongoDB feature
         * @param options
         */
        Collection.prototype.clear = function () {
            var dfd = $.Deferred();
            // https://localforage.github.io/localForage/#data-api-clear
            this._collection.clear(function (err) {
                if (err) {
                    dfd.reject(err);
                } else {
                    dfd.resolve();
                }
            });
            return dfd.promise();
        };

        /**
         * Drop a collection
         * @see https://docs.mongodb.com/manual/reference/command/drop/
         * @param name
         */
        Collection.prototype.drop = function () {
            // TODO as and when localForage implements it - see https://github.com/localForage/localForage/issues/620
            throw new Error(NOT_IMPLEMENTED);
        };

        /**
         * Sync a collection with a $.ajax endPoint
         * Note: not a mongoDB feature
         * @param options
         */
        Collection.prototype.sync = function (options) {

            /* Client
             * ==========
             * Inserts on the client have an _idField containing '000' in positions 5 6 7 and have no sync timestamp
             * Removals on the client are marked as "deleted" and only physically removed after a sync
             * Updates on the client have an updated date after the sync timestamp
             *
             * Server
             * ===========
             * Inserts on the server do not exist on the client - they have
             * Removals on the server ?????????????????????????????????????????
             * Updates on the server can be found with the last timestamp on the collection
             *
             * Sync algorithm
             * ================
             *
             * Step 1: Request Client --> Server
             * - All inserts since last sync: { command: insert, collection: xxxx, document: {} }
             * - All updates since last sync: { command: update, collection: xxxx, document: {} }
             * - All removals since last sync: { command: remove, collection: xxxx, id: xxxxx }
             * - A request for status updates on all other records: { command: status, collection: xxxx, id: xxxxx }
             *
             * Step 2: Server --> Client
             * - All inserts since last sync: { command: insert, document: {} }
             * - All updates since last sync: { command: update, document: {} }
             * - All removals since last sync: { command: remove, id: xxxxx }
             * - An acknowledgement for all step 1 commands: { command: ack_success, id: xxxxx } or { command: ack_failure, id: xxxxx, error: {} }
             *
             * How do we recover from failures ? How can we process in batches ?
             * The main obstacle to idempotence is inserts:
             * - updates and removals can be made several times without consequences.
             * - inserts form the server copied to the client are not an issue either because they have a definitive _id.
             * - the big issue is inserts from the client to the server becuase theyr have a temp _id so we need a step 3.
             *
             * Step 3:
             * - Make all inserts from the client to the server one by one with an acknowledgement for each
             */

        };

        /**
         * Database
         * @param options
         * @constructor
         */
        var Database = pongodb.Database = function (options) {
            assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
            assert.type(STRING, options.name, assert.format(assert.messages.isPlainObject.default, 'options.name', STRING));
            assert.isArray(options.collections, assert.format(assert.messages.isArray.default, 'db', 'options.collections'));

            this._options = options;
            this._idField = options.idField || 'id';

            // Configure localForage
            options.storeName = options.name;
            localForage.config(options);
            /*
            localForage.config({
                driver      : localForage.WEBSQL, // Force WebSQL; same as using setDriver()
                name        : name,
                version     : version,
                size        : 4980736 // Size of database, in bytes. WebSQL-only for now.
                storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
                description : 'some description'
            });
            */

            // Add collections
            var collections = options.collections;
            for (var i = 0, length = collections.length; i < length; i++) {
                this[collections[i]] = new Collection({ db: this, name: collections[i] });
            }
        };

        /**
         * Create a collection
         * @see https://docs.mongodb.com/manual/reference/method/db.createCollection/
         * @param name
         */
        Database.prototype.createCollection = function (name, options) {
            throw new Error('Instantiate a new Database object and pass an array of collection names to the constructor.');
        };

        /**
         * Drop a database
         * @see https://docs.mongodb.com/manual/reference/method/db.dropDatabase/
         */
        Database.prototype.dropDatabase = function () {
            // TODO as and when localForage implements it - see https://github.com/localForage/localForage/issues/620
            throw new Error(NOT_IMPLEMENTED);
        };

    }(window.jQuery));

    /* jshint +W071 */

    return pongodb;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

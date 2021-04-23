/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import assert from './window.assert.es6';
import CONSTANTS from './window.constants.es6';
import ObjectId from './window.objectid.es6';
// import Database from './window.pongodb.database.es6'; // <-- no circular reference
import localForage from '../vendor/localforage/localforage.nopromises';
import { match } from './pongodb.util.es6';

const TRIGGERS = {
    insert: 'insert',
    remove: 'remove',
    update: 'update',
};

function deepClone(obj) {
    let ret;
    if (Array.isArray(obj)) {
        ret = [];
        obj.forEach((item) => {
            ret.push(deepClone(item));
        });
    } else if ($.type(obj) === CONSTANTS.OBJECT) {
        ret = {};
        Object.keys(obj).forEach((_key) => {
            // Note: we do not expect functions or symbols here
            let key = _key;
            if (key !== '__v') {
                // Strip _id from _
                if (CONSTANTS.RX_MONGODB_IDKEY.test(key)) {
                    key = key.substr(1);
                }
                // Flatten $oid
                const value = obj[_key];
                if (value && CONSTANTS.RX_MONGODB_ID.test(value.$oid)) {
                    ret[key] = value.$oid;
                } else if (value && CONSTANTS.RX_ISODATE.test(value.$date)) {
                    ret[key] = new Date(value.$date);
                } else {
                    ret[key] = deepClone(value);
                }
            }
        });
    } else {
        // boolean, date, number, string
        ret = obj;
    }
    return ret;
}

/**
 * Collection
 * @class
 */
export default class Collection {
    /**
     * Collection
     * @param options
     * @constructor
     */
    constructor(options) {
        assert.isNonEmptyPlainObject(
            options,
            assert.format(
                assert.messages.isNonEmptyPlainObject.default,
                'options'
            )
        );
        /*
        // We would need a circular reference to test an instanceof Database
        assert.instanceof(
            Database,
            options.db,
            assert.format(
                assert.messages.instanceof.default,
                'options.db',
                'pongodb.Database'
            )
        );
        */
        assert.type(
            CONSTANTS.OBJECT,
            options.db,
            assert.format(
                assert.messages.type.default,
                'options.db',
                CONSTANTS.STRING
            )
        );
        assert.type(
            CONSTANTS.FUNCTION,
            options.db.dropDatabase,
            assert.format(
                assert.messages.type.default,
                'options.db.dropDatabase',
                CONSTANTS.FUNCTION
            )
        );
        assert.type(
            CONSTANTS.STRING,
            options.name,
            assert.format(
                assert.messages.type.default,
                'options.name',
                CONSTANTS.STRING
            )
        );
        this._db = options.db;
        this._name = options.name;

        // Keep localForage as an internal reference
        this._store = localForage.createInstance({
            name: this._db._name, // Database name
            storeName: this._name, // Collection name
        });

        // Init text fields and triggers
        this._reset();
    }

    /**
     * Reset text fields and triggers
     * @private
     */
    _reset() {
        // For full text searches (set on db)
        this._textFields = [];

        // Triggers (set on db)
        this._triggers = {
            insert: [],
            remove: [],
            update: [],
        };
    }

    /**
     * Triggers
     * @returns {{insert: string, remove: string, update: string}}
     */
    static get triggers() {
        return TRIGGERS;
    }

    /**
     * Database
     * @returns {*}
     */
    get db() {
        return this._db;
    }

    /**
     * id field
     * @returns {*}
     */
    get idField() {
        return this._db._idField;
    }

    /**
     * Collection name
     * @returns {*}
     */
    get name() {
        return this._name;
    }

    /**
     * Find (returns an array instead of a cursor in mongoDB)
     * Note: The order is determined by ObjectId which is random
     * @see https://docs.mongodb.com/manual/reference/method/db.collection.find/
     * @param query
     * @param projection // not implemented, for future use
     * @param breakOnFirst
     */
    find(query = {}, projection = '', breakOnFirst = false) {
        assert.type(
            CONSTANTS.OBJECT,
            query,
            assert.format(
                assert.messages.type.default,
                'query',
                CONSTANTS.OBJECT
            )
        );
        assert.type(
            CONSTANTS.STRING,
            projection,
            assert.format(
                assert.messages.type.default,
                'query',
                CONSTANTS.STRING
            )
        );
        assert.type(
            CONSTANTS.BOOLEAN,
            breakOnFirst,
            assert.format(
                assert.messages.type.default,
                'query',
                CONSTANTS.BOOLEAN
            )
        );
        const that = this;
        const { idField } = that;
        const dfd = $.Deferred();
        if ($.type(query[idField]) !== CONSTANTS.UNDEFINED) {
            // We have an id to get straight to the document
            // https://localforage.github.io/localForage/#data-api-getitem
            that._store.getItem(query[idField], (err, item) => {
                if (err) {
                    dfd.reject(err);
                } else if (item) {
                    // If found, check that the entire query matches
                    if (!match(query, item, that._textFields)) {
                        item = null; // eslint-disable-line no-param-reassign
                    }
                    dfd.resolve(item ? [item] : []);
                } else {
                    dfd.resolve([]);
                }
            });
        } else {
            // Without an id, we need to iterate
            // https://localforage.github.io/localForage/#data-api-length
            that._store.length((err, length) => {
                if (err) {
                    dfd.reject(err);
                } else if (!length) {
                    // Without length, no need to iterate
                    dfd.resolve([]);
                } else {
                    const found = [];
                    // https://localforage.github.io/localForage/#data-api-iterate
                    that._store.iterate(
                        (item, key, index) => {
                            let ret;
                            if (match(query, item, that._textFields)) {
                                found.push(item);
                            }
                            if (breakOnFirst) {
                                // return something to stop iterating
                                ret = item;
                            } else {
                                dfd.notify({
                                    index: index - 1, // index starts at 1
                                    total: length,
                                });
                            }
                            return ret;
                        },
                        (error) => {
                            if (error) {
                                dfd.reject(error);
                            } else {
                                dfd.resolve(found);
                            }
                        }
                    );
                }
            });
        }
        return dfd.promise();
    }

    /**
     * FindOne
     * @see https://docs.mongodb.com/manual/reference/method/db.collection.findOne/
     * @param query
     * @param projection // not implemented, for future use
     */
    findOne(query, projection) {
        const dfd = $.Deferred();
        this.find(query, projection, true)
            .then((results) => {
                assert.isArray(
                    results,
                    assert.format(assert.messages.isArray.default, 'results')
                );
                if (results.length) {
                    dfd.resolve(results[0]);
                } else {
                    dfd.reject(new Error('Not found'));
                }
            })
            .catch(dfd.reject);
        return dfd.promise();
    }

    /**
     * Count
     * @see https://docs.mongodb.com/manual/reference/method/db.collection.count/
     * @param query
     */
    count(query = {}) {
        assert.type(
            CONSTANTS.OBJECT,
            query,
            assert.format(
                assert.messages.type.default,
                'query',
                CONSTANTS.OBJECT
            )
        );
        const that = this;
        const { idField } = that;
        let count = 0;
        const dfd = $.Deferred();
        if ($.type(query[idField]) !== CONSTANTS.UNDEFINED) {
            // We have an id to get straight to the document
            // https://localforage.github.io/localForage/#data-api-getitem
            that._store.getItem(query[idField], (err, item) => {
                if (err) {
                    dfd.reject(err);
                } else if (item) {
                    // If found, check that the entire query matches
                    if (match(query, item, that._textFields)) {
                        count += 1;
                    }
                    dfd.resolve(count); // 1
                } else {
                    dfd.resolve(count); // 0
                }
            });
        } else {
            // Without an id, we need to iterate
            // https://localforage.github.io/localForage/#data-api-length
            that._store.length((err, length) => {
                if (err) {
                    dfd.reject(err);
                } else if (!length) {
                    // Without length, no need to iterate
                    dfd.resolve(count); // 0
                } else {
                    // https://localforage.github.io/localForage/#data-api-iterate
                    that._store.iterate(
                        (item, key, index) => {
                            if (match(query, item, that._textFields)) {
                                count += 1;
                            }
                            dfd.notify({ index: index - 1, total: length }); // index starts at 1
                        },
                        (error) => {
                            if (error) {
                                dfd.reject(error);
                            } else {
                                dfd.resolve(count);
                            }
                        }
                    );
                }
            });
        }
        return dfd.promise();
    }

    /**
     * Insert a document
     * @see https://docs.mongodb.com/manual/reference/method/db.collection.insert/
     * @param doc
     */
    insert(doc) {
        assert.type(
            CONSTANTS.OBJECT,
            doc,
            assert.format(assert.messages.type.default, 'doc', CONSTANTS.OBJECT)
        );
        const that = this;
        const { idField } = that;
        const dfd = $.Deferred();
        if (!doc[idField]) {
            // Insertion without an id requires that we create one
            const docWithId = {};
            Object.assign(docWithId, doc);
            // Beware! doc[idField] may be null when set from Kendo UI
            docWithId[idField] = new ObjectId().toString();
            // https://localforage.github.io/localForage/#data-api-setitem
            that._store.setItem(docWithId[idField], docWithId, (err, item) => {
                if (err) {
                    dfd.reject(err);
                } else {
                    $.when(...that.triggers(Collection.triggers.insert, item))
                        .then(() => {
                            dfd.resolve(item);
                        })
                        .catch(dfd.reject);
                }
            });
        } else {
            // Insertion with an id requires that we check it does not already exist
            // https://localforage.github.io/localForage/#data-api-getitem
            that._store.getItem(doc[idField], (err, item) => {
                if (err) {
                    dfd.reject(err);
                } else if (item) {
                    dfd.reject(
                        new Error(`Duplicate ${idField} \`${doc[idField]}\``)
                    );
                } else {
                    // https://localforage.github.io/localForage/#data-api-setitem
                    that._store.setItem(doc[idField], doc, (error, result) => {
                        if (error) {
                            dfd.reject(error);
                        } else {
                            $.when(
                                ...that.triggers(
                                    Collection.triggers.insert,
                                    result
                                )
                            )
                                .then(() => {
                                    dfd.resolve(result);
                                })
                                .catch(dfd.reject);
                        }
                    });
                }
            });
        }
        return dfd.promise();
    }

    /**
     * Update a set of documents
     * @see https://docs.mongodb.com/manual/reference/method/db.collection.update/
     * @param query
     * @param doc
     * @param options
     */
    update(query, doc, options) {
        assert.type(
            CONSTANTS.OBJECT,
            query,
            assert.format(
                assert.messages.type.default,
                'query',
                CONSTANTS.OBJECT
            )
        );
        assert.type(
            CONSTANTS.OBJECT,
            doc,
            assert.format(assert.messages.type.default, 'doc', CONSTANTS.OBJECT)
        );
        const that = this;
        const { idField } = that;
        const upsert = !!(options && options.upsert);
        const dfd = $.Deferred();
        if (
            $.type(doc[idField]) !== CONSTANTS.UNDEFINED &&
            doc[idField] !== query[idField]
        ) {
            dfd.reject(new Error(`Cannot update ${idField}`));
        } else if ($.type(query[idField]) !== CONSTANTS.UNDEFINED) {
            // We have an id to get straight to the document
            // https://localforage.github.io/localForage/#data-api-getitem
            that._store.getItem(query[idField], (err, item) => {
                if (err) {
                    dfd.reject(err);
                } else if (item) {
                    // If found, check that the entire query matches
                    if (match(query, item, that._textFields)) {
                        // https://localforage.github.io/localForage/#data-api-setitem
                        // TODO: consider what to do with update fields explicitly set to undefined, which $.extend ignores
                        that._store.setItem(
                            item[idField],
                            $.extend(true, item, doc),
                            (error, result) => {
                                if (error) {
                                    dfd.reject(error);
                                } else {
                                    $.when(
                                        ...that.triggers(
                                            Collection.triggers.update,
                                            result
                                        )
                                    )
                                        .then(() => {
                                            dfd.resolve({
                                                nMatched: 1,
                                                nUpserted: 0,
                                                nModified: 1,
                                            });
                                        })
                                        .catch(dfd.reject);
                                }
                            }
                        );
                    } else {
                        // if not found simply return 0 modified documents
                        dfd.resolve({
                            nMatched: 0,
                            nUpserted: 0,
                            nModified: 0,
                        });
                    }
                } else if (
                    upsert &&
                    $.type(query[idField]) !== CONSTANTS.UNDEFINED
                ) {
                    // The document does not exist, insert it with query[idField]
                    that._store.setItem(
                        query[idField],
                        $.extend(true, doc, query),
                        (error, result) => {
                            if (error) {
                                dfd.reject(error);
                            } else {
                                $.when(
                                    ...that.triggers(
                                        Collection.triggers.update,
                                        result
                                    )
                                )
                                    .then(() => {
                                        dfd.resolve({
                                            nMatched: 1,
                                            nUpserted: 1,
                                            nModified: 0,
                                        });
                                    })
                                    .catch(dfd.reject);
                            }
                        }
                    );
                } else {
                    // If not found
                    dfd.resolve({ nMatched: 0, nUpserted: 0, nModified: 0 });
                }
            });
        } else {
            // Without an id, we need to iterate but we do not upsert
            // https://localforage.github.io/localForage/#data-api-length
            that._store.length((err, length) => {
                if (err) {
                    dfd.reject(err);
                } else if (!length) {
                    // Without length, no need to iterate
                    dfd.resolve({ nMatched: 0, nUpserted: 0, nModified: 0 });
                } else {
                    const promises = [];
                    // https://localforage.github.io/localForage/#data-api-iterate
                    that._store.iterate(
                        (item, key, index) => {
                            if (match(query, item, that._textFields)) {
                                promises.push(
                                    (function fn(obj) {
                                        const def = $.Deferred();
                                        // https://localforage.github.io/localForage/#data-api-setitem
                                        that._store.setItem(
                                            obj[idField],
                                            $.extend(true, obj, doc),
                                            (error) => {
                                                // }, doc) {
                                                if (error) {
                                                    def.reject(error);
                                                } else {
                                                    $.when(
                                                        ...that.triggers(
                                                            Collection.triggers
                                                                .update,
                                                            doc
                                                        )
                                                    )
                                                        .then(def.resolve)
                                                        .catch(def.reject);
                                                }
                                            }
                                        );
                                        return def.promise();
                                    })(item)
                                );
                            }
                            dfd.notify({ index: index - 1, total: length }); // index starts at 1
                        },
                        (error) => {
                            // This is called at the end of the iteration
                            if (error) {
                                dfd.reject(error);
                            } else {
                                $.when(...promises)
                                    .then(() => {
                                        dfd.notify({
                                            index: length - 1,
                                            total: length,
                                        }); // Make sure we reach 100%
                                        // Note: Cannot upsert when query returns several documents => upsert requires an id
                                        dfd.resolve({
                                            nMatched: length,
                                            nUpserted: 0,
                                            nModified: promises.length,
                                        });
                                    })
                                    .catch(dfd.reject);
                            }
                        }
                    );
                }
            });
        }
        return dfd.promise();
    }

    /**
     * Remove a set of documents
     * @see https://docs.mongodb.com/manual/reference/method/db.collection.remove/
     * @param query
     */
    remove(query) {
        // Note: if query is undefined, use Collection.prototype.clear
        // TODO: What if query is an empty object {}?
        assert.type(
            CONSTANTS.OBJECT,
            query,
            assert.format(
                assert.messages.type.default,
                'query',
                CONSTANTS.OBJECT
            )
        );
        const that = this;
        const { idField } = that;
        const dfd = $.Deferred();
        if ($.type(query[idField]) !== CONSTANTS.UNDEFINED) {
            // We have an id to get straight to the document
            // RemoveItem is always successful even if the key is missing
            that._store.getItem(query[idField], (err, item) => {
                if (err) {
                    dfd.reject(err);
                } else if (item) {
                    // https://localforage.github.io/localForage/#data-api-removeitem
                    that._store.removeItem(query[idField], (error) => {
                        if (error) {
                            dfd.reject(error);
                        } else {
                            $.when(
                                ...that.triggers(
                                    Collection.triggers.remove,
                                    item
                                )
                            )
                                .then(() => {
                                    dfd.resolve({ nRemoved: 1 });
                                })
                                .catch(dfd.reject);
                        }
                    });
                } else {
                    dfd.resolve({ nRemoved: 0 });
                }
            });
        } else {
            // Without an id, we need to iterate
            // https://localforage.github.io/localForage/#data-api-length
            that._store.length((err, length) => {
                if (err) {
                    dfd.reject(err);
                } else if (!length) {
                    // Without length, no need to iterate
                    dfd.resolve({ nRemoved: 0 });
                } else {
                    const removals = {};
                    // https://localforage.github.io/localForage/#data-api-iterate
                    that._store.iterate(
                        (item, key, index) => {
                            if (match(query, item, that._textFields)) {
                                removals[key] = $.Deferred();
                                // https://localforage.github.io/localForage/#data-api-removeitem
                                that._store.removeItem(
                                    item[idField],
                                    (error) => {
                                        let ret;
                                        if (error) {
                                            ret = removals[key].reject(error); // return something to stop iterating
                                        } else {
                                            $.when(
                                                ...that.triggers(
                                                    Collection.triggers.remove,
                                                    item
                                                )
                                            )
                                                .then(removals[key].resolve)
                                                .catch(removals[key].reject);
                                        }
                                        return ret;
                                    }
                                );
                            }
                            dfd.notify({ index: index - 1, total: length }); // index starts at 1
                        },
                        (error) => {
                            if (error) {
                                dfd.reject(error);
                            }
                            // Note: we need the removals hash and the promises array
                            // because this success callback is executed before some
                            // of the removeItem callbacks in the iterate method
                            // These promises and $.when ensure all removals are completed
                            // before we return a count of removed items
                            // TODO: write concern errors - https://docs.mongodb.com/manual/reference/method/db.collection.remove/#write-concern-errors
                            // In other words how many items have been removed before an error occurred?
                            const count = Object.keys(removals).length;
                            const promises = [];
                            Object.keys(removals).forEach((key) => {
                                promises.push(removals[key].promise());
                            });
                            $.when(...promises)
                                .then(() => {
                                    dfd.resolve({ nRemoved: count });
                                })
                                .catch(dfd.reject);
                        }
                    );
                }
            });
        }
        return dfd.promise();
    }

    /**
     * Gets triggers as an array of promises
     * @param event
     * @param item
     */
    triggers(event, item) {
        assert.type(
            CONSTANTS.STRING,
            event,
            assert.format(
                assert.messages.type.default,
                'event',
                CONSTANTS.STRING
            )
        );
        assert.type(
            CONSTANTS.OBJECT,
            item,
            assert.format(
                assert.messages.type.default,
                'item',
                CONSTANTS.OBJECT
            )
        );
        const promises = [];
        this._triggers[event].forEach((trigger) => {
            promises.push(trigger(item));
        });
        return promises;
    }

    /**
     * Loads an array of objects (especially from a mongo export)
     * Note: You might want to clear the collection first
     * @param data
     */
    load(data) {
        assert.isArray(
            data,
            assert.format(assert.messages.isArray.default, 'data')
        );
        const that = this;
        const promises = data.map((item) => {
            const doc = deepClone(item);
            return that.insert(doc);
        });
        return $.when(...promises);
    }

    /**
     * Clear a collection
     * Note: not a mongoDB feature
     * @param options
     */
    clear() {
        const dfd = $.Deferred();
        // https://localforage.github.io/localForage/#data-api-clear
        this._store.clear((err) => {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve();
            }
        });
        return dfd.promise();
    }

    /**
     * Drop a collection
     * @see https://docs.mongodb.com/manual/reference/command/drop/
     * @param name
     */
    drop() {
        const dfd = $.Deferred();
        this._store = localForage.dropInstance(
            {
                name: this._db._name, // Database name
                storeName: this._name, // Collection name
            },
            (err) => {
                if (err) {
                    dfd.reject(err);
                } else {
                    this._reset();
                    delete this._db[this._name];
                    delete this._db;
                    dfd.resolve();
                }
            }
        );
        return dfd.promise();
    }
}

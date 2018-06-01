/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        './vendor/blueimp/md5', // Keep at the top considering function arguments
        './vendor/kendo/kendo.core',
        './vendor/kendo/kendo.data',
        './common/window.assert.es6',
        './common/window.logger.es6',
        './window.pongodb',
        './kidoju.data',
        './kidoju.tools',
        './app.constants',
        './app.logger',
        './app.i18n',
        './app.rapi',
        './app.cache',
        './app.db',
        './app.fs',
        './app.models'
    ], f);
})(function (md5H) {

    'use strict';

    /* This function has too many statements. */
    /* jshint -W071 */

    /* This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

    (function ($, undefined) {

        /* jshint maxcomplexity: 8 */

        /**
         * IMPORTANT NOTE 1
         * Lazy models are simplified/flattened readonly models (all properties are non-editable) to load in Lazy datasources
         * Other models are used for CRUD operations and might have nested models like MongoDB schemas
         *
         * IMPORTANT NOTE 2
         * All calculated fields used in MVVM to display properly formatted data are marked with an appended $
         * The reason is to recognize them in kendo templates where they should be used as functions with trailing ()
         * whereas they should be used as properties without trailing () in data-bind attributes
         */

        var app = window.app = window.app || {};
        var models = app.models = app.models || {};
        var kendo = window.kendo;
        var kidoju = window.kidoju;
        var Class = kendo.Class;
        var Model = kidoju.data.Model;
        var DataSource = kidoju.data.DataSource;
        var assert = window.assert;
        var logger = new window.Logger('app.mobile.models');
        var pongodb = window.pongodb;
        var db = app.db;
        var i18n = app.i18n;
        var fileSystem = new app.FileSystem();
        var md5 = md5H || window.md5;
        // var i18n = app.i18n = app.i18n || { };
        // This is for testing only because we should get values from config files (see ./js/app.config.jsx)
        var uris = app.uris = app.uris || {};
        uris.cdn = uris.cdn || {};
        uris.cdn.icons = uris.cdn.icons || 'https://cdn.kidoju.com/images/o_collection/svg/office/{0}.svg';
        uris.mobile = uris.mobile || {};
        uris.mobile.icons = uris.mobile.icons || './img/icons/{0}.svg';
        uris.mobile.pictures = uris.mobile.pictures || '{0}users/{1}';
        var DATE = 'date';
        var FUNCTION = 'function';
        // var BOOLEAN = 'boolean';
        // var NULL = 'null';
        var NUMBER = 'number';
        var STRING = 'string';
        var UNDEFINED = 'undefined';
        // var RX_LANGUAGE = /^[a-z]{2}$/;
        var RX_MONGODB_ID = /^[a-f0-9]{24}$/;
        var DOT_JPEG = '.jpg';
        var DEFAULT = {
            ROOT_CATEGORY_ID: {
                en: app.constants.rootCategoryId.en || '000100010000000000000000',
                fr: app.constants.rootCategoryId.fr || '000200010000000000000000'
            },
            DATE: new Date(2000, 0, 1) // 1/1/2000
            // LANGUAGE: 'en',
            // THEME: 'flat' // The default theme is actually defined in app.theme.js - make sure they match!
        };
        var STATE = {
            CREATED: 'created',
            DESTROYED: 'destroyed',
            UPDATED: 'updated'
        };

        /**
         * An error helper that converts an error into an array [xhr, status, error]
         * in order to match $.ajax errors
         * @param error
         * @returns {[*,string,*]}
         * @constructor
         */
        function error2XHR(error) {
            assert.instanceof(Error, error, kendo.format(assert.messages.instanceof.default, 'error', 'Error'));
            assert.type(STRING, error.message, kendo.format(assert.messages.type.default, 'error.message', STRING));
            // JSON.stringify(error) is always {} - $.extend is a workaround to collect non-undefined error properties
            var obj = $.extend(true, {}, {
                message: error.message,
                type: error.type,
                code: error.code,
                stack: error.stack && error.stack.toString()
                // TODO: review missing sub errors
            });
            // Possible responseText from rapi calls are:
            // - "{"error":{"name":"ApplicationError","i18n":"errors.http.401","status":401,"message":"Unauthorized"}}"
            return [
                { responseText: JSON.stringify({ error: obj }) },
                'error',
                error.message
            ];
        }

        /**
         * Extend model with transport
         * @param DataModel - Note: use DataModel to avoid any confusion with Model in kendo.data.Model
         * @param transport
         */
        function extendModelWithTransport(DataModel, transport) {
            assert.isFunction(DataModel, assert.format(assert.messages.isFunction.default, 'DataModel'));
            assert.isFunction(transport.get, assert.format(assert.messages.isFunction.default, 'transport.get'));
            // assert.isFunction(transport.create, assert.format(assert.messages.isFunction.default, 'transport.create'));
            // assert.isFunction(transport.update, assert.format(assert.messages.isFunction.default, 'transport.update'));

            // Add transport to kendo.data.Model
            DataModel.fn.transport = transport;

            // Implement load function
            DataModel.fn.load = function (options) {
                assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
                assert.match(RX_MONGODB_ID, options[this.idField], assert.format(assert.messages.match.default, 'options[this.idField]', RX_MONGODB_ID));
                var that = this;
                var dfd = $.Deferred();
                if (!that.dirty && (that.get(that.idField) === options[that.idField])) {
                    // Already loaded and not modified
                    dfd.resolve(that.toJSON());
                } else {
                    var data = {};
                    data[that.idField] = options[that.idField];
                    delete options[that.idField];
                    that.transport.partition(options);
                    that.transport.get({
                        data: that.transport.parameterMap(data, 'get'),
                        error: dfd.reject,
                        success: function (response) {
                            // TODO: Not found? is error or empty response
                            that.accept(response);
                            dfd.resolve(response);
                        }
                    });
                }
                return dfd.promise();
            };

            // Implement reset function
            DataModel.fn.reset = function () {
                var data = {};
                for (var prop in this.defaults) {
                    if (this.defaults.hasOwnProperty(prop)) {
                        data[prop] = $.isFunction(this.defaults[prop]) ? this.defaults[prop]() : this.defaults[prop];
                    }
                }
                // TODO references ?????
                this.accept(data);
            };

            // Implement save function
            // Note that all model fields marked as serializable === false won't be sent
            DataModel.fn.save = function () {
                var that = this;
                var dfd = $.Deferred();
                if (that.isNew()) {
                    // that.transport.partition() must have been called when loading
                    that.transport.create({
                        data: that.transport.parameterMap(that.toJSON(), 'create'),
                        error: dfd.reject,
                        success: function (response) {
                            // TODO: Not found? is error or empty response
                            that.accept(response.data[0]);
                            dfd.resolve(response.data[0]);
                        }
                    });
                } else if (that.dirty) {
                    var json = that.transport.parameterMap(that.toJSON(), 'update');
                    var data = {};
                    // Only send dirty fields with id for update
                    data[that.idField] = json[that.idField];
                    for (var prop in that.dirtyFields) {
                        if (that.dirtyFields[prop]) {
                            data[prop] = json[prop];
                        }
                    }
                    that.transport.update({
                        data: data,
                        error: dfd.reject,
                        success: function (response) {
                            // TODO: Not found? is error or empty response
                            that.accept(response.data[0]);
                            dfd.resolve(response.data[0]);
                        }
                    });
                } else {
                    dfd.resolve(that.toJSON());
                }
                return dfd.promise();
            };
        }

        /**
         * Lazy remote transport (read-only)
         */
        var LazyRemoteTransport = models.LazyRemoteTransport = models.BaseTransport.extend({

            /**
             * Init
             * @constructor
             * @param options
             */
            init: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isFunction(options.collection, kendo.format(assert.messages.isFunction.default, 'options.collection'));
                this._collection = options.collection; // Something like app.rapi.v2.activities
                models.BaseTransport.fn.init.call(this, options);
            },

            /**
             * Gets/sets a partition
             * @param value
             */
            partition: function (value) {
                if ($.type(value) === UNDEFINED) {
                    return models.BaseTransport.fn.partition.call(this);
                } else {
                    models.BaseTransport.fn.partition.call(this, value);
                    this._rapi = this._collection(this._partition);
                    assert.isFunction(this._rapi.create, kendo.format(assert.messages.isFunction.default, 'this._rapi.create'));
                    assert.isFunction(this._rapi.destroy, kendo.format(assert.messages.isFunction.default, 'this._rapi.destroy'));
                    assert.isFunction(this._rapi.get, kendo.format(assert.messages.isFunction.default, 'this._rapi.get'));
                    assert.isFunction(this._rapi.read, kendo.format(assert.messages.isFunction.default, 'this._rapi.read'));
                    assert.isFunction(this._rapi.update, kendo.format(assert.messages.isFunction.default, 'this._rapi.update'));
                }
            },

            /**
             * Get
             * @param options
             */
            get: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                assert.isFunction(options.error, kendo.format(assert.messages.isFunction.default, 'options.error'));
                assert.isFunction(options.success, kendo.format(assert.messages.isFunction.default, 'options.success'));
                // Fields are part of options.data, filter and sort order are not applicable
                var data = this.parameterMap(options.data, 'get');
                this._rapi.get(data[this.idField], { fields: data.fields }).done(options.success).fail(options.error);
            },

            /**
             * Read
             * @param options
             */
            read: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                assert.isFunction(options.error, kendo.format(assert.messages.isFunction.default, 'options.error'));
                assert.isFunction(options.success, kendo.format(assert.messages.isFunction.default, 'options.success'));
                var partition = this.partition();
                if ($.type(partition) === UNDEFINED) {
                    // This lets us create a dataSource without knowing the partition, which can be set in the load method of the data source
                    options.success({ total: 0, data: [] });
                } else {
                    // Fields, filters and default sort order are part of options.data
                    var data = this.parameterMap(options.data, 'read');
                    // data.partition = undefined;
                    this._rapi.read(data).done(options.success).fail(options.error);
                }
            }

        });

        /**
         * Rapi transport (all CRUD operations)
         */
        var RemoteTransport = models.RemoteTransport = models.LazyRemoteTransport.extend({

            /**
             * Create
             * @param options
             */
            create: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                assert.isFunction(options.error, kendo.format(assert.messages.isFunction.default, 'options.error'));
                assert.isFunction(options.success, kendo.format(assert.messages.isFunction.default, 'options.success'));
                var data = this.parameterMap(options.data, 'create');
                // Validate data against partition
                var err = this._validate(data);
                if (err) {
                    return options.error.apply(this, error2XHR(err));
                }
                // Execute request
                this._rapi.create(data)
                    .done(function (response) {
                        options.success({ total: 1, data: [response] });
                    })
                    .fail(options.error);
            },

            /**
             * Destroy
             * @param options
             */
            destroy: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                assert.isFunction(options.error, kendo.format(assert.messages.isFunction.default, 'options.error'));
                assert.isFunction(options.success, kendo.format(assert.messages.isFunction.default, 'options.success'));
                var data = this.parameterMap(options.data, 'destroy');
                // Validate data against partition
                var err = this._validate(data);
                if (err) {
                    return options.error.apply(this, error2XHR(err)); // TODO review error2XHR
                }
                // Execute request
                this._rapi.destroy(data[this.idField])
                    .done(function (response) {
                        options.success({ total: 1, data: [response] });
                    })
                    .fail(options.error);
            },

            /**
             * Update
             * @param options
             */
            update: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                assert.isFunction(options.error, kendo.format(assert.messages.isFunction.default, 'options.error'));
                assert.isFunction(options.success, kendo.format(assert.messages.isFunction.default, 'options.success'));
                var data = this.parameterMap(options.data, 'update');
                // Validate data against partition
                var err = this._validate(data);
                if (err) {
                    return options.error.apply(this, error2XHR(err));
                }
                // TODO: filter dirty fields --------------------------------
                // Execute request
                this._rapi.update(data[this.idField], data)
                    .done(function (response) {
                        options.success({ total: 1, data: [response] });
                    })
                    .fail(options.error);
            }
        });

        /**
         *
         */
        var LazyMobileTransport = models.LazyMobileTransport = models.BaseTransport.extend({

            /**
             * Init
             * @constructor
             * @param options
             */
            init: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.instanceof(pongodb.Collection, options.collection, kendo.format(assert.messages.instanceof.default, 'options.collection', 'pongodb.Collection'));
                this._collection = options.collection;
                models.BaseTransport.fn.init.call(this, options);
            },

            /**
             * Get
             * @param options
             */
            get: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                assert.isFunction(options.error, kendo.format(assert.messages.isFunction.default, 'options.error'));
                assert.isFunction(options.success, kendo.format(assert.messages.isFunction.default, 'options.success'));
                logger.debug({
                    message: 'Get mobile data',
                    method: 'app.models.LazyMobileTransport.get',
                    data: options.data
                });
                var data = this.parameterMap(options.data, 'get');
                var query = {};
                query[this.idField] = data[this.idField];
                this._collection.findOne(query, this.projection())
                    .done(function (response) {
                        options.success(response);
                    })
                    .fail(function (error) {
                        options.error.apply(this, error2XHR(error));
                    });
            },

            /**
             * Read
             * @param options
             */
            read: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                // assert.isOptionalObject(options.data, kendo.format(assert.messages.isOptionalObject.default, 'options.data')); // because of option.data === {}
                assert.isFunction(options.error, kendo.format(assert.messages.isFunction.default, 'options.error'));
                assert.isFunction(options.success, kendo.format(assert.messages.isFunction.default, 'options.success'));
                var partition = this.partition();
                logger.debug({
                    message: 'Read mobile data',
                    method: 'app.models.LazyMobileTransport.read',
                    data: options.data
                });
                if ($.type(partition) === UNDEFINED) {
                    // This lets us create a dataSource without knowing the partition, which can be set in the load method of the data source
                    options.success({ total: 0, data: [] });
                } else {
                    var query = this.parameterMap(options.data, 'read');
                    app.rapi.util.extendQueryWithPartition(query, partition);
                    // Filter all records with __state___ === 'destroyed', considering partition is ignored when false
                    query.filter.filters.push({ field: '__state__', operator: 'neq',  value: STATE.DESTROYED });
                    query = pongodb.util.convertFilter(options.data.filter);
                    this._collection.find(query, this.projection())
                        .done(function (response) {
                            if ($.isArray(response)) {
                                options.success({ total: response.length, data: response });
                            } else {
                                options.error.apply(this, error2XHR(new Error('Database should return an array')));
                            }
                        })
                        .fail(function (error) {
                            options.error.apply(this, error2XHR(error));
                        });
                }
            }
        });

        /**
         * A generic mobile transport using pongodb (and localForage)
         */
        var MobileTransport = models.MobileTransport = models.LazyMobileTransport.extend({

            /**
             * Create
             * @param options
             */
            create: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                assert.isFunction(options.error, kendo.format(assert.messages.isFunction.default, 'options.error'));
                assert.isFunction(options.success, kendo.format(assert.messages.isFunction.default, 'options.success'));
                logger.debug({
                    message: 'Create mobile data',
                    method: 'app.models.MobileTransport.create',
                    data: options.data
                });
                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var item = JSON.parse(JSON.stringify(this.parameterMap(options.data, 'create')));
                /*
                if (item.updated) {
                    // Beware! JSON.parse(JSON.stringify(...)) converts dates to ISO Strings, so we need to be consistent
                    item.updated = new Date().toISOString();
                }
                */
                if (!item[this.idField]) {
                    item.__state__ = STATE.CREATED;
                }
                // Validate item against partition
                var err = this._validate(item);
                if (err) {
                    return options.error.apply(this, error2XHR(err));
                }
                // Unless we give one ourselves, the collection will give the item an id
                this._collection.insert(item)
                    .done(function () {
                        // Note: the item now has an id
                        options.success({ total: 1, data: [item] });
                    })
                    .fail(function (error) {
                        options.error.apply(this, error2XHR(error));
                    });
            },

            /**
             * Destroy
             * @param options
             */
            destroy: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                assert.isFunction(options.error, kendo.format(assert.messages.isFunction.default, 'options.error'));
                assert.isFunction(options.success, kendo.format(assert.messages.isFunction.default, 'options.success'));
                logger.debug({
                    message: 'Destroy mobile data',
                    method: 'app.models.MobileTransport.destroy',
                    data: options.data
                });
                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var item = JSON.parse(JSON.stringify(this.parameterMap(options.data, 'destroy')));
                var idField = this.idField;
                var id = item[idField];
                if (item.__state__ === STATE.CREATED) {
                    // Items with __state__ === 'created' can be safely removed because they do not exist on the remote server
                    if (RX_MONGODB_ID.test(id)) {
                        this._collection.remove({ id: id })
                            .done(function (response) {
                                if (response && response.nRemoved === 1) {
                                    options.success({ total: 1, data: [item] });
                                } else {
                                    options.error.apply(this, error2XHR(new Error('Not found')));
                                }
                            })
                            .fail(function (error) {
                                options.error.apply(this, error2XHR(error));
                            });
                    } else {
                        // No need to hit the database, it won't be found
                        options.error.apply(this, error2XHR(new Error('Not found')));
                    }
                } else {
                    if (item.updated) {
                        // Beware! JSON.parse(JSON.stringify(...)) converts dates to ISO Strings, so we need to be consistent
                        item.updated = new Date().toISOString();
                    }
                    item.__state__ = STATE.DESTROYED;
                    // Validate item against partition
                    var err = this._validate(item);
                    if (err) {
                        return options.error.apply(this, error2XHR(err));
                    }
                    // Execute request
                    if (RX_MONGODB_ID.test(id)) {
                        item[idField] = undefined;
                        this._collection.update({ id: id }, item)
                            .done(function (response) {
                                if (response && response.nMatched === 1 && response.nModified === 1) {
                                    item[idField] = id;
                                    options.success({ total: 1, data: [item] });
                                } else {
                                    options.error.apply(this, error2XHR(new Error('Not found')));
                                }
                            })
                            .fail(function (error) {
                                options.error.apply(this, error2XHR(error));
                            });
                    } else {
                        // No need to hit the database, it won't be found
                        options.error.apply(this, error2XHR(new Error('Not found')));
                    }
                }
            },

            /**
             * Update
             * @param options
             */
            update: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                assert.isFunction(options.error, kendo.format(assert.messages.isFunction.default, 'options.error'));
                assert.isFunction(options.success, kendo.format(assert.messages.isFunction.default, 'options.success'));
                logger.debug({
                    message: 'Update mobile data',
                    method: 'app.models.MobileTransport.update',
                    data: options.data
                });
                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var item = JSON.parse(JSON.stringify(this.parameterMap(options.data, 'update')));
                if (item.updated) {
                    // Beware! JSON.parse(JSON.stringify(...)) converts dates to ISO Strings, so we need to be consistent
                    item.updated = new Date().toISOString();
                }
                if ($.type(item.__state__) === UNDEFINED) {
                    // Do not change the state of created and destroyed items
                    item.__state__ = STATE.UPDATED;
                }
                // Validate item against partition
                var err = this._validate(item);
                if (err) {
                    return options.error.apply(this, error2XHR(err));
                }
                // Execute request
                var idField = this.idField;
                var id = item[idField];
                if (RX_MONGODB_ID.test(id)) {
                    item[idField] = undefined;
                    this._collection.update({ id: id }, item, { upsert: true })
                        .done(function (response) {
                            if (response && response.nMatched === 1 && (response.nModified + response.nUpserted) === 1) {
                                item[idField] = id;
                                options.success({ total: 1, data: [item] });
                            } else {
                                options.error.apply(this, error2XHR(new Error('Not found')));
                            }
                        })
                        .fail(function (error) {
                            options.error.apply(this, error2XHR(error));
                        });
                } else {
                    // No need to hit the database, it won't be found
                    options.error.apply(this, error2XHR(new Error('Not found')));
                }
            }

        });

        /**
         * DummyTransport
         */
        var DummyTransport = models.DummyTransport = models.BaseTransport.extend({

            init: function (options) {
                models.BaseTransport.fn.init.call(this, options);
                this._data = [];
            },

            create: function (options) {
                var item = options.data;
                item[this.idField] = new window.pongodb.ObjectId().toString();
                this._data.push(item);
                options.success({ total: 1, data: [item] });
            },

            destroy : function (options) {
                var idField = this.idField;
                var id = options.data[idField];
                var found = false;
                for (var idx = 0, length = this._data.length; idx < length; idx++) {
                    var item = this._data[idx];
                    if (item[idField] === id) {
                        found = true;
                        this._data.splice(idx, 1);
                        options.success({ total: 1, data: [item] });
                        break;
                    }
                }
                if (!found) {
                    options.error.apply(this, error2XHR(new Error('Not found')));
                }
            },

            read : function (options) {
                options.success({ total: this._data.length, data: this._data });
            },

            update : function (options) {
                var idField = this.idField;
                var id = options.data[idField];
                var found = false;
                for (var idx = 0, length = this._data.length; idx < length; idx++) {
                    if (this._data[idx][idField] === id) {
                        found = true;
                        var item = this._data[idx] = $.extend(this._data[idx], options.data);
                        options.success({ total: 1, data: [item] });
                        break;
                    }
                }
                if (!found) {
                    options.error.apply(this, error2XHR(new Error('Not found')));
                }
            }

        });

        /**
         * An lazy offline strategy using pongodb (and localForage)
         * @class LazyOfflineStrategy
         */
        models.LazyOfflineStrategy = LazyMobileTransport.extend({

            /**
             * Init
             * @constructor
             * @param options
             */
            init: function (options) {
                options = options || {};
                this.remoteTransport = options.remoteTransport;
                LazyMobileTransport.fn.init.call(this, options); // Calls partition() and projection()
            },

            /**
             * Gets/sets the partition (kind of permanent filter)
             * @param value
             */
            partition: function (value) {
                return this.remoteTransport.partition(value);
            },

            /**
             * Gets/sets the projection (list of fields to return)
             * @param value
             */
            projection: function (value) {
                return this.remoteTransport.projection(value);
            },

            /**
             * Get
             * @param options
             */
            get: function (options) {
                var that = this;
                if (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) ||
                    (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
                    MobileTransport.fn.get.call(this, options);
                } else {
                    this.remoteTransport.get(options);
                }
            },

            /**
             * Read
             * @param options
             */
            read: function (options) {
                var that = this;
                if (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) ||
                    (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
                    MobileTransport.fn.read.call(this, options);
                } else {
                    this.remoteTransport.read(options);
                }
            }
        });

        /**
         * An Offline cache strategy using pongodb (and localForage)
         * Note: Only applies to items that cannot be modified
         * @class LazyCacheStrategy
         */
        models.LazyCacheStrategy = MobileTransport.extend({

            /**
             * Init
             * @constructor
             * @param options
             */
            init: function (options) {
                options = options || {};
                this.remoteTransport = options.remoteTransport;
                MobileTransport.fn.init.call(this, options); // Calls partition() and projection()
            },

            /**
             * Gets/sets the partition (kind of permanent filter)
             * @param value
             */
            partition: function (value) {
                return this.remoteTransport.partition(value);
            },

            /**
             * Gets/sets the projection (list of fields to return)
             * @param value
             */
            projection: function (value) {
                return this.remoteTransport.projection(value);
            },

            /**
             * Get
             * @param options
             */
            get: function (options) {
                var that = this;
                if (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) ||
                    (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
                    MobileTransport.fn.get.call(that, options);
                } else {
                    that.remoteTransport.get({
                        data: options.data,
                        error: options.error,
                        success: function (response) {
                            // This update is actually an upsert
                            MobileTransport.fn.update.call(that, {
                                data: response,
                                error: options.error,
                                success: function (response) {
                                    assert.equal(1, response && response.total, assert.format(assert.messages.equal.default, 'response.total', '1'));
                                    options.success(response.data[0]);
                                }
                            });
                        }
                    });
                }
            },

            /**
             * Read
             * @param options
             */
            read: function (options) {
                var that = this;
                if (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) ||
                    (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
                    MobileTransport.fn.read.call(that, options);
                } else {
                    that.remoteTransport.read({
                        data: options.data,
                        error: options.error,
                        success: function (response) {
                            var promises = [];
                            var upsert = function (index) {
                                var dfd = $.Deferred();
                                // TODO: This should be an upsert, merging fields
                                MobileTransport.fn.update.call(that, {
                                    data: response.data[index],
                                    error: dfd.reject,
                                    success: dfd.resolve
                                });
                                return dfd.promise();
                            };
                            for (var idx = 0, length = response.data.length; idx < length; idx++) {
                                // avoid anonymous functions in for oops
                                promises.push(upsert(idx));
                            }
                            $.when.apply(that, promises)
                                .always(function () {
                                    // Note: ignore errors caching the response
                                    options.success(response);
                                });
                        }
                    });
                }
            }
        });

        /**
         * An offline strategy for summaries using pongodb (and localForage)
         * Note: This matches a remote summary with a mobile summary to show the ones available offline with their scores
         * @class LazyCacheStrategy
         */
        models.LazySummaryOfflineStrategy = models.LazyOfflineStrategy.extend({

            /**
             * Get
             * @param options
             */
            get: function (options) {
                var that = this;
                if (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) ||
                    (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
                    MobileTransport.fn.get.call(that, options);
                } else {
                    that.remoteTransport.get({
                        data: options.data,
                        error: options.error,
                        success: function (response) {
                            MobileTransport.fn.get.call(that, {
                                data: options.data, // The remote data
                                error: function (err) {
                                    options.success(response); // We do not care if we have an error here
                                },
                                success: function (offlineData) { // The local data
                                    response = $.extend(true, offlineData, response, { offline: true });
                                    options.success(response);
                                }
                            });
                        }
                    });
                }
            },

            /**
             * Read
             * @param options
             */
            read: function (options) {
                var that = this;
                if (('Connection' in window && window.navigator.connection.type === window.Connection.NONE) ||
                    (window.device && window.device.platform === 'browser' && !window.navigator.onLine)) {
                    MobileTransport.fn.read.call(that, options);
                } else {
                    that.remoteTransport.read({
                        data: options.data,
                        error: options.error,
                        success: function (response) {
                            var promises = [];
                            var extendOfflineData = function (index) {
                                var dfd = $.Deferred();
                                MobileTransport.fn.get.call(that, {
                                    data: response.data[index], // The remote data
                                    error: function () {
                                        dfd.resolve(); // We do not care! we just don't merge
                                    },
                                    success: function (offlineData) { // The local data
                                        response.data[index] = $.extend(true, offlineData, response.data[index], { offline: true });
                                        dfd.resolve();
                                    }
                                });
                                return dfd.promise();
                            };
                            for (var idx = 0, length = response.data.length; idx < length; idx++) {
                                // avoid anonymous functions in for oops
                                promises.push(extendOfflineData(idx));
                            }
                            $.when.apply(that, promises)
                                .always(function () {
                                    // Note: ignore errors caching the response
                                    options.success(response);
                                });
                        }
                    });
                }
            }
        });

        /**
         * A synchronization strategy using pongodb (and localForage)
         * @class SynchronizationStrategy
         */
        models.SynchronizationStrategy = MobileTransport.extend({

            /**
             * Initialization
             * @constructor
             */
            init: function (options) {
                options = options || {};
                this.remoteTransport = options.remoteTransport;
                MobileTransport.fn.init.call(this, options); // Calls partition() and projection()
            },

            /**
             * Gets/sets the partition (kind of permanent filter)
             * @param value
             */
            partition: function (value) {
                return this.remoteTransport.partition(value);
            },

            /**
             * Gets/sets the projection (list of fields to return)
             * @param value
             */
            projection: function (value) {
                return this.remoteTransport.projection(value);
            },

            /**
             * Gets/sets the last synchronization date
             * @param value
             * @returns {*|{type, defaultValue}}
             */
            lastSync: function (value) {
                if ($.type(value) === UNDEFINED) {
                    return this._lastSync;
                } else if ($.type(value) === DATE) {
                    this._lastSync = value;
                } else {
                    throw new TypeError('`value` should be a `Date`');
                }
            },

            /**
             * Upload a created item
             * @param item
             * @private
             */
            _createSync: function (item) {
                assert.isPlainObject(item, kendo.format(assert.messages.isPlainObject.default, 'item'));
                assert.equal(STATE.CREATED, item.__state__, kendo.format(assert.messages.equal.default, 'item.__state__', 'created'));
                var dfd = $.Deferred();
                var collection = this._collection;
                var idField = this.idField;
                var mobileId = item[idField];
                item[idField] = null;
                delete item.__state__;
                this.remoteTransport.create({
                    data: item,
                    error: function (err) {
                        dfd.reject(err);
                    },
                    success: function (response) {
                        // Note: we do not prioritize deletion and creation but we should probably create before deleting
                        // as it is probably better to have a duplicate than a missing record
                        $.when(
                            collection.remove({ id: mobileId }),
                            collection.insert(response.data[0])
                        )
                            .done(dfd.resolve)
                            .fail(dfd.reject);
                    }
                });
                return dfd.promise();
            },

            /**
             * Upload a destroyed item
             * @param item
             * @private
             */
            _destroySync: function (item) {
                assert.isPlainObject(item, kendo.format(assert.messages.isPlainObject.default, 'item'));
                assert.equal(STATE.DESTROYED, item.__state__, kendo.format(assert.messages.equal.default, 'item.__state__', 'destroyed'));
                var dfd = $.Deferred();
                var collection = this._collection;
                var idField = this.idField;
                delete item.__state__;
                this.remoteTransport.destroy({
                    data: item,
                    error: function (err) {
                        if (err.message = '404') { // TODO -----------------------------------------------------------------------------------
                            // If item is not found on the server, remove from local database
                            collection.remove({ id: item[idField] })
                                .done(dfd.resolve)
                                .fail(dfd.reject);
                        } else {
                            dfd.reject(err);
                        }
                    },
                    success: function (response) {
                        collection.remove({ id: item[idField] })
                            .done(dfd.resolve)
                            .fail(dfd.reject);
                    }
                });
                return dfd.promise();
            },

            /**
             * Download remote items
             * @private
             */
            _readSync: function () {
                var that = this;
                var dfd = $.Deferred();
                var collection = this._collection;
                var idField = this.idField;
                this.remoteTransport.read({
                    data: {
                        filter: { field: 'updated', operator: 'gte', value: that._lastSync },
                        sort: { field: 'updated', dir: 'desc' }
                    },
                    success: function (response) {
                        var result = response.data; // this.remoteTransport.read ensures data is already partitioned
                        var total = result.length;
                        var promises = [];
                        function update(index) {
                            var item = result[index];
                            return collection.update({ id: item[idField] }, item, { upsert: true })
                                .always(function () {
                                    dfd.notify({ collection: collection.name(), pass: 2, index: index, total: total });
                                });
                        }
                        for (var idx = 0; idx < total; idx++) {
                            promises.push(update(idx));
                        }
                        $.when.apply(that, promises)
                            .always(function () {
                                // Note: dfd.notify is ignored if called after dfd.resolve or dfd.reject
                                total = total || 1; // Cannot divide by 0;
                                dfd.notify({ collection: collection.name(), pass: 2, index: total - 1, total: total }); // Make sure we always reach 100%
                                if (total >= 90) { // Don not wait till we reach 100 to act
                                    // TODO we certainly have an issue with paging in this case, because we only synced the first 90 items and there are more
                                    // See https://github.com/kidoju/Kidoju-Mobile/issues/161
                                    logger.crit({
                                        message: 'Time to add paging to synchronization',
                                        method: 'models.SynchronizationStrategy._readSync',
                                        data: { total: total }
                                    });
                                }
                            })
                            .done(dfd.resolve)
                            .fail(dfd.reject);
                    },
                    error: dfd.reject
                });
                return dfd.promise();
            },

            /**
             * Upload an updated item
             * @param item
             * @private
             */
            _updateSync: function (item) {
                assert.isPlainObject(item, kendo.format(assert.messages.isPlainObject.default, 'item'));
                assert.equal(STATE.UPDATED, item.__state__, kendo.format(assert.messages.equal.default, 'item.__state__', 'updated'));
                var dfd = $.Deferred();
                var collection = this._collection;
                var idField = this.idField;
                var query = {};
                delete item.__state__;
                this.remoteTransport.update({
                    data: item,
                    error: function (err) {
                        if (err.message = '404') { // TODO ----------------------------------------------------------------
                            // If item is not found on the server, remove from local database
                            query[idField] = item[idField];
                            collection.remove(query)
                                .done(dfd.resolve)
                                .fail(dfd.reject);
                        } else {
                            dfd.reject(err);
                        }
                    },
                    success: function (response) {
                        query[idField] = response.data[0][idField];
                        collection.update(query, response.data[0])
                            .done(dfd.resolve)
                            .fail(dfd.reject);
                    }
                });
                return dfd.promise();
            },

            /**
             * Synchronize
             * Note: the only limitation of our algorithm is we cannot identify items deleted on the server
             */
            sync: function () {
                var that = this;
                var dfd = $.Deferred();
                var collection = that._collection;
                var partition = that.remoteTransport._partition;
                this._collection.find(partition, this.projection())
                    .done(function (items) {
                        var promises = [];
                        var total = items.length;
                        function syncItem(index) {
                            var item = items[index];
                            if (item.__state__ === STATE.CREATED) {
                                return that._createSync(item)
                                    .always(function () {
                                        dfd.notify({ collection: collection.name(), pass: 1, index: index, total: total });
                                    });
                            } else if (item.__state__ === STATE.DESTROYED) {
                                return that._destroySync(item)
                                    .always(function () {
                                        dfd.notify({ collection: collection.name(), pass: 1, index: index, total: total });
                                    });
                            } else if (item.__state__ === STATE.UPDATED) {
                                return that._updateSync(item)
                                    .always(function () {
                                        dfd.notify({ collection: collection.name(), pass: 1, index: index, total: total });
                                    });
                            }
                        }
                        for (var idx = 0; idx < total; idx++) {
                            var promise = syncItem(idx);
                            if (promise) {
                                promises.push(promise);
                            }
                        }
                        $.when.apply(that, promises)
                            .always(function () {
                                // Note: dfd.notify is ignored if called after dfd.resolve or dfd.reject
                                total = total || 1; // Cannot divide by 0;
                                dfd.notify({ collection: collection.name(), pass: 1, index: total - 1, total: total }); // Make sure we always reach 100%
                            })
                            .done(function () {
                                that._readSync()
                                    .progress(dfd.notify)
                                    .done(dfd.resolve)
                                    .fail(dfd.reject);
                            })
                            .fail(dfd.reject);
                    })
                    .fail(dfd.reject);
                return dfd.promise();
            }
        });

        /**
         * MobileUser model
         * @type {kidoju.data.Model}
         */
        models.MobileUser = Model.define({
            id: 'id', // the identifier of the model, which is required for isNew() to work
            fields: {
                id: { // mobile id, which cannot be the same as server id otherwise isNew won't work and appropriate transports won't be triggered in DataSource
                    type: STRING,
                    editable: false,
                    nullable: true
                },
                sid: { // mongodb server id
                    type: STRING,
                    editable: false
                },
                firstName: {
                    type: STRING,
                    editable: false
                },
                /*
                language: {
                    type: STRING,
                    defaultValue: DEFAULT.LANGUAGE
                },
                */
                lastName: {
                    type: STRING,
                    editable: false
                },
                // Last time when the mobile device was synchronized with the server for that specific user
                lastSync: {
                    type: DATE,
                    defaultValue: DEFAULT.DATE
                },
                // The current user is the user with the most recent lastUse
                lastUse: {
                    type: DATE,
                    defaultValue: function () {
                        return new Date();
                    }
                },
                md5pin: {
                    type: STRING,
                    nullable: true
                },
                picture: {
                    type: STRING
                    // editable: false
                },
                // We are keeping the original provider, but we may consider also saving the token
                provider: {
                    type: STRING,
                    editable: false
                },
                reviewState: {
                    defaultValue: { counter: 0 }
                },
                rootCategoryId: {
                    type: STRING,
                    defaultValue: function () {
                        return DEFAULT.ROOT_CATEGORY_ID[i18n.locale()];
                    }
                }
                /*
                theme: {
                    type: STRING,
                    defaultValue: DEFAULT.THEME
                }
                */
                // consider locale (for display of numbers, dates and currencies)
                // consider timezone (for display of dates), born (for searches)
            },
            fullName$: function () {
                return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
            },
            /**
             * Facebook
             * --------
             * Small:  https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/12509115_942778785793063_9199238178311708429_n.jpg?oh=af39b0956408500676ee12db7bf5ea31&oe=58B8E1A9
             * Large:  https://scontent.xx.fbcdn.net/v/t1.0-1/p160x160/12509115_942778785793063_9199238178311708429_n.jpg?oh=333006a975ce0fbebcd1ad7519f1bc45&oe=58CACE38
             * Larger: https://scontent.xx.fbcdn.net/t31.0-8/12487039_942778785793063_9199238178311708429_o.jpg
             * Small and large images cannot be accessed without query string but there is also https://graph.facebook.com/username_or_id/picture?width=9999
             *
             * Google
             * --------
             * Small: https://lh3.googleusercontent.com/-nma3Tmew9CI/AAAAAAAAAAI/AAAAAAAAAAA/AEMOYSCbFzy-DifyDo-I9xTQ6EUh8cQ4Xg/s64-c-mo/photo.jpg
             * Large: https://lh3.googleusercontent.com/-nma3Tmew9CI/AAAAAAAAAAI/AAAAAAAAAAA/AEMOYSCbFzy-DifyDo-I9xTQ6EUh8cQ4Xg/mo/photo.jpg
             * Default: https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg
             *
             * Live
             * --------
             * Small: https://apis.live.net/v5.0/USER_ID/picture?type=small (96x96)
             * Medium: https://apis.live.net/v5.0/cid-bad501d98dfe21b3/picture?type=medium (160x160)
             * Large: https://apis.live.net/v5.0/USER_ID/picture?type=large (360x360)
             * If your user id is cid-bad501d98dfe21b3 use bad501d98dfe21b3 as USER_ID
             *
             * Twitter
             * --------
             * Small: https://pbs.twimg.com/profile_images/681812478876119042/UQ6KWVL8_normal.jpg
             * Large: https://pbs.twimg.com/profile_images/681812478876119042/UQ6KWVL8_400x400.jpg
             * Default: https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png
             *
             */
            picture$: function () {
                var picture = this instanceof models.MobileUser ? this.get('picture') : this.picture;
                if ($.type(picture) === STRING && picture.length) {
                    return picture;
                } else {
                    return kendo.format(uris.mobile.icons, 'user');
                }
            },
            mobilePicture$: function () {
                var picture = this instanceof models.MobileUser ? this.get('picture') : this.picture;
                var sid = this instanceof models.MobileUser ? this.get('sid') : this.sid;
                var persistent = fileSystem._persistent;
                // To have a mobile picture, there needs to have been a valid picture in the first place and a persistent file system to save it to
                if ($.type(persistent) !== UNDEFINED && RX_MONGODB_ID.test(sid) && $.type(picture) === STRING && picture.length) {
                    // Facebook, Google, Live and Twitter all use JPG images
                    // In the browser:
                    // - toURL returns a url starting with filesystem://
                    // - toInternalURL returns a url starting with cdvfile:// but the url scheme is not recognized by the browser
                    // On Android,
                    // - we get "Uncaught TypeError: FileSystem.encodeURIPath is not a function"
                    // On iOS
                    // - toURL returns a url starting with file://
                    // - toInternalURL returns a url starting with cdvfile://

                    // Note: cdvfile urls do not work in the browser and in WKWebViewEngine - https://issues.apache.org/jira/browse/CB-10141
                    // To test WKWebView against UIWebView, check https://stackoverflow.com/questions/28795476/detect-if-page-is-loaded-inside-wkwebview-in-javascript
                    // var rootURL = window.cordova && window.device && window.device.platform !== 'browser' && !window.indexedDB ?
                    // var rootURL = window.cordova && window.device && window.device.platform !== 'browser' && !(window.webkit && window.webkit.messageHandlers) ?
                    //     persistent.root.toInternalURL() : persistent.root.toURL();
                    // var path = kendo.format(uris.mobile.pictures, persistent.root.toInternalURL(), sid + DOT_JPEG);
                    var path = kendo.format(uris.mobile.pictures, persistent.root.toURL(), sid + DOT_JPEG); // TODO might be a png
                    logger.debug({
                        message: 'binding to mobilePicture$',
                        method: 'MobileUser.mobilePicture$',
                        data: { path: path }
                    });
                    // window.alert(path);
                    return path;
                } else {
                    return kendo.format(uris.mobile.icons, 'user');
                }
            },
            /**
             * _saveMobilePicture should not be used directly
             * This is called from within MobileUserDataSource transport CRUD methods
             * @returns {*}
             * @private
             */
            _saveMobilePicture: function () {
                var that = this;
                var dfd = $.Deferred();
                // The following allows app.models.MobileUser.fn._saveMobilePicture.call(user) in MobileUserDataSource
                // where user is a plain object with a sid and picture
                var sid = that instanceof models.MobileUser ? that.get('sid') : that.sid;
                var remoteUrl = that instanceof models.MobileUser ? that.picture$() : models.MobileUser.fn.picture$.call(that);
                if (remoteUrl === kendo.format(uris.mobile.icons, 'user')) {
                    dfd.resolve();
                } else {
                    assert.match(RX_MONGODB_ID, sid, kendo.format(assert.messages.match.default, 'sid', RX_MONGODB_ID));
                    // Note: this may fail if user does not allow sufficient storage space
                    fileSystem.init()
                        .done(function () {
                            var directoryPath = kendo.format(uris.mobile.pictures, '', '');
                            var fileName = sid + DOT_JPEG; // TODO beware SVG default
                            fileSystem.getDirectoryEntry(directoryPath, window.PERSISTENT)
                                .done(function (directoryEntry) {
                                    fileSystem.getFileEntry(directoryEntry, fileName)
                                        .done(function (fileEntry) {
                                            fileSystem.download(remoteUrl, fileEntry)
                                                .done(dfd.resolve)
                                                .fail(dfd.reject);
                                        })
                                        .fail(dfd.reject);
                                })
                                .fail(dfd.reject);
                        })
                        .fail(dfd.reject);
                }
                return dfd.promise();
            },
            /**
             * Add a pin
             * @param pin
             */
            addPin: function (pin) {
                assert.type(STRING, pin, kendo.format(assert.messages.type.default, 'pin', STRING));
                assert.type(FUNCTION, md5, kendo.format(assert.messages.type.default, 'md5', FUNCTION));
                var salt = this.get('sid');
                assert.match(RX_MONGODB_ID, salt, kendo.format(assert.messages.match.default, 'salt', RX_MONGODB_ID));
                var md5pin = md5(salt + pin);
                this.set('md5pin', md5pin);
            },
            /**
             * Reset pin
             * @param pin
             */
            /*
            resetPin: function () {
                this.set('md5pin', null);
            },
            */
            /**
             * Verify pin
             * @param pin
             */
            verifyPin: function (pin) {
                assert.type(STRING, pin, kendo.format(assert.messages.type.default, 'pin', STRING));
                assert.type(FUNCTION, md5, kendo.format(assert.messages.type.default, 'md5', FUNCTION));
                var salt = this.get('sid');
                assert.match(RX_MONGODB_ID, salt, kendo.format(assert.messages.match.default, 'salt', RX_MONGODB_ID));
                var md5pin = md5(salt + pin);
                return this.get('md5pin') === md5pin;
            }
            /**
             * Load user from Kidoju-Server
             * @returns {*}
             */
            /*
            load: function () {
                var that = this;
                assert.ok(that.isNew(), 'Cannot load a new user into an existing user!');
                app.cache.removeMe();
                return app.cache.getMe()
                    .done(function (data) {
                        if ($.isPlainObject(data) && RX_MONGODB_ID.test(data.id)) {
                            // Since we have marked fields as non editable, we cannot use 'that.set',
                            // This should raise a change event on the parent viewModel
                            that.accept({
                                id: that.defaults.id,
                                sid: data.id,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                lastSync: that.defaults.lastSync,
                                lastUse: new Date(),
                                md5pin: that.defaults.md5pin,
                                picture: data.picture,
                                rootCategoryId: that.defaults.rootCategoryId()
                            });
                        } else {
                            that.reset();
                        }
                    });

            },
            */
            /**
             * Reset user
             */
            /*
            reset: function () {
                // Since we have marked fields as non editable, we cannot use 'that.set'
                this.accept({
                    id: this.defaults.id,
                    sid: this.defaults.sid,
                    firstName: this.defaults.firstName,
                    lastName: this.defaults.lastName,
                    lastSync: this.defaults.lastSync,
                    lastUse: this.defaults.lastUse,
                    md5pin: this.defaults.md5pin,
                    picture: this.defaults.picture,
                    rootCategoryId: this.defaults.rootCategoryId()
                });
            }
            */
        });

        /**
         * MobileUserTransport transport
         */
        models.MobileUserTransport = Class.extend({

            /**
             * Init
             * @constructor
             * @param options
             */
            init: function (options) {
                options = options || {};
                this.idField = options.idField || 'id';
                /*
                // Note: it is not subclassing models.BaseTransport yet (or ever)
                this.partition(options.partition);
                this.projection(options.projection);
                if ($.isFunction(options.parameterMap)) {
                    this.parameterMap = options.parameterMap.bind(this);
                }
                */
            },

            /**
             * Validate user before saving
             * @param user
             */
            _validate: function (user) {
                var ret;
                var errors = [];
                if ($.type(user.md5pin) !== STRING || user.md5pin.length < 4) {
                    var err = new Error('Invalid md5pin');
                    err.prop = 'md5pin';
                    errors.push(err);
                }
                if (errors.length) {
                    ret = new Error('Bad request');
                    ret.code = 400;
                    ret.errors = errors;
                }
                return ret;
            },

            /**
             * Create transport
             * @param options
             * @returns {*}
             * @private
             */
            create: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'User data creation',
                    method: 'app.models.MobileUserDataSource.transport.create'
                });
                var idField = this.idField;
                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var user = JSON.parse(JSON.stringify(options.data));
                // Validate item against partition
                var err = this._validate(user);
                if (err) {
                    return options.error.apply(this, error2XHR(err));
                }
                // This replaces the machine id in the mongoDB server id by MACHINE_ID
                // This ensures uniqueness of user in mobile app when sid is unique without further checks
                // i.e. same user with the same sid recorded twice under different ids in mobile device
                user[idField] = new window.pongodb.ObjectId(user.sid).toMobileId();
                // Start with saving the picture to avoid a broken image in UI if user is saved without
                models.MobileUser.fn._saveMobilePicture.call(user)
                    .done(function () {
                        db.users.insert(user)
                            .done(function () {
                                options.success({ total: 1, data: [user] });
                            })
                            .fail(function (error) {
                                options.error.apply(this, error2XHR(error));
                            });
                    })
                    .fail(function (error) {
                        // Create the user anyway without picture
                        logger.error({
                            message: 'Cannot save mobile picture',
                            method: 'models.MobileUserTransport.create',
                            error: error
                        });
                        user.set('picture', '');
                        db.users.insert(user)
                            .done(function () {
                                options.success({ total: 1, data: [user] });
                            })
                            .fail(function (error) {
                                options.error.apply(this, error2XHR(error));
                            });
                    });
            },

            /**
             * Destroy transport
             * @param options
             * @private
             */
            destroy: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'User data deletion',
                    method: 'app.models.MobileUserDataSource.transport.destroy'
                });
                var idField = this.idField;
                var user = options.data;
                var id = user[idField];
                if (RX_MONGODB_ID.test(id)) {
                    var query = {};
                    query[idField] = id;
                    db.users.remove(query)
                        .done(function (response) {
                            if (response && response.nRemoved === 1) {
                                options.success({ total: 1, data: [user] });
                            } else {
                                options.error.apply(this, error2XHR(new Error('User not found')));
                            }
                        })
                        .fail(function (error) {
                            options.error.apply(this, error2XHR(error));
                        });
                } else {
                    // No need to hit the database, it won't be found
                    options.error.apply(this, error2XHR(new Error('User not found')));
                }
            },

            /**
             * Read transport
             * @param options
             * @private
             */
            read: function (options) {
                logger.debug({
                    message: 'User data read',
                    method: 'app.models.MobileUserDataSource.transport.read'
                });
                // Initialize the file system for mobilePicture$
                fileSystem.init()
                .done(function () {
                    // Query the database of all users
                    db.users.find()
                        .done(function (response) {
                            if ($.isArray(response)) {
                                options.success({ total: response.length, data: response });
                            } else {
                                options.error.apply(this, error2XHR(new Error('Database should return an array')));
                            }
                        })
                        .fail(function (error) {
                            options.error.apply(this, error2XHR(error));
                        });
                })
                .fail(function (error) {
                    options.error.apply(this, error2XHR(error));
                });
            },

            /**
             * Update transport
             * @param options
             * @returns {*}
             * @private
             */
            update: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'User data update',
                    method: 'app.models.MobileUserDataSource.transport.update'
                });
                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var user = JSON.parse(JSON.stringify(options.data));
                // Validate item against partition
                var err = this._validate(user);
                if (err) {
                    return options.error.apply(this, error2XHR(err));
                }
                // Execute request
                var idField = this.idField;
                var id = user[idField];
                if (RX_MONGODB_ID.test(id)) {
                    var query = {};
                    query[idField] = id;
                    // pongodb does not allow the id to be part of the update
                    user[idField] = undefined;
                    db.users.update(query, user)
                        .done(function (response) {
                            if (response && response.nMatched === 1 && response.nModified === 1) {
                                if (('Connection' in window && window.navigator.connection.type !== window.Connection.NONE && window.navigator.onLine)) {
                                    // We only update the image when connected ans discard success/failure because the user is already saved with an image
                                    models.MobileUser.fn._saveMobilePicture.call(user);
                                }
                                // Restore id and return updated user to datasource
                                user[idField] = id;
                                options.success({ total: 1, data: [user] });
                            } else {
                                options.error.apply(this, error2XHR(new Error('User not found')));
                            }
                        })
                        .fail(function (error) {
                            options.error.apply(this, error2XHR(error));
                        });
                } else {
                    // No need to hit the database, it won't be found
                    options.error.apply(this, error2XHR(new Error('User not found')));
                }
            }

        });

        /**
         * MobileUserDataSource model (stored localy)
         * @type {kidoju.data.Model}
         */
        models.MobileUserDataSource = DataSource.extend({

            /**
             * Datasource constructor
             * @param options
             */
            init: function (options) {

                var that = this;

                DataSource.fn.init.call(that, $.extend(true, {}, {
                    transport: new models.MobileUserTransport(),
                    // no serverFiltering, serverSorting or serverPaging considering the limited number of users
                    schema: {
                        data: 'data',
                        total: 'total',
                        errors: 'error',
                        modelBase: models.MobileUser,
                        model: models.MobileUser
                        /**
                        // This is for debugging only
                        parse: function (response) {
                            // debugger;
                            return response;
                        }
                        */
                    }
                }, options));
            }

        });

        /**
         * MobileActivity model
         * @type {kidoju.data.Model}
         */
        models.MobileActivity = Model.define({
            id: 'id', // the identifier of the model, which is required for isNew() to work
            fields: {
                id: {
                    type: STRING,
                    nullable: true
                },
                actor: { // <--- models.UserReference
                    // For complex types, the recommendation is to leave the type undefined and set a default value
                    // See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
                    // See: http://demos.telerik.com/kendo-ui/grid/editing-custom
                    defaultValue: null,
                    parse: function (value) {
                        // Important: foreign keys use sids
                        return (value instanceof models.UserReference || value === null) ? value : new models.UserReference(value);
                    }
                },
                // score is used for activities of type score
                score: {
                    type: NUMBER,
                    editable: false,
                    nullable: true
                },
                // test is used for activities of type score
                test: {
                    // For complex types, the recommendation is to leave the type undefined and set a default value
                    defaultValue: null
                },
                type: {
                    type: STRING,
                    editable: false
                },
                scheme: {
                    type: STRING,
                    defaultValue: app.constants.appScheme,
                    editable: false
                },
                date: {
                    type: DATE
                },
                updated: {
                    type: DATE
                },
                version: { // <--- models.VersionReference
                    // For complex types, the recommendation is to leave the type undefined and set a default value
                    // See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
                    // See: http://demos.telerik.com/kendo-ui/grid/editing-custom
                    defaultValue: null,
                    // TODO Add category!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    parse: function (value) {
                        // Important: foreign keys use sids
                        return (value instanceof models.VersionReference || value === null) ? value : new models.VersionReference(value);
                    }
                }
            },
            /*
            category$: function () {
                return this.get('version.categoryId')
            },
            */
            isError$: function () {
                return this.get('score') >= 0 && this.get('score') < 50;
            },
            isSuccess$: function () {
                return this.get('score') >= 75;
            },
            isWarning$: function () {
                return this.get('score') >= 50 && this.get('score') < 75;
            },
            period$: function () {
                // Time zones ????
                var now = new Date();
                var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                var startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()); // Previous Sunday
                var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // It won't show within a week of begining of the month
                var updated = this.get('updated');
                if (updated >= today) {
                    return today;
                } else if (updated >= yesterday) {
                    return yesterday;
                } else if (updated >= startOfWeek) {
                    return startOfWeek;
                } else if (updated >= startOfMonth) {
                    return startOfMonth;
                } else {
                    return new Date(updated.getFullYear(), updated.getMonth(), 1);
                }
            },
            queryString$: function () { // TODO replace with activityUri tested on Cordova versus WebApp
                return '?language=' + window.encodeURIComponent(this.get('version.language')) +
                    '&summaryId=' + window.encodeURIComponent(this.get('version.summaryId')) +
                    '&versionId=' + window.encodeURIComponent(this.get('version.versionId')) +
                    '&activityId=' + window.encodeURIComponent(this.get('id'));
            },
            score$: function () {
                return kendo.toString(this.get('score') / 100, 'p0');
            },
            title$: function () {
                return this.get('version.title'); // Flattens data depth
            },
            updated$: function () {
                return kendo.toString(this.get('updated'), 'dd MMM yyyy');
            }
        });

        /**
         * MobileActivityDataSource datasource (stored locally and synchronized)
         * @type {kidoju.data.DataSource}
         */
        models.MobileActivityDataSource = DataSource.extend({

            /**
             * Datasource constructor
             * @param options
             */
            init: function (options) {
                DataSource.fn.init.call(this, $.extend(true, {}, options, {
                    transport: new models.SynchronizationStrategy({
                        collection: db.activities,
                        remoteTransport: new models.RemoteTransport({
                            collection: app.rapi.v2.activities,
                            partition: options && options.partition
                        })
                    }),
                    serverAggregates: false,
                    serverFiltering: false,
                    serverGrouping: false,
                    serverSorting: false,
                    serverPaging: false,
                    group: {
                        dir: 'desc',
                        field: 'period$()'
                    },
                    sort: {
                        dir: 'desc',
                        field: 'updated'
                    },
                    schema: {
                        data: 'data',
                        errors: 'error', // <--------------------- TODO: look at this properly for error reporting
                        modelBase: models.MobileActivity,
                        model: models.MobileActivity,
                        total: 'total'
                        /**
                         // This is for debugging only
                         parse: function (response) {
                            // debugger;
                            return response;
                        }
                        */
                    }
                }, options));

            },

            /**
             * Sets the partition and queries the data source
             * @param options
             */
            load: function (options) {
                if (options && $.isPlainObject(options.partition)) {
                    this.transport.partition(options.partition);
                }
                return this.query(options);
            },

            /**
             * Set last synchronization date
             * @param options
             */
            setLastSync: function (date) {
                this.transport.lastSync(date);
            },

            /**
             * Synchronizes user activities with the server
             */
            remoteSync: function () {
                return this.transport.sync();
            }

        });

        /**
         * LazySummaryDataSource datasource
         * @type {kidoju.data.Model}
         */
        models.LazySummaryDataSource = DataSource.extend({

            /**
             * Init
             * @constructor
             * @param options
             */
            init: function (options) {
                var that = this;
                that._userId = options._userId;
                DataSource.fn.init.call(that, $.extend(true, { pageSize: 5 }, options, {
                    transport: new models.LazySummaryOfflineStrategy({
                        collection: db.summaries,
                        remoteTransport: new models.RemoteTransport({
                            collection: app.rapi.v2.summaries,
                            partition: options && options.partition
                        })
                    }),
                    serverFiltering: true,
                    serverSorting: true,
                    serverPaging: true,
                    schema: {
                        data: 'data',
                        total: 'total',
                        errors: 'error',
                        modelBase: models.LazySummary,
                        model: models.LazySummary,
                        parse: function (response) {
                            // We parse the response to flatten data for our LazySummary model (instead of using field.from and field.defaultValue definitions)
                            // We cannot use nested model properties as in https://docs.telerik.com/kendo-ui/controls/data-management/grid/how-to/binding/use-nested-model-properties
                            // because we need that._userId to parse activities for the latest user score
                            // Also we need to create the path to nested properties anyway otherwise kendo.getter will fail
                            // because kendo.expr won't be able to evaluate a property like metrics.comments.count if metrics.comments is undefined
                            if (response && $.type(response.total) === NUMBER && $.isArray(response.data)) {
                                $.each(response.data, function (index, summary) {
                                    // We need to flatten author and metrics in case we need to represent data in a kendo.ui.Grid
                                    // Flatten author
                                    assert.isPlainObject(summary.author, kendo.format(assert.messages.isPlainObject.default, 'summary.author'));
                                    summary.userId = summary.author.userId;
                                    summary.firstName = summary.author.firstName;
                                    summary.lastName = summary.author.lastName;
                                    summary.author = undefined;
                                    // Flatten metrics
                                    summary.comments = summary.comments && summary.metrics.comments && summary.metrics.comments.count || 0;
                                    summary.ratings = summary.comments && summary.metrics.ratings && summary.metrics.ratings.average || null;
                                    summary.scores = summary.comments && summary.metrics.scores && summary.metrics.scores.average || null;
                                    summary.views = summary.comments && summary.metrics.views && summary.metrics.views.count || 0;
                                    if (summary.metrics) {
                                        summary.metrics = undefined;
                                    }
                                    // Flatten activity (only mobile application)
                                    if (Array.isArray(summary.activities)) {
                                        for (var i = 0, length = summary.activities.length; i < length; i++) {
                                            if (summary.activities[i].actorId === that._userId) {
                                                summary.userScore = summary.activities[i].score;
                                                break;
                                            }
                                        }
                                        summary.activities = undefined;
                                    }
                                });
                            }
                            return response;
                        }
                    }
                }));
            },

            /**
             * Set user id
             * @param userId
             */
            setUserId: function (userId) {
                this._userId = userId;
            },

            /**
             * Sets the partition and queries the data source
             * @param options
             */
            load: function (options) {
                if (options && $.isPlainObject(options.partition)) {
                    this.transport.partition(options.partition);
                }
                return this.query(options);
            }
        });

        /**
         * Summary model with transport
         */
        extendModelWithTransport(models.Summary, new models.LazySummaryOfflineStrategy({
            collection: db.summaries,
            remoteTransport: new models.RemoteTransport({
                collection: app.rapi.v2.summaries
                // partition: ?
            })
        }));

        /**
         * LazyVersionDataSource datasource
         * @type {kidoju.data.Model}
         */
        models.LazyVersionDataSource = DataSource.extend({

            /**
             * Init
             * @constructor
             * @param options
             */
            init: function (options) {
                DataSource.fn.init.call(this, $.extend(true, { pageSize: 100 }, options, {
                    transport: new models.LazyOfflineStrategy({
                        collection: db.versions,
                        remoteTransport: new models.RemoteTransport({
                            collection: app.rapi.v2.versions,
                            partition: options && options.partition
                        })
                    }),
                    serverFiltering: true,
                    serverSorting: true,
                    serverPaging: true,
                    schema: {
                        data: 'data',
                        total: 'total',
                        errors: 'error',
                        modelBase: models.LazyVersion,
                        model: models.LazyVersion,
                        parse: function (response) {
                            // Name versions: draft, version 1, version 2, ....
                            if (response && $.type(response.total === NUMBER && $.isArray(response.data))) {
                                $.each(response.data, function (index, version) {
                                    if (version.state === 0) { // VERSION_STATE.DRAFT) {
                                        version.name = ''; // i18n.culture.versions.draft.name;
                                    } else {
                                        version.name = ''; // kendo.format(i18n.culture.versions.published.name, response.data.length - index);
                                    }
                                });
                            }
                            return response;
                        }
                    }
                }));
            },

            /**
             * Sets the partition and queries the data source
             * @param options
             */
            load: function (options) {
                if (options && $.isPlainObject(options.partition)) {
                    this.transport.partition(options.partition);
                }
                return this.query(options);
            }
        });

        /**
         * Version model with transport
         */
        extendModelWithTransport(models.Version, new models.LazyCacheStrategy({
            collection: db.versions,
            remoteTransport: new models.RemoteTransport({
                collection: app.rapi.v2.versions
                // partition: ?
            })
        }));


    }(window.jQuery));

    /* jshint +W074 */
    /* jshint +W071 */

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });

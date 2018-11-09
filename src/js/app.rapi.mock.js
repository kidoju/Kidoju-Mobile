/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */

(function ($) {

    'use strict';

    var app = window.app = window.app || {};
    var assert = window.assert;
    var kendo = window.kendo;
    var Loki = window.loki;

    var uris = app.uris = app.uris || {
            rapi: {
                root: 'https://www.kidoju.com',
                reset: '/reset',
                v1: {
                    activities: '/api/v1/{0}/summaries/{1}/activities',
                    activity: '/api/v1/{0}/summaries/{1}/activities/{2}',
                    categories: '/api/v1/languages/{0}/categories',
                    file: '',
                    files: '',
                    language: '/api/v1/languages/{0}',
                    languages: '/api/v1/languages',
                    me: '/api/v1/users/me',
                    myActivities: '/api/v1/users/me/{0}/activities',
                    myFavourite: '',
                    myFavourites: '',
                    mySummaries: '',
                    summaries: '',
                    summary: '',
                    upload: '',
                    user: '',
                    version: '',
                    versions: ''

                }
            }
        };
    var STRING = 'string';
    var UNDEFINED = 'undefined';
    var BEARER_LENGTH = 'Bearer '.length;
    var HTTP_STATUS = {
        NOT_FOUND: 'Not found',
        UNAUTHORIZED: 'Unauthorized'
    };


    /*******************************************************************************************************
     * MockDB requiring lokiJS
     *******************************************************************************************************/

    /**
     * MockDB database
     * @type {string}
     */
    var MockDB = function () {
        this.loki = new Loki();
        this.activities = this.loki.addCollection('activities');
        this.categories = this.loki.addCollection('categories');
        this.sessions = this.loki.addCollection('sessions');
        this.summaries = this.loki.addCollection('summaries');
        this.tokens = this.loki.addCollection('tokens');
        this.users = this.loki.addCollection('users');
        this.versions = this.loki.addCollection('versions');
    };

    /* Blocks are nested too deeply. */
    /* jshint -W073 */

    /* This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

    /**
     * Parses documents in JSON files exported from MongoDB
     * Especially handles id and date fields
     * @param value
     * @returns {*}
     */
    MockDB.prototype._parse = function (value) {
        /* jshint maxcomplexity: 11 */
        /* jshint maxdepth: 6 */
        var that = this;
        if ($.isPlainObject(value)) {
            if (value.hasOwnProperty('$oid') && Object.keys(value).length === 1) {
                // This is the case with categories which are an array of ids
                // After parsing the array, we need to parse each item into an id
                value = value.$oid;
            } else {
                for (var field in value) {
                    if (value.hasOwnProperty(field)) {
                        if ($.isPlainObject(value[field]) && $.type(value[field].$oid) === STRING) {
                            // value[field] is an ObjectId which mongo exports as { $oid: ... }
                            var id = value[field].$oid;
                            delete value[field];
                            value[field.replace(/_([^_]*)/, '$1')] = id;
                        } else if ($.isPlainObject(value[field]) && $.type(value[field].$date) === STRING) {
                            // value[field] is a Date which mongo exports as { $date: ... }
                            value[field] = kendo.parseDate(value[field].$date);
                        } else if ($.isPlainObject(value[field])) {
                            // value[field] is an object with nested values which need to be parsed
                            value[field] = that._parse(value[field]);
                        } else if ($.isArray(value[field])) {
                            // value[field] is an array with nested values which need to be parsed
                            var array = [];
                            for (var i = 0; i < value[field].length; i++) {
                                array.push(that._parse(value[field][i]));
                            }
                            value[field] = array;
                        }
                        // if value is a basic type (string, number, boolean), keep as is
                    }
                }
                if (!value.created && value.updated instanceof Date) {
                    value.created = value.updated;
                }
                delete value.__v;
            }
        }
        return value;
    };

    /**
     * Clean a loki object before returning it in $.mockjax
     * @param value
     * @param fields
     * @private
     */
    MockDB.prototype._toObject = function (value, fields) {
        var ret = $.extend(true, {}, value); // clone
        if ($.type(fields) === STRING) {
            var fieldArray = fields.split(/[,;\s]/);
            var tmp = {};
            $.each(fieldArray, function (index, field) {
                // TODO split fields like author.userId and arrays
                if ($.type(ret[field]) !== UNDEFINED) {
                    tmp[field] = ret[field];
                    if (field === 'updated') {
                        tmp.created = tmp.updated;
                    }
                }
            });
            // Always include the id
            tmp.id = ret.id;
            ret = tmp;
        } else {
            delete ret.$loki;
            delete ret.meta;
        }
        if (ret.created) {
            ret.created = ret.created.toISOString();
        }
        if (ret.updated) {
            ret.updated = ret.updated.toISOString();
        }
        return ret;
    };

    /* jshint +W074 */
    /* jshint +W073 */

    /**
     * Load collection with JSON file
     * @param name
     * @param uri
     * @returns {*}
     */
    MockDB.prototype.loadCollection = function (name, uri) {
        var that = this;
        var dfd = $.Deferred();
        var collection = this[name];
        $.get(uri)
            .done(function (response) {
                // In Mocha, the content type is text
                if ($.type(response) === STRING) {
                    try {
                        response = JSON.parse(response);
                    } catch (exception) {
                        response = [];
                    }
                }
                // With Jetbrains web server the content type is JSON and $.get parses it
                if ($.isArray(response)) {
                    $.each(response, function (index, value) {
                        collection.insert(that._parse(value));
                    });
                }
                dfd.resolve();
            })
            .fail(dfd.reject);
        return dfd.promise();
    };

    /**
     * Load database from JSON files
     * @returns {*}
     */
    MockDB.prototype.load = function () {
        return $.when(
            this.loadCollection('activities', '../data/activities.json'),
            this.loadCollection('categories', '../data/categories.json'),
            this.loadCollection('sessions', '../data/sessions.json'),
            this.loadCollection('summaries', '../data/summaries.json'),
            this.loadCollection('tokens', '../data/tokens.json'),
            this.loadCollection('users', '../data/users.json'),
            this.loadCollection('versions', '../data/versions.json')
        );
    };

    /**
     * Instantiate database
     */
    var mockDB = app.mockDB = new MockDB();

    /*******************************************************************************************************
     * Mock $.ajax endpoints
     *******************************************************************************************************/


    /**
     * $.mockjaxSettings
     * @type {string}
     */
    $.mockjaxSettings.contentType = 'application/json';
    // $.mockjaxSettings.namespace = root; // <-- this does not seem to work, so we have complete urls here below

    /**
     * $.mockjax
     */
    $.mockjax([

        /***************************************************************************************************************
         * Reset
         ***************************************************************************************************************/

        /**
         * /reset
         */
        {
            url: uris.rapi.root + uris.rapi.reset,
            response: function (request) {
                this.responseText = ''; // There is no cache to clear unless we consider reloading lokiDB
            }
        },

        /***************************************************************************************************************
         * Taxonomy
         ***************************************************************************************************************/

        /**
         * /api/v1/languages
         */
        {
            url: uris.rapi.root + uris.rapi.v1.languages,
            response: function (request) {
                // TODO: can this be dynamic considering json files?
                this.responseText = '{"total":2,"data":[{"language":"en"},{"language":"fr"}]}';
            }
        },

        /**
         * /api/v1/languages/{0}
         */
        {
            url: new RegExp(('^' + uris.rapi.root + uris.rapi.v1.languages).replace('{0}', '[a-z]{2}')),
            response: function (request) {
                this.responseText = { language: 'en' }; // TODO Analyse url
            }
        },

        /**
         * /api/v1/languages/{0}/categories
         */
        {
            url: new RegExp(('^' + uris.rapi.root + uris.rapi.v1.categories).replace('{0}', '[a-z]{2}')),
            response: function (request) {
                var categories = mockDB.categories.find({ language: 'en' }); // TODO Analyse url
                assert.isArray(categories, assert.format(assert.messages.isArray.default, 'categories'));
                this.responseText = categories.map(function (category) { return mockDB._toObject(category, request.data.fields); });
            }
        },

        /***************************************************************************************************************
         * Users
         ***************************************************************************************************************/

        /**
         * /api/v1/users/me
         */
        {
            url: uris.rapi.root + uris.rapi.v1.me,
            response: function (request) {
                if (request.headers.Authorization) {
                    var access = request.headers.Authorization.substr(BEARER_LENGTH);
                    var token = mockDB.tokens.findOne({ access: access });
                    if (token) {
                        var user = mockDB.users.findOne({ id: token.userId });
                        if (user) {
                            this.responseText = mockDB._toObject(user, request.data.fields);
                        } else {
                            this.status = 404;
                            this.statusText = HTTP_STATUS.NOT_FOUND;
                        }
                    } else {
                        this.status = 404;
                        this.statusText = HTTP_STATUS.NOT_FOUND;
                    }
                } else {
                    this.status = 401;
                    this.statusText = HTTP_STATUS.UNAUTHORIZED;
                }
            }
        },

        /**
         * /api/v1/users/me/{0}/activities
         */
        {
            url: new RegExp(('^' + uris.rapi.root + uris.rapi.v1.myActivities).replace('{0}', '[a-z]{2}')),
            response: function (request) {
                if (request.headers.Authorization) {
                    var access = request.headers.Authorization.substr(BEARER_LENGTH);
                    var token = mockDB.tokens.findOne({ access: access });
                    if (token) {
                        var user = mockDB.users.findOne({ id: token.userId });
                        if (user) {
                            this.responseText = mockDB._toObject(user, request.data.fields);
                        } else {
                            this.status = 404;
                            this.statusText = HTTP_STATUS.NOT_FOUND;
                        }
                    } else {
                        this.status = 404;
                        this.statusText = HTTP_STATUS.NOT_FOUND;
                    }
                } else {
                    this.status = 401;
                    this.statusText = HTTP_STATUS.UNAUTHORIZED;
                }
            }
        }



    ]);

}(window.jQuery));

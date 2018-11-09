/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        './vendor/kendo/kendo.core',
        './vendor/kendo/kendo.data',
        './app.logger',
        './app.rapi',
        './app.cache'
], f);
})(function () {

    'use strict';

    var app = window.app = window.app || {};

    /*  This function has too many statements. */
    /* jshint -W071 */

    /* This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

    (function ($, undefined) {

        /* jshint maxcomplexity: 8 */
        var kendo = window.kendo;
        var i18n = app.i18n;
        var logger = app.logger;
        var models = app.models;
        var STRING = 'string';
        var RX_MONGODB_ID = /^[a-f0-9]{24}$/;
        var ERROR = 'error';
        // var BAD_REQUEST = 'Bad Request';
        // var NOT_FOUND = 'Not Found';
        // var UNAUTHORIZED = 'Unauthorized';
        var uris = app.uris = app.uris || {}; // we expect to have app.uris.rapi = {...}
        uris.webapp = uris.webapp  || {}; // this is for testing too
        uris.webapp.finder = uris.webapp.finder || (window.location.protocol + '//' + window.location.host + '/{0}');
        uris.webapp.user = uris.webapp.user || (window.location.protocol + '//' + window.location.host + '/{0}/u/{1}');
        uris.webapp.summary = uris.webapp.summary || (window.location.protocol + '//' + window.location.host + '/{0}/s/{1}');

        if (!models) {
            throw new Error('app.models.js is not loaded');
        }

        /**
         * MongoDB-like id generator
         */
        function ObjectId() {
            return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, function () {
                /* jshint -W016 */
                return (Math.random() * 16|0).toString(16);
                /* jshint +W016 */
            });
        }

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
        function parse(value) {
            /* jshint maxcomplexity: 11 */
            /* jshint maxdepth: 6 */
            if ($.isPlainObject(value)) {
                if (value.hasOwnProperty('$oid') && Object.keys(value).length === 1) {
                    // This is the case with categories which are an array of ids
                    // After parsing the array, we need to parse each item into an id
                    value = value.$oid;
                } else {
                    for (var field in value) {
                        if (value.hasOwnProperty(field)) {
                            if ($.isPlainObject(value[field]) && $.type(value[field].$oid) === 'string') {
                                // value[field] is an ObjectId which mongo exports as { $oid: ... }
                                var id = value[field].$oid;
                                delete value[field];
                                value[field.replace(/_([^_]*)/, '$1')] = id;
                            } else if ($.isPlainObject(value[field]) && $.type(value[field].$date) === 'string') {
                                // value[field] is a Date which mongo exports as { $date: ... }
                                value[field] = kendo.parseDate(value[field].$date);
                            } else if ($.isPlainObject(value[field])) {
                                // value[field] is an object with nested values which need to be parsed
                                value[field] = parse(value[field]);
                            } else if ($.isArray(value[field])) {
                                // value[field] is an array with nested values which need to be parsed
                                var array = [];
                                for (var i = 0; i < value[field].length; i++) {
                                    array.push(parse(value[field][i]));
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
        }

        /* jshint +W074 */
        /* jshint +W073 */

        /**
         * Clone an object from database without metadata
         * @param obj
         * @returns {*|void}
         */
        function cloneWithoutDBMetaData(obj) {
            var ret = $.extend(true, {}, obj); // clone
            delete ret.$loki;
            delete ret.meta;
            return ret;
        }

        /**
         * Convert an object from DB to be used in deferred resolution
         * @param obj
         * @constructor
         */
        function convertFromDBtoResolve(obj) {
            var ret = cloneWithoutDBMetaData(obj);
            ret.created = ret.created.toISOString();
            ret.updated = ret.updated.toISOString();
            return ret;
        }

        /* This function's cyclomatic complexity is too high. */
        /* jshint -W074 */

        /**
         * Converts a kendo ui filter into a mongodb query
         * @see http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#configuration-filter.operator
         * @param filters
         * @returns {*}
         */
        function convertFilter2Query(filters) {
            /* jshint maxcomplexity: 17 */
            var query = {};
            if (!filters) {
                return;
            }
            if ($.isPlainObject(filters)) {
                if ($.type(filters.field) === 'string' && filters.operator && filters.value) {
                    filters = [filters];
                } else if (filters.logic === 'and' && $.isArray(filters.filters)) {
                    filters = filters.filters;
                } else {
                    throw new Error('Unsupported kendo ui filter');
                }
            }
            if ($.isArray(filters)) {
                for (var i = 0; i < filters.length; i++) {
                    if ($.type(filters[i].field) === 'string' && filters[i].operator && filters[i].value) {
                        switch (filters[i].operator) {
                            case 'contains':
                                query[filters[i].field] = { $regex: filters[i].value };
                                break;
                            case 'endswith':
                                query[filters[i].field] = { $regex: filters[i].value + '$' };
                                break;
                            case 'eq':
                                query[filters[i].field] = { $eq: filters[i].value };
                                break;
                            case 'gt':
                                query[filters[i].field] = { $gt: filters[i].value };
                                break;
                            case 'gte':
                                query[filters[i].field] = { $gte: filters[i].value };
                                break;
                            case 'lt':
                                query[filters[i].field] = { $lt: filters[i].value };
                                break;
                            case 'lte':
                                query[filters[i].field] = { $lte: filters[i].value };
                                break;
                            case 'neq':
                                query[filters[i].field] = { $neq: filters[i].value };
                                break;
                            case 'startswith':
                                query[filters[i].field] = { $regex: '^' + filters[i].value };
                                break;
                            default:
                                throw new Error('filters operator `' + filters.opertator + '` is unsupported');
                        }
                    }
                }
            }
            return query;
        }

        /* jshint +W074*/

        /**
         * Returns an xhr object consistent with the xhr returned by the .fail method of $.ajax requests
         * @constructor
         */
        var ErrorXHR = function (status, message) {
            var errors = {
                400: 'Bad Request',
                401: 'Unauthorized',
                404: 'Bad Request'
            };
            this.readyState = 4;
            this.responseText = kendo.format('{"error":{"name":"ApplicationError","code":0,"status":{0},"message":"{1}"}}', status, message);
            this.status = status;
            this.statusText = errors[status.toString()];
        };

        /**
         * Mock app.cache.getMe to fetch the authenticated user from lokiJS in-memory database
         * @type {{getMe: Function}}
         */
        app.cache = {

            /* Blocks are nested too deeply. */
            /* jshint -W073 */

            /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */

            /**
             * Get current user
             * @returns {*}
             */
            getMe: function () {
                var dfd = $.Deferred();
                setTimeout(function () {
                    var token = window.localStorage.getItem('token');
                    var me = { id: null };
                    if ($.type(token) === STRING) {
                        var access = JSON.parse(token).access_token;
                        var tokens = db.tokens.find({ access: access });
                        if ($.isArray(tokens) && tokens.length) {
                            if (tokens[0] && RX_MONGODB_ID.test(tokens[0].userId)) {
                                var users = db.users.find({ id: tokens[0].userId });
                                if ($.isArray(users) && users.length) {
                                    me = {
                                        id: users[0].id,
                                        firstName: users[0].firstName,
                                        lastName: users[0].lastName,
                                        picture: users[0].picture
                                    };
                                }
                            }
                        }
                    }
                    dfd.resolve(me);
                }, 0);
                return dfd.promise();
            },

            /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

            /* jshint +W073 */

            /**
             * Get all categories in a flat array
             * @param locale
             * @returns {*}
             */
            getAllCategories: function (locale) {
                var dfd = $.Deferred();
                setTimeout(function () {
                    var categories = db.categories.find({ language: i18n.locale() });
                    dfd.resolve({ total: categories.length, data: categories });
                }, 0);
                return dfd.promise();
            },

            /**
             * Get all categories in a hierarchy
             * @param locale
             * @returns {*}
             */
            getCategoryHierarchy: function (locale) {
                var dfd = $.Deferred();
                this.getAllCategories(locale)
                    .done(function (response) {
                        var hash = {};
                        $.each(response.data, function (index, value) {
                            // See http://docs.telerik.com/kendo-ui/getting-started/web/treeview/overview#item-definition
                            // See http://docs.telerik.com/kendo-ui/getting-started/web/treeview/binding-to-flat-data#method-1-initial-pre-processing-of-all-data
                            var item = {
                                    id: value.id,
                                    name: value.name,
                                    icon: value.icon,
                                    type: 2
                                };
                            var id = value.id;
                            var parentId = value.parentId || 'root';
                            hash[id] = hash[id] || [];
                            hash[parentId] = hash[parentId] || [];
                            item.items = hash[id];
                            hash[parentId].push(item);
                        });
                        dfd.resolve(hash.root);
                    })
                    .fail(function (xhr, status, error) {
                        dfd.reject(xhr, status, error);
                    });
                return dfd.promise();
            },

            /* Blocks are nested too deeply. */
            /* jshint -W073 */

            /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */

            /**
             * Get all favourites in a hierarchy
             * @param locale
             * @returns {*}
             */
            getFavouriteHierarchy: function (locale) {
                var dfd = $.Deferred();
                setTimeout(function () {
                    var token = window.localStorage.getItem('token');
                    var favourites = [];
                    if ($.type(token) === STRING) {
                        var access = JSON.parse(token).access_token;
                        var tokens = db.tokens.find({ access: access });
                        if ($.isArray(tokens) && tokens.length) {
                            if (tokens[0] && RX_MONGODB_ID.test(tokens[0].userId)) {
                                var users = db.users.find({ id: tokens[0].userId });
                                if ($.isArray(users) && users.length) {
                                    favourites = $.grep(users[0].favourites, function (favourite) {
                                        return favourite.language === locale;
                                    });
                                    $.each(favourites, function (index, favourite) {
                                        delete favourite.language;
                                        favourite.icon = 'star';
                                        favourite.type = 3;
                                    });
                                }
                            }
                        }
                    }
                    dfd.resolve(favourites);
                }, 0);
                return dfd.promise();
            },

            /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

            /* jshint +W073 */

            /**
             * Remove favourites
             * @param locale
             */
            removeMyFavourites: function (locale) {
                if (window.localStorage) {
                    window.localStorage.removeItem('favourites.' + locale);
                }
            }
        };

        /*******************************************************************************
         * Taxonomy
         *******************************************************************************/

        /************************************************************************************
         * Searches and Rummages
         ************************************************************************************/

        models.Search.prototype.save = function () {
            var that = this;
            var dfd = $.Deferred();
            // Test userId to avoid hitting the database unnecessarily
            if (RX_MONGODB_ID.test(this.userId)) {
                app.cache.removeMyFavourites(i18n.locale());
                // Save a favourite on the current user
                setTimeout(function () {
                    var root = window.location.protocol + '//' + window.location.host;
                    var finder = kendo.format(uris.webapp.finder, i18n.locale());
                    finder = finder.indexOf(root) === 0 ? finder.substr(root.length) : finder;
                    var favourite = {
                            id: ObjectId(),
                            language: i18n.locale(),
                            name: that.get('favourite'),
                            path: finder + that.getHash(true)
                        };
                    var users = db.users.find({ id: that.get('userId') });
                    if ($.isArray(users) && users.length) {
                        var user = $.extend(true, {}, users[0]); // clone
                        user.favourites.push(favourite);
                        if (user.updated instanceof Date) {
                            that.updated = user.updated = new Date();
                        }
                        db.users.update(user);
                        dfd.resolve(favourite);
                    } else {
                        var xhr = new ErrorXHR(404, 'User not found');
                        dfd.reject(xhr, ERROR, xhr.statusText);
                    }
                }, 0);
            } else {
                setTimeout(function () {
                    var xhr = new ErrorXHR(401, 'Ensure you have loaded the search model with an authenticated user id');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }, 0);
            }
            return dfd.promise();
        };

        /************************************************************************************
         * Users
         ************************************************************************************/

        /**
         * Mock User.load function
         * @param userId
         * @returns {*}
         */
        models.User.prototype.load = function (userId) {
            var that = this;
            var xhr;
            var dfd = $.Deferred();
            if (RX_MONGODB_ID.test(userId)) {
                var users = db.users.find({ id: userId });
                if ($.isArray(users) && users.length) {
                    var user = $.extend(true, {}, users[0]); // clone
                    app.cache.getMe()
                        .done(function (me) {
                            if (user.id !== me.id) {
                                user = filter(user, 'created,firstName,lastName,metrics.comments.count,metrics.ratings.average,metrics.summaries.count,picture,updated');
                                delete user.facebook; // our filter above always keeps ids even in subdocuments
                                delete user.google;
                                delete user.live;
                                delete user.twitter;
                            }
                            that.accept(user);
                            dfd.resolve(convertFromDBtoResolve(user));
                        });
                } else {
                    xhr = new ErrorXHR(404, 'User not found');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }
            } else {
                xhr = new ErrorXHR(400, 'Unexpected userId: please provide a plain object with an id property');
                dfd.reject(xhr, ERROR, xhr.statusText);
            }
            return dfd.promise();
        };

        /**
         * Mock User.save function
         * @returns {*}
         */
        models.User.prototype.save = function (/*fields*/) {
            var that = this;
            var xhr;
            var dfd = $.Deferred();
            var users = db.users.find({ id: that.id });
            var update = {};
            if ($.isArray(users) && users.length) {
                var user = $.extend(true, {}, users[0]); // clone
                app.cache.getMe()
                    .done(function (me) {
                        if ($.isPlainObject(me) && user.id === me.id) {
                            for (var field in that.fields) {
                                if (field !== 'id' && that.fields.hasOwnProperty(field) && that.editable(field)) {
                                    // TODO: use toJSON?
                                    update[field] = that.get(field);
                                }
                            }
                            $.extend(true, user, update);
                            if (user.updated instanceof Date) {
                                that.updated = user.updated = new Date();
                            }
                            db.users.update(user);
                            that.dirty = false;
                            dfd.resolve(convertFromDBtoResolve(user));
                        } else {
                            xhr = new ErrorXHR(401, 'Not authorized to save user');
                            dfd.reject(xhr, ERROR, xhr.statusText);
                        }
                    });
            } else {
                xhr = new ErrorXHR(404, 'User not found');
                dfd.reject(xhr, ERROR, xhr.statusText);
            }
            return dfd.promise();
        };

        /************************************************************************************
         * Summaries
         ************************************************************************************/

        /**
         * Mock NewSummary.save function
         */
        models.NewSummary.prototype.save = function () {
            var that = this;
            var dfd = $.Deferred();
            var xhr;
            var now = new Date();
            app.cache.getMe()
                .done(function (me) {
                    if ($.isPlainObject(me) && RX_MONGODB_ID.test(me.id)) {
                        if (!that.validate()) {
                            xhr = new ErrorXHR(400, 'Invalid data');
                            dfd.reject(xhr, ERROR, xhr.statusText);
                        } else {
                            var newSummary = {
                                id: ObjectId(),
                                ageGroup: 255,
                                author: {
                                    userId: me.id,
                                    firstName: me.firstName,
                                    lastName: me.lastName
                                },
                                categoryId: that.get('category.id'),
                                created: now,
                                icon: that.get('category.icon'),
                                language: that.get('language'),
                                tags: [],
                                title: that.get('title'),
                                type: that.get('type'),
                                updated: now
                            };
                            db.summaries.insert(newSummary);
                            dfd.resolve(convertFromDBtoResolve(newSummary));
                        }
                    } else {
                        xhr = new ErrorXHR(401, 'Cannot save summary without being authenticated');
                        dfd.reject(xhr, ERROR, xhr.statusText);
                    }
                });
            return dfd.promise();
        };

        /**
         * Mock LazySummaryDataSource transport.read function
         * @param options
         * @private
         */
        models.LazySummaryDataSource.fn._transport._read = function (options) {
            var that = this;
            var fields;
            var summaries;
            var data = [];
            var i;

            if (!RX_MONGODB_ID.test(that.userId)) { // Without user id, we just query public summaries

                options.data.fields = 'created,author,icon,metrics.comments.count,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,type,updated';

                summaries = db.summaries.chain()
                    .find(convertFilter2Query(options.data.filter))
                    .where(function (doc) { return doc.language === i18n.locale() && $.type(doc.published) !== 'undefined'; })
                    .simplesort('updated', true)// TODO options.data.sort?
                    .data();

                // Note: we could have used slice and map
                for (i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(summaries.length, options.data.page * options.data.pageSize); i++) {
                    data.push(filter(summaries[i], options.data.fields));
                }
                options.success({ total: summaries.length, data: data });

            } else { // With a userId, we only query user's summaries

                app.cache.getMe()
                    .done(function (me) {

                        // options.data.fields = 'created,author,icon,metrics.comments.count,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,updated';
                        options.data.fields = 'created,icon,metrics.comments.count,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,type,updated';

                        // If the authenticated user is the author of summaries, include drafts
                        if ($.isPlainObject(me) && that.userId === me.id) {

                            summaries = db.summaries.chain()
                                .find(convertFilter2Query(options.data.filter))
                                .where(function (doc) {
                                    return doc.language === i18n.locale() && doc.author.userId === that.userId;
                                })
                                .simplesort('updated', true)// TODO options.data.sort?
                                .data();


                            for (i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(summaries.length, options.data.page * options.data.pageSize); i++) {
                                data.push(filter(summaries[i], options.data.fields));
                            }
                            options.success({ total: summaries.length, data: data });

                            // if the (authenticated/anonymous) user is not the author of summaries, only fetch public/published summaries
                        } else {

                            summaries = db.summaries.chain()
                                .find({ 'author.userId': that.userId })
                                .where(function (doc) {
                                    return doc.language === i18n.locale() && doc.author.userId === that.userId && doc.published instanceof Date;
                                })
                                .simplesort('updated', true)// TODO options.data.sort?
                                .data();

                            for (i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(summaries.length, options.data.page * options.data.pageSize); i++) {
                                data.push(filter(summaries[i], options.data.fields));
                            }
                            options.success({ total: summaries.length, data: data });
                        }

                    });
            }
        };

        /**
         * Mock User.load function
         * @param summaryId
         */
        models.Summary.prototype.load = function (summaryId) {
            var that = this;
            var xhr;
            var dfd = $.Deferred();
            if (RX_MONGODB_ID.test(summaryId)) {
                var summaries = db.summaries.find({ id: summaryId });
                if ($.isArray(summaries) && summaries.length) {
                    var summary = $.extend(true, {}, summaries[0]); // clone
                    app.cache.getMe()
                        .done(function (me) {
                            if ($.isPlainObject(me) && summary.author.userId === me.id) { // the user is the author
                                summary = filter(summary);
                            } else {
                                if (summary.published instanceof Date) {
                                    summary = filter(summary);
                                } else {
                                    xhr = new ErrorXHR(401, 'You are not authorised to view drafts');
                                    dfd.reject(xhr, ERROR, xhr.statusText);
                                }
                            }
                            that.accept(summary);
                            dfd.resolve(convertFromDBtoResolve(summary));
                        });
                } else {
                    xhr = new ErrorXHR(404, 'Summary not found');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }
            } else {
                xhr = new ErrorXHR(400, 'Unexpected summaryId: please provide a plain object with an id property');
                dfd.reject(xhr, ERROR, xhr.statusText);
            }
            return dfd.promise();
        };

        /**
         * Mock Summary.save function
         */
        models.Summary.prototype.save = function () {
            var that = this;
            var xhr;
            var dfd = $.Deferred();
            var summaries = db.summaries.find({ id: that.id });
            var update = {};
            if ($.isArray(summaries) && summaries.length) {
                var summary = $.extend(true, {}, summaries[0]); // clone
                app.cache.getMe()
                    .done(function (me) {
                        if ($.isPlainObject(me) && summary.author.userId === me.id) {
                            $.extend(true, summary, that.toJSON());
                            if (summary.updated instanceof Date) {
                                that.updated = summary.updated = new Date();
                            }
                            db.summaries.update(summary);
                            that.dirty = false;
                            dfd.resolve(convertFromDBtoResolve(summary));
                        } else {
                            xhr = new ErrorXHR(401, 'Not authorized to save summary');
                            dfd.reject(xhr, ERROR, xhr.statusText);
                        }
                    });
            } else {
                xhr = new ErrorXHR(404, 'Summary not found');
                dfd.reject(xhr, ERROR, xhr.statusText);
            }
            return dfd.promise();
        };

        /**
         * Mock Summary.createDraft function
         */
        models.Summary.prototype.createDraft = function () {
            var that = this;
            var dfd = $.Deferred();
            app.cache.getMe()
                .done(function (me) {
                    var xhr;
                    if ($.isPlainObject(me) && that.author.userId === me.id) {
                        var newDraft;
                        var now = new Date();
                        var versions = db.versions.chain()
                                .find({ summaryId: that.id })
                                .simplesort('created', true)
                                .data();
                        if ($.isArray(versions) && versions.length) {
                            if (versions[0].state === 0) {
                                xhr = new ErrorXHR(400, 'There is already a draft');
                                dfd.reject(xhr, ERROR, xhr.statusText);
                            } else {
                                newDraft = cloneWithoutDBMetaData(versions[0]);
                                newDraft.id = ObjectId();
                                newDraft.created = now;
                                newDraft.updated = now;
                                newDraft.state = 0;
                                db.versions.insert(newDraft);
                                dfd.resolve(convertFromDBtoResolve(newDraft));
                            }
                        } else {
                            newDraft = {
                                id: ObjectId(),
                                categoryId: that.categoryId,
                                created: now,
                                language: that.language,
                                state: 0,
                                stream: { pages: [] },
                                summaryId: that.id,
                                type: that.type,
                                updated: now,
                                userId: that.author.userId
                            };
                            db.versions.insert(newDraft);
                            var ret = convertFromDBtoResolve(newDraft);
                            delete ret.stream;
                            dfd.resolve(ret);
                        }
                    } else {
                        xhr = new ErrorXHR(401, 'Not authorized to create draft');
                        dfd.reject(xhr, ERROR, xhr.statusText);
                    }
                });
            return dfd.promise();
        };

        /* Blocks are nested too deeply. */
        /* jshint -W073 */

        /**
         * Mock Summary.publish function
         */
        models.Summary.prototype.publish = function () {
            var that = this;
            var dfd = $.Deferred();
            app.cache.getMe()
                .done(function (me) {
                    var xhr;
                    if ($.isPlainObject(me) && that.author.userId === me.id) {
                        var draftToPublish;
                        var now = new Date();
                        var versions = db.versions.chain()
                                .find({ summaryId: that.id })
                                .simplesort('created', true)
                                .data();
                        if ($.isArray(versions) && versions.length) {
                            if (versions[0].state !== 0) {
                                xhr = new ErrorXHR(400, 'There is no draft to publish');
                                dfd.reject(xhr, ERROR, xhr.statusText);
                            } else {
                                // Update version
                                draftToPublish = versions[0];
                                draftToPublish.state = 5;
                                draftToPublish.updated = now;
                                db.versions.update(draftToPublish);
                                // Update summary
                                var summaries = db.summaries.find({ id: that.id });
                                if ($.isArray(summaries) && summaries.length) {
                                    summaries[0].published = now;
                                    summaries[0].updated = now;
                                    db.summaries.update(summaries[0]);
                                    that.set('published', now);
                                    that.set('updated', now);
                                    that.dirty = false;
                                }
                                var ret = convertFromDBtoResolve(draftToPublish);
                                delete ret.stream;
                                dfd.resolve(ret);
                            }
                        } else {
                            xhr = new ErrorXHR(400, 'There is no draft to publish');
                            dfd.reject(xhr, ERROR, xhr.statusText);
                        }
                    } else {
                        xhr = new ErrorXHR(401, 'Not authorized to publish draft');
                        dfd.reject(xhr, ERROR, xhr.statusText);
                    }
                });
            return dfd.promise();
        };

        /* jshint +W073 */

        /**
         * Mock Summary.rate function
         */
        models.Summary.prototype.rate = function () {
            var dfd = $.Deferred();
            setTimeout(function () {
                dfd.resolve(); // TODO
            }, 0);
            return dfd.promise();
        };

        /*******************************************************************************************************
         * Versions
         *******************************************************************************************************/

        /**
         * Mock LazyVersionDataSource transport.read function
         * @param options
         * @private
         */
        models.LazyVersionDataSource.fn._transport._read = function (options) {
            var that = this;
            var summaries = db.summaries.find({ id: that.summaryId });
            if ($.isArray(summaries) && summaries.length) {
                var versions = db.versions.find({ summaryId: that.summaryId });
                versions.sort(function (a, b) {
                    return b.created - a.created;
                });
                app.cache.getMe().done(function (me) {
                    if (summaries[0].author.userId !== me.id && versions[0].status === 0) {
                        versions.shift(); // remove draft
                    }
                    options.success({ total: versions.length, data: versions });
                });
            } else {
                var xhr = new ErrorXHR(404, 'Summary not found');
                options.error(xhr, ERROR, xhr.statusText);
            }
        };

        /**
         * Mock Version.load function
         */
        models.Version.prototype.load = function (summaryId, versionId) {
            var that = this;
            var xhr;
            var dfd = $.Deferred();
            if (RX_MONGODB_ID.test(summaryId) && RX_MONGODB_ID.test(versionId)) {
                var versions = db.versions.find({ id: versionId });
                if ($.isArray(versions) && versions.length) {
                    var version = $.extend(true, {}, versions[0]); // clone
                    app.cache.getMe()
                        .done(function (me) {
                            if ($.isPlainObject(me) && version.userId === me.id) { // the user is the author
                                version = filter(version);
                            } else {
                                if (version.state === 5) {
                                    version = filter(version);
                                } else {
                                    xhr = new ErrorXHR(401, 'You are not authorised to view drafts');
                                    dfd.reject(xhr, ERROR, xhr.statusText);
                                }
                            }
                            that.accept(version);
                            dfd.resolve(convertFromDBtoResolve(version));
                        });
                } else {
                    xhr = new ErrorXHR(404, 'Version not found');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }
            } else {
                xhr = new ErrorXHR(400, 'Unexpected data: please provide a plain object with an id property');
                dfd.reject(xhr, ERROR, xhr.statusText);
            }
            return dfd.promise();
        };

        /**
         * Mock Version.save function
         */
        models.Version.prototype.save = function () {
            var that = this;
            var xhr;
            var dfd = $.Deferred();
            var versions = db.versions.find({ id: that.id });
            var update = {};
            if ($.isArray(versions) && versions.length) {
                var version = $.extend(true, {}, versions[0]); // clone
                app.cache.getMe()
                    .done(function (me) {
                        if ($.isPlainObject(me) && version.userId === me.id) {
                            $.extend(true, version, that.toJSON());
                            that.updated = version.updated = new Date();
                            db.versions.update(version);
                            that.dirty = false;
                            dfd.resolve(convertFromDBtoResolve(version));
                        } else {
                            xhr = new ErrorXHR(401, 'Not authorized to save version');
                            dfd.reject(xhr, ERROR, xhr.statusText);
                        }
                    });
            } else {
                xhr = new ErrorXHR(404, 'Summary not found');
                dfd.reject(xhr, ERROR, xhr.statusText);
            }
            return dfd.promise();
        };

        /**
         * Mock LazyActivityDataSource transport.read function
         * @param options
         * @private
         */
        models.LazyActivityDataSource.fn._transport._read = function (options) {
            var that = this;
            var activities;
            var data = [];
            var i;

            // If we have a summaryId for the content being displayed, we fetch summary activities
            if (RX_MONGODB_ID.test(that.summaryId)) {

                // Note: we get value (rating, score), but not text (comment, report)
                options.data.fields = 'actor,created,type,updated,value,version.versionId';

                activities = db.activities.chain()
                    .find({ 'version.summaryId': that.summaryId })
                    .where(function (doc) {
                        return doc.version.language === i18n.locale();
                    })
                    .data();

                for (i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(activities.length, options.data.page * options.data.pageSize); i++) {
                    data.push(filter(activities[i], options.data.fields));
                }
                options.success({ total: activities.length, data: data });

                // Without a summaryId, we need an authenticated user to fetch user activities
            } else {

                app.cache.getMe().done(function (me) {

                    if ($.isPlainObject(me) && RX_MONGODB_ID.test(me.id)) {

                        // Note: we get value (rating, score), but not text (comment, report)
                        // options.data.fields = 'actor,created,type,updated,value,version';
                        options.data.fields = 'created,type,updated,value,version';

                        activities = db.activities.chain()
                            .find({ 'actor.userId': me.id })
                            .where(function (doc) {
                                return doc.version.language === i18n.locale();
                            })
                            .data();

                        for (i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(activities.length, options.data.page * options.data.pageSize); i++) {
                            data.push(filter(activities[i], options.data.fields));
                        }
                        options.success({ total: activities.length, data: data });

                    } else {
                        var xhr = new ErrorXHR(401, 'You are not authorized to view these activities');
                        options.error(xhr, ERROR, xhr.statusText);
                    }
                });
            }
        };

        /*******************************************************************************************************
         * Activities
         *******************************************************************************************************/

        /**
         * Mock Activity.load function
         */
        models.Activity.prototype.load = function (data) {
            var dfd = $.Deferred();
            setTimeout(function () {
                dfd.resolve(); // TODO
            }, 0);
            return dfd.promise();
        };

        /**
         * Mock Version.save function
         */
        models.Activity.prototype.save = function () {
            var dfd = $.Deferred();
            setTimeout(function () {
                dfd.resolve(); // TODO
            }, 0);
            return dfd.promise();
        };

        /**
         * Mock CommentDataSource transport.create function
         * @param options
         * @private
         */
        models.CommentDataSource.fn._transport._create = function (options) {
            var that = this;
            var xhr;
            var summaries = db.summaries.find({ id: that.summaryId });
            if ($.isArray(summaries) && summaries.length) {
                var versions = db.versions.find({ summaryId: that.summaryId });
                if ($.isArray(versions) && versions.length) {
                    versions.sort(function (a, b) {
                        return b - a;
                    });
                    app.cache.getMe().done(function (me) {
                        if (summaries[0].author.userId !== me.id && versions[0].status === 0) {
                            versions.shift(); // remove draft
                        }
                        if (me.id === null) {
                            xhr = new ErrorXHR(401, 'You need to be authenticated to comment');
                            options.error(xhr, ERROR, xhr.statusText);
                        } else if (versions.length) {
                            var now = new Date();
                            var comment = {
                                    id: ObjectId(),
                                    created: now,
                                    actor: {
                                        userId: me.id,
                                        firstName: me.firstName,
                                        lastName: me.lastName
                                    },
                                    text: options.data.text,
                                    type: 'Comment',
                                    updated: now,
                                    version: {
                                        language: versions[0].language,
                                        categoryId: versions[0].categoryId,
                                        summaryId: versions[0].summaryId,
                                        title: summaries[0].title,
                                        versionId: versions[0].id
                                    }
                                };
                            db.activities.insert(comment);
                            options.success(convertFromDBtoResolve(comment));
                        } else {
                            xhr = new ErrorXHR(404, 'There is no version to comment');
                            options.error(xhr, ERROR, xhr.statusText);
                        }
                    });
                } else {
                    xhr = new ErrorXHR(404, 'There is no version to comment');
                    options.error(xhr, ERROR, xhr.statusText);
                }
            } else {
                xhr = new ErrorXHR(404, 'Summary not found');
                options.error(xhr, ERROR, xhr.statusText);
            }
        };

        /**
         * Mock CommentDataSource transport.destroy function
         * @param options
         * @private
         */
        models.CommentDataSource.fn._transport._destroy = function (options) {
            var that = this;
            var xhr;
            var comments = db.activities.find({ id: options.data.id });
            if ($.isArray(comments) && comments.length) {
                app.cache.getMe().done(function (me) {
                    if (comments[0].actor.userId === me.id) {
                        db.activities.remove(comments[0]);
                        options.success(convertFromDBtoResolve(comments[0]));
                    } else {
                        xhr = new ErrorXHR(401, 'Not authorized to delete comment');
                        options.error(xhr, ERROR, xhr.statusText);
                    }
                });
            } else {
                xhr = new ErrorXHR(404, 'Comment not found');
                options.error(xhr, ERROR, xhr.statusText);
            }
        };

        /**
         * Mock CommentDataSource transport.read function
         * @param options
         * @private
         */
        models.CommentDataSource.fn._transport._read = function (options) {
            var that = this;
            var xhr;
            var summaries = db.summaries.find({ id: that.summaryId });
            if ($.isArray(summaries) && summaries.length) {
                var comments = db.activities.chain()
                    .find({ 'version.summaryId': that.summaryId })
                    .where(function (doc) {
                        return doc.type === 'Comment';
                    })
                    .data();
                if ($.isArray(comments) && comments.length) {
                    var data = [];
                    for (var i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(comments.length, options.data.page * options.data.pageSize); i++) {
                        data.push(filter(comments[i], options.data.fields));
                    }
                    options.success({ total: comments.length, data: data });

                } else {
                    options.success({ total: 0, data: [] });
                }
            } else {
                xhr = new ErrorXHR(404, 'Summary not found');
                options.error(xhr, ERROR, xhr.statusText);
            }
        };

        /**
         * Mock CommentDataSource transport.update function
         * @param options
         * @private
         */
        models.CommentDataSource.fn._transport._update = function (options) {
            var that = this;
            var xhr;
            var comments = db.activities.find({ id: options.data.id });
            if ($.isArray(comments) && comments.length) {
                app.cache.getMe().done(function (me) {
                    if (comments[0].actor.userId === me.id) {
                        delete options.data.id;
                        $.extend(true, comments[0], options.data);
                        comments[0].updated = new Date();
                        db.activities.update(comments[0]);
                        options.success(convertFromDBtoResolve(comments[0]));
                    } else {
                        xhr = new ErrorXHR(401, 'Not authorized to update comment');
                        options.error(xhr, ERROR, xhr.statusText);
                    }
                });
            } else {
                xhr = new ErrorXHR(404, 'Comment not found');
                options.error(xhr, ERROR, xhr.statusText);
            }
        };

        // TODO models.ScoreDataSource = DataSource.extend({});

        /************************************************************************************
         * Setup in-memory database
         ************************************************************************************/

        /**
         * Filter some fields of a document extracted from LokiJS
         * if fields is undefined, just clean the document from LokiJS metadata
         * @param document
         * @param fields
         */
        function filter(document, fields) {

            /* Blocks are nested too deeply. */
            /* jshint -W073 */

            /* This function's cyclomatic complexity is too high. */
            /* jshint -W074 */

            function sieve(document, fields) {
                /* jshint maxcomplexity: 8 */
                if ($.isArray(fields) && fields.length) {
                    for (var prop in document) {
                        if (document.hasOwnProperty(prop)) {
                            if ($.isPlainObject(document[prop])) {
                                var propFields = [];
                                for (var i = 0; i < fields.length; i++) {
                                    if (fields[i].indexOf(prop + '.') === 0) {
                                        propFields.push(fields[i].substr(prop.length + 1));
                                    }
                                }
                                sieve(document[prop], propFields);
                            } else { // basic types, functions, arrays
                                if (prop !== 'id' && fields.indexOf(prop) === -1) {
                                    delete document[prop];
                                }
                            }
                        }
                    }
                }
            }

            /* jshint +W074 */
            /* jshint +W073 */

            var doc = {};
            var farray = [];
            if ($.isPlainObject(document)) {
                if ($.type(fields) === STRING) {
                    farray = fields.split(/[\,\s]/);
                } else if ($.isArray(fields)) {
                    farray = fields;
                }
                doc = cloneWithoutDBMetaData(document);
                sieve(doc, farray);
            }
            return doc;
        }

        var MockDB = function () {
            this.loki = new window.loki();
            this.activities = this.loki.addCollection('activities');
            this.categories = this.loki.addCollection('categories');
            this.sessions = this.loki.addCollection('sessions');
            this.summaries = this.loki.addCollection('summaries');
            this.tokens = this.loki.addCollection('tokens');
            this.users = this.loki.addCollection('users');
            this.versions = this.loki.addCollection('versions');
        };

        MockDB.prototype.loadCollection = function (name, uri) {
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
                            collection.insert(parse(value));
                        });
                    }
                    dfd.resolve();
                })
                .fail(function (xhr, status, error) {
                    dfd.reject(xhr, status, error);
                });
            return dfd.promise();
        };

        MockDB.prototype.load = function () {
            // logger.debug();

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

        var db = app.mockDB = new MockDB();

    }(window.jQuery));

    /* jshint +W074 */

    /* jshint +W071 */

    return app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
